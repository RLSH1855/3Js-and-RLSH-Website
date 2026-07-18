/* ============================================================
   3J's QUOTE CART — sitewide "quote list" (cart for quote requests)
   ------------------------------------------------------------
   Loaded automatically by site-shell.js (same pattern as mega-menu.js).
   - localStorage-backed list of products the visitor wants quoted
     (key: 'quote_cart' — array of {id, product, partNum, brand,
      year, make, model, trim, bedSize, vin, addedAt})
   - Injects a cart icon + count badge into the black nav bar
     (right of the My Garage pill) and a row in the mobile drawer
   - Slide-down review panel anchored top-right (Rough Country-style
     placement, 3J's visual language: square corners, #8B0000 red)
   - Global click delegate: any element with [data-quote-add] becomes
     an "Add to Quote" action. Its href is kept as a no-JS fallback.
   - Pages can also call window.RLSHQuoteCart.add({product, partNum, brand})
   - Submit hands off to parts-quote.html, which reads the same
     localStorage list and sends ONE combined request to /api/quote.
   ============================================================ */
(function(){
  if(window.__qcLoaded) return; window.__qcLoaded=true;

  var KEY='quote_cart';
  var QUOTE_PAGE='parts-quote.html';

  /* ── storage helpers ── */
  function readCart(){
    try{var s=localStorage.getItem(KEY);var a=s?JSON.parse(s):[];return Array.isArray(a)?a:[];}catch(e){return [];}
  }
  function writeCart(items){
    try{localStorage.setItem(KEY,JSON.stringify(items));}catch(e){}
    try{window.dispatchEvent(new Event('quoteCartUpdated'));}catch(e){}
  }
  function readGarage(){
    try{var s=localStorage.getItem('garage_vehicle');return s?JSON.parse(s):null;}catch(e){return null;}
  }

  /* ── public accessor (mirrors window.RLSHGarage) ── */
  window.RLSHQuoteCart=(function(){
    function get(){return readCart();}
    function count(){return readCart().length;}
    function add(obj){
      if(!obj||!obj.product) return null;
      var items=readCart();
      var dupe=null;
      for(var i=0;i<items.length;i++){
        if(items[i].product===obj.product&&(items[i].partNum||'')===(obj.partNum||'')){dupe=items[i];break;}
      }
      if(dupe){
        showToast(obj.product,true);
        pulseBadge();
        return null;
      }
      var v=readGarage()||{};
      var item={
        id:Date.now().toString(36)+Math.random().toString(36).slice(2,7),
        product:obj.product,
        partNum:obj.partNum||'',
        brand:obj.brand||'',
        year:v.year||'',
        make:v.make||'',
        model:v.model||'',
        trim:v.trim||'',
        bedSize:v.bedSize||'',
        vin:v.vin||'',
        addedAt:new Date().toISOString()
      };
      items.push(item);
      writeCart(items);
      showToast(obj.product,false);
      pulseBadge();
      return item;
    }
    function remove(id){
      var items=readCart().filter(function(it){return it.id!==id;});
      writeCart(items);
    }
    function clear(){
      writeCart([]);
    }
    function subscribe(cb){
      window.addEventListener('storage',function(e){if(e.key===KEY)cb(readCart());});
      window.addEventListener('quoteCartUpdated',function(){cb(readCart());});
    }
    return {get:get,count:count,add:add,remove:remove,clear:clear,subscribe:subscribe,open:openPanel,close:closePanel,KEY:KEY};
  })();

  /* ── skip all UI when embedded (Wix iframe) — buttons fall back to their hrefs ── */
  var inFrame=(function(){try{return window.self!==window.top;}catch(e){return true;}})();

  /* ════════ STYLES ════════ */
  var css=''
  /* nav button */
  +'.ss-qcart{position:relative;align-self:center;display:flex;align-items:center;justify-content:center;width:64px;height:60px;flex-shrink:0;box-sizing:border-box;'
  +'border:1px solid rgba(255,255,255,.18);border-left:none;background:rgba(255,255,255,.07);cursor:pointer;border-radius:0;text-decoration:none;'
  +'transition:border-color .15s,background .15s;}'
  +'.ss-qcart:hover{border-color:#8B0000;background:rgba(255,255,255,.11);}'
  +'.ss-qcart svg{width:26px;height:26px;stroke:rgba(255,255,255,.9);fill:none;stroke-width:1.8;transition:stroke .15s;}'
  +'.ss-qcart.qc-has svg{stroke:#fff;}'
  +'.ss-qcart-badge{position:absolute;top:7px;right:5px;min-width:18px;height:18px;padding:0 4px;box-sizing:border-box;display:none;align-items:center;justify-content:center;'
  +'background:#8B0000;color:#fff;font-family:\'Montserrat\',\'Inter\',sans-serif;font-size:10px;font-weight:800;line-height:1;border-radius:0;}'
  +'.ss-qcart.qc-has .ss-qcart-badge{display:flex;}'
  +'@keyframes qcPulse{0%{transform:scale(1);}40%{transform:scale(1.35);}100%{transform:scale(1);}}'
  +'.ss-qcart-badge.qc-pulse{animation:qcPulse .45s cubic-bezier(.22,1,.36,1);}'
  +'@media(max-width:960px){.ss-qcart{display:none;}}'
  /* mobile drawer count chip */
  +'.qc-drawer-count{font-family:\'Montserrat\',\'Inter\',sans-serif;font-size:11px;font-weight:800;color:#fff;background:#8B0000;padding:2px 7px;margin-left:8px;}'
  /* panel overlay + panel */
  +'.qc-ov{position:fixed;inset:0;z-index:1400;display:none;background:rgba(7,12,22,.45);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);opacity:0;transition:opacity .25s ease;}'
  +'.qc-ov.qc-open{display:block;opacity:1;}'
  +'.qc-panel{position:fixed;z-index:1401;top:0;right:0;width:min(420px,100vw);max-height:calc(100vh - 24px);display:none;flex-direction:column;'
  +'background:#fff;border:1px solid #E8E8E8;border-top:3px solid #8B0000;box-shadow:0 30px 80px rgba(0,0,0,.45);'
  +'opacity:0;transform:translateY(-10px);transition:opacity .28s ease,transform .32s cubic-bezier(.22,1,.36,1);}'
  +'.qc-panel.qc-open{display:flex;opacity:1;transform:translateY(0);}'
  +'@media(min-width:961px){.qc-panel{right:12px;}}'
  /* panel header */
  +'.qc-head{display:flex;align-items:center;justify-content:space-between;padding:18px 20px 14px;border-bottom:2px solid #F0F0EE;flex-shrink:0;}'
  +'.qc-head-title{font-family:\'Montserrat\',\'Inter\',sans-serif;font-size:13px;font-weight:900;letter-spacing:3px;text-transform:uppercase;color:#0A0A0A;}'
  +'.qc-head-title span{color:#8B0000;}'
  +'.qc-x{width:34px;height:34px;border:none;background:rgba(0,0,0,.05);cursor:pointer;font-size:16px;font-weight:700;color:#2d2d2d;line-height:1;display:flex;align-items:center;justify-content:center;border-radius:0;transition:background .15s,color .15s;}'
  +'.qc-x:hover{background:#8B0000;color:#fff;}'
  /* panel body */
  +'.qc-body{overflow-y:auto;flex:1;min-height:0;padding:16px 20px;}'
  /* empty state */
  +'.qc-empty-h{font-family:\'Montserrat\',\'Inter\',sans-serif;font-size:18px;font-weight:900;letter-spacing:-.3px;text-transform:uppercase;color:#0A0A0A;text-align:center;margin:14px 0 6px;}'
  +'.qc-empty-sub{font-family:\'Inter\',sans-serif;font-size:13px;color:#555;text-align:center;line-height:1.6;margin-bottom:20px;}'
  +'.qc-cats{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:8px;}'
  +'.qc-cat{position:relative;display:flex;align-items:flex-end;height:104px;background:#0A0A0A;border:1px solid #0A0A0A;text-decoration:none;overflow:hidden;transition:border-color .15s;}'
  +'.qc-cat:hover{border-color:#8B0000;}'
  +'.qc-cat img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.55;transition:transform .3s ease,opacity .2s;}'
  +'.qc-cat:hover img{transform:scale(1.03);opacity:.65;}'
  +'.qc-cat-label{position:relative;z-index:1;width:100%;padding:10px 12px;font-family:\'Montserrat\',\'Inter\',sans-serif;font-size:12px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;color:#fff;text-shadow:0 1px 4px rgba(0,0,0,.7);'
  +'background:linear-gradient(to top,rgba(0,0,0,.72),transparent);}'
  /* item rows */
  +'.qc-item{display:flex;align-items:flex-start;gap:12px;padding:14px 0;border-bottom:1px solid #F0F0EE;}'
  +'.qc-item:first-child{padding-top:2px;}'
  +'.qc-item:last-child{border-bottom:none;}'
  +'.qc-item-ico{width:34px;height:34px;background:#F8F8F6;border:1px solid #E8E8E8;display:flex;align-items:center;justify-content:center;flex-shrink:0;}'
  +'.qc-item-ico svg{width:17px;height:17px;stroke:#8B0000;fill:none;stroke-width:2;}'
  +'.qc-item-txt{flex:1;min-width:0;}'
  +'.qc-item-name{font-family:\'Montserrat\',\'Inter\',sans-serif;font-size:14px;font-weight:800;color:#0A0A0A;line-height:1.3;}'
  +'.qc-item-part{font-family:\'Inter\',sans-serif;font-size:11px;font-weight:600;color:#777;margin-top:2px;}'
  +'.qc-item-rm{width:28px;height:28px;border:1px solid #E8E8E8;background:#fff;cursor:pointer;font-size:14px;font-weight:700;color:#999;line-height:1;display:flex;align-items:center;justify-content:center;flex-shrink:0;border-radius:0;transition:background .15s,color .15s,border-color .15s;}'
  +'.qc-item-rm:hover{background:#8B0000;border-color:#8B0000;color:#fff;}'
  /* vehicle line */
  +'.qc-veh{display:flex;align-items:center;gap:8px;margin-top:14px;padding:11px 14px;background:#F8F8F6;border:1px solid #E8E8E8;font-family:\'Inter\',sans-serif;font-size:12px;font-weight:600;color:#444;}'
  +'.qc-veh strong{font-family:\'Montserrat\',\'Inter\',sans-serif;font-weight:800;color:#0A0A0A;}'
  +'.qc-veh svg{width:15px;height:15px;stroke:#8B0000;fill:none;stroke-width:2;flex-shrink:0;}'
  /* panel footer */
  +'.qc-foot{padding:16px 20px 18px;border-top:2px solid #F0F0EE;flex-shrink:0;background:#fff;}'
  +'.qc-submit{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;height:50px;background:#8B0000;color:#fff;border:2px solid #a00000;border-radius:0;'
  +'font-family:\'Montserrat\',\'Inter\',sans-serif;font-size:12px;font-weight:800;letter-spacing:2.5px;text-transform:uppercase;text-decoration:none;cursor:pointer;transition:background .2s;}'
  +'.qc-submit:hover{background:#6d0000;}'
  +'.qc-clear{display:block;width:100%;margin-top:10px;background:none;border:none;cursor:pointer;font-family:\'Montserrat\',\'Inter\',sans-serif;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#999;padding:6px 0;transition:color .15s;}'
  +'.qc-clear:hover{color:#8B0000;}'
  /* toast */
  +'.qc-toast{position:fixed;z-index:1500;right:16px;bottom:16px;width:min(340px,calc(100vw - 32px));display:flex;align-items:flex-start;gap:12px;padding:14px 16px;'
  +'background:#0A0A0A;border-left:3px solid #8B0000;box-shadow:0 16px 48px rgba(0,0,0,.4);opacity:0;transform:translateY(12px);pointer-events:none;transition:opacity .3s ease,transform .35s cubic-bezier(.22,1,.36,1);}'
  +'.qc-toast.qc-show{opacity:1;transform:translateY(0);pointer-events:auto;}'
  +'.qc-toast-ico{width:26px;height:26px;background:#8B0000;color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:900;flex-shrink:0;}'
  +'.qc-toast-txt{flex:1;min-width:0;}'
  +'.qc-toast-h{font-family:\'Montserrat\',\'Inter\',sans-serif;font-size:11px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:#fff;margin-bottom:2px;}'
  +'.qc-toast-p{font-family:\'Inter\',sans-serif;font-size:12px;color:rgba(255,255,255,.80);line-height:1.4;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}'
  +'.qc-toast-view{background:none;border:none;cursor:pointer;font-family:\'Montserrat\',\'Inter\',sans-serif;font-size:10px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;color:#fff;border-bottom:2px solid #8B0000;padding:0 0 2px;margin-top:6px;transition:color .15s;}'
  +'.qc-toast-view:hover{color:#8B0000;}'
  +'@media(max-width:600px){.qc-toast{left:16px;right:16px;width:auto;}}';

  /* ════════ ICONS ════════ */
  var icoCart='<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1.4"/><circle cx="19" cy="21" r="1.4"/><path d="M2.5 3h2l2.4 12.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L22 7H6"/></svg>';
  var icoTag='<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>';

  /* ════════ UI STATE ════════ */
  var panelOpen=false;

  function badgeEls(){return document.querySelectorAll('.ss-qcart-badge');}

  function syncBadge(){
    var n=readCart().length;
    var btn=document.getElementById('ss-qcart-btn');
    if(btn) btn.classList.toggle('qc-has',n>0);
    badgeEls().forEach(function(b){b.textContent=String(n);});
    var chip=document.getElementById('qcDrawerCount');
    if(chip){
      chip.textContent=String(n);
      chip.style.display=n>0?'':'none';
    }
    if(panelOpen) renderPanel();
  }

  function pulseBadge(){
    var b=document.querySelector('#ss-qcart-btn .ss-qcart-badge');
    if(!b) return;
    b.classList.remove('qc-pulse');void b.offsetWidth;b.classList.add('qc-pulse');
  }

  /* ════════ TOAST ════════ */
  var toastTimer=null;
  function showToast(product,already){
    var t=document.getElementById('qcToast');
    if(!t) return;
    document.getElementById('qcToastH').textContent=already?'Already in your quote list':'Added to your quote list';
    document.getElementById('qcToastP').textContent=product;
    t.classList.add('qc-show');
    if(toastTimer) clearTimeout(toastTimer);
    toastTimer=setTimeout(function(){t.classList.remove('qc-show');},3500);
  }

  /* ════════ PANEL ════════ */
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

  function renderPanel(){
    var body=document.getElementById('qcBody');
    var foot=document.getElementById('qcFoot');
    var countEl=document.getElementById('qcHeadCount');
    if(!body) return;
    var items=readCart();
    if(countEl) countEl.textContent=items.length?('('+items.length+')'):'';
    if(!items.length){
      body.innerHTML=
        '<div class="qc-empty-h">Your Quote List Is Empty</div>'
        +'<p class="qc-empty-sub">Browse our accessories and click "Add&nbsp;to&nbsp;Quote" on anything you want priced — then submit one request for everything.</p>'
        +'<div class="qc-cats">'
        +'<a class="qc-cat" href="parts-catalog.html?cat=tonneau"><img src="bak-bakflip-mx4-2016-ford-f150-blue-beach-lifestyle-05.webp" alt="" loading="lazy" onerror="this.style.display=\'none\'"><span class="qc-cat-label">Tonneau Covers</span></a>'
        +'<a class="qc-cat" href="parts-catalog.html?cat=running-boards"><img src="go-rhino/GR_RB10_T_4Steps_Primary__80786.1677057201.webp" alt="" loading="lazy" onerror="this.style.display=\'none\'"><span class="qc-cat-label">Running Boards</span></a>'
        +'<a class="qc-cat" href="parts-catalog.html?cat=lighting"><span class="qc-cat-label">Lighting</span></a>'
        +'<a class="qc-cat" href="parts-catalog.html?cat=floor-liners"><span class="qc-cat-label">Floor Liners</span></a>'
        +'</div>';
      if(foot) foot.style.display='none';
      return;
    }
    var html='';
    items.forEach(function(it){
      html+='<div class="qc-item">'
        +'<span class="qc-item-ico">'+icoTag+'</span>'
        +'<span class="qc-item-txt">'
        +'<div class="qc-item-name">'+esc(it.product)+'</div>'
        +(it.partNum?'<div class="qc-item-part">Part #'+esc(it.partNum)+'</div>':'')
        +'</span>'
        +'<button class="qc-item-rm" data-qc-remove="'+esc(it.id)+'" aria-label="Remove '+esc(it.product)+'">&#x2715;</button>'
        +'</div>';
    });
    var v=readGarage();
    if(v&&v.year){
      html+='<div class="qc-veh">'+icoTag+'<span>For your <strong>'+esc(v.year+' '+v.make+' '+v.model+(v.trim?' '+v.trim:''))+'</strong></span></div>';
    }
    body.innerHTML=html;
    if(foot) foot.style.display='block';
  }

  function positionPanel(){
    var panel=document.getElementById('qcPanel');
    if(!panel) return;
    var top=0;
    if(window.innerWidth>960){
      var shell=document.getElementById('ssShell');
      if(shell) top=Math.max(0,Math.round(shell.getBoundingClientRect().bottom));
    }
    panel.style.top=top+'px';
    panel.style.maxHeight='calc(100vh - '+(top+16)+'px)';
  }

  function openPanel(){
    var ov=document.getElementById('qcOv');
    var panel=document.getElementById('qcPanel');
    if(!ov||!panel) return;
    renderPanel();
    positionPanel();
    panelOpen=true;
    ov.classList.add('qc-open');
    panel.classList.add('qc-open');
  }
  function closePanel(){
    var ov=document.getElementById('qcOv');
    var panel=document.getElementById('qcPanel');
    panelOpen=false;
    if(ov) ov.classList.remove('qc-open');
    if(panel) panel.classList.remove('qc-open');
  }

  /* ════════ INJECT UI (standalone pages only) ════════ */
  function injectUI(){
    if(inFrame) return;
    if(document.getElementById('qcPanel')) return;

    var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

    /* nav button — right of the My Garage pill */
    var garageBtn=document.getElementById('ss-garage-btn');
    if(garageBtn){
      garageBtn.insertAdjacentHTML('afterend',
        '<a href="#" class="ss-qcart" id="ss-qcart-btn" aria-label="My quote list">'
        +icoCart
        +'<span class="ss-qcart-badge">0</span>'
        +'</a>');
    }

    /* mobile drawer row — under the My Garage row */
    var mobGarage=document.getElementById('ss-mob-garage-btn');
    if(mobGarage){
      mobGarage.insertAdjacentHTML('afterend',
        '<button class="ssd-garage" id="ss-mob-qcart-btn">'
        +'<span class="ssd-garage-icon" style="color:#8B0000;display:flex;align-items:center;justify-content:center;">'+icoCart.replace('<svg ','<svg width="26" height="26" style="stroke:#8B0000;fill:none;stroke-width:1.8;" ')+'</span>'
        +'<span class="ssd-garage-val">My Quote List<span class="qc-drawer-count" id="qcDrawerCount" style="display:none">0</span></span>'
        +'<span class="ssd-garage-arr"><svg width="8" height="14" viewBox="0 0 8 14" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 1l6 6-6 6"/></svg></span>'
        +'</button>');
    }

    /* overlay + panel + toast (appended to body — outside #ss-page-wrap) */
    document.body.insertAdjacentHTML('beforeend',
      '<div class="qc-ov" id="qcOv"></div>'
      +'<div class="qc-panel" id="qcPanel" role="dialog" aria-label="My quote list">'
      +'<div class="qc-head">'
      +'<span class="qc-head-title">My <span>Quote</span> List <span id="qcHeadCount" style="color:#999;"></span></span>'
      +'<button class="qc-x" id="qcClose" aria-label="Close quote list">&#x2715;</button>'
      +'</div>'
      +'<div class="qc-body" id="qcBody"></div>'
      +'<div class="qc-foot" id="qcFoot" style="display:none">'
      +'<a href="'+QUOTE_PAGE+'" class="qc-submit">Submit Quote Request &rarr;</a>'
      +'<button class="qc-clear" id="qcClear">Clear All</button>'
      +'</div>'
      +'</div>'
      +'<div class="qc-toast" id="qcToast">'
      +'<span class="qc-toast-ico">&#x2713;</span>'
      +'<span class="qc-toast-txt">'
      +'<div class="qc-toast-h" id="qcToastH">Added to your quote list</div>'
      +'<div class="qc-toast-p" id="qcToastP"></div>'
      +'<button class="qc-toast-view" id="qcToastView">View List &rarr;</button>'
      +'</span>'
      +'</div>');

    /* wiring */
    document.getElementById('qcOv').addEventListener('click',closePanel);
    document.getElementById('qcClose').addEventListener('click',closePanel);
    document.getElementById('qcClear').addEventListener('click',function(){
      window.RLSHQuoteCart.clear();
    });
    document.getElementById('qcToastView').addEventListener('click',function(){
      document.getElementById('qcToast').classList.remove('qc-show');
      openPanel();
    });
    document.addEventListener('keydown',function(e){if(e.key==='Escape')closePanel();});
    window.addEventListener('resize',function(){if(panelOpen)positionPanel();});

    document.addEventListener('click',function(e){
      var t=e.target.closest?e.target.closest('#ss-qcart-btn'):null;
      if(t){e.preventDefault();openPanel();return;}
      var m=e.target.closest?e.target.closest('#ss-mob-qcart-btn'):null;
      if(m){
        /* close the mobile drawer first, then drop the panel in */
        var x=document.getElementById('ssDrawerClose');
        if(x) x.click();
        setTimeout(openPanel,420);
        return;
      }
      var rm=e.target.closest?e.target.closest('[data-qc-remove]'):null;
      if(rm){window.RLSHQuoteCart.remove(rm.getAttribute('data-qc-remove'));return;}
    });

    syncBadge();
  }

  /* ════════ ADD-TO-QUOTE CLICK DELEGATE (all pages) ════════
     Any element with data-quote-add="Product Name" becomes an add action.
     Optional: data-part-num, data-qbrand. Its href stays as a fallback for
     no-JS / embedded contexts where this script isn't running. */
  document.addEventListener('click',function(e){
    var el=e.target.closest?e.target.closest('[data-quote-add]'):null;
    if(!el) return;
    if(inFrame) return; /* embedded: let the href navigate like before */
    e.preventDefault();
    window.RLSHQuoteCart.add({
      product:el.getAttribute('data-quote-add'),
      partNum:el.getAttribute('data-part-num')||'',
      brand:el.getAttribute('data-qbrand')||''
    });
  });

  /* ════════ LIVE SYNC ════════ */
  window.addEventListener('storage',function(e){if(e.key===KEY)syncBadge();});
  window.addEventListener('quoteCartUpdated',syncBadge);

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',injectUI);
  else injectUI();
})();
