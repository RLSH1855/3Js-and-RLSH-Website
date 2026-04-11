(function(){

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
    }
    .sn-nav a{
      display:inline-flex;align-items:center;
      padding:18px 18px;
      font-family:'Montserrat',Arial,sans-serif;
      font-size:10.5px;font-weight:500;
      letter-spacing:1.5px;text-transform:uppercase;
      color:#fff;text-decoration:none;
      white-space:nowrap;
      transition:color 0.2s;
    }
    .sn-nav a:hover{color:#c0392b;}

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
      transition:all 0.3s;
    }

    /* ── Mobile menu ── */
    .sn-mobile-menu{
      display:none;
      background:#0a0a0a;
      flex-direction:column;
      border-top:1px solid #1a1a1a;
    }
    .sn-mobile-menu.sn-open{display:flex;}
    .sn-mobile-menu a{
      display:block;
      padding:14px 24px;
      font-family:'Montserrat',Arial,sans-serif;
      font-size:11px;font-weight:600;
      letter-spacing:1.5px;text-transform:uppercase;
      color:#fff;text-decoration:none;
      border-bottom:1px solid #1a1a1a;
      transition:color 0.2s;
    }
    .sn-mobile-menu a:hover{color:#c0392b;}
    .sn-mobile-menu a.sn-mob-red{color:#c0392b;}

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
    .sn-footer-phone:hover{color:#c0392b;}
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
        <a href="https://www.3jsautobody.com/body-paint-repairs">Body &amp; Paint Repairs</a>
        <a href="https://www.3jsautobody.com/areas-we-service">Areas We Service</a>
        <a href="https://www.3jsautobody.com/rhino-liner">Rhino Liner</a>
        <a href="https://www.3jsautobody.com/tonneau-covers">Tonneau Covers</a>
        <a href="https://www.3jsautobody.com/running-boards">Running Boards</a>
        <a href="https://www.3jsautobody.com/off-road-lighting">Off-Road Lighting</a>
        <a href="https://www.3jsautobody.com/contact-us">Contact Us</a>
        <a href="https://www.3jsautobody.com/faq">FAQ</a>
      </nav>
      <div class="sn-mobile-menu" id="sn-mobile-menu" aria-label="Mobile navigation">
        <a href="https://www.3jsautobody.com/inside-3js">Inside 3J's</a>
        <a href="https://www.3jsautobody.com/body-paint-repairs">Body &amp; Paint Repairs</a>
        <a href="https://www.3jsautobody.com/areas-we-service">Areas We Service</a>
        <a href="https://www.3jsautobody.com/rhino-liner">Rhino Liner</a>
        <a href="https://www.3jsautobody.com/tonneau-covers">Tonneau Covers</a>
        <a href="https://www.3jsautobody.com/running-boards">Running Boards</a>
        <a href="https://www.3jsautobody.com/off-road-lighting">Off-Road Lighting</a>
        <a href="https://www.3jsautobody.com/contact-us">Contact Us</a>
        <a href="https://www.3jsautobody.com/faq">FAQ</a>
        <a href="https://www.3jsautobody.com/rhino-lining-quote" class="sn-mob-red">Bed-Liner Quote</a>
        <a href="https://www.carwise.com/online-photo-estimate/3js-autobody-paint-inc-signal-hill-ca-90755/479382?source=shop.profile&referer=estimate.cccone.com">Free Auto Body Estimate</a>
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
      mobileMenu.classList.toggle('sn-open');
    });
  }

  /* ════════════════════════════════
     DESKTOP PHONE MODAL
     On mobile: tel: links dial normally.
     On desktop: intercept and show a
     clean popup with the number instead
     of the browser's ugly dialog.
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

})();
