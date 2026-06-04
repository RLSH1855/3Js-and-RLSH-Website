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
  .ss-nav{background:#0a0a0a;display:flex;align-items:center;justify-content:center;min-height:60px;padding:0 0 0 40px;position:relative;box-shadow:0 2px 0 0 rgba(0,0,0,.25);}
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
  .ss-garage{margin-left:auto;align-self:center;display:flex;align-items:center;gap:16px;padding:0 20px 0 16px;width:350px;height:60px;box-sizing:border-box;
    border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.07);text-decoration:none;cursor:pointer;border-radius:0;
    transition:border-color .15s,background .15s;}
  .ss-garage:hover{border-color:var(--ssr);background:rgba(255,255,255,.11);}
  .ss-garage-ico{color:var(--ssr);display:inline-flex;flex-shrink:0;}
  .ss-garage-ico svg{width:32px;height:32px;stroke:currentColor;fill:none;stroke-width:1.6;}
  .ss-garage-ico img{width:32px;height:32px;display:block;object-fit:contain;filter:brightness(0) invert(1);transition:filter .15s;}
  .ss-garage.ss-saved .ss-garage-ico img{filter:none;}
  .ss-garage-txt{display:flex;flex-direction:column;align-items:flex-start;line-height:1.15;}
  .ss-garage-label{font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.45);}
  .ss-garage-veh{font-family:var(--ssnav-font),sans-serif;font-weight:700;font-size:15px;letter-spacing:.03em;color:#fff;white-space:nowrap;}
  .ss-garage-swap{color:rgba(255,255,255,.35);flex-shrink:0;display:inline-flex;}
  .ss-garage-swap svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2;}
  .ss-garage.ss-saved{background:#fff;border-color:rgba(0,0,0,.12);}
  .ss-garage.ss-saved .ss-garage-label{color:rgba(17,17,17,.55);}
  .ss-garage.ss-saved .ss-garage-veh{color:#111;}
  .ss-garage.ss-saved .ss-garage-ico{color:#8b0000;}
  .ss-garage.ss-saved .ss-garage-swap{color:rgba(17,17,17,.35);}
  .ss-garage.ss-saved:hover{background:#f5f5f5;border-color:rgba(0,0,0,.2);}

  /* spacer clears the fixed shell */
  .ss-spacer{height:174px;}

  /* blur scrim behind open mega menu */
  .ss-scrim{position:fixed;inset:0;z-index:900;background:rgba(7,12,22,.34);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);opacity:0;pointer-events:none;transition:opacity .38s ease;}
  .ss-scrim.ss-show{opacity:1;pointer-events:auto;}

  /* My Garage popup overlay (blurred dark backdrop) */
  .ss-garage-ov{position:fixed;inset:0;z-index:1300;display:none;align-items:center;justify-content:center;background:rgba(7,12,22,.55);backdrop-filter:blur(7px);-webkit-backdrop-filter:blur(7px);opacity:0;transition:opacity .3s ease;padding:24px;}
  .ss-garage-ov.ss-open{display:flex;opacity:1;}
  .ss-garage-frame{width:min(1260px,100%);height:min(630px,92vh);border:none;background:#fff;box-shadow:0 40px 100px rgba(0,0,0,.6);}
  @media(max-width:640px){.ss-garage-ov{padding:0;}.ss-garage-frame{width:100%;height:100%;}}

  /* ── Hamburger (mobile) ── */
  .ss-burger{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:8px;background:none;border:none;}
  .ss-burger span{display:block;width:24px;height:2px;background:#fff;transition:transform .3s ease,opacity .3s ease;transform-origin:center;}
  .ss-burger.ss-open span:nth-child(1){transform:translateY(7px) rotate(45deg);}
  .ss-burger.ss-open span:nth-child(2){opacity:0;transform:scaleX(0);}
  .ss-burger.ss-open span:nth-child(3){transform:translateY(-7px) rotate(-45deg);}

  /* ── Page wrap — sits ON TOP of drawer; lifts, slides right, scales ── */
  #ss-page-wrap{position:relative;z-index:5;min-height:100vh;will-change:transform;transform-origin:50% 50vh;}
  body.ss-menu-open,body.ss-menu-closing{background:#ffffff;}
  @keyframes ssPageOpen{
    0%  {transform:translateX(0) scale(1);border-radius:0;box-shadow:none;}
    7%  {transform:translateX(6px) scale(1.02);}
    100%{transform:translateX(calc(min(360px,90vw) - 22px)) scale(0.80);border-radius:16px;box-shadow:-16px 0 52px rgba(0,0,0,.30),-2px 0 8px rgba(0,0,0,.12);}
  }
  @keyframes ssPageClose{
    0%  {transform:translateX(calc(min(360px,90vw) - 22px)) scale(0.80);border-radius:16px;box-shadow:-16px 0 52px rgba(0,0,0,.30),-2px 0 8px rgba(0,0,0,.12);}
    100%{transform:translateX(0) scale(1);border-radius:0;box-shadow:none;}
  }
  body.ss-menu-open #ss-page-wrap,body.ss-menu-closing #ss-page-wrap{min-height:0;}
  body.ss-menu-open #ss-page-wrap{animation:ssPageOpen .52s cubic-bezier(.22,1,.36,1) forwards;overflow:hidden;pointer-events:none;height:100vh;}
  body.ss-menu-closing #ss-page-wrap{animation:ssPageClose .46s cubic-bezier(.22,1,.36,1) forwards;overflow:hidden;height:100vh;}
  /* ── Overlay — between drawer and page ── */
  .ss-drawer-ov{position:fixed;inset:0;z-index:3;background:rgba(0,0,0,.45);opacity:0;pointer-events:none;transition:opacity .44s ease;}
  body.ss-menu-open .ss-drawer-ov{opacity:1;pointer-events:all;}
  body.ss-menu-closing .ss-drawer-ov{opacity:0;pointer-events:none;}
  /* ── Drawer panel — behind page, items start hidden ── */
  .ss-drawer{position:fixed;left:0;top:0;height:100vh;height:100dvh;width:min(360px,90vw);background:#fff;z-index:4;display:flex;flex-direction:column;overflow:hidden;}
  /* Close: blur + move left with page */
  body.ss-menu-closing .ss-drawer{filter:blur(6px);transform:translateX(-50px);opacity:0;transition:filter .12s ease,transform .46s cubic-bezier(.22,1,.36,1),opacity .32s ease .06s;}
  /* Cinematic keyframes */
  @keyframes ssDrawRight{from{transform:scaleX(0);transform-origin:left center;}to{transform:scaleX(1);transform-origin:left center;}}
  @keyframes ssScanDown{0%{top:2px;opacity:1;}85%{opacity:.6;}100%{top:100%;opacity:0;}}
  @keyframes ssFadeUpIn{from{opacity:0;transform:translateY(5px);}to{opacity:1;transform:translateY(0);}}
  @keyframes ssSlideInLeft{from{opacity:0;transform:translateX(-14px);}to{opacity:1;transform:translateX(0);}}
  @keyframes ssSheen{0%{left:-120px}100%{left:140%}}
  .ss-sheen-red{position:relative;overflow:hidden;}
  .ss-sheen-red::after{content:'';position:absolute;top:-50%;left:-120px;width:70px;height:200%;background:linear-gradient(105deg,transparent 20%,rgba(255,255,255,.28) 50%,transparent 80%);animation:ssSheen 2.6s cubic-bezier(.4,0,.6,1) infinite;}
  .ss-sheen-outline{position:relative;overflow:hidden;}
  .ss-sheen-outline::after{content:'';position:absolute;top:-50%;left:-120px;width:70px;height:200%;background:linear-gradient(105deg,transparent 20%,rgba(255,255,255,.14) 50%,transparent 80%);animation:ssSheen 2.6s cubic-bezier(.4,0,.6,1) infinite 1.1s;}
  /* Floating close button — top-right over editorial */
  .ssd-x{position:absolute;top:10px;right:12px;z-index:30;width:30px;height:30px;border:none;cursor:pointer;background:rgba(0,0,0,.07);border-radius:50%;display:flex;align-items:center;justify-content:center;color:rgba(0,0,0,.5);font-size:13px;font-weight:600;font-family:system-ui,sans-serif;}
  .ssd-x:hover{background:rgba(0,0,0,.15);}
  /* Drawer scroll container (flexes above pinned footer) */
  .ssd-scroll{flex:1;min-height:0;display:flex;flex-direction:column;background:#fff;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;-ms-overflow-style:none;scrollbar-width:none;}
  .ssd-scroll::-webkit-scrollbar{display:none;}
  .ssd-divider{height:1px;background:rgba(0,0,0,.08);flex-shrink:0;}
  /* Editorial panel */
  .ssd-editorial{position:relative;flex-shrink:0;overflow:hidden;background:#fff;border-bottom:2px solid #8B0000;}
  .ssd-editorial-top-bar{position:absolute;top:0;left:0;right:0;height:3px;background:#8B0000;pointer-events:none;}
  .ssd-editorial-body{position:relative;z-index:2;padding:14px 22px 12px;}
  .ssd-eyebrow{font-family:'Montserrat',sans-serif;font-weight:800;font-size:8.5px;letter-spacing:2.5px;text-transform:uppercase;color:#8B0000;margin-bottom:6px;opacity:.9;padding-right:34px;}
  .ssd-headline{font-family:'Montserrat',sans-serif;font-weight:900;font-size:22px;line-height:1.05;letter-spacing:-.7px;text-transform:uppercase;color:#1a1a1a;}
  .ssd-headline span{color:#8B0000;}
  .ssd-em-dash{width:28px;height:2.5px;background:#8B0000;margin:7px 0 6px;}
  .ssd-tagline{font-family:'Inter',sans-serif;font-style:italic;font-size:11px;color:rgba(0,0,0,.38);margin-bottom:0;min-height:14px;}
  .ssd-tagline-cursor{border-right:1.5px solid rgba(0,0,0,.3);margin-left:1px;}
  .ssd-ed-ctas{display:flex;flex-direction:column;gap:8px;}
  .ssd-ed-btn-red{height:42px;display:flex;align-items:center;justify-content:space-between;padding:0 18px;background:#8B0000;color:#fff;font-family:'Oswald',sans-serif;font-weight:700;font-size:13px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;box-shadow:inset 0 1px 0 rgba(255,255,255,.15),inset 0 -2px 0 rgba(0,0,0,.2);}
  .ssd-ed-btn-phone{height:34px;display:flex;align-items:center;justify-content:space-between;padding:0 18px;border:1px solid rgba(0,0,0,.15);color:rgba(0,0,0,.45);font-family:'Oswald',sans-serif;font-weight:500;font-size:11px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;}
  /* Garage row */
  .ssd-garage{display:flex;align-items:center;gap:11px;padding:10px 20px;background:#fff;border:none;border-bottom:1px solid rgba(0,0,0,.09);cursor:pointer;width:100%;text-align:left;flex-shrink:0;transition:background .15s;box-shadow:0 1px 3px rgba(0,0,0,.04),inset 0 -1px 0 rgba(0,0,0,.10);}
  .ssd-garage:hover,.ssd-garage:active{background:rgba(139,0,0,.04);}
  .ssd-garage-icon{width:28px;height:28px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .ssd-garage-icon img{width:28px;height:28px;object-fit:contain;}
  .ssd-garage-val{flex:1;font-family:'Montserrat',sans-serif;font-size:15px;font-weight:800;letter-spacing:-.2px;color:#1a1a1a;}
  .ssd-garage-arr{color:rgba(0,0,0,.25);flex-shrink:0;display:flex;}
  /* Nav */
  .ssd-nav{background:#fff;}
  .ssd-section{display:flex;align-items:center;position:relative;z-index:1;background:#2d2d2d;box-shadow:inset 0 2px 0 rgba(255,255,255,.12),inset 0 -2px 0 rgba(0,0,0,.5);padding:8px 20px 8px 30px;}
  .ssd-section span{font-family:'Oswald',sans-serif;font-weight:800;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,.92);text-shadow:0 1px 2px rgba(0,0,0,.6);}
  .ssd-item{display:flex;align-items:center;justify-content:space-between;padding:10px 20px 10px 17px;background:#fff;border-bottom:1px solid rgba(0,0,0,.09);border-left:3px solid transparent;border-right:none;border-top:none;cursor:pointer;width:100%;text-align:left;transition:background .1s ease,border-left-color .15s ease;box-shadow:0 1px 3px rgba(0,0,0,.04),inset 0 -1px 0 rgba(0,0,0,.10);text-decoration:none;color:inherit;}
  .ssd-item:hover,.ssd-item.ssd-active{background:rgba(0,0,0,.03);border-left-color:#8B0000;}
  .ssd-item:active{background:rgba(0,0,0,.05);}
  .ssd-item.ssd-open{border-left-color:#8B0000;}
  .ssd-item-text{display:flex;flex-direction:column;gap:2px;}
  .ssd-item-label{font-family:'Montserrat',sans-serif;font-size:14px;font-weight:700;letter-spacing:-.1px;color:#1a1a1a;line-height:1.2;}
  .ssd-item-desc{font-family:'Inter',sans-serif;font-size:10.5px;font-weight:400;color:rgba(0,0,0,.38);letter-spacing:.1px;line-height:1.3;}
  .ssd-item-arr{color:rgba(0,0,0,.2);flex-shrink:0;display:inline-flex;transition:transform .3s cubic-bezier(.22,1,.36,1);}
  .ssd-item.ssd-open .ssd-item-arr{transform:rotate(180deg);}
  /* Submenu */
  .ssd-sub{display:grid;grid-template-rows:0fr;background:#2d2d2d;transition:grid-template-rows 420ms cubic-bezier(.22,1,.36,1);}
  .ssd-sub.ssd-sub-open{grid-template-rows:1fr;}
  .ssd-sub-inner{overflow:hidden;min-height:0;position:relative;}
  .ssd-sub-bar{height:2px;background:#8B0000;flex-shrink:0;}
  .ssd-sub-bar.ss-drawn{animation:ssDrawRight 400ms cubic-bezier(.22,1,.36,1) 30ms both;}
  .ssd-scan-line{position:absolute;left:0;right:0;height:3px;background:linear-gradient(90deg,transparent 0%,#8B0000 40%,rgba(255,100,100,.6) 60%,transparent 100%);top:2px;z-index:5;pointer-events:none;animation:ssScanDown 550ms ease-out 60ms forwards;}
  .ssd-sub-label{display:block;font-family:'Oswald',sans-serif;font-size:10px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,.92);background:#1d1d1d;border-top:2px solid #000;border-bottom:1.5px solid rgba(255,255,255,.18);text-shadow:0 1px 2px rgba(0,0,0,.6);padding:15px 20px 15px 30px;}
  .ssd-sub-label.ss-fadein{animation:ssFadeUpIn 300ms cubic-bezier(.22,1,.36,1) both;}
  .ssd-sub-item{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;font-family:'Inter',sans-serif;font-size:13px;font-weight:500;color:rgba(255,255,255,.82);text-decoration:none;border-bottom:1px solid rgba(255,255,255,.05);transition:background .12s ease;}
  .ssd-sub-item:last-of-type{margin-bottom:6px;}
  .ssd-sub-item:hover,.ssd-sub-item:active{background:rgba(139,0,0,.40);}
  .ssd-sub-item.ss-slidein{animation:ssSlideInLeft 320ms cubic-bezier(.22,1,.36,1) both;}
  .ssd-sub-spacer{height:6px;background:#2d2d2d;}
  /* Drawer footer */
  .ssd-footer{background:#1a1a1f;padding:11px 20px 13px;flex-shrink:0;}
  .ssd-brand-line{display:flex;align-items:center;gap:6px;margin-bottom:9px;}
  .ssd-brand-dot{width:5px;height:5px;background:#8B0000;flex-shrink:0;}
  .ssd-brand-text{font-family:'Montserrat',sans-serif;font-weight:800;font-size:7.5px;letter-spacing:.6px;text-transform:uppercase;color:rgba(255,255,255,.38);white-space:nowrap;}
  .ssd-footer-btns{display:flex;flex-direction:column;gap:7px;}
  .ssd-cta-red{display:flex;align-items:center;justify-content:center;gap:8px;height:40px;background:#8B0000;color:#fff;font-family:'Montserrat',sans-serif;font-weight:800;font-size:10px;letter-spacing:2.5px;text-transform:uppercase;text-decoration:none;border:none;cursor:pointer;}
  .ssd-cta-outline{display:flex;align-items:center;justify-content:center;gap:8px;height:40px;border:1.5px solid rgba(255,255,255,.18);color:rgba(255,255,255,.72);font-family:'Montserrat',sans-serif;font-weight:700;font-size:10px;letter-spacing:2.5px;text-transform:uppercase;text-decoration:none;background:transparent;cursor:pointer;}
  .ssd-contact{margin-top:8px;text-align:center;font-family:'Inter',sans-serif;font-size:11px;color:rgba(255,255,255,.28);}
  @media(prefers-reduced-motion:reduce){#ss-page-wrap,.ss-drawer,.ss-drawer-ov,.ssd-sub{transition:none!important;}}

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
  .footer{background:#111;color:#fff;padding:56px 40px 0;}
  .footer-top{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:40px;padding-bottom:48px;border-bottom:1px solid rgba(255,255,255,0.08);}
  .footer-brand{text-align:center;}
  .footer-logos{display:flex;align-items:center;justify-content:center;gap:16px;margin-bottom:16px;flex-wrap:wrap;}
  .footer-logo{height:60px;width:auto;display:block;}
  .footer-tagline{font-family:'Inter',sans-serif;font-size:13px;font-weight:400;color:rgba(255,255,255,0.55);line-height:1.7;max-width:220px;margin:0 auto 20px;}
  .social-group{margin-bottom:10px;}
  .social-label{font-size:9px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#fff;margin-bottom:8px;}
  .social-row{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;}
  .social-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;font-family:'Montserrat',sans-serif;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.8);background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:0;min-height:44px;padding:0 20px;text-decoration:none;cursor:pointer;transition:all 0.3s ease;white-space:nowrap;}
  .social-btn:hover{background:#8B0000;color:#fff;border-color:#8B0000;}
  .social-btn svg{width:13px;height:13px;fill:currentColor;flex-shrink:0;}
  .footer-col-title{font-size:10px;font-weight:800;letter-spacing:2.5px;text-transform:uppercase;color:rgba(255,255,255,0.9);margin-bottom:16px;display:inline-block;padding-bottom:5px;border-bottom:2px solid #8B0000;}
  .footer-links{list-style:none;}
  .footer-links li{margin-bottom:10px;}
  .footer-links a{font-family:'Inter',sans-serif;font-size:14px;font-weight:400;color:rgba(255,255,255,0.65);text-decoration:none;transition:color 0.2s;}
  .footer-links a:hover{color:#fff;}
  .hours-row{display:flex;gap:10px;font-family:'Inter',sans-serif;font-size:13px;font-weight:400;color:rgba(255,255,255,0.65);margin-bottom:8px;}
  .hours-row span:first-child{color:rgba(255,255,255,0.9);font-weight:600;min-width:76px;}
  .hours-closed{color:#8B0000 !important;}
  .day-short{display:none;}.day-full{display:inline;}
  .contact-title-row{display:flex;align-items:center;justify-content:flex-start;gap:14px;margin-bottom:14px;}
  .contact-phone-inline{font-size:11px;font-weight:700;color:rgba(255,255,255,0.85);white-space:nowrap;}
  .contact-phone-inline a{color:rgba(255,255,255,0.85);text-decoration:none;transition:color 0.2s;}
  .contact-phone-inline a:hover{color:#fff;}
  .contact-details{display:flex;flex-direction:column;gap:10px;}
  .contact-item{display:flex;align-items:flex-start;gap:8px;}
  .contact-item svg{width:14px;height:14px;fill:#8B0000;flex-shrink:0;margin-top:2px;}
  .contact-item p{font-family:'Inter',sans-serif;font-size:13px;font-weight:400;color:rgba(255,255,255,0.65);line-height:1.6;}
  .contact-item a{color:rgba(255,255,255,0.65);text-decoration:none;transition:color 0.2s;}
  .contact-item a:hover{color:#fff;}
  .footer-bottom{padding:20px 0;display:flex;flex-direction:column;align-items:center;text-align:center;gap:6px;}
  .footer-copy{font-size:11px;font-weight:500;color:rgba(255,255,255,0.35);}
  .footer-copy span{color:#8B0000;}
  .footer-bottom-links{display:flex;gap:20px;}
  .footer-bottom-links a{font-size:11px;font-weight:500;color:rgba(255,255,255,0.35);text-decoration:none;transition:color 0.2s;}
  .footer-bottom-links a:hover{color:#fff;}
  @media(max-width:768px){.footer{padding:36px 20px 0;}.footer-top{grid-template-columns:1fr 1fr;gap:28px;}.footer-brand{grid-column:1/-1;}}
  @media(max-width:480px){.footer{padding:20px 16px 0;}.footer-top{grid-template-columns:1fr 1fr;gap:14px;padding-bottom:20px;}.footer-brand{grid-column:1/-1;}.footer-logo{height:44px;}.footer-tagline{font-size:11px;margin-bottom:10px;max-width:100%;}.social-label{font-size:8px;margin-bottom:5px;}.social-btn{font-size:9px;padding:0 10px;gap:4px;min-height:36px;}.social-btn svg{width:11px;height:11px;}.social-group{margin-bottom:6px;}.social-row{flex-wrap:nowrap;}.hours-row{font-size:10px;margin-bottom:3px;}.hours-row span:first-child{min-width:36px;}.day-short{display:inline;}.day-full{display:none;}.contact-title-row{flex-direction:column;align-items:flex-start;gap:4px;margin-bottom:10px;}.contact-item p{font-size:11px;}.contact-phone-inline{font-size:11px;}.footer-links li{margin-bottom:6px;}.footer-links a{font-size:11px;}.footer-col-title{font-size:10px;margin-bottom:8px;}.footer-brand~div:last-of-type{grid-column:1/-1;}.footer-bottom{flex-direction:column;align-items:flex-start;gap:6px;padding:12px 0;}.footer-copy,.footer-bottom-links a{font-size:10px;}}
  `;
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

  /* ════════ ICONS ════════ */
  var icoTruck='<img src="https://rlsh1855.github.io/3Js-and-RLSH-Website/images/my-garage-icon.png" alt="" width="32" height="32">';
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
  '</header>'+
  '<div class="ss-spacer"></div>'+
  '<div class="ss-scrim" id="ssScrim"></div>'+
  '<div class="ss-garage-ov" id="ssGarageOv"><iframe class="ss-garage-frame" id="ssGarageFrame" title="My Garage"></iframe></div>';

  /* ════════ FOOTER HTML ════════ */
  var footer = `<footer class="footer">
  <div class="footer-top">
    <div class="footer-brand">
      <div class="footer-logos">
        <img src="https://rlsh1855.github.io/3Js-and-RLSH-Website/3js-logo-white.webp" alt="3J's Auto Body &amp; Paint" loading="lazy" class="footer-logo">
        <img src="https://rlsh1855.github.io/3Js-and-RLSH-Website/rlsh-logo-white.webp" alt="Rhino Linings of Signal Hill" loading="lazy" class="footer-logo">
      </div>
      <p class="footer-tagline">Signal Hill's trusted auto body, paint, and truck accessory shop. Serving the community since day one.</p>
      <div class="social-group">
        <p class="social-label">RLSH — Rhino Linings</p>
        <div class="social-row">
          <a class="social-btn" href="https://www.instagram.com/rlofsignalhill/" target="_top">
            <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            Instagram
          </a>
          <a class="social-btn" href="https://www.facebook.com/RLsignalhill/" target="_top">
            <svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Facebook
          </a>
          <a class="social-btn" href="https://www.yelp.com/biz/rhino-linings-of-signal-hill-signal-hill-3" target="_top">
            <svg viewBox="0 0 24 24"><path d="M20.16 12.594l-4.995 1.433c-.96.275-1.854-.8-1.29-1.67l2.718-4.416c.564-.917 1.88-.57 1.976.51l.57 4.143zM12.16 19.594l-1.98 4.687c-.39.925-1.688.925-2.078 0L6.12 19.594c-.39-.924.39-1.924 1.388-1.737l3.264.617c.998.188 1.776 1.188 1.388 2.12zm-7.12-8.344L.946 9.816C.024 9.44 0 8.152.91 7.73l4.375-2.016c.91-.42 1.854.44 1.584 1.404L5.71 11.25c-.27.964-1.584 1.14-2.67 0zm5.484-9.984L8.336 5.57c-.39.924-1.688.924-2.078 0L4.27 1.266C3.88.342 4.66-.657 5.66-.47l3.264.617c.998.188 1.428 1.188 1.6 1.12zM14.16 7.97l2.718-4.416c.564-.917-.096-2.063-1.17-1.917L10.87.52c-.96-.137-1.584.87-1.02 1.64l4.32 5.81z"/></svg>
            Yelp
          </a>
        </div>
      </div>
      <div class="social-group">
        <p class="social-label">3J's Auto Body</p>
        <div class="social-row">
          <a class="social-btn" href="https://www.instagram.com/3jsautobody/" target="_top">
            <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            Instagram
          </a>
          <a class="social-btn" href="https://www.facebook.com/3jsAutoBodyPaintInc/" target="_top">
            <svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Facebook
          </a>
          <a class="social-btn" href="https://www.yelp.com/biz/3-js-auto-body-and-paint-signal-hill-3" target="_top">
            <svg viewBox="0 0 24 24"><path d="M20.16 12.594l-4.995 1.433c-.96.275-1.854-.8-1.29-1.67l2.718-4.416c.564-.917 1.88-.57 1.976.51l.57 4.143zM12.16 19.594l-1.98 4.687c-.39.925-1.688.925-2.078 0L6.12 19.594c-.39-.924.39-1.924 1.388-1.737l3.264.617c.998.188 1.776 1.188 1.388 2.12zm-7.12-8.344L.946 9.816C.024 9.44 0 8.152.91 7.73l4.375-2.016c.91-.42 1.854.44 1.584 1.404L5.71 11.25c-.27.964-1.584 1.14-2.67 0zm5.484-9.984L8.336 5.57c-.39.924-1.688.924-2.078 0L4.27 1.266C3.88.342 4.66-.657 5.66-.47l3.264.617c.998.188 1.428 1.188 1.6 1.12zM14.16 7.97l2.718-4.416c.564-.917-.096-2.063-1.17-1.917L10.87.52c-.96-.137-1.584.87-1.02 1.64l4.32 5.81z"/></svg>
            Yelp
          </a>
        </div>
      </div>
    </div>
    <div>
      <p class="footer-col-title">Quick Links</p>
      <ul class="footer-links">
        <li><a href="https://www.3jsautobody.com/" target="_top">Home</a></li>
        <li><a href="https://www.3jsautobody.com/body-paint-repairs" target="_top">Body &amp; Paint Repairs</a></li>
        <li><a href="https://www.3jsautobody.com/rhino-liner" target="_top">Rhino Linings</a></li>
        <li><a href="https://www.3jsautobody.com/exterior-accessories" target="_top">Truck &amp; SUV Accessories</a></li>
        <li><a href="https://www.3jsautobody.com/request-a-quote" target="_top">Get a Quote</a></li>
      </ul>
    </div>
    <div>
      <p class="footer-col-title">Hours</p>
      <div class="hours-row"><span><span class="day-full">Monday</span><span class="day-short">Mon</span></span><span>8AM &ndash; 5PM</span></div>
      <div class="hours-row"><span><span class="day-full">Tuesday</span><span class="day-short">Tue</span></span><span>8AM &ndash; 5PM</span></div>
      <div class="hours-row"><span><span class="day-full">Wednesday</span><span class="day-short">Wed</span></span><span>8AM &ndash; 5PM</span></div>
      <div class="hours-row"><span><span class="day-full">Thursday</span><span class="day-short">Thu</span></span><span>8AM &ndash; 5PM</span></div>
      <div class="hours-row"><span><span class="day-full">Friday</span><span class="day-short">Fri</span></span><span>8AM &ndash; 5PM</span></div>
      <div class="hours-row"><span><span class="day-full">Saturday</span><span class="day-short">Sat</span></span><span class="hours-closed">Closed</span></div>
      <div class="hours-row"><span><span class="day-full">Sunday</span><span class="day-short">Sun</span></span><span class="hours-closed">Closed</span></div>
    </div>
    <div>
      <div class="contact-title-row">
        <p class="footer-col-title" style="margin-bottom:0;">Contact Us</p>
        <span class="contact-phone-inline">
          <svg viewBox="0 0 24 24" style="width:11px;height:11px;fill:#8B0000;vertical-align:middle;margin-right:4px;"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
          <a href="tel:+15624246744">(562) 424-6744</a>
        </span>
      </div>
      <div class="contact-details">
        <div class="contact-item">
          <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
          <p>1855 East 29th Street<br>Signal Hill, CA 90755</p>
        </div>
        <div class="contact-item">
          <svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
          <p><a href="mailto:info@3jsautobody.com">info@3jsautobody.com</a></p>
        </div>
      </div>
    </div>
  </div>
  <div class="footer-bottom">
    <p class="footer-copy">&copy; 2025 <span>3J's Auto Body &amp; Paint</span>. All rights reserved.</p>
    <div class="footer-bottom-links">
      <a href="https://www.3jsautobody.com/privacy-policy" target="_top">Privacy Policy</a>
      <a href="https://www.3jsautobody.com/terms-conditions" target="_top">Terms of Service</a>
    </div>
  </div>
</footer>`;

  var ssChevR = '<svg width="8" height="14" viewBox="0 0 8 14" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 1l6 6-6 6"/></svg>';
  var ssChevD = '<svg width="11" height="7" viewBox="0 0 11 7" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 1 5.5 6 10 1" stroke="rgba(0,0,0,0.28)"/></svg>';
  var ssChevSub = '<svg width="6" height="10" viewBox="0 0 8 14" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 1l6 6-6 6"/></svg>';

  var ssDrawerHTML =
    '<div class="ss-drawer" id="ssDrawer" aria-label="Mobile navigation" aria-hidden="true">'+
      '<button class="ssd-x" id="ssDrawerClose" aria-label="Close menu">&#x2715;</button>'+
      '<div class="ssd-scroll" id="ssdScroll">'+
          '<div class="ssd-editorial" id="ssdEditorial">'+
            '<div class="ssd-editorial-top-bar"></div>'+
            '<div class="ssd-editorial-body">'+
              '<div class="ssd-eyebrow">Body &amp; Paint &middot; Signal Hill &middot; Est. 1995</div>'+
              '<div class="ssd-headline">We Restore.<br><span>You Drive.</span></div>'+
              '<div class="ssd-em-dash"></div>'+
              '<div class="ssd-tagline"><span id="ssdTagwriter"></span><span class="ssd-tagline-cursor">&thinsp;</span></div>'+
            '</div>'+
          '</div>'+
          '<div class="ssd-divider"></div>'+
          '<button class="ssd-garage" id="ss-mob-garage-btn">'+
            '<span class="ssd-garage-icon">'+icoTruck+'</span>'+
            '<span class="ssd-garage-val" id="ssMobGarageVeh">My Garage</span>'+
            '<span class="ssd-garage-arr">'+ssChevR+'</span>'+
          '</button>'+
          '<div class="ssd-nav">'+
            '<div class="ssd-section"><span>Navigate</span></div>'+
            '<a href="/" class="ssd-item" target="_top"><div class="ssd-item-text"><span class="ssd-item-label">Home</span><span class="ssd-item-desc">Start here</span></div><span class="ssd-item-arr">'+ssChevR+'</span></a>'+
            '<a href="/inside-3js" class="ssd-item" target="_top"><div class="ssd-item-text"><span class="ssd-item-label">Inside 3J\'s</span><span class="ssd-item-desc">Our story &amp; team</span></div><span class="ssd-item-arr">'+ssChevR+'</span></a>'+
            '<a href="/body-paint-repairs" class="ssd-item" target="_top"><div class="ssd-item-text"><span class="ssd-item-label">Body &amp; Paint</span><span class="ssd-item-desc">Collision repair &middot; paint matching</span></div><span class="ssd-item-arr">'+ssChevR+'</span></a>'+
            '<button class="ssd-item" id="ssd-acc-btn" aria-expanded="false"><div class="ssd-item-text"><span class="ssd-item-label">Truck Accessories</span><span class="ssd-item-desc">Liners, covers, steps &amp; more</span></div><span class="ssd-item-arr" id="ssd-acc-arr">'+ssChevD+'</span></button>'+
            '<div class="ssd-sub" id="ssd-acc-sub">'+
              '<div class="ssd-sub-inner">'+
                '<div class="ssd-sub-bar" id="ssd-acc-bar"></div>'+
                '<span class="ssd-sub-label">Bed Protection</span>'+
                '<a href="/rhino-liner" class="ssd-sub-item" target="_top">Rhino Liner'+ssChevSub+'</a>'+
                '<a href="/floor-liners" class="ssd-sub-item" target="_top">Floor Liners'+ssChevSub+'</a>'+
                '<span class="ssd-sub-label">Covers &amp; Steps</span>'+
                '<a href="/tonneau-covers" class="ssd-sub-item" target="_top">Tonneau Covers'+ssChevSub+'</a>'+
                '<a href="/steps-running-boards" class="ssd-sub-item" target="_top">Steps &amp; Running Boards'+ssChevSub+'</a>'+
                '<a href="/towing-hitches" class="ssd-sub-item" target="_top">Towing &amp; Hitches'+ssChevSub+'</a>'+
                '<a href="/lighting" class="ssd-sub-item" target="_top">Lighting'+ssChevSub+'</a>'+
                '<a href="/headache-racks" class="ssd-sub-item" target="_top">Headache Racks'+ssChevSub+'</a>'+
                '<div class="ssd-sub-spacer"></div>'+
              '</div>'+
            '</div>'+
            '<button class="ssd-item" id="ssd-areas-btn" aria-expanded="false"><div class="ssd-item-text"><span class="ssd-item-label">Areas We Service</span><span class="ssd-item-desc">Greater Signal Hill area</span></div><span class="ssd-item-arr" id="ssd-areas-arr">'+ssChevD+'</span></button>'+
            '<div class="ssd-sub" id="ssd-areas-sub">'+
              '<div class="ssd-sub-inner">'+
                '<div class="ssd-sub-bar" id="ssd-areas-bar"></div>'+
                '<span class="ssd-sub-label">South Bay</span>'+
                '<a href="https://rlsh1855.github.io/RLSH1855-3js-seo-pages/SERVICE_AREA_LONG_BEACH.html" class="ssd-sub-item" target="_top">Long Beach'+ssChevSub+'</a>'+
                '<a href="https://rlsh1855.github.io/RLSH1855-3js-seo-pages/SERVICE_AREA_TORRANCE.html" class="ssd-sub-item" target="_top">Torrance'+ssChevSub+'</a>'+
                '<a href="https://rlsh1855.github.io/RLSH1855-3js-seo-pages/SERVICE_AREA_CARSON.html" class="ssd-sub-item" target="_top">Carson'+ssChevSub+'</a>'+
                '<a href="https://rlsh1855.github.io/RLSH1855-3js-seo-pages/SERVICE_AREA_LAKEWOOD.html" class="ssd-sub-item" target="_top">Lakewood'+ssChevSub+'</a>'+
                '<span class="ssd-sub-label">Southeast LA</span>'+
                '<a href="https://rlsh1855.github.io/RLSH1855-3js-seo-pages/SERVICE_AREA_COMPTON.html" class="ssd-sub-item" target="_top">Compton'+ssChevSub+'</a>'+
                '<a href="https://rlsh1855.github.io/RLSH1855-3js-seo-pages/SERVICE_AREA_DOWNEY.html" class="ssd-sub-item" target="_top">Downey'+ssChevSub+'</a>'+
                '<a href="https://rlsh1855.github.io/RLSH1855-3js-seo-pages/SERVICE_AREA_BELLFLOWER.html" class="ssd-sub-item" target="_top">Bellflower'+ssChevSub+'</a>'+
                '<div class="ssd-sub-spacer"></div>'+
              '</div>'+
            '</div>'+
            '<div class="ssd-section"><span>More</span></div>'+
            '<a href="/bundles" class="ssd-item" target="_top"><div class="ssd-item-text"><span class="ssd-item-label">Bundles &amp; Packages</span><span class="ssd-item-desc">Best value combinations</span></div><span class="ssd-item-arr">'+ssChevR+'</span></a>'+
            '<a href="/shop" class="ssd-item" target="_top"><div class="ssd-item-text"><span class="ssd-item-label">Shop</span><span class="ssd-item-desc">Browse all products</span></div><span class="ssd-item-arr">'+ssChevR+'</span></a>'+
            '<a href="/contact" class="ssd-item" target="_top"><div class="ssd-item-text"><span class="ssd-item-label">Contact Us</span><span class="ssd-item-desc">Get in touch &middot; 562-424-6744</span></div><span class="ssd-item-arr">'+ssChevR+'</span></a>'+
            '<a href="/FAQ_PAGE_V2" class="ssd-item" target="_top"><div class="ssd-item-text"><span class="ssd-item-label">FAQ</span><span class="ssd-item-desc">Common questions answered</span></div><span class="ssd-item-arr">'+ssChevR+'</span></a>'+
          '</div>'+
        '</div>'+
        '<div class="ssd-footer" id="ssdFooter">'+
            '<div class="ssd-brand-line"><div class="ssd-brand-dot"></div><span class="ssd-brand-text">3J\'S AUTO BODY &middot; RHINO LININGS OF SIGNAL HILL</span></div>'+
            '<div class="ssd-footer-btns">'+
              '<a href="https://www.3jsautobody.com/rhino-lining-quote" class="ssd-cta-red ss-sheen-red" target="_top">'+
                '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-10 2a2 2 0 100 4 2 2 0 000-4z"/></svg>'+
                'Bed-Liner Quote'+
              '</a>'+
              '<a href="https://www.carwise.com/online-photo-estimate/3js-autobody-paint-inc-signal-hill-ca-90755/479382?source=shop.profile&referer=estimate.cccone.com" class="ssd-cta-outline ss-sheen-outline" target="_top">'+
                '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>'+
                'Free Auto Body Estimate'+
              '</a>'+
            '</div>'+
            '<div class="ssd-contact">562-424-6744 &nbsp;&middot;&nbsp; Mon&ndash;Fri 8AM&ndash;5PM</div>'+
        '</div>'+
    '</div>'+
    '<div class="ss-drawer-ov" id="ssDrawerOv"></div>';

  document.body.insertAdjacentHTML('afterbegin', header);
  document.body.insertAdjacentHTML('beforeend', footer);
  // Wrap body content for the scale effect
  var ssWrap = document.createElement('div');
  ssWrap.id = 'ss-page-wrap';
  var ssNodes = Array.prototype.slice.call(document.body.childNodes);
  ssNodes.forEach(function(n){ ssWrap.appendChild(n); });
  document.body.appendChild(ssWrap);
  // Inject drawer + overlay outside wrap
  document.body.insertAdjacentHTML('beforeend', ssDrawerHTML);

  /* ════════ SPACER = EXACT HEADER HEIGHT (kills the blank strip on every page) ════════ */
  (function(){
    var shell=document.getElementById('ssShell');
    var spacer=document.querySelector('.ss-spacer');
    if(!shell||!spacer) return;
    function fit(){
      /* only measure in the full (un-shrunk) state so the spacer always clears the tallest header */
      if(shell.classList.contains('ss-shrunk')) return;
      spacer.style.height=shell.offsetHeight+'px';
    }
    fit();
    window.addEventListener('load',fit);
    window.addEventListener('resize',fit);
    /* fonts/logos can change header height after first paint */
    [120,400,900,2000].forEach(function(t){setTimeout(fit,t);});
    if(document.fonts&&document.fonts.ready){document.fonts.ready.then(fit);}
  })();

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

  /* ════════ DRAWER OPEN / CLOSE ════════ */
  (function(){
    var burger=document.getElementById('ssBurger');
    var drawer=document.getElementById('ssDrawer');
    var ov=document.getElementById('ssDrawerOv');
    var closeBtn=document.getElementById('ssDrawerClose');

    var ssTwTimer=null, ssTwInterval=null;

    function ssTwStart(){
      var el=document.getElementById('ssdTagwriter');
      if(!el) return;
      clearTimeout(ssTwTimer); clearInterval(ssTwInterval);
      el.textContent='';
      var text='“Meeting great people by accident”';
      var i=0;
      ssTwTimer=setTimeout(function(){
        ssTwInterval=setInterval(function(){
          i++; el.textContent=text.slice(0,i);
          if(i>=text.length) clearInterval(ssTwInterval);
        }, 38);
      }, 280);
    }

    function ssTwStop(){
      clearTimeout(ssTwTimer); clearInterval(ssTwInterval);
      var el=document.getElementById('ssdTagwriter');
      if(el) el.textContent='';
    }

    function ssOpenDrawer(){
      document.body.classList.remove('ss-menu-closing');
      document.body.classList.add('ss-menu-open');
      if(drawer) drawer.setAttribute('aria-hidden','false');
      if(burger){ burger.classList.add('ss-open'); burger.setAttribute('aria-expanded','true'); }
      document.body.style.overflow='hidden';
      if(drawer){
        var items=drawer.querySelectorAll('.ssd-editorial,.ssd-garage,.ssd-section,.ssd-item,.ssd-footer');
        items.forEach(function(el){
          el.style.opacity='0'; el.style.transform='translateX(-12px)'; el.style.transition='none';
        });
        setTimeout(function(){
          items.forEach(function(el,i){
            setTimeout(function(){
              el.style.transition='opacity .5s ease,transform .6s cubic-bezier(.22,1,.36,1)';
              el.style.opacity='1'; el.style.transform='translateX(0)';
            }, i*45);
          });
          ssTwStart();
        }, 260);
      }
    }

    function ssCloseDrawer(){
      ssTwStop();
      if(drawer){
        var items=drawer.querySelectorAll('.ssd-editorial,.ssd-garage,.ssd-section,.ssd-item,.ssd-footer');
        items.forEach(function(el){ el.style.opacity='0'; el.style.transform='translateX(-12px)'; el.style.transition='none'; });
      }
      document.body.classList.add('ss-menu-closing');
      requestAnimationFrame(function(){ requestAnimationFrame(function(){
        document.body.classList.remove('ss-menu-open');
      }); });
      if(burger){ burger.classList.remove('ss-open'); burger.setAttribute('aria-expanded','false'); }
      document.body.style.overflow='';
      setTimeout(function(){
        document.body.classList.remove('ss-menu-closing');
        if(drawer) drawer.setAttribute('aria-hidden','true');
      }, 500);
    }

    if(burger) burger.addEventListener('click',ssOpenDrawer);
    if(ov) ov.addEventListener('click',ssCloseDrawer);
    if(closeBtn) closeBtn.addEventListener('click',ssCloseDrawer);
    document.addEventListener('keydown',function(e){ if(e.key==='Escape') ssCloseDrawer(); });

    // Accordion toggles with cinematic animations
    function initAcc(btnId,subId,barId){
      var btn=document.getElementById(btnId);
      var sub=document.getElementById(subId);
      var bar=barId?document.getElementById(barId):null;
      if(!btn||!sub) return;
      btn.addEventListener('click',function(){
        var open=sub.classList.toggle('ssd-sub-open');
        btn.classList.toggle('ssd-open',open);
        btn.setAttribute('aria-expanded',open?'true':'false');
        if(open){
          // Draw bar
          if(bar){bar.classList.remove('ss-drawn');void bar.offsetWidth;bar.classList.add('ss-drawn');}
          // Scan line
          var existing=sub.querySelector('.ssd-scan-line');
          if(existing) existing.remove();
          var scan=document.createElement('div');
          scan.className='ssd-scan-line';
          var inner=sub.querySelector('.ssd-sub-inner');
          if(inner) inner.appendChild(scan);
          setTimeout(function(){if(scan.parentNode)scan.remove();},700);
          // Fade-in sub-labels
          sub.querySelectorAll('.ssd-sub-label').forEach(function(el,i){
            el.classList.remove('ss-fadein');void el.offsetWidth;
            el.style.animationDelay=(i*80+80)+'ms';
            el.classList.add('ss-fadein');
          });
          // Slide-in sub-items
          sub.querySelectorAll('.ssd-sub-item').forEach(function(el,i){
            el.classList.remove('ss-slidein');void el.offsetWidth;
            el.style.animationDelay=(i*45+100)+'ms';
            el.classList.add('ss-slidein');
          });
        }
      });
    }
    initAcc('ssd-acc-btn','ssd-acc-sub','ssd-acc-bar');
    initAcc('ssd-areas-btn','ssd-areas-sub','ssd-areas-bar');
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
    s.src='mega-menu.js';
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

    /* ── SHARED GARAGE ACCESSOR ── single source of truth for the saved truck.
       Every page reads/writes the vehicle through this so the flow stays seamless. */
    window.RLSHGarage=(function(){
      var KEY='garage_vehicle';
      function get(){try{var s=localStorage.getItem(KEY);return s?JSON.parse(s):null;}catch(e){return null;}}
      function buildLabel(v){
        if(!v||!v.year) return '';
        return v.year+' '+v.make+' '+v.model+(v.trim?' — '+v.trim:'');
      }
      function set(obj){
        if(!obj||typeof obj!=='object') return null;
        var cur=get()||{};
        // If the vehicle identity changed, drop trim/bed/color so they can't bleed across trucks.
        if((obj.make&&obj.make!==cur.make)||(obj.model&&obj.model!==cur.model)){
          cur.trim='';cur.bedSize='';cur.color='';
        }
        var merged=Object.assign({},cur,obj);
        merged.label=buildLabel(merged);
        try{localStorage.setItem(KEY,JSON.stringify(merged));}catch(e){}
        try{window.dispatchEvent(new Event('garageUpdated'));}catch(e){}
        return merged;
      }
      function clear(){
        try{localStorage.removeItem(KEY);}catch(e){}
        try{window.dispatchEvent(new Event('garageUpdated'));}catch(e){}
      }
      function subscribe(cb){
        window.addEventListener('storage',function(e){if(e.key===KEY)cb(get());});
        window.addEventListener('garageUpdated',function(){cb(get());});
      }
      // "2021 Ford F-150 XLT" style string for pre-filling the quote form
      function vehicleString(){var v=get();return v?buildLabel(v):'';}
      return {get:get,set:set,clear:clear,subscribe:subscribe,vehicleString:vehicleString,KEY:KEY};
    })();
    window.addEventListener('message',function(e){
      var d; try{ d=typeof e.data==='string'?JSON.parse(e.data):e.data; }catch(ex){ return; }
      if(!d||!d.type) return;
      if(d.type==='garage_saved'){ sync(); closeGarage(); }
      else if(d.type==='garage_clear'){ sync(); }
      else if(d.type==='close_garage'){ closeGarage(); }
      else if(d.type==='browse_accessories'){ closeGarage(); window.location.href='/exterior-accessories-V2'; }
    });
  })();

  /* ════════ SCROLL-REVEAL (sitewide, non-catalog) ════════
     Approved fade-up reveal from effects-sandbox. Auto-applies to section content
     blocks on pages that don't already animate; leaves explicitly-tagged pages alone.
     Hide-CSS is injected by JS so a script failure never leaves content hidden. */
  (function(){
    var p=(location.pathname||'').toLowerCase();
    /* skip catalog / faceted-sidebar pages */
    if(/shop|parts-catalog|product-detail|catalog/.test(p)) return;
    if(document.querySelector('.facets,.facet-rail,.filter-sidebar,[data-facets]')) return;
    if(window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;

    function init(){
      /* leave pages that already declare their own reveal targets untouched */
      if(document.querySelector('[data-anim]')) return;
      var targets=[];
      var bands=document.querySelectorAll('section,.strip');
      Array.prototype.forEach.call(bands,function(sec){
        if(sec.closest('#ssShell')||sec.closest('.footer')) return;
        if(/hero/i.test(sec.className||'')) return;            /* heroes keep their own entrance */
        /* unwrap a single inner container so we stagger the real content blocks */
        var inner=sec;
        if(sec.children.length===1 && sec.firstElementChild && sec.firstElementChild.children.length>1) inner=sec.firstElementChild;
        var i=0;
        Array.prototype.forEach.call(inner.children,function(k){
          var tag=k.tagName;
          if(tag==='SCRIPT'||tag==='STYLE'||tag==='BR') return;
          if(k.matches&&k.matches('section,.strip')) return;   /* nested bands reveal on their own — never twice */
          k.setAttribute('data-anim','fade-up');
          var d=Math.min(i*110,330); if(d) k.setAttribute('data-delay',String(d));
          targets.push(k); i++;
        });
      });
      if(!targets.length) return;
      var css='[data-anim]{opacity:0;transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1);}'
        +'[data-anim="fade-up"]{transform:translateY(30px);}[data-anim="fade-in"]{transform:none;}'
        +'[data-anim].ss-vis{opacity:1;transform:none;}'
        +'[data-delay="110"]{transition-delay:.11s}[data-delay="220"]{transition-delay:.22s}[data-delay="330"]{transition-delay:.33s}';
      var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
      if(!('IntersectionObserver' in window)){targets.forEach(function(t){t.classList.add('ss-vis');});return;}
      var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('ss-vis');io.unobserve(e.target);}});},{threshold:0.12,rootMargin:'0px 0px -7% 0px'});
      targets.forEach(function(t){io.observe(t);});
    }
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
  })();

})();
