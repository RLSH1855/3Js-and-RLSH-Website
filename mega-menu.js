/* 3J's AutoBody — Mega Menu Inject
 * Drop this via Wix Settings → Custom Code (body, all pages).
 * Finds the 3 Wix nav triggers by text, positions panels below the nav bar.
 */
(function () {
  'use strict';
  if (window.__jjMegaLoaded) return;
  window.__jjMegaLoaded = true;

  /* ── 1. GOOGLE FONTS ───────────────────────────────────────────────── */
  if (!document.querySelector('#jj-mega-fonts')) {
    var lnk = document.createElement('link');
    lnk.id = 'jj-mega-fonts';
    lnk.rel = 'stylesheet';
    lnk.href = 'https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Barlow:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';
    document.head.appendChild(lnk);
  }

  /* ── 2. CSS ────────────────────────────────────────────────────────── */
  var css = [
    ':root{--jj-red:#8b0000;--jj-red-hot:#b3000a;--jj-gold:#d9a441;--jj-nav:#0b1220;--jj-panel:#fff;--jj-soft:#f3f4f6;--jj-ink:#0b1220;--jj-mute:#5b6473;--jj-line:rgba(255,255,255,0.08);}',

    /* container */
    '#jj-mega-host{position:fixed;left:0;right:0;z-index:999999;pointer-events:none;}',

    /* panel */
    '.jj-mega{background:var(--jj-panel);color:var(--jj-ink);box-shadow:0 8px 32px rgba(0,0,0,.22),0 3px 6px rgba(0,0,0,.14);overflow:hidden;transform-origin:top center;opacity:0;transform:translateY(-12px) scaleY(0.97);transition:opacity .38s cubic-bezier(.22,1,.36,1),transform .44s cubic-bezier(.22,1,.36,1);pointer-events:none;max-height:0;display:none;}',
    '.jj-mega.jj-open{opacity:1;transform:translateY(0) scaleY(1);pointer-events:auto;max-height:1200px;display:block;animation:jjSlideDown .44s cubic-bezier(.22,1,.36,1) both;}',
    '@keyframes jjSlideDown{from{opacity:0;transform:translateY(-12px) scaleY(0.97);}to{opacity:1;transform:translateY(0) scaleY(1);}}',

    /* accent bar */
    '.jj-accent{height:4px;background:linear-gradient(90deg,var(--jj-red) 35%,var(--jj-nav) 35%);}',

    /* grid */
    '.jj-grid{display:grid;grid-template-columns:280px 1fr;min-height:360px;}',
    '.jj-mega.jj-compact .jj-grid{grid-template-columns:320px 1fr;}',

    /* feature column */
    '.jj-feat{background:#fff;padding:28px 26px 26px;border-right:2px solid var(--jj-red);display:flex;flex-direction:column;gap:18px;}',
    '.jj-kicker{font-family:"JetBrains Mono",monospace;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--jj-red);}',
    '.jj-feat h2{font-family:"Oswald",sans-serif;text-transform:uppercase;font-weight:700;font-size:34px;line-height:.9;margin:-4px 0 0;color:#0b1220;display:flex;flex-direction:column;gap:2px;}',
    '.jj-feat h2 .jj-r2{color:var(--jj-red);display:inline-flex;align-items:center;gap:12px;}',
    '.jj-feat h2 .jj-big{font-size:1.2em;line-height:.9;letter-spacing:-.015em;display:inline-block;}',
    '.jj-feat h2 .jj-dash{display:inline-block;width:26px;height:5px;background:var(--jj-red);flex-shrink:0;transform:translateY(-3px);}',
    '.jj-feat p{margin:0;color:var(--jj-mute);font-family:"Barlow",sans-serif;font-size:13.5px;line-height:1.55;letter-spacing:.5px;}',
    '.jj-cta{background:var(--jj-red);color:#fff;border:0;padding:12px 22px;font-family:"Oswald",sans-serif;font-weight:600;letter-spacing:.05em;font-size:13px;text-transform:uppercase;cursor:pointer;align-self:flex-start;display:inline-flex;align-items:center;gap:10px;text-decoration:none;box-shadow:0 6px 16px -6px rgba(139,0,0,.55);transition:background .15s;}',
    '.jj-cta:hover{background:var(--jj-red-hot);}',
    '.jj-arrow{width:16px;height:2px;background:currentColor;position:relative;}',
    '.jj-arrow::after{content:"";position:absolute;right:-1px;top:-3px;width:8px;height:8px;border-right:2px solid currentColor;border-top:2px solid currentColor;transform:rotate(45deg);}',
    '.jj-meta{display:flex;align-items:center;gap:10px;font-family:"Oswald",sans-serif;font-size:11px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;color:rgb(112,117,129);}',
    '.jj-pip{width:6px;height:6px;background:var(--jj-red);display:inline-block;flex-shrink:0;}',

    /* icon grid */
    '.jj-icon-hdr{font-family:"Oswald",sans-serif;font-size:10px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:rgb(112,117,129);margin-bottom:-8px;display:flex;align-items:center;gap:8px;}',
    '.jj-icon-hdr::before,.jj-icon-hdr::after{content:"";flex:1;height:1px;background:rgba(11,18,32,.12);}',
    '.jj-icon-grid{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:1px;background:rgba(11,18,32,.12);border:1px solid rgba(11,18,32,.12);}',
    '.jj-icon-cell{background:#fff;padding:12px 8px 10px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;text-align:center;}',
    '.jj-icon-cell img{width:44px;height:44px;object-fit:contain;}',
    '.jj-ic-lbl{font-family:"Oswald",sans-serif;font-weight:600;font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:#0b1220;line-height:1.1;}',

    /* tiles */
    '.jj-tiles{padding:24px 28px 28px;display:grid;gap:2px;}',
    '.jj-tiles[data-cols="1"]{grid-template-columns:1fr;}',
    '.jj-tiles[data-cols="3"]{grid-template-columns:repeat(3,1fr);}',
    '.jj-tiles[data-cols="4"]{grid-template-columns:repeat(4,1fr);}',
    '.jj-compact .jj-tiles{padding:28px;gap:16px;}',

    /* tile */
    '.jj-tile{padding:18px 18px 20px;display:grid;grid-template-columns:78px 1fr;gap:14px;align-items:start;background:#f8f9fa;border:1px solid rgba(11,18,32,.12);cursor:pointer;text-decoration:none;color:inherit;transition:background .15s;position:relative;}',
    '.jj-tile:hover{background:#f3f4f6;}',
    '.jj-tile:hover h3{color:var(--jj-red);}',
    '.jj-tile:hover .jj-go{opacity:1;transform:translateX(0);}',
    '.jj-compact .jj-tile{grid-template-columns:150px 1fr;padding:14px;gap:16px;}',

    /* tile img */
    '.jj-timg{aspect-ratio:1/1;width:100%;background:#e7e8ea;border:1px solid rgba(11,18,32,.12);position:relative;overflow:hidden;transition:none!important;}',
    '.jj-timg::before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(45deg,transparent 0 6px,rgba(11,18,32,.05) 6px 7px);}',
    '.jj-timg[style*="background-image"]::before{display:none;}',
    '.jj-timg .jj-tlbl{position:absolute;left:6px;right:6px;bottom:6px;font-family:"JetBrains Mono",monospace;font-size:8px;letter-spacing:.1em;text-transform:uppercase;color:#5b6473;text-align:center;line-height:1.2;}',

    /* tile body */
    '.jj-tbody{padding-top:2px;}',
    '.jj-tile h3{font-family:"Oswald",sans-serif;text-transform:uppercase;font-weight:600;font-size:14px;letter-spacing:.04em;margin:0 0 4px;color:#0b1220;display:flex;align-items:center;gap:8px;transition:color .15s;}',
    '.jj-tile p{margin:0;color:var(--jj-mute);font-family:"Barlow",sans-serif;font-size:12.5px;line-height:1.45;}',
    '.jj-price{margin-top:8px;font-family:"Inter",system-ui,sans-serif;font-size:10px;color:rgb(107,107,107);}',
    '.jj-price b{color:var(--jj-red);font-weight:600;}',
    '.jj-detail{margin-top:8px;padding-top:8px;border-top:1px solid #8b0000;font-family:"Barlow",sans-serif;font-size:11.5px;line-height:1.5;letter-spacing:.3px;color:rgb(70,78,92);}',
    '.jj-detail b{color:#0b1220;font-weight:600;}',
    '.jj-go{position:absolute;top:18px;right:14px;width:22px;height:22px;border-radius:50%;background:var(--jj-red);color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;opacity:0;transform:translateX(-4px);transition:opacity .15s,transform .15s;}',

    /* badges */
    '.jj-new{font-family:"JetBrains Mono",monospace;font-size:8px;letter-spacing:.14em;background:var(--jj-red);color:#fff;padding:2px 5px;}',
    '.jj-premium{font-family:"JetBrains Mono",monospace;font-size:8px;letter-spacing:.14em;background:#0b1220;color:var(--jj-gold);padding:2px 5px;}',
    '.jj-badge{font-family:"JetBrains Mono",monospace;font-size:9px;letter-spacing:.14em;color:#5b6473;}',

    /* social tile */
    '.jj-social-img{background:#0b1220;padding:4px;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:3px;aspect-ratio:1/1;}',
    '.jj-social-img::before{display:none;}',
    '.jj-scell{background:repeating-linear-gradient(45deg,#1a2236 0 4px,#131c30 4px 8px);}',
    '.jj-scell:nth-child(2){background:linear-gradient(135deg,rgba(139,0,0,.5),rgba(139,0,0,0)),repeating-linear-gradient(45deg,#1a2236 0 4px,#131c30 4px 8px);}',
    '.jj-ctag{position:absolute;top:6px;left:6px;background:rgba(11,18,32,.85);color:#fff;font-family:"Oswald",sans-serif;font-size:8px;letter-spacing:.16em;padding:3px 6px;z-index:2;text-transform:uppercase;display:inline-flex;align-items:center;gap:5px;}',
    '.jj-pulse{width:6px;height:6px;background:#ff3b46;box-shadow:0 0 0 0 rgba(255,59,70,.6);animation:jjPulse 1.6s infinite;}',
    '@keyframes jjPulse{0%{box-shadow:0 0 0 0 rgba(255,59,70,.6)}70%{box-shadow:0 0 0 7px rgba(255,59,70,0)}100%{box-shadow:0 0 0 0 rgba(255,59,70,0)}}',
    '.jj-live{font-family:"Oswald",sans-serif;font-size:8px;letter-spacing:.16em;background:var(--jj-red);color:#fff;padding:2px 6px;display:inline-flex;align-items:center;gap:4px;}',
    '.jj-live::before{content:"";width:5px;height:5px;background:#fff;border-radius:50%;animation:jjLive 1.4s infinite;}',
    '@keyframes jjLive{0%,100%{opacity:1}50%{opacity:.3}}',

    /* stats row */
    '.jj-stats{margin-top:10px;display:flex;background:#0b1220;color:#fff;border:1px solid rgba(11,18,32,.18);border-left:3px solid var(--jj-red);}',
    '.jj-stat{flex:1;padding:8px 10px;text-align:center;border-right:1px solid rgba(255,255,255,.08);display:flex;flex-direction:column;gap:2px;}',
    '.jj-stat:last-child{border-right:0;}',
    '.jj-stat .jj-num{font-family:"Oswald",sans-serif;font-weight:700;font-size:16px;line-height:1;color:#fff;letter-spacing:.02em;}',
    '.jj-stat .jj-num.jj-gold{color:var(--jj-gold);}',
    '.jj-stat .jj-slbl{font-family:"Oswald",sans-serif;font-weight:500;font-size:8.5px;letter-spacing:.14em;text-transform:uppercase;color:#b9c0cf;}',

    /* social bar */
    '.jj-socbar{margin-top:10px;padding-top:10px;border-top:1px solid #8b0000;display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;}',
    '.jj-handle{font-family:"Oswald",sans-serif;font-weight:600;letter-spacing:.04em;font-size:12px;color:#0b1220;}',
    '.jj-handle::before{content:"";display:inline-block;width:6px;height:6px;background:var(--jj-red);margin-right:6px;transform:translateY(-1px);}',
    '.jj-plats{display:inline-flex;gap:4px;}',
    '.jj-plat{width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;font-family:"Oswald",sans-serif;font-weight:700;font-size:9px;color:#fff;transition:transform .15s;}',
    '.jj-plat:hover{transform:translateY(-2px);}',
    '.jj-ig{background:linear-gradient(135deg,#833ab4,#fd1d1d 50%,#fcb045);}',
    '.jj-tt{background:#0b1220;box-shadow:inset 1px 1px 0 0 #25f4ee,inset -1px -1px 0 0 #fe2c55;}',
    '.jj-yt{background:#cc0000;}',
    '.jj-fb{background:#1877f2;}',

    /* bundles variant */
    '.jj-mega.jj-bundles .jj-tile{grid-template-columns:1fr;padding:16px;}',
    '.jj-mega.jj-bundles .jj-timg{aspect-ratio:4/3;width:100%;margin-bottom:12px;}',
    '.jj-mega.jj-bundles .jj-tile h3{font-size:16px;}',

    /* exterior variant */
    '.jj-mega.jj-exterior{left:0;right:0;}',
    '.jj-mega.jj-exterior .jj-tile{display:grid;grid-template-columns:150px 1fr;grid-template-areas:"img title" "desc desc";column-gap:18px;row-gap:14px;padding:20px;}',
    '.jj-mega.jj-exterior .jj-timg{grid-area:img;width:100%;aspect-ratio:4/3;margin:0;align-self:start;}',
    '.jj-mega.jj-exterior .jj-tile>h3{grid-area:title;align-self:center;margin:0;}',
    '.jj-mega.jj-exterior .jj-tbody{grid-area:desc;}',
    '.jj-mega.jj-exterior .jj-tbody p{margin:0;font-size:13px;line-height:1.5;color:rgb(70,78,92);}',

    /* footer strip */
    '.jj-foot{background:#121212;color:#b9c0cf;padding:14px 28px;display:flex;align-items:center;justify-content:space-between;gap:24px;font-family:"Barlow",sans-serif;font-size:13px;flex-wrap:nowrap;}',
    '.jj-foot-ctr{flex:1;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-family:"Oswald",sans-serif;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#b9c0cf;}',
    '.jj-foot-ctr b{color:#fff;font-weight:600;}',
    '.jj-foot-ctr .jj-sep{color:var(--jj-red);margin:0 8px;font-weight:700;}',
    '.jj-foot-ctr .jj-addr{text-transform:none;letter-spacing:.02em;color:#8b93a4;font-family:"Barlow",sans-serif;font-weight:400;margin-left:10px;}',
    '.jj-foot-links{display:flex;gap:12px;flex-wrap:wrap;}',
    '.jj-foot-link{color:#fff;text-decoration:none;font-family:"Oswald",sans-serif;text-transform:uppercase;font-size:11px;letter-spacing:.08em;display:inline-flex;align-items:center;gap:8px;cursor:pointer;position:relative;overflow:hidden;padding:9px 14px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.18);backdrop-filter:blur(6px);transition:background .25s,border-color .25s;}',
    '.jj-foot-link:hover{background:rgba(255,255,255,.10);border-color:rgba(255,255,255,.32);}',
    '.jj-foot-link::before{content:"";position:absolute;top:0;bottom:0;left:-120%;width:85%;background:linear-gradient(100deg,rgba(255,255,255,0),rgba(255,255,255,.08) 25%,rgba(255,255,255,.26) 50%,rgba(255,255,255,.08) 75%,rgba(255,255,255,0));transform:skewX(-22deg);pointer-events:none;z-index:-1;animation:jjShine 6s linear infinite;}',
    '.jj-foot-links .jj-foot-link:nth-child(1)::before{animation-delay:0s;}',
    '.jj-foot-links .jj-foot-link:nth-child(2)::before{animation-delay:.85s;}',
    '.jj-foot-links .jj-foot-link:nth-child(3)::before{animation-delay:1.7s;}',
    '@keyframes jjShine{0%{left:-120%}27%{left:130%}100%{left:130%}}',
    '.jj-foot-dot{width:5px;height:5px;background:var(--jj-red);display:inline-block;flex-shrink:0;}',
    '.jj-foot-phone{font-family:"Oswald",sans-serif;color:#fff;font-size:15px;letter-spacing:.04em;white-space:nowrap;}',
    '.jj-foot-phone span{color:var(--jj-red);margin-right:8px;}',
  ].join('');

  var st = document.createElement('style');
  st.id = 'jj-mega-styles';
  st.textContent = css;
  document.head.appendChild(st);

  /* ── 3. HTML PANELS ────────────────────────────────────────────────── */
  var host = document.createElement('div');
  host.id = 'jj-mega-host';
  host.innerHTML = [

    /* RHINO LINER */
    '<div class="jj-mega jj-compact" data-menu="rhino" id="jj-rhino">',
      '<div class="jj-accent"></div>',
      '<div class="jj-grid">',
        '<div class="jj-feat">',
          '<div class="jj-kicker">Rhino Liner Of Signal Hill</div>',
          '<h2><span>Rhino <span class="jj-big">Tough.</span></span><span class="jj-r2"><i class="jj-dash"></i>Enough Said.</span></h2>',
          '<p>The original spray-on bed liner. Permanently bonded, UV-stable, and backed by a nationwide lifetime warranty. Installed in-house by certified techs.</p>',
          '<a href="https://www.3jsautobody.com/request-a-quote" class="jj-cta">Get A Quote <span class="jj-arrow"></span></a>',
          '<div class="jj-icon-hdr">Certified Resistant To</div>',
          '<div class="jj-icon-grid">',
            '<div class="jj-icon-cell"><img src="https://rlsh1855.github.io/3Js-and-RLSH-Website/Chemical%20Resistant.png" alt="Chemical Resistant"><div class="jj-ic-lbl">Chemical</div></div>',
            '<div class="jj-icon-cell"><img src="https://rlsh1855.github.io/3Js-and-RLSH-Website/Impact%20Resistant.png" alt="Impact Resistant"><div class="jj-ic-lbl">Impact</div></div>',
            '<div class="jj-icon-cell"><img src="https://rlsh1855.github.io/3Js-and-RLSH-Website/Abrasion%20Resistant.png" alt="Abrasion Resistant"><div class="jj-ic-lbl">Abrasion</div></div>',
            '<div class="jj-icon-cell"><img src="https://rlsh1855.github.io/3Js-and-RLSH-Website/SlipResistant.png" alt="Slip Resistant"><div class="jj-ic-lbl">Slip</div></div>',
          '</div>',
          '<div class="jj-meta"><span class="jj-pip"></span> Same-day installs available</div>',
        '</div>',
        '<div class="jj-tiles" data-cols="1">',
          '<a href="https://www.3jsautobody.com/request-a-quote" class="jj-tile">',
            '<div class="jj-timg" style="background-image:url(\'https://rlsh1855.github.io/3Js-and-RLSH-Website/Bedliner-Jeep_exterior.webp\');background-size:cover;background-position:center;"></div>',
            '<div class="jj-tbody">',
              '<h3>Rhino Liner Quote <span class="jj-new">FAST</span></h3>',
              '<p>Get a no-obligation, online quote for your truck bed in under 60 seconds — pick your make, model, and bed size.</p>',
              '<div class="jj-price">Starting at <b>$549</b> &middot; LIFETIME WARRANTY</div>',
              '<div class="jj-detail"><b>Premium spray-on bedliner protection</b> built to resist <b>scratches, dents, corrosion</b> and daily wear. Creates a <b>tough, factory-style finish</b> that shields your truck bed and exterior surfaces from impact and harsh conditions.</div>',
            '</div>',
            '<span class="jj-go">&rarr;</span>',
          '</a>',
          '<a href="https://www.3jsautobody.com/our-work" class="jj-tile">',
            '<div class="jj-timg jj-social-img">',
              '<span class="jj-ctag"><span class="jj-pulse"></span>LIVE</span>',
              '<div class="jj-scell"></div><div class="jj-scell"></div><div class="jj-scell"></div><div class="jj-scell"></div>',
            '</div>',
            '<div class="jj-tbody">',
              '<h3>Our Work <span class="jj-live">FRESH INSTALLS</span></h3>',
              '<p>See real customer trucks rolling out of our Signal Hill bay — daily reels, before/afters &amp; behind-the-scenes builds.</p>',
              '<div class="jj-stats">',
                '<div class="jj-stat"><span class="jj-num">200+</span><span class="jj-slbl">Makes</span></div>',
                '<div class="jj-stat"><span class="jj-num">1,200+</span><span class="jj-slbl">Jobs</span></div>',
                '<div class="jj-stat"><span class="jj-num jj-gold">4.9&#9733;</span><span class="jj-slbl">Avg Rating</span></div>',
              '</div>',
              '<div class="jj-socbar">',
                '<span class="jj-handle">@3jsautobody</span>',
                '<span class="jj-plats"><span class="jj-plat jj-ig">IG</span><span class="jj-plat jj-tt">TT</span><span class="jj-plat jj-yt">YT</span><span class="jj-plat jj-fb">FB</span></span>',
              '</div>',
            '</div>',
            '<span class="jj-go">&rarr;</span>',
          '</a>',
        '</div>',
      '</div>',
      '<div class="jj-foot">',
        '<div class="jj-foot-links">',
          '<a href="https://www.3jsautobody.com/request-a-quote" class="jj-foot-link"><span class="jj-foot-dot"></span> Schedule an install</a>',
          '<a href="https://www.3jsautobody.com/rhino-liner" class="jj-foot-link"><span class="jj-foot-dot"></span> Color options</a>',
          '<a href="https://www.3jsautobody.com/returns-warranties" class="jj-foot-link"><span class="jj-foot-dot"></span> Warranty info</a>',
        '</div>',
        '<div class="jj-foot-ctr"><b>3J\'s Auto Body</b><span class="jj-sep">|</span><b>Rhino Linings of Signal Hill</b><span class="jj-addr">1855 E 29th St Ste A, Signal Hill, CA 90755</span></div>',
        '<div class="jj-foot-phone"><span>&#9679;</span> CALL (562) 424-6744</div>',
      '</div>',
    '</div>',

    /* BUNDLES & PACKAGES */
    '<div class="jj-mega jj-bundles" data-menu="bundles" id="jj-bundles">',
      '<div class="jj-accent"></div>',
      '<div class="jj-grid">',
        '<div class="jj-feat">',
          '<div class="jj-kicker">Pre-Built Packages</div>',
          '<h2><span>Save With A</span><span class="jj-r2"><i class="jj-dash"></i>Bundle</span></h2>',
          '<p>Hand-picked combos of our most-installed upgrades. One quote, one install day, one warranty — and meaningful savings vs. ordering &agrave; la carte.</p>',
          '<a href="https://www.3jsautobody.com/bundles" class="jj-cta">Compare Bundles <span class="jj-arrow"></span></a>',
          '<div class="jj-meta"><span class="jj-pip"></span> Up to $1,400 off retail</div>',
        '</div>',
        '<div class="jj-tiles" data-cols="4">',
          '<a href="https://www.3jsautobody.com/the-405-essentials" class="jj-tile">',
            '<div class="jj-timg" style="background-image:url(\'https://rlsh1855.github.io/3Js-and-RLSH-Website/405%20ESSENTIALS%20METAL%20CARD.png\');background-size:cover;background-position:center;"></div>',
            '<div class="jj-tbody"><h3>The 405 Essential <span class="jj-badge">3 ITEMS</span></h3><p>Bed liner, tonneau cover &amp; floor liners — the daily-driver starter kit.</p><div class="jj-price">Starting at <b>$1,299</b></div></div>',
          '</a>',
          '<a href="https://www.3jsautobody.com/the-working-man" class="jj-tile">',
            '<div class="jj-timg" style="background-image:url(\'https://rlsh1855.github.io/3Js-and-RLSH-Website/WORKING%20MAN%20METAL%20CARD-1.png\');background-size:cover;background-position:center;"></div>',
            '<div class="jj-tbody"><h3>The Working Man <span class="jj-badge">4 ITEMS</span></h3><p>Built for tradesmen — liner, towing pkg, running boards &amp; bed organizer.</p><div class="jj-price">Starting at <b>$1,899</b></div></div>',
          '</a>',
          '<a href="https://www.3jsautobody.com/the-3-wise-men-standard" class="jj-tile">',
            '<div class="jj-timg" style="background-image:url(\'https://rlsh1855.github.io/3Js-and-RLSH-Website/3%20WISE%20MEN1%20METAL%20CARD.png\');background-size:cover;background-position:center;"></div>',
            '<div class="jj-tbody"><h3>3 Wise Men <span class="jj-badge">STANDARD</span></h3><p>Our signature trio: bed liner, BAKFlip MX4 &amp; LED light bar install.</p><div class="jj-price">Starting at <b>$2,499</b></div></div>',
          '</a>',
          '<a href="https://www.3jsautobody.com/the-3-wise-men-premium" class="jj-tile">',
            '<div class="jj-timg" style="background-image:url(\'https://rlsh1855.github.io/3Js-and-RLSH-Website/3%20WISE%20MEN%20-PREMIUM%20METAL%20CARD.png\');background-size:cover;background-position:center;"></div>',
            '<div class="jj-tbody"><h3>3 Wise Men <span class="jj-premium">PREMIUM</span></h3><p>Top-tier finishes, upgraded electronics, paint-matched accents.</p><div class="jj-price">Starting at <b>$3,299</b></div></div>',
          '</a>',
        '</div>',
      '</div>',
      '<div class="jj-foot">',
        '<div class="jj-foot-links">',
          '<a href="https://www.3jsautobody.com/bundles" class="jj-foot-link"><span class="jj-foot-dot"></span> Build your own bundle</a>',
          '<a href="https://www.3jsautobody.com/bundles" class="jj-foot-link"><span class="jj-foot-dot"></span> Financing &mdash; 0% / 12mo</a>',
          '<a href="https://www.3jsautobody.com/bundles" class="jj-foot-link"><span class="jj-foot-dot"></span> See what\'s included</a>',
        '</div>',
        '<div class="jj-foot-ctr"><b>3J\'s Auto Body</b><span class="jj-sep">|</span><b>Rhino Linings of Signal Hill</b><span class="jj-addr">1855 E 29th St Ste A, Signal Hill, CA 90755</span></div>',
        '<div class="jj-foot-phone"><span>&#9679;</span> CALL (562) 424-6744</div>',
      '</div>',
    '</div>',

    /* EXTERIOR ACCESSORIES */
    '<div class="jj-mega jj-exterior" data-menu="exterior" id="jj-exterior">',
      '<div class="jj-accent"></div>',
      '<div class="jj-grid">',
        '<div class="jj-feat">',
          '<div class="jj-kicker">Exterior Accessories</div>',
          '<h2><span>Build Out</span><span class="jj-r2"><i class="jj-dash"></i>Your Rig</span></h2>',
          '<p>From tonneau covers to towing rigs — professionally installed at our Signal Hill shop with a 12-month workmanship guarantee.</p>',
          '<a href="https://www.3jsautobody.com/exterior-accessories" class="jj-cta">Shop All Categories <span class="jj-arrow"></span></a>',
          '<div class="jj-meta"><span class="jj-pip"></span> Free fitment check on every order</div>',
        '</div>',
        '<div class="jj-tiles" data-cols="4">',
          '<a href="https://www.3jsautobody.com/exterior-accessories/tonneau-covers" class="jj-tile">',
            '<div class="jj-timg" style="background-image:url(\'https://rlsh1855.github.io/3Js-and-RLSH-Website/Tonneau-covers-page-hero-image.webp\');background-size:cover;background-position:center;"></div>',
            '<h3>Tonneau Covers</h3>',
            '<div class="jj-tbody"><p>Hard, soft, retractable &amp; folding covers from top brands — protect your cargo and lift your MPG.</p></div>',
          '</a>',
          '<a href="https://www.3jsautobody.com/exterior-accessories/bakflip-mx4-tonneau-cover" class="jj-tile">',
            '<div class="jj-timg" style="background-image:url(\'https://rlsh1855.github.io/3Js-and-RLSH-Website/bak-bakflip-mx4-2016-ford-f150-blue-beach-lifestyle-01.webp\');background-size:cover;background-position:center;"></div>',
            '<h3>BAKFlip MX4 <span class="jj-new">POPULAR</span></h3>',
            '<div class="jj-tbody"><p>The industry-standard folding hard cover. Matte finish, dual-action tailgate seal.</p></div>',
          '</a>',
          '<a href="https://www.3jsautobody.com/exterior-accessories/premium-led-offroad-lighting" class="jj-tile">',
            '<div class="jj-timg" style="background-image:url(\'https://rlsh1855.github.io/3Js-and-RLSH-Website/offroad-lighting-hero.webp\');background-size:cover;background-position:center;"></div>',
            '<h3>Lighting</h3>',
            '<div class="jj-tbody"><p>LED light bars, pods, fog &amp; halo headlight upgrades — wired clean and weatherproofed.</p></div>',
          '</a>',
          '<a href="https://www.3jsautobody.com/exterior-accessories/steps-running-boards" class="jj-tile">',
            '<div class="jj-timg" style="background-image:url(\'https://rlsh1855.github.io/3Js-and-RLSH-Website/go-rhino/rb-running-board-red-truck.webp\');background-size:cover;background-position:center;"></div>',
            '<h3>Running Boards</h3>',
            '<div class="jj-tbody"><p>Powered, fixed, and oval-step boards for full-size trucks, SUVs &amp; Jeeps.</p></div>',
          '</a>',
          '<a href="https://www.3jsautobody.com/exterior-accessories/floor-liners-mats" class="jj-tile">',
            '<div class="jj-timg" style="background-image:url(\'https://rlsh1855.github.io/3Js-and-RLSH-Website/FLOOR%20LINERS%20IMAGE.webp\');background-size:cover;background-position:center;"></div>',
            '<h3>Floor Liners &amp; Mats</h3>',
            '<div class="jj-tbody"><p>Custom-cut, all-weather coverage — WeatherTech, Husky &amp; OEM-matched options.</p></div>',
          '</a>',
          '<a href="https://www.3jsautobody.com/exterior-accessories/towing" class="jj-tile">',
            '<div class="jj-timg" style="background-image:url(\'https://rlsh1855.github.io/3Js-and-RLSH-Website/CURT%20Reb%20Hitch%20Email.webp\');background-size:cover;background-position:center;"></div>',
            '<h3>Towing &amp; Hitches</h3>',
            '<div class="jj-tbody"><p>Hitches, wiring harnesses, brake controllers &amp; weight-distribution setups — installed &amp; tested.</p></div>',
          '</a>',
          '<a href="https://www.3jsautobody.com/exterior-accessories/headache-racks" class="jj-tile">',
            '<div class="jj-timg" style="background-image:url(\'https://rlsh1855.github.io/3Js-and-RLSH-Website/Elevate%20Base%20Truck%20Rack.webp\');background-size:cover;background-position:center;"></div>',
            '<h3>Headache Racks</h3>',
            '<div class="jj-tbody"><p>BackRack open, safety &amp; louvered frames — cab protection for work trucks.</p></div>',
          '</a>',
        '</div>',
      '</div>',
      '<div class="jj-foot">',
        '<div class="jj-foot-links">',
          '<a href="https://www.3jsautobody.com/exterior-accessories" class="jj-foot-link"><span class="jj-foot-dot"></span> Browse all accessories</a>',
          '<a href="https://www.3jsautobody.com/exterior-accessories" class="jj-foot-link"><span class="jj-foot-dot"></span> Fitment guide</a>',
          '<a href="https://www.3jsautobody.com/exterior-accessories" class="jj-foot-link"><span class="jj-foot-dot"></span> Brand directory</a>',
        '</div>',
        '<div class="jj-foot-ctr"><b>3J\'s Auto Body</b><span class="jj-sep">|</span><b>Rhino Linings of Signal Hill</b><span class="jj-addr">1855 E 29th St Ste A, Signal Hill, CA 90755</span></div>',
        '<div class="jj-foot-phone"><span>&#9679;</span> CALL (562) 424-6744</div>',
      '</div>',
    '</div>',

  ].join('');

  document.body.appendChild(host);

  /* ── 4. INTERACTION LOGIC ──────────────────────────────────────────── */
  (function () {
    var panels = host.querySelectorAll('.jj-mega');
    var open = null;
    var closeTimer = null;
    var triggers = []; // populated after nav is ready

    function showMenu(key) {
      clearTimeout(closeTimer);
      if (open === key) return;
      open = key;
      panels.forEach(function (p) {
        var isOpen = p.dataset.menu === key;
        p.classList.toggle('jj-open', isOpen);
      });
      positionHost();
    }

    function hideMenu(immediate) {
      function doHide() {
        open = null;
        panels.forEach(function (p) { p.classList.remove('jj-open'); });
      }
      if (immediate) { clearTimeout(closeTimer); doHide(); }
      else closeTimer = setTimeout(doHide, 180);
    }

    function positionHost() {
      // Find the bottom of the Wix nav bar
      if (!triggers.length) return;
      var rect = triggers[0].getBoundingClientRect();
      // Walk up to find the nav container bottom
      var el = triggers[0].parentElement;
      while (el && el !== document.body) {
        var r = el.getBoundingClientRect();
        if (r.height > 40) { rect = r; break; }
        el = el.parentElement;
      }
      host.style.top = rect.bottom + 'px';
    }

    // Trigger finder — checks IDs first (site-nav.js), falls back to text match (Wix)
    function findTriggers() {
      var found = {
        rhino:    document.getElementById('sn-trigger-rhino'),
        bundles:  document.getElementById('sn-trigger-bundles'),
        exterior: document.getElementById('sn-trigger-exterior')
      };
      // ID-based match (GitHub Pages / site-nav.js) — fast and precise
      if (found.rhino && found.bundles && found.exterior) return found;
      // Text-based match (Wix) — scan visible nav-level elements only
      var all = document.querySelectorAll('a, button, [role="menuitem"], [role="button"]');
      for (var i = 0; i < all.length; i++) {
        var el = all[i];
        if (host.contains(el)) continue;
        // Skip elements that are inside dropdown panels (deep nesting means they're sub-items)
        if (el.closest('[class*="panel"], [class*="dropdown"], [class*="dd-panel"], [class*="sub"]')) continue;
        var txt = el.textContent.replace(/\s+/g, ' ').trim().toLowerCase();
        if (!found.rhino && /rhino\s*liner/.test(txt) && txt.length < 60) found.rhino = el;
        if (!found.bundles && /bundles?\s*((&amp;|&|and)\s*packages?)?/.test(txt) && txt.length < 60) found.bundles = el;
        if (!found.exterior && /exterior\s*access/.test(txt) && txt.length < 60) found.exterior = el;
      }
      return (found.rhino && found.bundles && found.exterior) ? found : null;
    }

    function wireTrigger(el, key) {
      el.addEventListener('mouseenter', function () { showMenu(key); });
      el.addEventListener('focus', function () { showMenu(key); });
      el.addEventListener('click', function (e) {
        // Touch: first tap opens, second tap navigates
        if (window.matchMedia('(hover:none)').matches && open !== key) {
          e.preventDefault();
          showMenu(key);
        }
        // Desktop: click navigates (Pattern B)
      });
      triggers.push(el);
    }

    function attach(found) {
      wireTrigger(found.rhino,    'rhino');
      wireTrigger(found.bundles,  'bundles');
      wireTrigger(found.exterior, 'exterior');

      host.addEventListener('mouseenter', function () { clearTimeout(closeTimer); });
      host.addEventListener('mouseleave', function () { hideMenu(false); });

      // Close when mousing off the nav area
      document.addEventListener('mouseleave', function (e) {
        if (!e.relatedTarget) hideMenu(false);
      });
      document.addEventListener('click', function (e) {
        if (!host.contains(e.target) && !triggers.some(function (t) { return t.contains(e.target); })) {
          hideMenu(true);
        }
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') hideMenu(true);
      });

      // Reposition on scroll/resize
      window.addEventListener('scroll', positionHost, { passive: true });
      window.addEventListener('resize', positionHost, { passive: true });
    }

    // Poll for Wix nav to be ready (Wix renders async)
    var attempts = 0;
    function tryAttach() {
      var found = findTriggers();
      if (found) {
        attach(found);
      } else if (attempts++ < 30) {
        setTimeout(tryAttach, 300);
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', tryAttach);
    } else {
      tryAttach();
    }
  })();

})();



