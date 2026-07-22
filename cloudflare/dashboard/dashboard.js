// cloudflare/dashboard/dashboard.js
(function () {
  const loginView = document.getElementById('login-view');
  const dashboardView = document.getElementById('dashboard-view');
  const convList = document.getElementById('conv-list');
  const convDetail = document.getElementById('conv-detail');
  const convMessages = document.getElementById('conv-messages');

  /* Customer-supplied text (names) is rendered into innerHTML below — escape it
     so a visitor can't inject markup into the owner's dashboard. */
  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  function formatTime(raw) {
    if (!raw) return '';
    const iso = raw.includes('T') ? raw : raw.replace(' ', 'T') + 'Z';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return raw;
    return d.toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true
    });
  }

  async function tryLoadDashboard() {
    const res = await fetch('/api/dashboard/conversations');
    if (!res.ok) return false;
    const data = await res.json();
    renderList(data.conversations);
    loginView.classList.add('hidden');
    dashboardView.classList.remove('hidden');
    return true;
  }

  function renderList(conversations) {
    convList.innerHTML = '';
    convDetail.classList.add('hidden');
    convList.classList.remove('hidden');
    conversations.forEach(function (c) {
      const item = document.createElement('div');
      item.className = 'conv-item';
      const who = c.customer_name ? `${escapeHtml(c.customer_name)} — ${c.id}` : c.id;
      item.innerHTML = `<div>${who}</div><div style="font-size:12px;color:#999;">${formatTime(c.last_message_at)}</div>` +
        (c.lead_count > 0 ? `<div class="lead-flag">LEAD (${c.lead_count})</div>` : '');
      item.addEventListener('click', function () { openConversation(c.id); });
      convList.appendChild(item);
    });
  }

  async function openConversation(id) {
    const res = await fetch('/api/dashboard/conversation?id=' + encodeURIComponent(id));
    const data = await res.json();
    convMessages.innerHTML = '';
    data.messages.forEach(function (m) {
      const el = document.createElement('div');
      el.className = 'msg ' + m.role;
      el.textContent = (m.role === 'user' ? 'Customer: ' : 'Assistant: ') + m.content;
      convMessages.appendChild(el);
    });
    if (data.leads.length) {
      const leadEl = document.createElement('div');
      leadEl.className = 'lead-flag';
      leadEl.style.marginTop = '16px';
      leadEl.textContent = 'LEAD: ' + data.leads.map(function (l) {
        return l.name + ' / ' + l.phone + (l.competitor_link ? ' / link: ' + l.competitor_link : '');
      }).join(', ');
      convMessages.appendChild(leadEl);
    }
    convList.classList.add('hidden');
    convDetail.classList.remove('hidden');
  }

  document.getElementById('back-btn').addEventListener('click', function () {
    convDetail.classList.add('hidden');
    convList.classList.remove('hidden');
  });

  async function attemptLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (res.ok) {
      await tryLoadDashboard();
    } else {
      document.getElementById('login-error').textContent = 'Invalid username or password.';
    }
  }

  document.getElementById('login-btn').addEventListener('click', attemptLogin);

  document.getElementById('username').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.getElementById('password').focus();
    }
  });

  document.getElementById('password').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      attemptLogin();
    }
  });

  document.getElementById('export-btn').addEventListener('click', function () {
    window.location.href = '/api/dashboard/export';
  });

  tryLoadDashboard();
})();
