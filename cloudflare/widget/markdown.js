/* cloudflare/widget/markdown.js
 *
 * Tiny, hand-rolled markdown renderer shared by the customer-facing chat widget
 * and the owner dashboard. Hex (the assistant) writes in markdown — **bold**,
 * "-"/"*" bullet lists and blank-line paragraph breaks — and before this existed
 * customers saw raw asterisks on the live site.
 *
 * SECURITY: message text comes from members of the public and from the model.
 * Nothing in here ever hands untrusted text to innerHTML:
 *   - renderToDom()  builds real DOM nodes (createElement / createTextNode)
 *   - renderToHtml() escapes every character of untrusted text before it is
 *     concatenated into markup, and only ever emits a fixed set of tags
 * Anything this renderer does not understand is emitted as its own literal
 * text — never as markup, never silently dropped.
 *
 * Deliberately supports ONLY what Hex actually emits. No library, no HTML
 * passthrough, no raw links, no code fences.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.HexMarkdown = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  /* Same shape the widget has always used for tap-to-call. */
  var PHONE_RE = /(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/g;

  /* Emoji runs (including variation selectors and ZWJ sequences) so the
     dashboard can give them a legible halo on its solid red bubbles. */
  var EMOJI_RE = new RegExp('(?:\\p{Extended_Pictographic}[\\uFE0F\\u200D\\u{1F3FB}-\\u{1F3FF}]*)+', 'gu');

  var BOLD_RE = /\*\*([\s\S]+?)\*\*/g;
  var BULLET_RE = /^[ \t]*[-*][ \t]+(.*)$/;

  function normalize(text) {
    return String(text == null ? '' : text).replace(/\r\n?/g, '\n');
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ---------- parsing ---------- */

  /* Splits one line of text into {text, bold} spans. An unmatched "**" is not
     bold — it stays as literal asterisks, which is the honest thing to show. */
  function parseInline(str) {
    var spans = [];
    var last = 0;
    var m;
    BOLD_RE.lastIndex = 0;
    while ((m = BOLD_RE.exec(str)) !== null) {
      if (m.index > last) spans.push({ text: str.slice(last, m.index), bold: false });
      spans.push({ text: m[1], bold: true });
      last = BOLD_RE.lastIndex;
    }
    if (last < str.length) spans.push({ text: str.slice(last), bold: false });
    return spans.filter(function (s) { return s.text !== ''; });
  }

  /* Returns blocks:
       { type: 'p',  lines: [ [span, ...], ... ] }   soft line breaks preserved
       { type: 'ul', items: [ [span, ...], ... ] }                            */
  function parse(text) {
    var lines = normalize(text).split('\n');
    var blocks = [];
    var para = null;
    var list = null;

    function flushPara() {
      if (para) { blocks.push({ type: 'p', lines: para }); para = null; }
    }
    function flushList() {
      if (list) { blocks.push({ type: 'ul', items: list }); list = null; }
    }

    lines.forEach(function (raw) {
      var line = raw.replace(/\s+$/, '');
      if (!line.trim()) { flushPara(); flushList(); return; }

      var m = BULLET_RE.exec(line);
      if (m) {
        flushPara();
        if (!list) list = [];
        list.push(m[1]);
        return;
      }
      if (list) {
        /* wrapped continuation of the previous bullet */
        list[list.length - 1] += ' ' + line.trim();
        return;
      }
      if (!para) para = [];
      para.push(line);
    });

    flushPara();
    flushList();

    return blocks.map(function (b) {
      if (b.type === 'ul') {
        return { type: 'ul', items: b.items.map(parseInline) };
      }
      return { type: 'p', lines: b.lines.map(parseInline) };
    });
  }

  /* Mid-stream the widget reveals a reply word by word, so a bold run can be
     half-typed. Drop a trailing unmatched "**" (and a dangling "*") so the
     customer never sees flickering asterisks. */
  function trimPartial(text) {
    var s = normalize(text);
    var pairs = s.match(/\*\*/g);
    if (pairs && pairs.length % 2 === 1) {
      var i = s.lastIndexOf('**');
      s = s.slice(0, i) + s.slice(i + 2);
    }
    return s.replace(/(^|[^*])\*$/, '$1');
  }

  /* ---------- shared inline walk ---------- */

  /* Calls back with typed chunks so the DOM and HTML renderers stay in lockstep
     about what counts as a phone number / emoji / plain text. */
  function walkText(str, opts, cb) {
    var pieces = opts.linkifyPhones
      ? String(str).split(PHONE_RE)
      : [String(str)];
    pieces.forEach(function (piece, i) {
      if (!piece) return;
      if (opts.linkifyPhones && i % 2 === 1) { cb('phone', piece); return; }
      if (!opts.wrapEmoji) { cb('text', piece); return; }
      var last = 0;
      var m;
      EMOJI_RE.lastIndex = 0;
      while ((m = EMOJI_RE.exec(piece)) !== null) {
        if (m.index > last) cb('text', piece.slice(last, m.index));
        cb('emoji', m[0]);
        last = EMOJI_RE.lastIndex;
      }
      if (last < piece.length) cb('text', piece.slice(last));
    });
  }

  function telHref(label) {
    return 'tel:' + String(label).replace(/\D/g, '');
  }

  /* ---------- DOM renderer (widget) ---------- */

  function appendInline(target, str, doc, opts) {
    walkText(str, opts, function (kind, value) {
      if (kind === 'phone') {
        var a = doc.createElement('a');
        a.href = telHref(value);
        a.textContent = value;
        target.appendChild(a);
      } else if (kind === 'emoji') {
        var span = doc.createElement('span');
        span.className = 'md-emoji';
        span.textContent = value;
        target.appendChild(span);
      } else {
        target.appendChild(doc.createTextNode(value));
      }
    });
  }

  function appendSpans(target, spans, doc, opts) {
    spans.forEach(function (sp) {
      if (sp.bold) {
        var strong = doc.createElement('strong');
        appendInline(strong, sp.text, doc, opts);
        target.appendChild(strong);
      } else {
        appendInline(target, sp.text, doc, opts);
      }
    });
  }

  /* Renders markdown into `target` as DOM nodes. innerHTML is never touched. */
  function renderToDom(target, text, doc, options) {
    var opts = options || {};
    var blocks = parse(text);
    blocks.forEach(function (b) {
      if (b.type === 'ul') {
        var ul = doc.createElement('ul');
        ul.className = 'md-ul';
        b.items.forEach(function (spans) {
          var li = doc.createElement('li');
          appendSpans(li, spans, doc, opts);
          ul.appendChild(li);
        });
        target.appendChild(ul);
      } else {
        var p = doc.createElement('p');
        p.className = 'md-p';
        b.lines.forEach(function (spans, i) {
          if (i > 0) p.appendChild(doc.createElement('br'));
          appendSpans(p, spans, doc, opts);
        });
        target.appendChild(p);
      }
    });
    return target;
  }

  /* Plain text (customer's own words) — no markdown, phones still tappable. */
  function renderPlainToDom(target, text, doc, options) {
    appendInline(target, normalize(text), doc, options || {});
    return target;
  }

  /* ---------- HTML renderer (dashboard) ---------- */

  function inlineHtml(str, opts) {
    var out = '';
    walkText(str, opts, function (kind, value) {
      if (kind === 'phone') {
        out += '<a href="' + escapeHtml(telHref(value)) + '">' + escapeHtml(value) + '</a>';
      } else if (kind === 'emoji') {
        out += '<span class="md-emoji">' + escapeHtml(value) + '</span>';
      } else {
        out += escapeHtml(value);
      }
    });
    return out;
  }

  function spansHtml(spans, opts) {
    return spans.map(function (sp) {
      var inner = inlineHtml(sp.text, opts);
      return sp.bold ? '<strong>' + inner + '</strong>' : inner;
    }).join('');
  }

  /* Returns a fully escaped HTML string. Every character of `text` is escaped;
     the only markup produced is this renderer's own fixed tag set. */
  function renderToHtml(text, options) {
    var opts = options || {};
    return parse(text).map(function (b) {
      if (b.type === 'ul') {
        return '<ul class="md-ul">' + b.items.map(function (spans) {
          return '<li>' + spansHtml(spans, opts) + '</li>';
        }).join('') + '</ul>';
      }
      return '<p class="md-p">' + b.lines.map(function (spans) {
        return spansHtml(spans, opts);
      }).join('<br>') + '</p>';
    }).join('');
  }

  return {
    parse: parse,
    parseInline: parseInline,
    trimPartial: trimPartial,
    escapeHtml: escapeHtml,
    renderToDom: renderToDom,
    renderPlainToDom: renderPlainToDom,
    renderToHtml: renderToHtml,
    PHONE_RE: PHONE_RE
  };
});
