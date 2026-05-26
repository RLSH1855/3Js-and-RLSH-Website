(function(){
  /* Skip nav injection if embedded in Wix (iframe OR ?embed=1 param) */
  var _inFrame = (function(){try{return window.self!==window.top;}catch(e){return true;}})();
  var _hasParam = window.location.search.indexOf('embed=1')!==-1;
  if(_inFrame||_hasParam) return;

  /* ════════════════════════════════
     STYLES
  ════════════════════════════════ */
  var css = `
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');
    :root{--sn-red:#8B0000;--sn-red-dark:#6e0000;}

    .sn-header{
      font-family:'Montserrat',Arial,sans-serif;
      width:100%;
      position:relative;
      z-index:1000;
    }

    /* ── Top bar ── */
    .sn-top{
      background:#081523 url('https://rlsh1855.github.io/3Js-and-RLSH-Website/1-BG_dark_blue_gradiant_edited_edited.jpg') center center / cover no-repeat;
      padding:0;
    }
    .sn-top-inner{
      max-width:980px;
      margin:0 auto;
      padding:16px 32px;
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:24px;
    }
    .sn-logo-3js img{
      height:72px;
      display:block;
      object-fit:contain;
    }
    .sn-btns{
      display:flex;
      align-items:center;
      gap:14px;
    }
    .sn-btn-red{
      display:inline-flex;align-items:center;
      padding:16px 28px;
      background:#8B0000;color:#fff;
      border:1px solid #A30505;
      font-family:'Montserrat',Arial,sans-serif;
      font-size:12px;font-weight:600;letter-spacing:0.5px;
      text-decoration:none;
      white-space:nowrap;
      transition:background 0.2s;
    }
    .sn-btn-red:hover{background:#6e0000;}
    .sn-btn-blue{
      display:inline-flex;align-items:center;
      padding:16px 28px;
      background:#366B8F;color:#fff;
      border:1px solid #4181AD;
      font-family:'Montserrat',Arial,sans-serif;
      font-size:12px;font-weight:600;letter-spacing:0.5px;
      text-decoration:none;
      white-space:nowrap;
      transition:background 0.2s;
    }
    .sn-btn-blue:hover{background:#2d5a7a;}
    .sn-logo-rlsh img{
      height:90px;
      display:block;
      object-fit:contain;
    }

    /* ── Nav bar ── */
    .sn-nav{
      background:#000;
      display:flex;
      align-items:center;
      justify-content:center;
      flex-wrap:wrap;
      padding:0 32px;
      position:relative;
    }
    .sn-nav > a{
      display:inline-flex;align-items:center;
      padding:18px 16px;
      font-family:'Montserrat',Arial,sans-serif;
      font-size:10.5px;font-weight:500;
      letter-spacing:1.5px;text-transform:uppercase;
      color:#fff;text-decoration:none;
      white-space:nowrap;
      transition:color 0.2s;
    }
    .sn-nav > a:hover{color:#8B0000;}

    /* ── Dropdown (simple list) ── */
    .sn-dd{
      position:relative;
      display:inline-flex;
      align-items:center;
    }
    .sn-dd-trigger{
      display:inline-flex;align-items:center;gap:5px;
      padding:18px 16px;
      font-family:'Montserrat',Arial,sans-serif;
      font-size:10.5px;font-weight:500;
      letter-spacing:1.5px;text-transform:uppercase;
      color:#fff;text-decoration:none;
      white-space:nowrap;
      cursor:pointer;
      transition:color 0.2s;
      background:none;border:none;
    }
    .sn-dd-trigger:hover,.sn-dd:hover .sn-dd-trigger{color:#8B0000;}
    .sn-caret{
      font-size:8px;
      transition:transform 0.2s;
      display:inline-block;
      opacity:0.6;
    }
    .sn-dd:hover .sn-caret{transform:rotate(180deg);}
    .sn-dd-panel{
      display:none;
      position:absolute;
      top:100%;
      left:0;
      background:#111;
      border:1px solid #1e1e1e;
      border-top:2px solid #8B0000;
      min-width:190px;
      z-index:9999;
      box-shadow:0 12px 32px rgba(0,0,0,0.5);
    }
    .sn-dd:hover .sn-dd-panel{display:block;}
    .sn-dd-panel a{
      display:block;
      padding:12px 18px;
      font-family:'Montserrat',Arial,sans-serif;
      font-size:10px;font-weight:600;
      letter-spacing:1px;text-transform:uppercase;
      color:rgba(255,255,255,0.72);
      text-decoration:none;
      border-bottom:1px solid #1a1a1a;
      transition:color 0.15s,background 0.15s,padding-left 0.15s;
      white-space:nowrap;
    }
    .sn-dd-panel a:last-child{border-bottom:none;}
    .sn-dd-panel a:hover{color:#fff;background:#1a1a1a;padding-left:22px;}

    /* ── Mega menu ── */
    .sn-mega{
      position:static;
      display:inline-flex;
      align-items:center;
    }
    .sn-mega-trigger{
      display:inline-flex;align-items:center;gap:5px;
      padding:18px 16px;
      font-family:'Montserrat',Arial,sans-serif;
      font-size:10.5px;font-weight:500;
      letter-spacing:1.5px;text-transform:uppercase;
      color:#fff;text-decoration:none;
      white-space:nowrap;
      cursor:pointer;
      transition:color 0.2s;
      background:none;border:none;
    }
    .sn-mega-trigger:hover,.sn-mega:hover .sn-mega-trigger{color:#8B0000;}
    .sn-mega:hover .sn-caret{transform:rotate(180deg);}
    .sn-mega-panel{
      display:none;
      position:absolute;
      top:100%;
      left:50%;
      transform:translateX(-50%);
      background:#fff;
      border:1px solid #e0e0e0;
      border-top:3px solid #8B0000;
      z-index:9999;
      box-shadow:0 12px 40px rgba(0,0,0,0.15);
      padding:28px 32px;
    }
    .sn-mega:hover .sn-mega-panel{display:block;}

    /* ── Accessories image grid panel ── */
    .sn-mega-panel.sn-grid-panel{
      width:900px;
    }
    .sn-mega-grid-header{
      font-size:8.5px;font-weight:800;
      letter-spacing:2.5px;text-transform:uppercase;
      color:#8B0000;
      margin-bottom:20px;
      padding-bottom:12px;
      border-bottom:1px solid #eee;
    }
    .sn-mega-grid{
      display:grid;
      grid-template-columns:repeat(5,1fr);
      gap:8px;
    }
    .sn-mega-item{
      display:flex;flex-direction:column;
      align-items:center;text-align:center;
      text-decoration:none;
      padding:14px 8px;
      border-radius:0;
      border:1.5px solid transparent;
      transition:border-color 0.2s,background 0.2s;
    }
    .sn-mega-item:hover{
      background:#fafafa;
      border-color:#e8e8e8;
    }
    .sn-mega-item img{
      width:80px;height:60px;
      object-fit:contain;
      margin-bottom:10px;
    }
    .sn-mega-item span{
      font-family:'Montserrat',Arial,sans-serif;
      font-size:10px;font-weight:700;
      color:#1a1a1a;
      letter-spacing:0.3px;
      line-height:1.4;
      text-transform:uppercase;
    }
    .sn-mega-item:hover span{color:#8B0000;}

    /* ── Areas We Service columns panel ── */
    .sn-mega-panel.sn-cols-panel{
      width:720px;
      display:none;
    }
    .sn-mega:hover .sn-mega-panel.sn-cols-panel{display:flex;gap:0;}
    .sn-mega-col{
      flex:1;
      padding:0 20px;
      border-right:1px solid #eee;
    }
    .sn-mega-col:first-child{padding-left:0;}
    .sn-mega-col:last-child{border-right:none;padding-right:0;}
    .sn-mega-col-title{
      font-size:8.5px;font-weight:800;
      letter-spacing:2.5px;text-transform:uppercase;
      color:#8B0000;
      margin-bottom:14px;
      padding-bottom:10px;
      border-bottom:1px solid #eee;
    }
    .sn-mega-col a{
      display:flex;align-items:center;gap:8px;
      padding:8px 0;
      font-family:'Montserrat',Arial,sans-serif;
      font-size:10px;font-weight:600;
      letter-spacing:0.8px;text-transform:uppercase;
      color:#444;
      text-decoration:none;
      border-bottom:1px solid #f0f0f0;
      transition:color 0.15s,padding-left 0.15s;
      white-space:nowrap;
    }
    .sn-mega-col a:last-child{border-bottom:none;}
    .sn-mega-col a:hover{color:#8B0000;padding-left:6px;}
    .sn-mega-col a .sn-mega-icon{font-size:13px;flex-shrink:0;}
    .sn-mega-cta-col{
      display:flex;flex-direction:column;
      justify-content:center;align-items:flex-start;
      gap:10px;
    }
    .sn-mega-cta-title{
      font-size:8.5px;font-weight:800;
      letter-spacing:2.5px;text-transform:uppercase;
      color:#8B0000;
      margin-bottom:4px;
      padding-bottom:10px;
      border-bottom:1px solid #eee;
      width:100%;
    }
    .sn-mega-cta-btn{
      display:inline-flex;align-items:center;
      width:100%;
      padding:11px 16px;
      font-family:'Montserrat',Arial,sans-serif;
      font-size:10px;font-weight:700;
      letter-spacing:1px;text-transform:uppercase;
      text-decoration:none;
      border-radius:0;
      transition:background 0.2s,transform 0.15s;
      white-space:nowrap;
    }
    .sn-mega-cta-btn.red{background:#8B0000;color:#fff;}
    .sn-mega-cta-btn.red:hover{background:#6e0000;transform:translateY(-1px);}
    .sn-mega-cta-btn.outline{background:transparent;color:#444;border:1px solid #ccc;}
    .sn-mega-cta-btn.outline:hover{border-color:#8B0000;color:#8B0000;}
    .sn-mega-phone{
      font-size:13px;font-weight:800;
      color:#1a1a1a;margin-top:6px;
      letter-spacing:-0.3px;
    }
    .sn-mega-hours{
      font-size:9.5px;font-weight:500;
      color:#888;
      letter-spacing:0.3px;
      line-height:1.6;
    }

    /* ── Hamburger ── */
    .sn-hamburger{
      display:none;
      flex-direction:column;
      gap:5px;
      cursor:pointer;
      padding:8px;
      background:none;border:none;
    }
    .sn-hamburger span{
      display:block;width:24px;height:2px;background:#fff;
      transition:transform 0.3s ease, opacity 0.3s ease;
      transform-origin:center;
    }
    .sn-hamburger.sn-open span:nth-child(1){transform:translateY(7px) rotate(45deg);}
    .sn-hamburger.sn-open span:nth-child(2){opacity:0;transform:scaleX(0);}
    .sn-hamburger.sn-open span:nth-child(3){transform:translateY(-7px) rotate(-45deg);}

    /* ── Mobile menu ── */
    .sn-mobile-menu{
      display:flex;
      flex-direction:column;
      background:#0a0a0a;
      border-top:1px solid #1a1a1a;
      max-height:0;
      overflow:hidden;
      opacity:0;
      transform:translateY(-12px);
      transition:max-height 0.42s cubic-bezier(0.22,1,0.36,1),
                 opacity 0.32s ease,
                 transform 0.38s cubic-bezier(0.22,1,0.36,1);
      pointer-events:none;
    }
    .sn-mobile-menu.sn-open{
      max-height:85vh;
      overflow-y:auto;
      opacity:1;
      transform:translateY(0);
      pointer-events:all;
    }
    .sn-mobile-menu > a,
    .sn-mob-item > .sn-mob-top{
      display:flex;align-items:center;justify-content:space-between;
      padding:14px 24px;
      font-family:'Montserrat',Arial,sans-serif;
      font-size:11px;font-weight:600;
      letter-spacing:1.5px;text-transform:uppercase;
      color:#fff;text-decoration:none;
      border-bottom:1px solid #1a1a1a;
      transition:color 0.2s;
      cursor:pointer;
      background:none;border:none;width:100%;text-align:left;
      border-bottom:1px solid #1a1a1a;
    }
    .sn-mobile-menu > a:hover,.sn-mob-top:hover{color:#8B0000;}
    .sn-mobile-menu > a.sn-mob-red{color:#8B0000;}
    .sn-mob-item > .sn-mob-top{
      color:#fff;
    }
    .sn-mob-arrow{
      font-size:9px;opacity:0.5;
      transition:transform 0.2s;
    }
    .sn-mob-item.sn-mob-open > .sn-mob-top .sn-mob-arrow{transform:rotate(90deg);}
    .sn-mob-sub{
      display:none;
      flex-direction:column;
      background:#050505;
      border-bottom:1px solid #1a1a1a;
    }
    .sn-mob-item.sn-mob-open > .sn-mob-sub{display:flex;}
    .sn-mob-sub a{
      display:block;
      padding:11px 24px 11px 36px;
      font-family:'Montserrat',Arial,sans-serif;
      font-size:10px;font-weight:600;
      letter-spacing:1px;text-transform:uppercase;
      color:rgba(255,255,255,0.55);
      text-decoration:none;
      border-bottom:1px solid #111;
      transition:color 0.2s;
    }
    .sn-mob-sub a:last-child{border-bottom:none;}
    .sn-mob-sub a:hover{color:#fff;}
    .sn-mob-sub-label{
      display:block;
      padding:8px 24px 4px 36px;
      font-family:'Montserrat',Arial,sans-serif;
      font-size:8px;font-weight:800;
      letter-spacing:2px;text-transform:uppercase;
      color:#8B0000;
    }

    /* ── Mobile top bar adjustments ── */
    @media(max-width:960px){
      .sn-top-inner{padding:14px 24px;}
      .sn-nav{display:none;}
      .sn-hamburger{display:flex;}
      .sn-logo-3js img{height:52px;}
      .sn-logo-rlsh img{height:62px;}
    }
    @media(max-width:600px){
      .sn-top-inner{padding:12px 16px;gap:10px;}
      .sn-logo-3js img{height:42px;}
      .sn-logo-rlsh img{height:50px;}
      .sn-btn-red,.sn-btn-blue{font-size:10px;padding:11px 14px;}
      .sn-btn-blue{display:none;}
    }
    @media(max-width:430px){
      .sn-btns{gap:8px;}
      .sn-btn-red,.sn-btn-blue{font-size:9px;padding:10px 11px;}
    }

    /* ── My Garage nav button ── */
    .sn-garage-btn{
      display:inline-flex;align-items:center;justify-content:center;
      width:40px;height:40px;
      color:#fff;cursor:pointer;
      background:rgba(255,255,255,0.12);
      border:1.5px solid rgba(255,255,255,0.35);
      flex-shrink:0;
      transition:background 0.2s,border-color 0.2s;
      position:relative;
    }
    .sn-garage-btn:hover{background:rgba(255,255,255,0.25);border-color:rgba(255,255,255,0.7);}
    .sn-garage-btn svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0;}
    .sn-mob-garage-btn{
      display:flex;align-items:center;gap:10px;
      padding:14px 24px;width:100%;text-align:left;
      font-family:'Montserrat',Arial,sans-serif;
      font-size:11px;font-weight:600;
      letter-spacing:1.5px;text-transform:uppercase;
      color:#8B0000;background:none;border:none;
      border-bottom:1px solid #1a1a1a;cursor:pointer;
    }
    .sn-mob-garage-btn svg{width:13px;height:13px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0;}

    /* ── Garage saved-state indicator ── */
    .sn-garage-btn.sn-garage-saved{background:rgba(139,0,0,0.22);border-color:rgba(139,0,0,0.55);}
    .sn-garage-btn.sn-garage-saved::after{content:'';position:absolute;top:5px;right:5px;width:7px;height:7px;background:#8B0000;border:1.5px solid rgba(255,255,255,0.85);}
    .sn-mob-garage-btn.sn-garage-saved{background:rgba(139,0,0,0.08);}

    /* ════════════════════════════════
       FOOTER
    ════════════════════════════════ */
    .sn-footer{
      font-family:'Montserrat',Arial,sans-serif;
      background:#111;
      padding:56px 64px 28px;
      border-top:1px solid #1a1a1a;
    }
    .sn-footer-grid{
      display:grid;
      grid-template-columns:1fr 1fr 1fr;
      gap:48px;
      max-width:1100px;
      margin:0 auto 40px;
    }
    .sn-footer-heading{
      font-size:10px;font-weight:700;
      letter-spacing:2.5px;text-transform:uppercase;
      color:rgba(255,255,255,0.9);
      margin-bottom:16px;
    }
    .sn-footer-col a{
      display:block;
      font-size:12px;font-weight:400;
      color:rgba(255,255,255,0.50);
      text-decoration:none;
      margin-bottom:9px;
      transition:color 0.2s;
    }
    .sn-footer-col a:hover{color:#fff;}
    .sn-footer-contact-label{
      font-size:11px;font-weight:700;
      color:rgba(255,255,255,0.85);
      margin-bottom:6px;
    }
    .sn-footer-phone{
      font-size:13px;font-weight:700;
      color:#fff;text-decoration:none;
      display:inline-block;margin-bottom:14px;
      transition:color 0.2s;
    }
    .sn-footer-phone:hover{color:#8B0000;}
    .sn-footer-hours{
      font-size:13px;font-weight:600;
      color:rgba(255,255,255,0.85);
      line-height:2.2;
      letter-spacing:0.4px;
      margin-bottom:20px;
    }
    .sn-footer-copy{
      text-align:center;
      font-size:10px;font-weight:400;
      color:#8B0000;
      border-top:1px solid #1a1a1a;
      padding-top:24px;
      max-width:1100px;
      margin:0 auto;
      letter-spacing:0.5px;
    }
    @media(max-width:960px){
      .sn-footer{padding:48px 36px 24px;}
      .sn-footer-grid{grid-template-columns:1fr 1fr;gap:36px;}
    }
    @media(max-width:600px){
      .sn-footer{padding:36px 20px 20px;}
      .sn-footer-grid{grid-template-columns:1fr;gap:28px;}
    }
  `;

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ════════════════════════════════
     HEADER HTML
  ════════════════════════════════ */
  var header = `
    <header class="sn-header">
      <div class="sn-top">
        <div class="sn-top-inner">
          <div class="sn-logo-3js">
            <a href="https://www.3jsautobody.com/">
              <img src="https://static.wixstatic.com/media/b95bd9_86c7cf1e525d4b9e961a2738ed9af502~mv2.png" alt="3J's Auto Body & Paint — Signal Hill CA">
            </a>
          </div>
          <div class="sn-btns">
            <button class="sn-garage-btn" id="sn-garage-btn" title="My Garage" aria-label="My Garage">
              <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </button>
            <a href="https://www.3jsautobody.com/rhino-lining-quote" class="sn-btn-red">Bed-Liner Quote</a>
            <a href="https://www.carwise.com/online-photo-estimate/3js-autobody-paint-inc-signal-hill-ca-90755/479382?source=shop.profile&referer=estimate.cccone.com" class="sn-btn-blue">Free Auto Body Estimate</a>
          </div>
          <div class="sn-logo-rlsh">
            <a href="https://www.3jsautobody.com/">
              <img src="https://static.wixstatic.com/media/b95bd9_8e3e4f256c85462d960aaa1e3ef740c8~mv2.png" alt="RLSH Rhino Lining of Signal Hill">
            </a>
          </div>
          <button class="sn-hamburger" id="sn-hamburger" aria-label="Open menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      <nav class="sn-nav" aria-label="Main navigation">

        <a href="https://www.3jsautobody.com/inside-3js">Inside 3J's</a>
        <a href="https://www.3jsautobody.com/body-paint-repairs">Body &amp; Paint</a>

        <!-- Truck Accessories mega menu — image grid -->
        <div class="sn-mega">
          <button class="sn-mega-trigger">Truck Accessories <span class="sn-caret">▾</span></button>
          <div class="sn-mega-panel sn-grid-panel">
            <div class="sn-mega-grid-header">Truck Accessories &amp; Upgrades</div>
            <div class="sn-mega-grid">
              <a href="https://www.3jsautobody.com/rhino-liner" class="sn-mega-item">
                <img src="https://rlsh1855.github.io/3Js-and-RLSH-Website/PROTECTION%20-%20RHINO%20LININGS.webp" alt="Rhino Liner">
                <span>Rhino Liner</span>
              </a>
              <a href="https://rlsh1855.github.io/3Js-and-RLSH-Website/tonneau-covers.html" class="sn-mega-item">
                <img src="https://rlsh1855.github.io/3Js-and-RLSH-Website/MEGA%20MENU%20IMAGES/TONNEAU%20COVER.webp" alt="Tonneau Covers">
                <span>Tonneau Covers</span>
              </a>
              <a href="https://rlsh1855.github.io/3Js-and-RLSH-Website/steps-running-boards.html" class="sn-mega-item">
                <img src="https://rlsh1855.github.io/3Js-and-RLSH-Website/MEGA%20MENU%20IMAGES/RUNNING%20BOARDS%20-%20SIDE%20STEPS.webp" alt="Steps &amp; Running Boards">
                <span>Steps &amp; Running Boards</span>
              </a>
              <a href="https://rlsh1855.github.io/3Js-and-RLSH-Website/towing-hitches.html" class="sn-mega-item">
                <img src="https://rlsh1855.github.io/3Js-and-RLSH-Website/MEGA%20MENU%20IMAGES/TOWING.webp" alt="Towing &amp; Hitches">
                <span>Towing &amp; Hitches</span>
              </a>
              <a href="https://rlsh1855.github.io/3Js-and-RLSH-Website/floor-liners.html" class="sn-mega-item">
                <img src="https://rlsh1855.github.io/3Js-and-RLSH-Website/MEGA%20MENU%20IMAGES/FLOOR%20MATS.webp" alt="Floor Liners">
                <span>Floor Liners</span>
              </a>
              <a href="https://rlsh1855.github.io/3Js-and-RLSH-Website/lighting.html" class="sn-mega-item">
                <div style="width:80px;height:60px;display:flex;align-items:center;justify-content:center;margin-bottom:10px;"><svg viewBox="0 0 40 36" width="64" height="58" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="40" height="12" fill="#8B0000"/><circle cx="8" cy="6" r="3.5" fill="#FFD700"/><circle cx="20" cy="6" r="3.5" fill="#FFD700"/><circle cx="32" cy="6" r="3.5" fill="#FFD700"/><rect x="0" y="14" width="40" height="4" fill="#8B0000" opacity="0.35"/><path d="M18 20L10 36h8l-2 0 6-12 6 12h-2l8 0-8-16z" fill="#8B0000" opacity="0.5"/></svg></div>
                <span>Lighting</span>
              </a>
              <a href="https://rlsh1855.github.io/3Js-and-RLSH-Website/headache-racks.html" class="sn-mega-item">
                <img src="https://rlsh1855.github.io/3Js-and-RLSH-Website/MEGA%20MENU%20IMAGES/RUNNING%20BOARDS%20-%20SIDE%20STEPS.webp" alt="Headache Racks">
                <span>Headache Racks</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Areas We Service mega menu -->
        <div class="sn-mega">
          <button class="sn-mega-trigger">Areas We Service <span class="sn-caret">▾</span></button>
          <div class="sn-mega-panel sn-cols-panel">
            <div class="sn-mega-col">
              <div class="sn-mega-col-title">South Bay</div>
              <a href="https://rlsh1855.github.io/RLSH1855-3js-seo-pages/SERVICE_AREA_LONG_BEACH.html"><span class="sn-mega-icon">📍</span>Long Beach</a>
              <a href="https://rlsh1855.github.io/RLSH1855-3js-seo-pages/SERVICE_AREA_TORRANCE.html"><span class="sn-mega-icon">📍</span>Torrance</a>
              <a href="https://rlsh1855.github.io/RLSH1855-3js-seo-pages/SERVICE_AREA_CARSON.html"><span class="sn-mega-icon">📍</span>Carson</a>
              <a href="https://rlsh1855.github.io/RLSH1855-3js-seo-pages/SERVICE_AREA_LAKEWOOD.html"><span class="sn-mega-icon">📍</span>Lakewood</a>
            </div>
            <div class="sn-mega-col">
              <div class="sn-mega-col-title">Southeast LA</div>
              <a href="https://rlsh1855.github.io/RLSH1855-3js-seo-pages/SERVICE_AREA_COMPTON.html"><span class="sn-mega-icon">📍</span>Compton</a>
              <a href="https://rlsh1855.github.io/RLSH1855-3js-seo-pages/SERVICE_AREA_DOWNEY.html"><span class="sn-mega-icon">📍</span>Downey</a>
              <a href="https://rlsh1855.github.io/RLSH1855-3js-seo-pages/SERVICE_AREA_BELLFLOWER.html"><span class="sn-mega-icon">📍</span>Bellflower</a>
            </div>
            <div class="sn-mega-col sn-mega-cta-col">
              <div class="sn-mega-cta-title">Visit Us</div>
              <div class="sn-mega-hours">1855 E 29th Street<br>Signal Hill, CA 90755</div>
              <a href="tel:+15624246744" class="sn-mega-cta-btn outline">Call Us Now</a>
              <div class="sn-mega-phone">(562) 424-6744</div>
              <div class="sn-mega-hours">Mon – Fri &nbsp; 8 AM – 5 PM</div>
            </div>
          </div>
        </div>

        <a href="https://www.3jsautobody.com/rhino-liner" id="sn-trigger-rhino">Rhino Liner +</a>
        <a href="https://www.3jsautobody.com/bundles" id="sn-trigger-bundles">Bundles &amp; Packages +</a>
        <a href="https://www.3jsautobody.com/exterior-accessories" id="sn-trigger-exterior">Exterior Accessories +</a>
        <a href="https://www.3jsautobody.com/contact-us">Contact Us</a>
        <a href="https://www.3jsautobody.com/faq">FAQ</a>

      </nav>

      <!-- Mobile menu -->
      <div class="sn-mobile-menu" id="sn-mobile-menu" aria-label="Mobile navigation">

        <a href="https://www.3jsautobody.com/inside-3js">Inside 3J's</a>
        <a href="https://www.3jsautobody.com/body-paint-repairs">Body &amp; Paint</a>

        <!-- Truck Accessories mobile accordion -->
        <div class="sn-mob-item" id="sn-mob-accessories">
          <button class="sn-mob-top">Truck Accessories <span class="sn-mob-arrow">▶</span></button>
          <div class="sn-mob-sub">
            <span class="sn-mob-sub-label">Bed Protection</span>
            <a href="https://www.3jsautobody.com/rhino-liner">Rhino Liner</a>
            <a href="https://rlsh1855.github.io/3Js-and-RLSH-Website/floor-liners.html">Floor Liners</a>
            <span class="sn-mob-sub-label">Covers &amp; Steps</span>
            <a href="https://rlsh1855.github.io/3Js-and-RLSH-Website/tonneau-covers.html">Tonneau Covers</a>
            <a href="https://rlsh1855.github.io/3Js-and-RLSH-Website/bakflip-mx4.html">BakFlip MX4</a>
            <a href="https://rlsh1855.github.io/3Js-and-RLSH-Website/steps-running-boards.html">Steps &amp; Running Boards</a>
            <a href="https://rlsh1855.github.io/3Js-and-RLSH-Website/towing-hitches.html">Towing &amp; Hitches</a>
            <a href="https://rlsh1855.github.io/3Js-and-RLSH-Website/lighting.html">Lighting</a>
            <a href="https://rlsh1855.github.io/3Js-and-RLSH-Website/headache-racks.html">Headache Racks</a>
          </div>
        </div>

        <!-- Areas We Service mobile accordion -->
        <div class="sn-mob-item" id="sn-mob-areas">
          <button class="sn-mob-top">Areas We Service <span class="sn-mob-arrow">▶</span></button>
          <div class="sn-mob-sub">
            <span class="sn-mob-sub-label">South Bay</span>
            <a href="https://rlsh1855.github.io/RLSH1855-3js-seo-pages/SERVICE_AREA_LONG_BEACH.html">Long Beach</a>
            <a href="https://rlsh1855.github.io/RLSH1855-3js-seo-pages/SERVICE_AREA_TORRANCE.html">Torrance</a>
            <a href="https://rlsh1855.github.io/RLSH1855-3js-seo-pages/SERVICE_AREA_CARSON.html">Carson</a>
            <a href="https://rlsh1855.github.io/RLSH1855-3js-seo-pages/SERVICE_AREA_LAKEWOOD.html">Lakewood</a>
            <span class="sn-mob-sub-label">Southeast LA</span>
            <a href="https://rlsh1855.github.io/RLSH1855-3js-seo-pages/SERVICE_AREA_COMPTON.html">Compton</a>
            <a href="https://rlsh1855.github.io/RLSH1855-3js-seo-pages/SERVICE_AREA_DOWNEY.html">Downey</a>
            <a href="https://rlsh1855.github.io/RLSH1855-3js-seo-pages/SERVICE_AREA_BELLFLOWER.html">Bellflower</a>
          </div>
        </div>

        <a href="https://www.3jsautobody.com/rhino-liner">Rhino Liner</a>
        <a href="https://www.3jsautobody.com/contact-us">Contact Us</a>
        <a href="https://www.3jsautobody.com/faq">FAQ</a>
        <a href="https://www.3jsautobody.com/rhino-lining-quote" class="sn-mob-red">Bed-Liner Quote</a>
        <a href="https://www.carwise.com/online-photo-estimate/3js-autobody-paint-inc-signal-hill-ca-90755/479382?source=shop.profile&referer=estimate.cccone.com">Free Auto Body Estimate</a>
        <button class="sn-mob-garage-btn" id="sn-mob-garage-btn">
          <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          My Garage
        </button>

      </div>
    </header>
  `;

  /* ════════════════════════════════
     FOOTER HTML
  ════════════════════════════════ */
  var footer = `
    <footer class="sn-footer" aria-label="Site footer">
      <div class="sn-footer-grid">
        <div class="sn-footer-col">
          <div class="sn-footer-heading">Help</div>
          <a href="https://www.3jsautobody.com/contact-us">Contact Us</a>
          <a href="https://www.3jsautobody.com/shipping-policy">Shipping Policy</a>
          <a href="https://www.3jsautobody.com/terms-conditions">Terms &amp; Conditions</a>
          <a href="https://www.3jsautobody.com/returns-warranties">Returns and Warranties</a>
          <a href="https://www.3jsautobody.com/privacy-policy">Privacy Policy</a>
        </div>
        <div class="sn-footer-col">
          <div class="sn-footer-heading">Resources</div>
          <a href="https://www.3jsautobody.com/company-information">Company Information</a>
          <a href="https://www.3jsautobody.com/testimonials">Customer Testimonials</a>
          <a href="https://www.3jsautobody.com/sitemap">Sitemap</a>
        </div>
        <div class="sn-footer-col">
          <div class="sn-footer-contact-label">Sales &amp; Support</div>
          <a href="tel:+15624246744" class="sn-footer-phone">1-562-424-6744</a>
          <div class="sn-footer-contact-label">Phone Sales</div>
          <div class="sn-footer-hours">
            · Monday – Friday: 8 a.m. – 5 p.m.<br>
            · Saturday: Closed – Email Us<br>
            · Sunday: Closed – Email Us
          </div>
          <div class="sn-footer-contact-label">Customer Service</div>
          <div class="sn-footer-hours">
            · Monday – Friday: 8 a.m. – 5 p.m.<br>
            · Saturday: Closed<br>
            · Sunday: Closed
          </div>
        </div>
      </div>
      <div class="sn-footer-copy">
        Copyright &copy; 2018 – All Rights Reserved &nbsp;·&nbsp; 3J's Auto Body &amp; Paint &nbsp;·&nbsp; 1855 E 29th Street, Signal Hill, CA 90755
      </div>
    </footer>
  `;

  /* ════════════════════════════════
     INJECT
  ════════════════════════════════ */
  document.body.insertAdjacentHTML('afterbegin', header);
  document.body.insertAdjacentHTML('beforeend', footer);

  /* ════════════════════════════════
     HAMBURGER TOGGLE
  ════════════════════════════════ */
  var hamburger = document.getElementById('sn-hamburger');
  var mobileMenu = document.getElementById('sn-mobile-menu');
  if(hamburger && mobileMenu){
    hamburger.addEventListener('click', function(){
      var isOpen = mobileMenu.classList.toggle('sn-open');
      hamburger.classList.toggle('sn-open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  /* ════════════════════════════════
     MOBILE ACCORDION TOGGLES
  ════════════════════════════════ */
  document.querySelectorAll('.sn-mob-item').forEach(function(item){
    var btn = item.querySelector('.sn-mob-top');
    if(btn){
      btn.addEventListener('click', function(){
        item.classList.toggle('sn-mob-open');
      });
    }
  });

  /* ════════════════════════════════
     DESKTOP PHONE MODAL
  ════════════════════════════════ */
  var isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
                 (window.matchMedia && window.matchMedia('(pointer:coarse)').matches);

  if(!isMobile){
    var modalCSS = `
      .sn-phone-overlay{
        display:none;position:fixed;inset:0;z-index:99999;
        background:rgba(0,0,0,0.55);
        align-items:center;justify-content:center;
      }
      .sn-phone-overlay.sn-popen{display:flex;}
      .sn-phone-box{
        background:#fff;border-radius:0;
        padding:44px 52px;text-align:center;
        box-shadow:0 24px 64px rgba(0,0,0,0.28);
        font-family:'Montserrat',Arial,sans-serif;
        max-width:360px;width:90%;
        animation:snPop 0.22s ease;
      }
      @keyframes snPop{from{transform:scale(0.92);opacity:0;}to{transform:scale(1);opacity:1;}}
      .sn-phone-label{
        font-size:9px;font-weight:800;letter-spacing:3px;
        text-transform:uppercase;color:#8B0000;margin-bottom:14px;
      }
      .sn-phone-number{
        font-size:30px;font-weight:900;color:#1a1a1a;
        letter-spacing:-0.5px;margin-bottom:6px;
      }
      .sn-phone-hours{
        font-size:11px;font-weight:500;color:#999;margin-bottom:28px;
      }
      .sn-phone-close{
        background:#8B0000;color:#fff;border:none;
        padding:13px 36px;border-radius:0;
        font-family:'Montserrat',Arial,sans-serif;
        font-size:10px;font-weight:700;letter-spacing:1.5px;
        text-transform:uppercase;cursor:pointer;
        transition:background 0.2s;
      }
      .sn-phone-close:hover{background:#6e0000;}
    `;
    var mStyle = document.createElement('style');
    mStyle.textContent = modalCSS;
    document.head.appendChild(mStyle);

    document.body.insertAdjacentHTML('beforeend',
      '<div class="sn-phone-overlay" id="sn-phone-overlay">' +
        '<div class="sn-phone-box">' +
          '<div class="sn-phone-label">Give Us a Call</div>' +
          '<div class="sn-phone-number">(562) 424-6744</div>' +
          '<div class="sn-phone-hours">Mon – Fri &nbsp; 8 AM – 5 PM</div>' +
          '<button class="sn-phone-close" id="sn-phone-close">Close</button>' +
        '</div>' +
      '</div>'
    );

    var overlay = document.getElementById('sn-phone-overlay');
    var closeBtn = document.getElementById('sn-phone-close');

    document.addEventListener('click', function(e){
      var link = e.target.closest ? e.target.closest('a[href^="tel:"]') : null;
      if(!link && e.target.tagName === 'A' && e.target.href && e.target.href.indexOf('tel:') === 0) link = e.target;
      if(link){
        e.preventDefault();
        overlay.classList.add('sn-popen');
      }
    });

    closeBtn.addEventListener('click', function(){
      overlay.classList.remove('sn-popen');
    });
    overlay.addEventListener('click', function(e){
      if(e.target === overlay) overlay.classList.remove('sn-popen');
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape') overlay.classList.remove('sn-popen');
    });
  }

  /* ════════════════════════════════
     MEGA MENU — load inject script
  ════════════════════════════════ */
  (function(){
    if(document.getElementById('jj-mega-styles')) return;
    var s=document.createElement('script');
    s.src='https://rlsh1855.github.io/3Js-and-RLSH-Website/mega-menu.js';
    document.head.appendChild(s);
  })();

  /* ════════════════════════════════
     MY GARAGE — load widget + wire buttons
  ════════════════════════════════ */
  (function(){
    var _widgetLoading=false;

    function loadWidget(cb){
      if(window.gcOpen){cb&&cb();return;}
      if(_widgetLoading){
        var t=setInterval(function(){if(window.gcOpen){clearInterval(t);cb&&cb();}},50);
        return;
      }
      if(document.getElementById('gc-ov')){
        // HTML already injected, wait for gcOpen to be set
        var t2=setInterval(function(){if(window.gcOpen){clearInterval(t2);cb&&cb();}},50);
        return;
      }
      _widgetLoading=true;
      var s=document.createElement('script');
      s.src='https://rlsh1855.github.io/3Js-and-RLSH-Website/my-garage-widget.js';
      s.onload=function(){_widgetLoading=false;cb&&cb();};
      s.onerror=function(){_widgetLoading=false;};
      document.head.appendChild(s);
    }

    // Event delegation — wired immediately, no timing dependency
    document.addEventListener('click',function(e){
      var tgt=e.target.closest?e.target.closest('#sn-garage-btn,#sn-mob-garage-btn'):null;
      if(!tgt){if(e.target.id==='sn-garage-btn'||e.target.id==='sn-mob-garage-btn')tgt=e.target;}
      if(!tgt)return;
      loadWidget(function(){if(window.gcOpen)window.gcOpen();});
    });

    // Preload widget in background so it's ready before first click
    loadWidget();
  })();

  /* ════════════════════════════════
     GARAGE STATE INDICATOR
  ════════════════════════════════ */
  (function(){
    function snSyncGarage(){
      var saved=!!localStorage.getItem('garage_vehicle');
      var btn=document.getElementById('sn-garage-btn');
      var mob=document.getElementById('sn-mob-garage-btn');
      if(btn){
        btn.classList.toggle('sn-garage-saved',saved);
        var v=saved?JSON.parse(localStorage.getItem('garage_vehicle')||'null'):null;
        btn.setAttribute('aria-label',v?(v.year+' '+v.make+' '+v.model):'My Garage');
      }
      if(mob){
        mob.classList.toggle('sn-garage-saved',saved);
        var label=v?(v.year+' '+v.make+' '+v.model):'My Garage';
        // Update visible text node (last child, after the SVG)
        var nodes=mob.childNodes;
        for(var i=nodes.length-1;i>=0;i--){if(nodes[i].nodeType===3){nodes[i].textContent='\n          '+label+'\n        ';break;}}
      }
    }
    snSyncGarage();
    window.addEventListener('storage',function(e){if(e.key==='garage_vehicle')snSyncGarage();});
    window.addEventListener('garageUpdated',snSyncGarage);
    window.addEventListener('message',function(e){
      try{
        var d=typeof e.data==='string'?JSON.parse(e.data):e.data;
        if(d&&(d.type==='garage_saved'||d.type==='garage_clear'))snSyncGarage();
      }catch(ex){}
    });
  })();

})();
