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
      border-radius:8px;
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
      border-radius:4px;
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
      font-size:11px;font-weight:400;
      color:rgba(255,255,255,0.50);
      line-height:1.95;
      margin-bottom:20px;
    }
    .sn-footer-copy{
      text-align:center;
      font-size:10px;font-weight:400;
      color:rgba(255,255,255,0.28);
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
            <button class="sn-garage-btn" id="sn-garage-btn" title="My Garage">
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
                <img src="https://rlsh1855.github.io/3Js-and-RLSH-Website/MEGA%20MENU%20IMAGES/TOWING.webp" alt="Lighting">
                <span>Lighting</span>
              </a>
              <a href="https://rlsh1855.github.io/3Js-and-RLSH-Website/towing-hitches.html" class="sn-mega-item">
                <img src="https://rlsh1855.github.io/3Js-and-RLSH-Website/MEGA%20MENU%20IMAGES/TOWING.webp" alt="Towing &amp; Hitches">
                <span>Towing &amp; Hitches</span>
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

        <a href="https://www.3jsautobody.com/rhino-liner">Rhino Liner</a>
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
        background:#fff;border-radius:16px;
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
        padding:13px 36px;border-radius:8px;
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
     MY GARAGE MODAL
  ════════════════════════════════ */
  var garageCss = `
    .sn-garage-ov{
      display:none;position:fixed;inset:0;z-index:99999;
      background:rgba(0,0,0,0.68);
      align-items:center;justify-content:center;
      padding:16px;
    }
    .sn-garage-ov.sn-gopen{display:flex;}
    .sn-gmodal{
      background:#fff;width:100%;max-width:520px;
      max-height:90vh;overflow-y:auto;
      position:relative;
      animation:snGPop 0.25s ease;
    }
    @keyframes snGPop{from{transform:scale(0.94) translateY(16px);opacity:0;}to{transform:none;opacity:1;}}
    .sn-gmodal-hdr{
      position:relative;min-height:160px;
      display:flex;align-items:flex-end;overflow:hidden;
    }
    .sn-gmodal-hdr-bg{
      position:absolute;inset:0;
      background:url('https://rlsh1855.github.io/3Js-and-RLSH-Website/My_Garage_Header_image.png') center/cover no-repeat;
    }
    .sn-gmodal-hdr-ov{
      position:absolute;inset:0;
      background:linear-gradient(to right,rgba(0,0,0,0.80) 0%,rgba(0,0,0,0.45) 60%,rgba(0,0,0,0.15) 100%);
    }
    .sn-gmodal-hdr-txt{position:relative;z-index:2;padding:22px 26px;}
    .sn-gmodal-eyebrow{
      display:block;font-family:'Montserrat',Arial,sans-serif;
      font-size:9px;font-weight:800;letter-spacing:3px;text-transform:uppercase;
      color:#fff;margin-bottom:6px;
    }
    .sn-gmodal-title{
      font-family:'Montserrat',Arial,sans-serif;
      font-size:clamp(18px,3vw,24px);font-weight:800;
      letter-spacing:-0.5px;color:#fff;line-height:1.1;text-transform:uppercase;
    }
    .sn-gmodal-title em{font-style:normal;color:#8B0000;}
    .sn-gmodal-close{
      position:absolute;top:12px;right:14px;z-index:10;
      background:rgba(0,0,0,0.45);border:none;
      color:#fff;font-size:16px;line-height:1;
      width:32px;height:32px;cursor:pointer;
      display:flex;align-items:center;justify-content:center;
      transition:background 0.2s;
    }
    .sn-gmodal-close:hover{background:rgba(139,0,0,0.8);}
    .sn-gmodal-body{padding:24px 26px;}
    .sn-gtabs{display:flex;border:2px solid #e8e8e8;margin-bottom:22px;}
    .sn-gtab{
      flex:1;padding:11px 8px;text-align:center;
      font-family:'Montserrat',Arial,sans-serif;
      font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;
      color:#999;background:#fff;border:none;cursor:pointer;
      transition:background 0.2s,color 0.2s;
    }
    .sn-gtab.active{background:#8B0000;color:#fff;}
    .sn-gpanel{display:none;}
    .sn-gpanel.active{display:block;}
    .sn-gymm-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
    .sn-gfield{margin-bottom:0;}
    .sn-gfield label{
      display:block;font-family:'Montserrat',Arial,sans-serif;
      font-size:10px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;
      color:#1a1a1a;margin-bottom:5px;
    }
    .sn-gfield select{
      width:100%;padding:11px 12px;
      border:2px solid #e8e8e8;border-radius:0;
      font-family:'Montserrat',Arial,sans-serif;font-size:13px;font-weight:600;color:#1a1a1a;
      background:#fff;appearance:none;
      background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238B0000' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
      background-repeat:no-repeat;background-position:right 12px center;
      cursor:pointer;transition:border-color 0.2s;
    }
    .sn-gfield select:focus{outline:none;border-color:#8B0000;}
    .sn-gfield select:disabled{color:#bbb;background-color:#fafafa;cursor:not-allowed;}
    .sn-gyear-wrap{position:relative;}
    .sn-gyear-btn{
      width:100%;padding:11px 12px;
      border:2px solid #e8e8e8;border-radius:0;
      font-family:'Montserrat',Arial,sans-serif;font-size:11px;font-weight:700;
      color:#1a1a1a;letter-spacing:1.5px;text-transform:uppercase;
      background:#fff;cursor:pointer;text-align:left;
      display:flex;align-items:center;justify-content:space-between;
      min-height:44px;transition:border-color 0.2s;
    }
    .sn-gyear-btn:hover{border-color:#ccc;}
    .sn-gyear-btn.open{border-color:#8B0000;}
    .sn-gyear-btn .ph{color:#bbb;font-weight:500;}
    .sn-gyear-arrow{font-size:9px;color:#8B0000;transition:transform 0.2s;}
    .sn-gyear-btn.open .sn-gyear-arrow{transform:rotate(180deg);}
    .sn-gyear-panel{
      display:none;position:absolute;top:calc(100% + 4px);left:0;right:0;
      background:#fff;border:2px solid #e8e8e8;
      box-shadow:0 8px 32px rgba(0,0,0,0.14);
      z-index:9999;padding:10px;max-height:220px;overflow-y:auto;
    }
    .sn-gyear-panel.open{display:block;}
    .sn-gyear-grid-inner{display:grid;grid-template-columns:repeat(3,1fr);gap:3px;}
    .sn-gyear-cell{
      padding:7px 4px;text-align:center;
      font-family:'Montserrat',Arial,sans-serif;font-size:12px;font-weight:700;
      color:#1a1a1a;cursor:pointer;
      transition:background 0.12s,color 0.12s;
    }
    .sn-gyear-cell:hover{background:#f5f5f5;}
    .sn-gyear-cell.sel{background:#8B0000;color:#fff;}
    .sn-gvin-row{display:flex;gap:8px;}
    .sn-gvin-input{
      flex:1;padding:11px 12px;
      border:2px solid #e8e8e8;border-radius:0;
      font-family:'Montserrat',Arial,sans-serif;font-size:13px;font-weight:600;
      color:#1a1a1a;letter-spacing:1px;text-transform:uppercase;
      transition:border-color 0.2s;
    }
    .sn-gvin-input:focus{outline:none;border-color:#8B0000;}
    .sn-gvin-input::placeholder{text-transform:none;letter-spacing:0;font-weight:400;color:#bbb;}
    .sn-gvin-btn{
      display:inline-flex;align-items:center;justify-content:center;
      padding:0 18px;min-height:44px;
      background:#8B0000;color:#fff;border:none;cursor:pointer;
      font-family:'Montserrat',Arial,sans-serif;font-size:10px;font-weight:700;
      letter-spacing:1.5px;text-transform:uppercase;white-space:nowrap;
      transition:background 0.2s;
    }
    .sn-gvin-btn:hover{background:#6d0000;}
    .sn-gvin-btn:disabled{background:#ccc;cursor:not-allowed;}
    .sn-gvin-status{margin-top:8px;font-size:12px;color:#666;min-height:16px;}
    .sn-gvin-status.err{color:#c00;}
    .sn-gvin-status.ok{color:#8B0000;}
    .sn-gconfirm{display:none;margin-top:18px;border:2px solid #e8e8e8;}
    .sn-gconfirm.show{display:block;}
    .sn-gconfirm-hdr{
      background:#f9f9f9;border-bottom:2px solid #e8e8e8;
      padding:10px 16px;
      font-family:'Montserrat',Arial,sans-serif;
      font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#8B0000;
    }
    .sn-gconfirm-body{padding:16px;}
    .sn-gvehicle-name{
      font-family:'Montserrat',Arial,sans-serif;
      font-size:16px;font-weight:800;color:#1a1a1a;margin-bottom:14px;
    }
    .sn-gextras{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;}
    .sn-gcolor-label{
      font-family:'Montserrat',Arial,sans-serif;
      font-size:10px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;
      color:#1a1a1a;margin-bottom:7px;
    }
    .sn-gswatches{display:flex;flex-wrap:wrap;gap:6px;}
    .sn-gswatch{
      width:24px;height:24px;border-radius:50%;
      border:2px solid transparent;cursor:pointer;
      transition:transform 0.12s,border-color 0.12s;
    }
    .sn-gswatch:hover{transform:scale(1.18);}
    .sn-gswatch.sel{border-color:#8B0000;transform:scale(1.18);}
    .sn-gsave-btn{
      width:100%;display:flex;align-items:center;justify-content:center;gap:8px;
      height:48px;background:#8B0000;color:#fff;border:none;cursor:pointer;
      font-family:'Montserrat',Arial,sans-serif;font-size:11px;font-weight:800;
      letter-spacing:2px;text-transform:uppercase;
      transition:background 0.2s;margin-top:16px;
    }
    .sn-gsave-btn:hover{background:#6d0000;}
    .sn-gsaved{display:none;text-align:center;padding:28px 26px;}
    .sn-gsaved.show{display:block;}
    .sn-gsaved-check{
      width:56px;height:56px;background:#8B0000;
      display:flex;align-items:center;justify-content:center;
      margin:0 auto 14px;font-size:26px;color:#fff;
    }
    .sn-gsaved-title{
      font-family:'Montserrat',Arial,sans-serif;
      font-size:17px;font-weight:800;color:#1a1a1a;margin-bottom:4px;
    }
    .sn-gsaved-pill{
      font-family:'Montserrat',Arial,sans-serif;
      font-size:13px;font-weight:700;color:#1a1a1a;
      letter-spacing:0.5px;margin-bottom:18px;
    }
    .sn-gsaved-actions{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;}
    .sn-gsaved-btn{
      display:inline-flex;align-items:center;justify-content:center;gap:6px;
      height:44px;padding:0 20px;
      font-family:'Montserrat',Arial,sans-serif;font-size:10px;font-weight:700;
      letter-spacing:1.5px;text-transform:uppercase;text-decoration:none;cursor:pointer;
      transition:background 0.2s,border-color 0.2s;
    }
    .sn-gsaved-btn.red{background:#8B0000;color:#fff;border:none;}
    .sn-gsaved-btn.red:hover{background:#6d0000;}
    .sn-gsaved-btn.out{background:#fff;color:#1a1a1a;border:2px solid #e8e8e8;}
    .sn-gsaved-btn.out:hover{border-color:#1a1a1a;}
    @media(max-width:540px){
      .sn-gymm-grid{grid-template-columns:1fr;}
      .sn-gextras{grid-template-columns:1fr;}
    }
  `;
  var gStyle = document.createElement('style');
  gStyle.textContent = garageCss;
  document.head.appendChild(gStyle);

  document.body.insertAdjacentHTML('beforeend',
    '<div class="sn-garage-ov" id="sn-garage-ov">' +
      '<div class="sn-gmodal" id="sn-gmodal">' +
        '<div class="sn-gmodal-hdr">' +
          '<div class="sn-gmodal-hdr-bg"></div>' +
          '<div class="sn-gmodal-hdr-ov"></div>' +
          '<div class="sn-gmodal-hdr-txt">' +
            '<span class="sn-gmodal-eyebrow">3J\'s Auto Body</span>' +
            '<h2 class="sn-gmodal-title">My <em>Garage</em></h2>' +
          '</div>' +
          '<button class="sn-gmodal-close" id="sn-gmodal-close">&#x2715;</button>' +
        '</div>' +
        '<div class="sn-gmodal-body" id="sn-gmodal-body">' +
          '<div class="sn-gtabs">' +
            '<button class="sn-gtab active" id="sn-gtab-ymm" onclick="snGTab(\'ymm\')">Year / Make / Model</button>' +
            '<button class="sn-gtab" id="sn-gtab-vin" onclick="snGTab(\'vin\')">Enter VIN</button>' +
          '</div>' +
          '<div class="sn-gpanel active" id="sn-gpanel-ymm">' +
            '<div class="sn-gymm-grid">' +
              '<div class="sn-gfield"><label>Year</label>' +
                '<div class="sn-gyear-wrap">' +
                  '<button type="button" class="sn-gyear-btn" id="sn-gyear-btn" onclick="snGToggleYear()">' +
                    '<span id="sn-gyear-label" class="ph">Select Year</span>' +
                    '<span class="sn-gyear-arrow">&#9660;</span>' +
                  '</button>' +
                  '<div class="sn-gyear-panel" id="sn-gyear-panel"><div class="sn-gyear-grid-inner" id="sn-gyear-grid"></div></div>' +
                '</div>' +
                '<input type="hidden" id="sn-gymm-year" value=""/>' +
              '</div>' +
              '<div class="sn-gfield"><label>Make</label>' +
                '<select id="sn-gymm-make" disabled onchange="snGMakeChange()"><option value="">Select Make</option></select>' +
              '</div>' +
              '<div class="sn-gfield" style="grid-column:1/-1;"><label>Model</label>' +
                '<select id="sn-gymm-model" disabled onchange="snGModelChange()"><option value="">Select Model</option></select>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="sn-gpanel" id="sn-gpanel-vin">' +
            '<div class="sn-gvin-row">' +
              '<input class="sn-gvin-input" id="sn-gvin-input" type="text" maxlength="17" placeholder="Enter your 17-digit VIN"/>' +
              '<button class="sn-gvin-btn" id="sn-gvin-btn" onclick="snGDecodeVIN()">Decode</button>' +
            '</div>' +
            '<p class="sn-gvin-status" id="sn-gvin-status"></p>' +
          '</div>' +
          '<div class="sn-gconfirm" id="sn-gconfirm">' +
            '<div class="sn-gconfirm-hdr">Confirm Your Vehicle</div>' +
            '<div class="sn-gconfirm-body">' +
              '<p class="sn-gvehicle-name" id="sn-gvehicle-name">—</p>' +
              '<div class="sn-gextras">' +
                '<div class="sn-gfield"><label>Trim Level</label><select id="sn-gsel-trim"><option value="">Unknown / Not Listed</option></select></div>' +
                '<div><p class="sn-gcolor-label">Truck Color</p><div class="sn-gswatches" id="sn-gswatches"></div></div>' +
              '</div>' +
              '<div class="sn-gfield" id="sn-gbed-field" style="display:none;margin-bottom:12px;"><label>Bed Size</label>' +
                '<select id="sn-gsel-bed"><option value="">Select Bed Size</option></select>' +
              '</div>' +
              '<button class="sn-gsave-btn" onclick="snGSave()">Save to My Garage</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="sn-gsaved" id="sn-gsaved">' +
          '<div class="sn-gsaved-check">&#10003;</div>' +
          '<p class="sn-gsaved-title">Vehicle Saved!</p>' +
          '<p class="sn-gsaved-pill" id="sn-gsaved-pill">—</p>' +
          '<div class="sn-gsaved-actions">' +
            '<a href="https://www.3jsautobody.com/exterior-accessories" class="sn-gsaved-btn red">Shop Accessories</a>' +
            '<button class="sn-gsaved-btn out" onclick="snGReset()">Change Vehicle</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>'
  );

  var SN_COLORS=[
    {name:'White',hex:'#F5F5F0'},{name:'Silver',hex:'#C0C0C0'},{name:'Gray',hex:'#808080'},
    {name:'Black',hex:'#1a1a1a'},{name:'Red',hex:'#B22222'},{name:'Blue',hex:'#1E3A8A'},
    {name:'Navy',hex:'#0a1628'},{name:'Green',hex:'#2D5016'},{name:'Brown',hex:'#6B3A2A'},
    {name:'Orange',hex:'#CC5500'},{name:'Yellow',hex:'#D4A017'},{name:'Beige',hex:'#D2B48C'},
  ];
  var SN_MAKES={
    'Ford':['F-150','Super Duty F-250/F-350','Ranger','Maverick'],
    'Chevrolet':['Silverado 1500','Silverado 2500HD/3500HD','Colorado'],
    'GMC':['Sierra 1500','Sierra 2500HD/3500HD','Canyon'],
    'RAM':['1500','2500/3500'],
    'Toyota':['Tacoma','Tundra'],
    'Nissan':['Titan','Titan XD','Frontier'],
    'Honda':['Ridgeline'],
    'Jeep':['Gladiator'],
  };
  var SN_TRIMS={
    'F-150':['XL','XLT','Lariat','King Ranch','Platinum','Limited','Raptor','Raptor R'],
    'Super Duty F-250/F-350':['XL','XLT','Lariat','King Ranch','Platinum','Limited','Tremor'],
    'Ranger':['XL','XLT','Lariat','Raptor'],'Maverick':['XL','XLT','Lariat'],
    'Silverado 1500':['WT','Custom','LT','RST','LTZ','High Country','Trail Boss','ZR2'],
    'Silverado 2500HD/3500HD':['WT','Custom','LT','LTZ','High Country'],
    'Colorado':['WT','LT','Z71','ZR2','Trail Boss'],
    'Sierra 1500':['Pro','SLE','Elevation','SLT','AT4','Denali','Denali Ultimate'],
    'Sierra 2500HD/3500HD':['Pro','SLE','SLT','AT4','Denali'],
    'Canyon':['Pro','SLE','Elevation','SLT','AT4X','Denali'],
    '1500':['Tradesman','Big Horn','Lone Star','Laramie','Rebel','TRX','Limited','Longhorn'],
    '2500/3500':['Tradesman','Big Horn','Laramie','Power Wagon','Limited','Longhorn'],
    'Tacoma':['SR','SR5','TRD Sport','TRD Off-Road','Limited','TRD Pro','Trailhunter'],
    'Tundra':['SR','SR5','Limited','Platinum','1794 Edition','TRD Pro','Capstone'],
    'Titan':['S','SV','Pro-4X','Platinum Reserve'],'Titan XD':['S','SV','Pro-4X','Platinum Reserve'],
    'Frontier':['S','SV','Pro-4X','PRO-X'],'Ridgeline':['Sport','RTL','RTL-E','Black Edition'],
    'Gladiator':['Sport','Sport S','Willys','Rubicon','Mojave'],
  };
  var SN_BEDS={
    'F-150':[["5'6\" Short Bed",66],["6'6\" Standard Bed",78]],
    'Super Duty F-250/F-350':[["6'9\" Standard Bed",81],["8' Long Bed",96]],
    'Ranger':[["5' Short Bed",60],["6' Standard Bed",72]],
    'Maverick':[["4'6\" Compact Bed",54]],
    'Silverado 1500':[["5'9\" Short Bed",69],["6'7\" Standard Bed",79]],
    'Silverado 2500HD/3500HD':[["6'7\" Standard Bed",79],["8' Long Bed",96]],
    'Sierra 1500':[["5'9\" Short Bed",69],["6'7\" Standard Bed",79]],
    'Sierra 2500HD/3500HD':[["6'7\" Standard Bed",79],["8' Long Bed",96]],
    'Colorado':[["5'2\" Short Bed",62],["6'7\" Standard Bed",79]],
    'Canyon':[["5'2\" Short Bed",62],["6'7\" Standard Bed",79]],
    '1500':[["5'7\" Short Bed",67],["6'4\" Standard Bed",76],["8' Long Bed",96]],
    '2500/3500':[["6'4\" Standard Bed",76],["8' Long Bed",96]],
    'Tacoma':[["5' Short Bed",60],["6' Standard Bed",72]],
    'Tundra':[["5'6\" Short Bed",66],["6'6\" Standard Bed",78],["8' Long Bed",96]],
    'Titan':[["5'7\" Short Bed",67],["6'7\" Standard Bed",79]],
    'Titan XD':[["6'7\" Standard Bed",79]],
    'Frontier':[["5' Short Bed",60],["6' Standard Bed",72]],
    'Ridgeline':[["5'4\" Bed",64]],
    'Gladiator':[["5' Bed",60]],
  };

  var snGColor=SN_COLORS[0];
  var snGPending={};

  (function(){
    var grid=document.getElementById('sn-gyear-grid');
    for(var y=2026;y>=1981;y--){
      (function(yr){
        var cell=document.createElement('div');
        cell.className='sn-gyear-cell';
        cell.textContent=yr;
        cell.onclick=function(){
          document.getElementById('sn-gymm-year').value=yr;
          var lbl=document.getElementById('sn-gyear-label');
          lbl.textContent=yr;lbl.classList.remove('ph');
          document.querySelectorAll('.sn-gyear-cell').forEach(function(c){c.classList.remove('sel');});
          cell.classList.add('sel');
          snGCloseYear();snGYearChange();
        };
        grid.appendChild(cell);
      })(y);
    }
  })();

  function snGBuildSwatches(){
    var wrap=document.getElementById('sn-gswatches');wrap.innerHTML='';
    SN_COLORS.forEach(function(c){
      var s=document.createElement('div');
      s.className='sn-gswatch'+(c.name===snGColor.name?' sel':'');
      s.style.background=c.hex;
      if(c.name==='White') s.style.border='2px solid #ddd';
      s.title=c.name;
      s.onclick=function(){snGColor=c;snGBuildSwatches();};
      wrap.appendChild(s);
    });
  }

  function snGOpenGarage(){
    document.getElementById('sn-garage-ov').classList.add('sn-gopen');
    var saved=localStorage.getItem('garage_vehicle');
    if(saved){try{snGShowSaved(JSON.parse(saved));}catch(e){}}
  }
  function snGCloseGarage(){document.getElementById('sn-garage-ov').classList.remove('sn-gopen');}

  function snGTab(tab){
    document.getElementById('sn-gtab-ymm').classList.toggle('active',tab==='ymm');
    document.getElementById('sn-gtab-vin').classList.toggle('active',tab==='vin');
    document.getElementById('sn-gpanel-ymm').classList.toggle('active',tab==='ymm');
    document.getElementById('sn-gpanel-vin').classList.toggle('active',tab==='vin');
    document.getElementById('sn-gconfirm').classList.remove('show');
  }

  function snGToggleYear(){
    var panel=document.getElementById('sn-gyear-panel');
    var btn=document.getElementById('sn-gyear-btn');
    var open=panel.classList.contains('open');
    panel.classList.toggle('open',!open);btn.classList.toggle('open',!open);
  }
  function snGCloseYear(){
    document.getElementById('sn-gyear-panel').classList.remove('open');
    document.getElementById('sn-gyear-btn').classList.remove('open');
  }

  function snGYearChange(){
    var makeSel=document.getElementById('sn-gymm-make');
    var modelSel=document.getElementById('sn-gymm-model');
    makeSel.innerHTML='<option value="">Select Make</option>';
    modelSel.innerHTML='<option value="">Select Model</option>';
    makeSel.disabled=false;modelSel.disabled=true;
    Object.keys(SN_MAKES).forEach(function(m){
      var o=document.createElement('option');o.value=m;o.textContent=m;makeSel.appendChild(o);
    });
    document.getElementById('sn-gconfirm').classList.remove('show');
  }
  function snGMakeChange(){
    var make=document.getElementById('sn-gymm-make').value;
    var modelSel=document.getElementById('sn-gymm-model');
    modelSel.innerHTML='<option value="">Select Model</option>';modelSel.disabled=true;
    if(!make) return;
    (SN_MAKES[make]||[]).forEach(function(m){
      var o=document.createElement('option');o.value=m;o.textContent=m;modelSel.appendChild(o);
    });
    modelSel.disabled=false;
    document.getElementById('sn-gconfirm').classList.remove('show');
  }
  function snGModelChange(){
    var year=document.getElementById('sn-gymm-year').value;
    var make=document.getElementById('sn-gymm-make').value;
    var model=document.getElementById('sn-gymm-model').value;
    if(!year||!make||!model) return;
    snGPending={year:year,make:make,model:model,trim:'',vin:''};
    snGShowConfirm(year,make,model,'');
  }

  function snGDecodeVIN(){
    var vin=document.getElementById('sn-gvin-input').value.trim().toUpperCase();
    var status=document.getElementById('sn-gvin-status');
    var btn=document.getElementById('sn-gvin-btn');
    if(vin.length!==17){status.className='sn-gvin-status err';status.textContent='VIN must be 17 characters.';return;}
    status.className='sn-gvin-status';status.textContent='Decoding...';btn.disabled=true;
    fetch('https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/'+vin+'?format=json')
      .then(function(r){return r.json();})
      .then(function(data){
        btn.disabled=false;
        var get=function(n){var i=data.Results.find(function(r){return r.Variable===n;});return i?(i.Value||''):''};
        var year=get('Model Year'),make=get('Make'),model=get('Model'),trim=get('Trim');
        make=make.charAt(0).toUpperCase()+make.slice(1).toLowerCase();
        if(make==='Ram') make='RAM';
        if(!year||!make||!model){status.className='sn-gvin-status err';status.textContent='Could not decode. Try Year/Make/Model.';return;}
        status.className='sn-gvin-status ok';status.textContent='✓ VIN decoded!';
        snGPending={year:year,make:make,model:model,trim:trim,vin:vin};
        snGShowConfirm(year,make,model,trim);
      })
      .catch(function(){btn.disabled=false;status.className='sn-gvin-status err';status.textContent='Decode failed. Check your connection.';});
  }

  function snGShowConfirm(year,make,model,trim){
    document.getElementById('sn-gvehicle-name').textContent=year+' '+make+' '+model;
    var trimSel=document.getElementById('sn-gsel-trim');
    trimSel.innerHTML='<option value="">Unknown / Not Listed</option>';
    (SN_TRIMS[model]||[]).forEach(function(t){
      var o=document.createElement('option');o.value=t;o.textContent=t;
      if(t===trim) o.selected=true;trimSel.appendChild(o);
    });
    var bedSel=document.getElementById('sn-gsel-bed');
    var bedField=document.getElementById('sn-gbed-field');
    var bedList=SN_BEDS[model]||[];
    bedSel.innerHTML='<option value="">Select Bed Size</option>';
    if(bedList.length){
      bedList.forEach(function(b){var o=document.createElement('option');o.value=b[1];o.textContent=b[0];bedSel.appendChild(o);});
      if(bedList.length===1) bedSel.value=bedList[0][1];
      bedField.style.display='block';
    } else {bedField.style.display='none';}
    snGBuildSwatches();
    document.getElementById('sn-gconfirm').classList.add('show');
    setTimeout(function(){document.getElementById('sn-gmodal').scrollTop=9999;},50);
  }

  function snGSave(){
    var trim=document.getElementById('sn-gsel-trim').value;
    var bedIn=parseFloat(document.getElementById('sn-gsel-bed').value)||null;
    var bedList=SN_BEDS[snGPending.model]||[];
    var bedLabel='';
    if(bedIn){var m=bedList.find(function(b){return b[1]===bedIn;});bedLabel=m?m[0]:'';}
    var v={
      year:snGPending.year,make:snGPending.make,model:snGPending.model,
      trim:trim||snGPending.trim||'',bedIn:bedIn,bedSize:bedLabel,
      color:snGColor.name,colorHex:snGColor.hex,vin:snGPending.vin||''
    };
    localStorage.setItem('garage_vehicle',JSON.stringify(v));
    snGShowSaved(v);
    try{window.dispatchEvent(new CustomEvent('garageUpdated',{detail:v}));}catch(e){}
  }

  function snGShowSaved(v){
    var label=v.year+' '+v.make+' '+v.model+(v.trim?' '+v.trim:'')+(v.bedSize?' · '+v.bedSize:'');
    document.getElementById('sn-gsaved-pill').textContent=label;
    document.getElementById('sn-gmodal-body').style.display='none';
    document.getElementById('sn-gsaved').classList.add('show');
    var navLabel=document.getElementById('sn-garage-label');
    if(navLabel) navLabel.textContent=v.year+' '+v.make+' '+v.model;
  }

  function snGReset(){
    localStorage.removeItem('garage_vehicle');
    document.getElementById('sn-gmodal-body').style.display='block';
    document.getElementById('sn-gsaved').classList.remove('show');
    document.getElementById('sn-gconfirm').classList.remove('show');
    document.getElementById('sn-gymm-year').value='';
    var lbl=document.getElementById('sn-gyear-label');lbl.textContent='Select Year';lbl.classList.add('ph');
    document.querySelectorAll('.sn-gyear-cell').forEach(function(c){c.classList.remove('sel');});
    document.getElementById('sn-gymm-make').innerHTML='<option value="">Select Make</option>';
    document.getElementById('sn-gymm-make').disabled=true;
    document.getElementById('sn-gymm-model').innerHTML='<option value="">Select Model</option>';
    document.getElementById('sn-gymm-model').disabled=true;
    var navLabel=document.getElementById('sn-garage-label');
    if(navLabel) navLabel.textContent='My Garage';
  }

  var snGBtn=document.getElementById('sn-garage-btn');
  var snGMobBtn=document.getElementById('sn-mob-garage-btn');
  var snGOv=document.getElementById('sn-garage-ov');
  var snGCloseBtn=document.getElementById('sn-gmodal-close');
  if(snGBtn) snGBtn.addEventListener('click',snGOpenGarage);
  if(snGMobBtn) snGMobBtn.addEventListener('click',snGOpenGarage);
  if(snGCloseBtn) snGCloseBtn.addEventListener('click',snGCloseGarage);
  if(snGOv) snGOv.addEventListener('click',function(e){if(e.target===snGOv) snGCloseGarage();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape') snGCloseGarage();});
  document.addEventListener('click',function(e){
    var yb=document.getElementById('sn-gyear-btn');
    var yp=document.getElementById('sn-gyear-panel');
    if(yb&&yp&&!yb.contains(e.target)&&!yp.contains(e.target)) snGCloseYear();
  });

  (function(){
    var saved=localStorage.getItem('garage_vehicle');
    if(saved){
      try{
        var v=JSON.parse(saved);
        var navLabel=document.getElementById('sn-garage-label');
        if(navLabel) navLabel.textContent=v.year+' '+v.make+' '+v.model;
      }catch(e){}
    }
  })();

  // Load garage FAB widget on all pages that use site-nav
  // Skip if the page already has the catalog embedded (it has its own garage UI)
  (function(){
    if(document.getElementById('gc-ov')) return; // already loaded
    if(document.querySelector('iframe[src*="parts-catalog"]')) return; // catalog page has own garage
    var s=document.createElement('script');
    s.src='https://rlsh1855.github.io/3Js-and-RLSH-Website/my-garage-widget.js';
    document.head.appendChild(s);
  })();

})();
