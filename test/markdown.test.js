// test/markdown.test.js
const { test } = require('node:test');
const assert = require('node:assert');
const MD = require('../cloudflare/widget/markdown.js');

/* The exact reply from the live database that showed raw asterisks to a
   customer on the website. */
const REAL_REPLY = "Good question — it really depends on the severity of the damage:\n\n"
  + "- **Minor repairs** (small dents, scratches, minor panel work): typically **1-3 business days**\n"
  + "- **More significant collision damage** (frame work, multiple panels, major structural repair): usually **1-2 weeks**\n\n"
  + "Once we take a look at your truck, we'll give you a detailed estimate with a specific timeline upfront.";

/* ---------- a tiny DOM stand-in ----------
   Deliberately has NO innerHTML: any renderer that reaches for it throws, so
   the "never innerHTML with untrusted text" guarantee is enforced by the test
   suite rather than by convention. */
function makeDoc() {
  function node(tag) {
    return {
      tagName: tag,
      className: '',
      children: [],
      _text: '',
      set innerHTML(v) { throw new Error('innerHTML must never be used for message content'); },
      get innerHTML() { throw new Error('innerHTML must never be used for message content'); },
      set textContent(v) { this._text = String(v); this.children = []; },
      get textContent() { return this._text; },
      appendChild(child) { this.children.push(child); return child; }
    };
  }
  return {
    createElement(tag) { return node(tag); },
    createTextNode(t) { return { tagName: '#text', _text: String(t), children: [] }; }
  };
}

/* Serializes the stub tree the way a browser would, so assertions read like
   the markup the customer actually gets. */
function serialize(n) {
  if (n.tagName === '#text') return n._text;
  const attrs = [];
  if (n.href) attrs.push(' href="' + n.href + '"');
  if (n.className) attrs.push(' class="' + n.className + '"');
  const inner = n.children.length
    ? n.children.map(serialize).join('')
    : n._text;
  return '<' + n.tagName + attrs.join('') + '>' + inner + '</' + n.tagName + '>';
}

function dom(text, opts) {
  const doc = makeDoc();
  const root = doc.createElement('div');
  MD.renderToDom(root, text, doc, opts || {});
  return root.children.map(serialize).join('');
}

/* ---------- parsing ---------- */

test('parses bold runs and leaves surrounding text alone', () => {
  const spans = MD.parseInline('typically **1-3 business days** total');
  assert.deepStrictEqual(spans, [
    { text: 'typically ', bold: false },
    { text: '1-3 business days', bold: true },
    { text: ' total', bold: false }
  ]);
});

test('unmatched asterisks stay literal text, never broken markup', () => {
  assert.deepStrictEqual(MD.parseInline('a ** b'), [{ text: 'a ** b', bold: false }]);
  assert.strictEqual(MD.renderToHtml('5 * 3 = 15'), '<p class="md-p">5 * 3 = 15</p>');
  assert.strictEqual(MD.renderToHtml('**unclosed bold'), '<p class="md-p">**unclosed bold</p>');
});

test('blank lines split paragraphs, single newlines stay soft breaks', () => {
  const blocks = MD.parse('one\ntwo\n\nthree');
  assert.strictEqual(blocks.length, 2);
  assert.strictEqual(blocks[0].type, 'p');
  assert.strictEqual(blocks[0].lines.length, 2);
  assert.strictEqual(blocks[1].lines.length, 1);
});

test('both "-" and "*" bullets become list items', () => {
  const blocks = MD.parse('- one\n- two');
  assert.strictEqual(blocks[0].type, 'ul');
  assert.strictEqual(blocks[0].items.length, 2);
  const star = MD.parse('* one\n* two');
  assert.strictEqual(star[0].type, 'ul');
  assert.strictEqual(star[0].items.length, 2);
});

test('a line starting with bold is not mistaken for a bullet', () => {
  const blocks = MD.parse('**Heads up** — we close at 5.');
  assert.strictEqual(blocks[0].type, 'p');
});

test('a wrapped continuation line folds into the bullet above it', () => {
  const blocks = MD.parse('- first item\n  continued here\n- second');
  assert.strictEqual(blocks[0].items.length, 2);
  assert.strictEqual(
    blocks[0].items[0].map(s => s.text).join(''),
    'first item continued here'
  );
});

test('empty or blank input renders nothing', () => {
  assert.strictEqual(MD.renderToHtml(''), '');
  assert.strictEqual(MD.renderToHtml('   \n\n  '), '');
  assert.strictEqual(MD.renderToHtml(null), '');
  assert.strictEqual(dom(''), '');
});

/* ---------- the real message ---------- */

test('the live reply renders as a paragraph, a 2-item list and a closing paragraph', () => {
  const html = MD.renderToHtml(REAL_REPLY);
  assert.strictEqual(
    html,
    '<p class="md-p">Good question — it really depends on the severity of the damage:</p>'
    + '<ul class="md-ul">'
    + '<li><strong>Minor repairs</strong> (small dents, scratches, minor panel work): typically <strong>1-3 business days</strong></li>'
    + '<li><strong>More significant collision damage</strong> (frame work, multiple panels, major structural repair): usually <strong>1-2 weeks</strong></li>'
    + '</ul>'
    + '<p class="md-p">Once we take a look at your truck, we&#39;ll give you a detailed estimate with a specific timeline upfront.</p>'
  );
  assert.ok(html.indexOf('**') === -1, 'no raw asterisks reach the customer');
});

test('the live reply renders the same structure as DOM nodes in the widget', () => {
  assert.strictEqual(
    dom(REAL_REPLY, { linkifyPhones: true }),
    '<p class="md-p">Good question — it really depends on the severity of the damage:</p>'
    + '<ul class="md-ul">'
    + '<li><strong>Minor repairs</strong> (small dents, scratches, minor panel work): typically <strong>1-3 business days</strong></li>'
    + '<li><strong>More significant collision damage</strong> (frame work, multiple panels, major structural repair): usually <strong>1-2 weeks</strong></li>'
    + '</ul>'
    + '<p class="md-p">Once we take a look at your truck, we\'ll give you a detailed estimate with a specific timeline upfront.</p>'
  );
});

/* ---------- tap-to-call ---------- */

test('phone numbers still become tel: links, including inside bold and bullets', () => {
  assert.strictEqual(
    dom('Call 562-424-6744 today.', { linkifyPhones: true }),
    '<p class="md-p">Call <a href="tel:5624246744">562-424-6744</a> today.</p>'
  );
  assert.strictEqual(
    dom('**Call 562-424-6744**', { linkifyPhones: true }),
    '<p class="md-p"><strong>Call <a href="tel:5624246744">562-424-6744</a></strong></p>'
  );
  assert.strictEqual(
    dom('- Ring (562) 424 6744', { linkifyPhones: true }),
    '<ul class="md-ul"><li>Ring <a href="tel:5624246744">(562) 424 6744</a></li></ul>'
  );
});

test('phone linkification is opt-in', () => {
  assert.strictEqual(
    MD.renderToHtml('Call 562-424-6744.'),
    '<p class="md-p">Call 562-424-6744.</p>'
  );
});

/* ---------- security ---------- */

test('HTML in a visitor message is escaped, never markup (dashboard path)', () => {
  const attack = '<img src=x onerror=alert(1)>';
  const html = MD.renderToHtml(attack);
  assert.ok(html.indexOf('<img') === -1);
  assert.ok(html.indexOf('&lt;img src=x onerror=alert(1)&gt;') !== -1);
});

test('bolded script tags are escaped inside <strong> (dashboard path)', () => {
  const html = MD.renderToHtml('**<script>alert(1)</script>**');
  assert.strictEqual(
    html,
    '<p class="md-p"><strong>&lt;script&gt;alert(1)&lt;/script&gt;</strong></p>'
  );
  assert.ok(html.indexOf('<script') === -1);
});

test('quotes, ampersands and attribute breakouts are escaped (dashboard path)', () => {
  const html = MD.renderToHtml('" onmouseover="alert(1)" & \'x\' <b>');
  assert.ok(html.indexOf('onmouseover="') === -1);
  assert.ok(html.indexOf('&quot;') !== -1);
  assert.ok(html.indexOf('&amp;') !== -1);
  assert.ok(html.indexOf('&#39;') !== -1);
  assert.ok(html.indexOf('<b>') === -1);
});

test('every non-tag "<" in output belongs to this renderer, not to input', () => {
  const nasty = '- **<a href="javascript:alert(1)">tap</a>**\n\n<svg onload=alert(1)>';
  const html = MD.renderToHtml(nasty, { wrapEmoji: true });
  const tags = html.match(/<[^>]*>/g) || [];
  const allowed = /^<\/?(p class="md-p"|ul class="md-ul"|p|ul|li|strong|br)>$/;
  tags.forEach(function(t){
    assert.ok(allowed.test(t), 'unexpected tag emitted: ' + t);
  });
  assert.ok(html.indexOf('javascript:') !== -1, 'literal text is preserved, just inert');
  assert.ok(html.indexOf('<a ') === -1, 'no anchor element is ever built from input');
  assert.ok(html.indexOf('href="javascript') === -1, 'the href is escaped, not live');
});

test('widget DOM path never touches innerHTML and emits markup as text', () => {
  // makeDoc() throws on any innerHTML access, so reaching this line proves it.
  const out = dom('<img src=x onerror=alert(1)> and **<script>**', { linkifyPhones: true });
  assert.strictEqual(
    out,
    '<p class="md-p"><img src=x onerror=alert(1)> and <strong><script></strong></p>'
  );
  // Serialized above for readability; what matters is that the payload lives in
  // text nodes, not elements.
  const doc = makeDoc();
  const root = doc.createElement('div');
  MD.renderToDom(root, '<img src=x onerror=alert(1)>', doc, {});
  const p = root.children[0];
  assert.strictEqual(p.tagName, 'p');
  assert.strictEqual(p.children.length, 1);
  assert.strictEqual(p.children[0].tagName, '#text');
  assert.strictEqual(p.children[0]._text, '<img src=x onerror=alert(1)>');
});

test('a tel: href can only ever contain digits', () => {
  const doc = makeDoc();
  const root = doc.createElement('div');
  MD.renderToDom(root, 'call 562-424-6744 x', doc, { linkifyPhones: true });
  const a = root.children[0].children.filter(function(n){ return n.tagName === 'a'; })[0];
  assert.ok(/^tel:\d+$/.test(a.href));
});

/* ---------- progressive reveal ---------- */

test('a half-typed bold marker is trimmed mid-reveal', () => {
  assert.strictEqual(MD.trimPartial('typically **1-3'), 'typically 1-3');
  assert.strictEqual(MD.trimPartial('typically **1-3 days**'), 'typically **1-3 days**');
  assert.strictEqual(MD.trimPartial('almost *'), 'almost ');
  assert.strictEqual(MD.trimPartial('5 * 3'), '5 * 3');
});

/* ---------- emoji ---------- */

test('emoji are wrapped for legibility only when asked', () => {
  assert.strictEqual(
    MD.renderToHtml('Call us 📞 today', { wrapEmoji: true }),
    '<p class="md-p">Call us <span class="md-emoji">📞</span> today</p>'
  );
  assert.strictEqual(
    MD.renderToHtml('Call us 📞 today'),
    '<p class="md-p">Call us 📞 today</p>'
  );
});

test('multi-codepoint emoji stay in one span', () => {
  const html = MD.renderToHtml('crew 👨‍👩‍👧 here', { wrapEmoji: true });
  assert.strictEqual((html.match(/md-emoji/g) || []).length, 1);
});
