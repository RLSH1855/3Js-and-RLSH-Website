/* ============================================================
   3J's SITE SHELL — locked unit: nav + mega menu + footer
   ------------------------------------------------------------
   One include per page (before </body>):
     <script src="https://rlsh1855.github.io/3Js-and-RLSH-Website/site-shell.js"></script>
   - Skips itself inside Wix iframes (only renders standalone / on Cloudflare)
   - Injects: navy/Inter nav (shrink-on-scroll + flicker fix), My Garage pill,
     mobile hamburger menu, footer
   - Auto-loads the real mega-menu.js (3 premium panels) + blur scrim
   - Adds buttery inertia scroll (desktop)
   ============================================================ */
(function(){
  /* Skip if embedded in Wix (iframe) or ?embed=1 */
  var _inFrame=(function(){try{return window.self!==window.top;}catch(e){return true;}})();
  if(_inFrame || window.location.search.indexOf('embed=1')!==-1) return;
  if(window.__ssLoaded) return; window.__ssLoaded=true;

  /* ── Fonts ── */
  if(!document.getElementById('ss-fonts')){
    var f=document.createElement('link');f.id='ss-fonts';f.rel='stylesheet';
    f.href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Oswald:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';
    document.head.appendChild(f);
  }

  /* ════════ STYLES ════════ */
  var css = `
  :root{--ssn:#0b1220;--ssr:#8b0000;--ssr2:#b3000a;--ssgold:#d9a441;--ssnav-font:'Inter';}

  /* fixed shell + flicker fix (own paint layer) */
  .ss-shell{position:fixed;top:0;left:0;right:0;z-index:1000;font-family:'Inter',Arial,sans-serif;
    background:var(--ssn);transform:translateZ(0);will-change:transform;backface-visibility:hidden;-webkit-backface-visibility:hidden;}

  /* top branding bar (collapses on scroll) */
  .ss-top{background:var(--ssn) url('https://rlsh1855.github.io/3Js-and-RLSH-Website/1-BG_dark_blue_gradiant_edited_edited.jpg') center/cover no-repeat;
    display:flex;align-items:center;justify-content:space-between;gap:24px;padding:14px 40px;
    max-height:120px;opacity:1;overflow:hidden;
    transition:max-height .7s cubic-bezier(.4,0,.2,1),opacity .55s cubic-bezier(.4,0,.2,1),padding .7s cubic-bezier(.4,0,.2,1);}
  .ss-shell.ss-shrunk .ss-top{max-height:0;opacity:0;padding-top:0;padding-bottom:0;}
  .ss-logos{display:flex;align-items:center;gap:28px;}
  .ss-logos a{display:inline-flex;}
  .ss-logos img{display:block;object-fit:contain;}
  .ss-logo-rlsh{height:64px;} .ss-logo-3js{height:62px;}
  .ss-tb-btn{display:inline-flex;align-items:center;justify-content:center;height:46px;padding:0 26px;
    font-family:'Oswald',sans-serif;font-size:13px;font-weight:600;letter-spacing:1px;text-transform:uppercase;
    text-decoration:none;border-radius:0;white-space:nowrap;transition:background .2s,color .2s,border-color .2s;}
  .ss-tb-btn.red{background:var(--ssr);color:#fff;border:1px solid #a30505;}
  .ss-tb-btn.red:hover{background:var(--ssr2);}
  .ss-tb-btn.blue{background:#366B8F;color:#fff;border:1px solid #4181AD;}
  .ss-tb-btn.blue:hover{background:#2d5a7a;}

  /* pinned menu row */
  .ss-nav{background:var(--ssn);display:flex;align-items:stretch;justify-content:center;padding:0 16px 0 40px;position:relative;box-shadow:0 2px 0 0 rgba(0,0,0,.25);}
  .ss-links{display:flex;align-items:stretch;flex-wrap:wrap;}
  .ss-links > a{display:inline-flex;align-items:center;gap:5px;padding:18px 22px;margin:0;
    font-family:var(--ssnav-font),sans-serif;font-size:13px;font-weight:500;line-height:1;
    letter-spacing:1.4px;text-transform:uppercase;color:#fff;text-decoration:none;white-space:nowrap;
    background:none;border:none;cursor:pointer;-webkit-appearance:none;appearance:none;vertical-align:middle;
    position:relative;transition:color .2s,padding .7s cubic-bezier(.4,0,.2,1);}
  .ss-links > a::after{content:'';position:absolute;left:22px;right:22px;bottom:0;height:3px;background:var(--ssr);transform:scaleX(0);transform-origin:left;transition:transform .25s ease;}
  .ss-links > a:hover::after, .ss-links > a.ss-active::after{transform:scaleX(1);}
  .ss-shell.ss-shrunk .ss-links > a{padding-top:14px;padding-bottom:14px;}

  /* My Garage pill */
  .ss-garage{margin-left:auto;align-self:center;display:flex;align-items:center;gap:8px;padding:8px 18px 8px 12px;min-width:210px;
    border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.07);text-decoration:none;cursor:pointer;border-radius:0;
    transition:border-color .15s,background .15s;}
  .ss-garage:hover{border-color:var(--ssr);background:rgba(255,255,255,.11);}
  .ss-garage-ico{color:var(--ssr);display:inline-flex;flex-shrink:0;}
  .ss-garage-ico svg{width:26px;height:26px;stroke:currentColor;fill:none;stroke-width:1.6;}
  .ss-garage-txt{display:flex;flex-direction:column;align-items:flex-start;line-height:1.15;}
  .ss-garage-label{font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.45);}
  .ss-garage-veh{font-family:var(--ssnav-font),sans-serif;font-weight:700;font-size:15px;letter-spacing:.03em;color:#fff;white-space:nowrap;}
  .ss-garage-swap{color:rgba(255,255,255,.35);flex-shrink:0;display:inline-flex;}
  .ss-garage-swap svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2;}
  .ss-garage.ss-saved{background:rgba(139,0,0,.18);border-color:rgba(139,0,0,.5);}

  /* spacer clears the fixed shell */
  .ss-spacer{height:174px;}

  /* blur scrim behind open mega menu */
  .ss-scrim{position:fixed;inset:0;z-index:900;background:rgba(7,12,22,.34);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);opacity:0;pointer-events:none;transition:opacity .38s ease;}
  .ss-scrim.ss-show{opacity:1;pointer-events:auto;}

  /* My Garage popup overlay (blurred dark backdrop) */
  .ss-garage-ov{position:fixed;inset:0;z-index:1300;display:none;align-items:center;justify-content:center;background:rgba(7,12,22,.55);backdrop-filter:blur(7px);-webkit-backdrop-filter:blur(7px);opacity:0;transition:opacity .3s ease;padding:24px;}
  .ss-garage-ov.ss-open{display:flex;opacity:1;}
  .ss-garage-frame{width:min(960px,100%);height:min(600px,88vh);border:none;background:#fff;box-shadow:0 40px 100px rgba(0,0,0,.6);}
  @media(max-width:640px){.ss-garage-ov{padding:0;}.ss-garage-frame{width:100%;height:100%;}}

  /* ── Hamburger (mobile) ── */
  .ss-burger{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:8px;background:none;border:none;}
  .ss-burger span{display:block;width:24px;height:2px;background:#fff;transition:transform .3s ease,opacity .3s ease;transform-origin:center;}
  .ss-burger.ss-open span:nth-child(1){transform:translateY(7px) rotate(45deg);}
  .ss-burger.ss-open span:nth-child(2){opacity:0;transform:scaleX(0);}
  .ss-burger.ss-open span:nth-child(3){transform:translateY(-7px) rotate(-45deg);}

  /* ── Mobile menu ── */
  .ss-mob{display:flex;flex-direction:column;background:#0a0f1a;border-top:1px solid #1a2236;max-height:0;overflow:hidden;opacity:0;transform:translateY(-12px);
    transition:max-height .42s cubic-bezier(.22,1,.36,1),opacity .32s ease,transform .38s cubic-bezier(.22,1,.36,1);pointer-events:none;}
  .ss-mob.ss-open{max-height:85vh;overflow-y:auto;opacity:1;transform:translateY(0);pointer-events:all;}
  .ss-mob > a, .ss-mob-top{display:flex;align-items:center;justify-content:space-between;padding:14px 24px;
    font-family:var(--ssnav-font),sans-serif;font-size:12px;font-weight:600;letter-spacing:1.4px;text-transform:uppercase;
    color:#fff;text-decoration:none;border-bottom:1px solid #1a2236;transition:color .2s;cursor:pointer;background:none;border-left:none;border-right:none;border-top:none;width:100%;text-align:left;}
  .ss-mob > a:hover, .ss-mob-top:hover{color:var(--ssr);}
  .ss-mob > a.ss-mob-red{color:#ff5a5a;}
  .ss-mob-arrow{font-size:9px;opacity:.5;transition:transform .2s;}
  .ss-mob-item.ss-mob-open > .ss-mob-top .ss-mob-arrow{transform:rotate(90deg);}
  .ss-mob-sub{display:none;flex-direction:column;background:#06090f;border-bottom:1px solid #1a2236;}
  .ss-mob-item.ss-mob-open > .ss-mob-sub{display:flex;}
  .ss-mob-sub a{display:block;padding:11px 24px 11px 36px;font-family:var(--ssnav-font),sans-serif;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,.6);text-decoration:none;border-bottom:1px solid #10151f;transition:color .2s;}
  .ss-mob-sub a:last-child{border-bottom:none;}
  .ss-mob-sub a:hover{color:#fff;}
  .ss-mob-sub-label{display:block;padding:8px 24px 4px 36px;font-family:'JetBrains Mono',monospace;font-size:8px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--ssr);}
  .ss-mob-garage{display:flex;align-items:center;gap:10px;padding:14px 24px;width:100%;text-align:left;font-family:var(--ssnav-font),sans-serif;font-size:12px;font-weight:600;letter-spacing:1.4px;text-transform:uppercase;color:#ff5a5a;background:none;border:none;border-bottom:1px solid #1a2236;cursor:pointer;}
  .ss-mob-garage svg{width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:2;}

  @media(max-width:960px){
    .ss-top{padding:14px 20px;}
    .ss-logo-rlsh{height:48px;} .ss-logo-3js{height:46px;}
    .ss-nav{display:none;}
    .ss-burger{display:flex;}
    .ss-top{position:relative;}
    .ss-spacer{height:96px;}
    .ss-shell.ss-shrunk .ss-top{max-height:120px;opacity:1;padding:14px 20px;} /* keep bar on mobile */
  }
  @media(max-width:560px){
    .ss-tb-btn.blue{display:none;}
    .ss-tb-btn.red{font-size:11px;padding:0 16px;height:42px;}
    .ss-logo-rlsh{height:40px;} .ss-logo-3js{height:38px;}
  }

  /* ════════ FOOTER ════════ */
  .ss-footer{font-family:var(--ssnav-font),Arial,sans-serif;background:#0a0f1a;padding:56px 64px 28px;border-top:1px solid #1a2236;}
  .ss-footer-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:48px;max-width:1100px;margin:0 auto 40px;}
  .ss-footer-h{font-family:'Oswald',sans-serif;font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.9);margin-bottom:16px;}
  .ss-footer-col a{display:block;font-size:13px;font-weight:400;color:rgba(255,255,255,.55);text-decoration:none;margin-bottom:9px;transition:color .2s;}
  .ss-footer-col a:hover{color:#fff;}
  .ss-footer-lbl{font-size:11px;font-weight:700;color:rgba(255,255,255,.85);margin-bottom:6px;}
  .ss-footer-phone{font-family:'Oswald',sans-serif;font-size:15px;font-weight:600;color:#fff;text-decoration:none;display:inline-block;margin-bottom:14px;transition:color .2s;}
  .ss-footer-phone:hover{color:var(--ssr);}
  .ss-footer-hours{font-size:13px;font-weight:500;color:rgba(255,255,255,.8);line-height:2;letter-spacing:.3px;margin-bottom:20px;}
  .ss-footer-copy{text-align:center;font-size:11px;color:rgba(255,255,255,.45);border-top:1px solid #1a2236;padding-top:24px;max-width:1100px;margin:0 auto;letter-spacing:.4px;}
  .ss-footer-copy b{color:var(--ssr);font-weight:700;}
  @media(max-width:960px){.ss-footer{padding:48px 28px 24px;}.ss-footer-grid{grid-template-columns:1fr 1fr;gap:32px;}}
  @media(max-width:560px){.ss-footer{padding:36px 20px 20px;}.ss-footer-grid{grid-template-columns:1fr;gap:26px;}}
  `;
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

  /* ════════ ICONS ════════ */
  var icoTruck='<svg viewBox="0 0 24 24"><path d="M1 6h13v9H1z"/><path d="M14 9h5l3 3v3h-8z"/><circle cx="6" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>';
  var icoSwap='<svg viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>';

  /* ════════ HEADER HTML ════════ */
  var header =
  '<header class="ss-shell" id="ssShell">'+
    '<div class="ss-top">'+
      '<a href="https://www.3jsautobody.com/rhino-lining-quote" class="ss-tb-btn red" target="_top">Bed-Liner Quote</a>'+
      '<div class="ss-logos">'+
        '<a href="/" target="_top"><img class="ss-logo-rlsh" src="https://static.wixstatic.com/media/b95bd9_8e3e4f256c85462d960aaa1e3ef740c8~mv2.png" alt="RLSH Rhino Lining of Signal Hill"></a>'+
        '<a href="/" target="_top"><img class="ss-logo-3js" src="https://static.wixstatic.com/media/b95bd9_86c7cf1e525d4b9e961a2738ed9af502~mv2.png" alt="3J\'s Auto Body & Paint"></a>'+
      '</div>'+
      '<a href="https://www.carwise.com/online-photo-estimate/3js-autobody-paint-inc-signal-hill-ca-90755/479382?source=shop.profile&referer=estimate.cccone.com" class="ss-tb-btn blue" target="_top">Free Online Repair Estimate</a>'+
      '<button class="ss-burger" id="ssBurger" aria-label="Open menu"><span></span><span></span><span></span></button>'+
    '</div>'+
    '<nav class="ss-nav" aria-label="Main navigation">'+
      '<div class="ss-links">'+
        '<a href="/" target="_top">Home</a>'+
        '<a href="/inside-3js" target="_top">Inside 3J\'s</a>'+
        '<a href="/body-paint-repairs" target="_top">Body &amp; Paint Repairs</a>'+
        '<a href="/rhino-liner" id="sn-trigger-rhino" target="_top">Rhino Liner +</a>'+
        '<a href="/bundles" id="sn-trigger-bundles" target="_top">Bundles &amp; Packages +</a>'+
        '<a href="/exterior-accessories-V2" id="sn-trigger-exterior" target="_top">Exterior Accessories +</a>'+
        '<a href="/shop" target="_top">Shop</a>'+
        '<a href="/contact" target="_top">Contact Us</a>'+
        '<a href="/FAQ_PAGE_V2" target="_top">FAQ</a>'+
      '</div>'+
      '<a href="#" class="ss-garage" id="ss-garage-btn">'+
        '<span class="ss-garage-ico">'+icoTruck+'</span>'+
        '<span class="ss-garage-txt"><span class="ss-garage-label">My Garage</span><span class="ss-garage-veh" id="ssGarageVeh">Set your truck</span></span>'+
        '<span class="ss-garage-swap">'+icoSwap+'</span>'+
      '</a>'+
    '</nav>'+
    /* mobile menu */
    '<div class="ss-mob" id="ssMob" aria-label="Mobile navigation">'+
      '<a href="/" target="_top">Home</a>'+
      '<a href="/inside-3js" target="_top">Inside 3J\'s</a>'+
      '<a href="/body-paint-repairs" target="_top">Body &amp; Paint Repairs</a>'+
      '<div class="ss-mob-item">'+
        '<button class="ss-mob-top">Truck Accessories <span class="ss-mob-arrow">▶</span></button>'+
        '<div class="ss-mob-sub">'+
          '<span class="ss-mob-sub-label">Bed Protection</span>'+
          '<a href="/rhino-liner" target="_top">Rhino Liner</a>'+
          '<a href="/floor-liners" target="_top">Floor Liners</a>'+
          '<span class="ss-mob-sub-label">Covers &amp; Steps</span>'+
          '<a href="/tonneau-covers" target="_top">Tonneau Covers</a>'+
          '<a href="/steps-running-boards" target="_top">Steps &amp; Running Boards</a>'+
          '<a href="/towing-hitches" target="_top">Towing &amp; Hitches</a>'+
          '<a href="/lighting" target="_top">Lighting</a>'+
          '<a href="/headache-racks" target="_top">Headache Racks</a>'+
        '</div>'+
      '</div>'+
      '<div class="ss-mob-item">'+
        '<button class="ss-mob-top">Areas We Service <span class="ss-mob-arrow">▶</span></button>'+
        '<div class="ss-mob-sub">'+
          '<span class="ss-mob-sub-label">South Bay</span>'+
          '<a href="https://rlsh1855.github.io/RLSH1855-3js-seo-pages/SERVICE_AREA_LONG_BEACH.html" target="_top">Long Beach</a>'+
          '<a href="https://rlsh1855.github.io/RLSH1855-3js-seo-pages/SERVICE_AREA_TORRANCE.html" target="_top">Torrance</a>'+
          '<a href="https://rlsh1855.github.io/RLSH1855-3js-seo-pages/SERVICE_AREA_CARSON.html" target="_top">Carson</a>'+
          '<a href="https://rlsh1855.github.io/RLSH1855-3js-seo-pages/SERVICE_AREA_LAKEWOOD.html" target="_top">Lakewood</a>'+
          '<span class="ss-mob-sub-label">Southeast LA</span>'+
          '<a href="https://rlsh1855.github.io/RLSH1855-3js-seo-pages/SERVICE_AREA_COMPTON.html" target="_top">Compton</a>'+
          '<a href="https://rlsh1855.github.io/RLSH1855-3js-seo-pages/SERVICE_AREA_DOWNEY.html" target="_top">Downey</a>'+
          '<a href="https://rlsh1855.github.io/RLSH1855-3js-seo-pages/SERVICE_AREA_BELLFLOWER.html" target="_top">Bellflower</a>'+
        '</div>'+
      '</div>'+
      '<a href="/bundles" target="_top">Bundles &amp; Packages</a>'+
      '<a href="/shop" target="_top">Shop</a>'+
      '<a href="/contact" target="_top">Contact Us</a>'+
      '<a href="/FAQ_PAGE_V2" target="_top">FAQ</a>'+
      '<a href="https://www.3jsautobody.com/rhino-lining-quote" class="ss-mob-red" target="_top">Bed-Liner Quote</a>'+
      '<button class="ss-mob-garage" id="ss-mob-garage-btn">'+icoTruck+' <span id="ssMobGarageVeh">My Garage</span></button>'+
    '</div>'+
  '</header>'+
  '<div class="ss-spacer"></div>'+
  '<div class="ss-scrim" id="ssScrim"></div>'+
  '<div class="ss-garage-ov" id="ssGarageOv"><iframe class="ss-garage-frame" id="ssGarageFrame" title="My Garage"></iframe></div>';

  /* ════════ FOOTER HTML ════════ */
  var footer =
  '<footer class="ss-footer" aria-label="Site footer">'+
    '<div class="ss-footer-grid">'+
      '<div class="ss-footer-col">'+
        '<div class="ss-footer-h">Help</div>'+
        '<a href="/contact" target="_top">Contact Us</a>'+
        '<a href="https://www.3jsautobody.com/shipping-policy" target="_top">Shipping Policy</a>'+
        '<a href="https://www.3jsautobody.com/terms-conditions" target="_top">Terms &amp; Conditions</a>'+
        '<a href="/warranty" target="_top">Returns &amp; Warranties</a>'+
        '<a href="https://www.3jsautobody.com/privacy-policy" target="_top">Privacy Policy</a>'+
      '</div>'+
      '<div class="ss-footer-col">'+
        '<div class="ss-footer-h">Resources</div>'+
        '<a href="/inside-3js" target="_top">Company Information</a>'+
        '<a href="https://www.3jsautobody.com/testimonials" target="_top">Customer Testimonials</a>'+
        '<a href="https://www.3jsautobody.com/sitemap" target="_top">Sitemap</a>'+
      '</div>'+
      '<div class="ss-footer-col">'+
        '<div class="ss-footer-lbl">Sales &amp; Support</div>'+
        '<a href="tel:+15624246744" class="ss-footer-phone">1-562-424-6744</a>'+
        '<div class="ss-footer-lbl">Hours</div>'+
        '<div class="ss-footer-hours">Mon – Fri: 8 a.m. – 5 p.m.<br>Sat: Closed – Email Us<br>Sun: Closed – Email Us</div>'+
        '<div class="ss-footer-lbl">1855 E 29th Street</div>'+
        '<div class="ss-footer-hours">Signal Hill, CA 90755</div>'+
      '</div>'+
    '</div>'+
    '<div class="ss-footer-copy">Copyright &copy; 2018 – All Rights Reserved &nbsp;·&nbsp; <b>3J\'s Auto Body &amp; Paint</b> &nbsp;·&nbsp; 1855 E 29th Street, Signal Hill, CA 90755</div>'+
  '</footer>';

  document.body.insertAdjacentHTML('afterbegin', header);
  document.body.insertAdjacentHTML('beforeend', footer);

  /* ════════ SHRINK-ON-SCROLL ════════ */
  (function(){
    var shell=document.getElementById('ssShell'),ticking=false;
    function update(){
      var y=window.pageYOffset||document.documentElement.scrollTop;
      if(y>110) shell.classList.add('ss-shrunk');
      else if(y<40) shell.classList.remove('ss-shrunk');
      ticking=false;
    }
    window.addEventListener('scroll',function(){if(!ticking){requestAnimationFrame(update);ticking=true;}},{passive:true});
    update();
  })();

  /* ════════ HAMBURGER + MOBILE ACCORDION ════════ */
  (function(){
    var burger=document.getElementById('ssBurger'),mob=document.getElementById('ssMob');
    if(burger&&mob){
      burger.addEventListener('click',function(){
        var open=mob.classList.toggle('ss-open');
        burger.classList.toggle('ss-open',open);
      });
    }
    document.querySelectorAll('.ss-mob-item').forEach(function(item){
      var t=item.querySelector('.ss-mob-top');
      if(t) t.addEventListener('click',function(){item.classList.toggle('ss-mob-open');});
    });
  })();

  /* ════════ BUTTERY INERTIA SCROLL (desktop only) ════════ */
  (function(){
    var touch=('ontouchstart' in window)||navigator.maxTouchPoints>0||(window.matchMedia&&window.matchMedia('(pointer:coarse)').matches);
    if(touch) return;
    if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    var target=window.pageYOffset,current=target,raf=null,LERP=0.08,MULT=0.85;
    function clamp(v){var max=document.documentElement.scrollHeight-window.innerHeight;return v<0?0:(v>max?max:v);}
    function loop(){current+=(target-current)*LERP;if(Math.abs(target-current)<0.3){current=target;window.scrollTo(0,current);raf=null;return;}window.scrollTo(0,current);raf=requestAnimationFrame(loop);}
    window.addEventListener('wheel',function(e){if(e.ctrlKey)return;e.preventDefault();target=clamp(target+e.deltaY*MULT);if(!raf)raf=requestAnimationFrame(loop);},{passive:false});
    window.addEventListener('scroll',function(){if(!raf){current=target=window.pageYOffset;}},{passive:true});
    window.addEventListener('resize',function(){target=clamp(target);},{passive:true});
  })();

  /* ════════ REAL MEGA MENU (mega-menu.js) + BLUR SCRIM ════════ */
  (function(){
    var scrim=document.getElementById('ssScrim');
    var s=document.createElement('script');
    s.src='https://rlsh1855.github.io/3Js-and-RLSH-Website/mega-menu.js';
    document.head.appendChild(s);
    function anyOpen(){return !!document.querySelector('#jj-mega-host .jj-mega.jj-open');}
    function sync(){scrim.classList.toggle('ss-show',anyOpen());}
    var tries=0;
    (function wait(){
      var host=document.getElementById('jj-mega-host');
      if(host){new MutationObserver(sync).observe(host,{subtree:true,attributes:true,attributeFilter:['class']});sync();}
      else if(tries++<80){setTimeout(wait,150);}
    })();
    scrim.addEventListener('click',function(){
      document.querySelectorAll('#jj-mega-host .jj-mega.jj-open').forEach(function(p){p.classList.remove('jj-open');});
      scrim.classList.remove('ss-show');
    });
  })();

  /* ════════ MY GARAGE — load widget + wire buttons + state ════════ */
  (function(){
    /* relative URL keeps the popup same-origin so it shares localStorage with every page */
    var GARAGE_URL='my-garage-v2.html';
    var ov=document.getElementById('ssGarageOv');
    var frame=document.getElementById('ssGarageFrame');
    var frameLoaded=false;

    function openGarage(){
      if(!ov||!frame) return;
      if(!frameLoaded){ frame.src=GARAGE_URL; frameLoaded=true; }
      ov.classList.add('ss-open');
      document.documentElement.style.overflow='hidden';
    }
    function closeGarage(){
      if(!ov) return;
      ov.classList.remove('ss-open');
      document.documentElement.style.overflow='';
    }

    document.addEventListener('click',function(e){
      var t=e.target.closest?e.target.closest('#ss-garage-btn,#ss-mob-garage-btn'):null;
      if(!t) return;
      e.preventDefault();
      openGarage();
    });
    if(ov) ov.addEventListener('click',function(e){ if(e.target===ov) closeGarage(); });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape') closeGarage(); });

    function sync(){
      var saved=false,v=null;
      try{var s=localStorage.getItem('garage_vehicle');if(s){v=JSON.parse(s);saved=!!v;}}catch(e){}
      var pill=document.getElementById('ss-garage-btn');
      var veh=document.getElementById('ssGarageVeh');
      var mveh=document.getElementById('ssMobGarageVeh');
      var label=(v&&v.year)?(v.year+' '+v.make+' '+v.model+(v.trim?' '+v.trim:'')):'Set your truck';
      if(pill) pill.classList.toggle('ss-saved',saved);
      if(veh) veh.textContent=label;
      if(mveh) mveh.textContent=(v&&v.year)?(v.year+' '+v.make+' '+v.model+(v.trim?' '+v.trim:'')):'My Garage';
    }
    sync();
    window.addEventListener('storage',function(e){if(e.key==='garage_vehicle')sync();});
    window.addEventListener('garageUpdated',sync);
    window.addEventListener('message',function(e){
      var d; try{ d=typeof e.data==='string'?JSON.parse(e.data):e.data; }catch(ex){ return; }
      if(!d||!d.type) return;
      if(d.type==='garage_saved'){ sync(); closeGarage(); }
      else if(d.type==='garage_clear'){ sync(); }
      else if(d.type==='close_garage'){ closeGarage(); }
      else if(d.type==='browse_accessories'){ closeGarage(); window.location.href='/exterior-accessories-V2'; }
    });
  })();

})();
