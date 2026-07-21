// cloudflare/widget/assistant-widget.js
(function () {
  if (window.__aiWidgetLoaded) return;
  window.__aiWidgetLoaded = true;

  const RED = '#8B0000';
  const conversationId = (function () {
    const key = 'threejs_ai_conversation_id';
    let id = localStorage.getItem(key);
    if (!id) {
      id = 'conv-' + Date.now() + '-' + Math.random().toString(36).slice(2);
      localStorage.setItem(key, id);
    }
    return id;
  })();

  const css = `
    .ai-bubble{position:fixed;bottom:20px;right:20px;width:56px;height:56px;background:${RED};
      border:2px solid ${RED};border-radius:0;display:flex;align-items:center;justify-content:center;
      cursor:pointer;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,.3);}
    .ai-bubble svg{width:26px;height:26px;stroke:#fff;fill:none;stroke-width:2;}
    .ai-panel{position:fixed;bottom:88px;right:20px;width:min(340px,calc(100vw - 40px));
      max-height:min(480px,calc(100vh - 140px));background:#111;border:1px solid #333;border-radius:0;
      display:none;flex-direction:column;z-index:9999;font-family:'Inter',Arial,sans-serif;overflow:hidden;}
    .ai-panel.open{display:flex;}
    @media (min-width: 768px){
      .ai-panel{width:380px;max-height:560px;}
    }
    .ai-header{background:${RED};color:#fff;padding:14px 16px;font-family:'Montserrat',sans-serif;
      font-weight:800;font-size:13px;letter-spacing:1px;text-transform:uppercase;}
    .ai-messages{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;}
    .ai-msg{max-width:85%;padding:10px 12px;border-radius:0;font-size:14px;line-height:1.5;}
    .ai-msg.user{align-self:flex-end;background:${RED};color:#fff;}
    .ai-msg.assistant{align-self:flex-start;background:#222;color:rgba(255,255,255,.9);}
    .ai-input-row{display:flex;border-top:1px solid #333;}
    .ai-input{flex:1;background:#1a1a1a;color:#fff;border:none;padding:12px;font-size:14px;}
    .ai-send{background:${RED};color:#fff;border:none;padding:0 18px;cursor:pointer;font-weight:800;}
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const bubble = document.createElement('div');
  bubble.className = 'ai-bubble';
  bubble.innerHTML = '<svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>';

  const panel = document.createElement('div');
  panel.className = 'ai-panel';
  panel.innerHTML = `
    <div class="ai-header">3J's Auto Body — Ask Us Anything</div>
    <div class="ai-messages"></div>
    <div class="ai-input-row">
      <input class="ai-input" type="text" placeholder="Type your question..." />
      <button class="ai-send">Send</button>
    </div>
  `;

  document.body.appendChild(bubble);
  document.body.appendChild(panel);

  const messagesEl = panel.querySelector('.ai-messages');
  const inputEl = panel.querySelector('.ai-input');
  const sendBtn = panel.querySelector('.ai-send');

  function addMessage(role, text) {
    const el = document.createElement('div');
    el.className = 'ai-msg ' + role;
    el.textContent = text;
    messagesEl.appendChild(el);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  let opened = false;
  bubble.addEventListener('click', function () {
    panel.classList.toggle('open');
    if (!opened) {
      opened = true;
      addMessage('assistant', "Hey there — welcome to 3J's! What can I help you with today?");
    }
  });

  async function send() {
    const text = inputEl.value.trim();
    if (!text) return;
    inputEl.value = '';
    addMessage('user', text);

    const typingEl = document.createElement('div');
    typingEl.className = 'ai-msg assistant';
    typingEl.textContent = '...';
    messagesEl.appendChild(typingEl);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, message: text })
      });
      const data = await res.json();
      /* Deliberate pause before showing the reply — matches the "takes its
         time, never rushed" voice brief rather than an instant robotic reply. */
      await new Promise(r => setTimeout(r, 1500));
      typingEl.remove();
      addMessage('assistant', data.reply || "Sorry, I'm having trouble right now — please call 562-424-6744.");
    } catch (e) {
      typingEl.remove();
      addMessage('assistant', "Sorry, I'm having trouble right now — please call 562-424-6744.");
    }
  }

  sendBtn.addEventListener('click', send);
  inputEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') send();
  });
})();
