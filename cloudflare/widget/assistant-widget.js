// cloudflare/widget/assistant-widget.js
(function () {
  if (window.__aiWidgetLoaded) return;
  window.__aiWidgetLoaded = true;

  const RED = '#8B0000';
  const CONV_KEY = 'threejs_ai_conversation_id';
  const NAME_KEY = 'threejs_ai_customer_name';

  const conversationId = (function () {
    let id = localStorage.getItem(CONV_KEY);
    if (!id) {
      id = 'conv-' + Date.now() + '-' + Math.random().toString(36).slice(2);
      localStorage.setItem(CONV_KEY, id);
    }
    return id;
  })();

  let customerName = (localStorage.getItem(NAME_KEY) || '').trim();
  let awaitingName = !customerName;

  const reduceMotion = window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Palette, square corners and typography are unchanged from the original
     widget — this pass modernises motion, pacing and input behaviour only. */
  const css = `
    .ai-bubble{position:fixed;bottom:20px;right:20px;width:56px;height:56px;background:${RED};
      border:2px solid ${RED};border-radius:0;display:flex;align-items:center;justify-content:center;
      cursor:pointer;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,.3);
      transition:transform .22s cubic-bezier(.2,.8,.3,1),box-shadow .22s ease;}
    .ai-bubble:hover{transform:translateY(-2px);box-shadow:0 8px 22px rgba(0,0,0,.42);}
    .ai-bubble:focus-visible{outline:2px solid #fff;outline-offset:2px;}
    .ai-bubble svg{width:26px;height:26px;stroke:#fff;fill:none;stroke-width:2;
      transition:opacity .18s ease,transform .18s ease;}
    .ai-bubble .ai-ico-close{position:absolute;opacity:0;transform:rotate(-45deg);}
    .ai-bubble.open .ai-ico-chat{opacity:0;transform:rotate(45deg);}
    .ai-bubble.open .ai-ico-close{opacity:1;transform:rotate(0deg);}

    .ai-nudge{position:fixed;bottom:24px;right:88px;background:#111;border:1px solid #333;
      border-radius:0;color:rgba(255,255,255,.92);font-family:'Inter',Arial,sans-serif;font-size:13px;
      line-height:1.4;padding:10px 12px;max-width:210px;z-index:9998;box-shadow:0 4px 16px rgba(0,0,0,.35);
      opacity:0;transform:translateX(8px);transition:opacity .3s ease,transform .3s ease;pointer-events:none;}
    .ai-nudge.show{opacity:1;transform:translateX(0);}

    .ai-panel{position:fixed;bottom:88px;right:20px;width:min(340px,calc(100vw - 40px));
      max-height:min(480px,calc(100vh - 140px));background:#111;border:1px solid #333;border-radius:0;
      display:flex;flex-direction:column;z-index:9999;font-family:'Inter',Arial,sans-serif;overflow:hidden;
      box-shadow:0 18px 48px rgba(0,0,0,.5);
      opacity:0;visibility:hidden;transform:translateY(10px) scale(.985);transform-origin:100% 100%;
      transition:opacity .2s ease,transform .22s cubic-bezier(.2,.8,.3,1),visibility .22s;}
    .ai-panel.open{opacity:1;visibility:visible;transform:translateY(0) scale(1);}
    @media (min-width: 768px){
      .ai-panel{width:380px;max-height:560px;}
    }
    @media (max-width: 520px){
      .ai-panel{left:0;right:0;bottom:0;width:100%;max-width:100%;
        max-height:82vh;height:82vh;border-left:none;border-right:none;border-bottom:none;
        transform:translateY(100%);transform-origin:50% 100%;}
      .ai-panel.open{transform:translateY(0);}
      .ai-bubble{bottom:16px;right:16px;}
    }
    @media (prefers-reduced-motion: reduce){
      .ai-panel,.ai-bubble,.ai-bubble svg,.ai-nudge{transition:none;}
    }

    .ai-header{background:${RED};color:#fff;padding:14px 16px;font-family:'Montserrat',sans-serif;
      font-weight:800;font-size:13px;letter-spacing:1px;text-transform:uppercase;
      display:flex;align-items:center;gap:10px;flex:0 0 auto;}
    .ai-header .ai-h-text{flex:1;min-width:0;}
    .ai-header .ai-h-title{display:block;}
    .ai-status{display:flex;align-items:center;gap:6px;margin-top:4px;
      font-family:'Inter',Arial,sans-serif;font-weight:600;font-size:10px;letter-spacing:1.2px;
      color:rgba(255,255,255,.85);}
    .ai-status i{width:6px;height:6px;background:#4ade80;display:block;flex:0 0 auto;}
    .ai-close{background:none;border:none;color:#fff;cursor:pointer;padding:4px;line-height:0;opacity:.85;}
    .ai-close:hover{opacity:1;}
    .ai-close svg{width:18px;height:18px;stroke:#fff;fill:none;stroke-width:2.2;}

    .ai-messages{flex:1 1 auto;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;
      scroll-behavior:smooth;overscroll-behavior:contain;}
    .ai-msg{max-width:85%;padding:10px 12px;border-radius:0;font-size:14px;line-height:1.55;
      white-space:pre-wrap;word-wrap:break-word;
      animation:aiIn .26s cubic-bezier(.2,.8,.3,1) both;}
    @keyframes aiIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:none;}}
    @media (prefers-reduced-motion: reduce){ .ai-msg{animation:none;} }
    .ai-msg.user{align-self:flex-end;background:${RED};color:#fff;}
    .ai-msg.assistant{align-self:flex-start;background:#222;color:rgba(255,255,255,.9);}
    .ai-msg a{color:#fff;text-decoration:underline;text-underline-offset:2px;}
    .ai-msg.assistant a{color:#fff;font-weight:600;}

    .ai-typing{align-self:flex-start;background:#222;padding:12px 14px;display:flex;gap:5px;align-items:center;}
    .ai-typing span{width:6px;height:6px;background:rgba(255,255,255,.65);display:block;
      animation:aiDot 1.1s infinite ease-in-out both;}
    .ai-typing span:nth-child(2){animation-delay:.16s;}
    .ai-typing span:nth-child(3){animation-delay:.32s;}
    @keyframes aiDot{0%,80%,100%{opacity:.25;transform:translateY(0);}40%{opacity:1;transform:translateY(-3px);}}
    @media (prefers-reduced-motion: reduce){ .ai-typing span{animation:none;opacity:.7;} }

    .ai-chips{display:flex;flex-wrap:wrap;gap:8px;padding:0 14px 12px;flex:0 0 auto;}
    .ai-chip{background:transparent;border:1px solid #3a3a3a;border-radius:0;color:rgba(255,255,255,.85);
      font-family:'Inter',Arial,sans-serif;font-size:12.5px;padding:8px 11px;cursor:pointer;
      transition:border-color .18s ease,color .18s ease,background .18s ease;}
    .ai-chip:hover{border-color:${RED};color:#fff;background:rgba(139,0,0,.18);}
    .ai-chip:focus-visible{outline:2px solid ${RED};outline-offset:2px;}

    .ai-input-row{display:flex;align-items:flex-end;border-top:1px solid #333;flex:0 0 auto;}
    .ai-input{flex:1;background:#1a1a1a;color:#fff;border:none;padding:12px;font-size:14px;
      font-family:'Inter',Arial,sans-serif;line-height:1.45;resize:none;max-height:110px;overflow-y:auto;}
    .ai-input:focus{outline:none;background:#1f1f1f;}
    .ai-input::placeholder{color:rgba(255,255,255,.42);}
    .ai-send{background:${RED};color:#fff;border:none;padding:0 16px;cursor:pointer;font-weight:800;
      align-self:stretch;display:flex;align-items:center;justify-content:center;min-width:52px;
      transition:filter .18s ease,opacity .18s ease;}
    .ai-send:hover:not(:disabled){filter:brightness(1.22);}
    .ai-send:disabled{opacity:.45;cursor:not-allowed;}
    .ai-send svg{width:18px;height:18px;stroke:#fff;fill:none;stroke-width:2.2;}

    .ai-skip{background:none;border:none;color:rgba(255,255,255,.5);font-family:'Inter',Arial,sans-serif;
      font-size:11.5px;letter-spacing:1.2px;text-transform:uppercase;cursor:pointer;padding:0 14px 12px;
      text-align:left;align-self:flex-start;flex:0 0 auto;}
    .ai-skip:hover{color:rgba(255,255,255,.8);text-decoration:underline;}
    .ai-hidden{display:none !important;}
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const bubble = document.createElement('button');
  bubble.className = 'ai-bubble';
  bubble.type = 'button';
  bubble.setAttribute('aria-label', 'Open chat with Hex, 3J\'s Auto Body and RLSH assistant');
  bubble.setAttribute('aria-expanded', 'false');
  bubble.innerHTML =
    '<svg class="ai-ico-chat" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>'
    + '<svg class="ai-ico-close" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>';

  const nudge = document.createElement('div');
  nudge.className = 'ai-nudge';
  nudge.textContent = customerName
    ? 'Welcome back, ' + customerName + ' — need anything?'
    : 'Questions? Hex is here to help.';

  const panel = document.createElement('div');
  panel.className = 'ai-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', "Hex, 3J's Auto Body and RLSH chat assistant");
  panel.setAttribute('aria-modal', 'false');
  panel.innerHTML = `
    <div class="ai-header">
      <div class="ai-h-text">
        <span class="ai-h-title">Hex — 3J's Auto Body and RLSH</span>
        <span class="ai-status"><i></i>ONLINE NOW</span>
      </div>
      <button class="ai-close" type="button" aria-label="Close chat">
        <svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    </div>
    <div class="ai-messages" role="log" aria-live="polite" aria-atomic="false"></div>
    <div class="ai-chips ai-hidden"></div>
    <button class="ai-skip ai-hidden" type="button">Skip — just ask a question</button>
    <div class="ai-input-row">
      <textarea class="ai-input" rows="1" placeholder="Type your question..."
        aria-label="Type your message"></textarea>
      <button class="ai-send" type="button" aria-label="Send message">
        <svg viewBox="0 0 24 24"><path d="M4 12h15M13 6l6 6-6 6"/></svg>
      </button>
    </div>
  `;

  document.body.appendChild(bubble);
  document.body.appendChild(nudge);
  document.body.appendChild(panel);

  const messagesEl = panel.querySelector('.ai-messages');
  const chipsEl = panel.querySelector('.ai-chips');
  const skipBtn = panel.querySelector('.ai-skip');
  const inputEl = panel.querySelector('.ai-input');
  const sendBtn = panel.querySelector('.ai-send');
  const closeBtn = panel.querySelector('.ai-close');

  const SUGGESTIONS = [
    'Do you do Rhino Linings?',
    'How do I get a quote?',
    'What are your hours?',
    'Where are you located?'
  ];

  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  /* Builds message content as DOM nodes (never innerHTML) so customer text and
     model output can never inject markup. Phone numbers become tap-to-call. */
  const PHONE_RE = /(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/g;
  function appendText(target, text) {
    const parts = String(text).split(PHONE_RE);
    parts.forEach(function (part, i) {
      if (!part) return;
      if (i % 2 === 1) {
        const a = document.createElement('a');
        a.href = 'tel:' + part.replace(/\D/g, '');
        a.textContent = part;
        target.appendChild(a);
      } else {
        target.appendChild(document.createTextNode(part));
      }
    });
  }

  function addMessage(role, text) {
    const el = document.createElement('div');
    el.className = 'ai-msg ' + role;
    appendText(el, text);
    messagesEl.appendChild(el);
    scrollToBottom();
    return el;
  }

  function showTyping() {
    const el = document.createElement('div');
    el.className = 'ai-typing';
    el.setAttribute('aria-label', 'Hex is typing');
    el.innerHTML = '<span></span><span></span><span></span>';
    messagesEl.appendChild(el);
    scrollToBottom();
    return el;
  }

  /* Reveals the reply progressively instead of dropping a finished wall of
     text. Keeps the "takes its time, never rushed" voice brief while feeling
     alive rather than frozen behind a spinner. */
  function revealMessage(text) {
    const el = document.createElement('div');
    el.className = 'ai-msg assistant';
    messagesEl.appendChild(el);

    if (reduceMotion) {
      appendText(el, text);
      scrollToBottom();
      return Promise.resolve();
    }

    const words = String(text).split(/(\s+)/);
    const step = words.length > 90 ? 8 : 18;
    let i = 0;
    return new Promise(function (resolve) {
      (function tick() {
        if (i >= words.length) { resolve(); return; }
        let chunk = '';
        const take = Math.min(words.length - i, words.length > 160 ? 4 : 2);
        for (let k = 0; k < take; k++) chunk += words[i + k];
        i += take;
        el.textContent = '';
        appendText(el, words.slice(0, i).join(''));
        scrollToBottom();
        setTimeout(tick, step);
      })();
    });
  }

  function renderChips() {
    chipsEl.innerHTML = '';
    SUGGESTIONS.forEach(function (q) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'ai-chip';
      b.textContent = q;
      b.addEventListener('click', function () {
        chipsEl.classList.add('ai-hidden');
        sendMessage(q);
      });
      chipsEl.appendChild(b);
    });
    chipsEl.classList.remove('ai-hidden');
  }

  function startNameStep() {
    awaitingName = true;
    inputEl.placeholder = 'Your first name...';
    skipBtn.classList.remove('ai-hidden');
    addMessage('assistant',
      "Hi — I'm Hex, your assistant here at 3J's Auto Body and RLSH. "
      + "I can answer questions about our work and pricing, or help you find your way around the site. "
      + "First off, what's your first name?");
  }

  function finishNameStep(name) {
    awaitingName = false;
    skipBtn.classList.add('ai-hidden');
    inputEl.placeholder = 'Type your question...';
    if (name) {
      customerName = name;
      localStorage.setItem(NAME_KEY, name);
      addMessage('assistant',
        'Great to meet you, ' + name + '. What can I help you with today?');
    } else {
      addMessage('assistant', 'No problem — what can I help you with today?');
    }
    renderChips();
  }

  let started = false;
  function startConversation() {
    if (started) return;
    started = true;
    if (customerName) {
      addMessage('assistant',
        'Welcome back, ' + customerName + "! Hex here — ask me anything, "
        + 'or tell me what you\'re looking for and I\'ll point you to the right page.');
      renderChips();
    } else {
      startNameStep();
    }
  }

  /* ---- open / close ---- */
  let isOpen = false;
  function setOpen(open) {
    isOpen = open;
    panel.classList.toggle('open', open);
    bubble.classList.toggle('open', open);
    bubble.setAttribute('aria-expanded', String(open));
    bubble.setAttribute('aria-label', open ? 'Close chat' : "Open chat with 3J's Auto Body");
    nudge.classList.remove('show');
    if (open) {
      startConversation();
      setTimeout(function () { inputEl.focus(); }, reduceMotion ? 0 : 220);
    } else {
      bubble.focus();
    }
  }

  bubble.addEventListener('click', function () { setOpen(!isOpen); });
  closeBtn.addEventListener('click', function () { setOpen(false); });
  nudge.addEventListener('click', function () { setOpen(true); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen) setOpen(false);
  });

  skipBtn.addEventListener('click', function () {
    finishNameStep('');
    inputEl.focus();
  });

  /* One-time gentle nudge so the assistant is discoverable without nagging. */
  if (!sessionStorage.getItem('threejs_ai_nudged')) {
    setTimeout(function () {
      if (!isOpen) {
        nudge.classList.add('show');
        sessionStorage.setItem('threejs_ai_nudged', '1');
        setTimeout(function () { nudge.classList.remove('show'); }, 7000);
      }
    }, 6000);
  }

  /* ---- input ---- */
  function autoGrow() {
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 110) + 'px';
  }
  inputEl.addEventListener('input', function () {
    autoGrow();
    sendBtn.disabled = !inputEl.value.trim();
  });
  sendBtn.disabled = true;

  inputEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  });
  sendBtn.addEventListener('click', submit);

  function submit() {
    const text = inputEl.value.trim();
    if (!text) return;
    inputEl.value = '';
    autoGrow();
    sendBtn.disabled = true;

    if (awaitingName) {
      /* Take only the first word, strip punctuation — customers often type
         "Daniel Morales" or "it's Dan!" when asked for a first name. */
      const first = text.split(/\s+/)[0].replace(/[^\p{L}\p{N}'-]/gu, '').slice(0, 40);
      addMessage('user', text);
      finishNameStep(first);
      return;
    }

    sendMessage(text);
  }

  let inFlight = false;
  async function sendMessage(text) {
    if (inFlight) return;
    inFlight = true;
    chipsEl.classList.add('ai-hidden');
    addMessage('user', text);

    const typingEl = showTyping();
    const startedAt = Date.now();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          message: text,
          customerName: customerName || undefined
        })
      });
      const data = await res.json();

      /* Deliberate minimum beat before replying — matches the "takes its time,
         never rushed" voice brief. Only pads out what the network didn't
         already take, so slow replies aren't delayed twice. */
      const elapsed = Date.now() - startedAt;
      const minBeat = reduceMotion ? 0 : 600;
      if (elapsed < minBeat) await new Promise(r => setTimeout(r, minBeat - elapsed));

      typingEl.remove();
      await revealMessage(
        data.reply || "Sorry, I'm having trouble right now — please call 562-424-6744."
      );
    } catch (e) {
      typingEl.remove();
      addMessage('assistant',
        "Sorry, I'm having trouble right now — please call 562-424-6744.");
    } finally {
      inFlight = false;
      sendBtn.disabled = !inputEl.value.trim();
      if (isOpen) inputEl.focus();
    }
  }
})();
