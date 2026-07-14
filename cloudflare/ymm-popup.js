/**
 * RLSH YMM Popup — drop this script on any catalog page.
 * Shows a "What fits your truck?" modal on page load if YMM isn't in sessionStorage.
 * Stores to sessionStorage and dispatches `rlsh:ymm` event on submit.
 * Usage: <script src="ymm-popup.js"></script>
 */
(function(){
  'use strict';

  var KEYS={year:'rlsh_year',make:'rlsh_make',model:'rlsh_model'};
  var IMAGE='steps-hero-bg.webp';

  var YMM={makes:{
    'Ford':['F-150','F-250','F-350','Ranger','Bronco','Explorer','Expedition'],
    'Chevrolet':['Silverado 1500','Silverado 2500HD','Silverado 3500HD','Colorado','Tahoe','Suburban','Traverse'],
    'GMC':['Sierra 1500','Sierra 2500HD','Sierra 3500HD','Canyon','Yukon','Acadia'],
    'RAM':['1500','2500','3500','ProMaster'],
    'Toyota':['Tacoma','Tundra','4Runner','Sequoia','Highlander'],
    'Jeep':['Wrangler','Gladiator','Grand Cherokee'],
    'Nissan':['Frontier','Titan','Pathfinder'],
    'Honda':['Ridgeline','Pilot','Passport']
  }};

  // Check if already set
  function hasYMM(){
    return !!(sessionStorage.getItem(KEYS.year)&&sessionStorage.getItem(KEYS.make)&&sessionStorage.getItem(KEYS.model));
  }

  function injectStyles(){
    if(document.getElementById('rlsh-ymm-styles'))return;
    var css=`
      #rlsh-ymm-overlay{
        position:fixed;inset:0;z-index:99999;
        background:rgba(0,0,0,.82);
        display:flex;align-items:center;justify-content:center;
        padding:16px;
        animation:rlshFadeIn .3s cubic-bezier(0,0,0.2,1);
      }
      @keyframes rlshFadeIn{from{opacity:0;}to{opacity:1;}}
      #rlsh-ymm-modal{
        display:grid;
        grid-template-columns:1fr 1fr;
        width:100%;max-width:860px;
        max-height:92vh;
        overflow:hidden;
        background:#fff;
        border-top:3px solid #8B0000;
        animation:rlshSlideUp .35s cubic-bezier(0,0,0.2,1);
      }
      @keyframes rlshSlideUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:none;}}
      #rlsh-ymm-visual{
        position:relative;overflow:hidden;
        background:#0a0a0a;
        min-height:360px;
      }
      #rlsh-ymm-visual img{
        position:absolute;inset:0;width:100%;height:100%;
        object-fit:cover;object-position:center 40%;
      }
      #rlsh-ymm-visual::after{
        content:'';position:absolute;inset:0;
        background:linear-gradient(135deg,rgba(0,0,0,.7) 0%,rgba(0,0,0,.3) 100%);
      }
      #rlsh-ymm-visual-text{
        position:absolute;bottom:0;left:0;right:0;z-index:1;
        padding:32px;
      }
      #rlsh-ymm-visual-text strong{
        display:block;
        font-family:'Montserrat',sans-serif;
        font-size:clamp(22px,2.5vw,32px);
        font-weight:900;letter-spacing:-1px;
        text-transform:uppercase;
        color:#fff;line-height:1.0;
        margin-bottom:8px;
      }
      #rlsh-ymm-visual-text strong em{font-style:normal;color:#8B0000;}
      #rlsh-ymm-visual-text span{
        font-family:'Inter',sans-serif;font-size:13px;
        color:rgba(255,255,255,.65);
      }
      #rlsh-ymm-form-side{
        display:flex;flex-direction:column;justify-content:center;
        padding:clamp(32px,4vw,52px) clamp(28px,4vw,48px);
        overflow-y:auto;
        background:#fff;
      }
      #rlsh-ymm-close{
        position:absolute;top:14px;right:14px;z-index:100;
        width:36px;height:36px;
        background:rgba(255,255,255,.12);border:none;cursor:pointer;
        display:flex;align-items:center;justify-content:center;
        transition:background .2s;
      }
      #rlsh-ymm-close:hover{background:rgba(255,255,255,.22);}
      #rlsh-ymm-close svg{width:16px;height:16px;stroke:#fff;stroke-width:2;fill:none;}
      .rlsh-pop-eyebrow{
        font-family:'Montserrat',sans-serif;font-size:10px;font-weight:800;
        letter-spacing:3px;text-transform:uppercase;color:#8B0000;
        display:block;margin-bottom:10px;
      }
      .rlsh-pop-heading{
        font-family:'Montserrat',sans-serif;
        font-size:clamp(22px,2.5vw,30px);font-weight:900;
        letter-spacing:-1px;color:#0a0a0a;
        margin-bottom:6px;line-height:1.0;text-transform:uppercase;
      }
      .rlsh-pop-sub{
        font-family:'Inter',sans-serif;font-size:14px;
        color:#666;line-height:1.6;margin-bottom:28px;
      }
      .rlsh-pop-dd-wrap{display:flex;flex-direction:column;gap:10px;margin-bottom:24px;}
      .rlsh-pop-dd{position:relative;}
      .rlsh-pop-dd-label{
        font-family:'Montserrat',sans-serif;font-size:9px;font-weight:800;
        letter-spacing:2px;text-transform:uppercase;color:#888;
        display:block;margin-bottom:5px;
      }
      .rlsh-pop-trigger{
        width:100%;padding:12px 36px 12px 14px;
        border:1.5px solid #e0e0e0;background:#fff;
        font-family:'Inter',sans-serif;font-size:14px;font-weight:600;
        color:#999;text-align:left;cursor:pointer;outline:none;
        transition:border-color .2s;
        display:flex;align-items:center;justify-content:space-between;
      }
      .rlsh-pop-trigger.has-value{color:#111;}
      .rlsh-pop-trigger:disabled{opacity:.35;cursor:not-allowed;}
      .rlsh-pop-dd.open .rlsh-pop-trigger{border-color:#8B0000;}
      .rlsh-pop-arrow{
        width:0;height:0;
        border-left:5px solid transparent;border-right:5px solid transparent;
        border-top:5px solid #aaa;flex-shrink:0;
        transition:transform .2s;
      }
      .rlsh-pop-dd.open .rlsh-pop-arrow{transform:rotate(180deg);border-top-color:#8B0000;}
      .rlsh-pop-list{
        position:absolute;top:100%;left:0;right:0;
        background:#fff;border:1.5px solid #8B0000;border-top:none;
        max-height:180px;overflow-y:auto;z-index:9999;
        display:none;box-shadow:0 8px 24px rgba(0,0,0,.12);
      }
      .rlsh-pop-dd.open .rlsh-pop-list{display:block;}
      .rlsh-pop-option{
        padding:10px 14px;font-family:'Inter',sans-serif;
        font-size:14px;font-weight:600;cursor:pointer;color:#111;
      }
      .rlsh-pop-option:hover{background:#f5f5f5;color:#8B0000;}
      .rlsh-pop-btn{
        width:100%;height:50px;
        background:#8B0000;color:#fff;border:none;cursor:pointer;
        font-family:'Montserrat',sans-serif;font-size:11px;font-weight:800;
        letter-spacing:2px;text-transform:uppercase;
        transition:background .2s;margin-bottom:14px;
        display:flex;align-items:center;justify-content:center;gap:8px;
      }
      .rlsh-pop-btn:hover{background:#A00000;}
      .rlsh-pop-btn:disabled{background:#ccc;cursor:not-allowed;}
      .rlsh-pop-btn svg{width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2.2;}
      .rlsh-pop-skip{
        display:block;text-align:center;
        font-family:'Montserrat',sans-serif;font-size:9px;font-weight:700;
        letter-spacing:1.5px;text-transform:uppercase;
        color:#aaa;text-decoration:underline;
        background:none;border:none;cursor:pointer;width:100%;
        transition:color .2s;
      }
      .rlsh-pop-skip:hover{color:#8B0000;}
      @media(max-width:620px){
        #rlsh-ymm-modal{grid-template-columns:1fr;}
        #rlsh-ymm-visual{display:none;}
      }
    `;
    var s=document.createElement('style');
    s.id='rlsh-ymm-styles';s.textContent=css;
    document.head.appendChild(s);
  }

  function buildModal(){
    var overlay=document.createElement('div');
    overlay.id='rlsh-ymm-overlay';

    overlay.innerHTML=`
      <div id="rlsh-ymm-modal">
        <div id="rlsh-ymm-visual">
          <img src="${IMAGE}" alt="Truck with running boards">
          <div id="rlsh-ymm-visual-text">
            <strong>What Fits<br>Your <em>Truck?</em></strong>
            <span>Tell us your ride and we'll show you exactly what fits.</span>
          </div>
          <button id="rlsh-ymm-close" aria-label="Close">
            <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div id="rlsh-ymm-form-side">
          <span class="rlsh-pop-eyebrow">Find Your Fit</span>
          <div class="rlsh-pop-heading">What Fits<br>Your Truck?</div>
          <p class="rlsh-pop-sub">Enter your Year, Make, and Model to filter products that fit your vehicle.</p>
          <div class="rlsh-pop-dd-wrap">
            <div class="rlsh-pop-dd" id="pop-dd-year">
              <span class="rlsh-pop-dd-label">Year</span>
              <button class="rlsh-pop-trigger" id="pop-year" type="button">
                <span id="pop-year-lbl">Select year</span>
                <span class="rlsh-pop-arrow"></span>
              </button>
              <div class="rlsh-pop-list" id="pop-year-list"></div>
            </div>
            <div class="rlsh-pop-dd" id="pop-dd-make">
              <span class="rlsh-pop-dd-label">Make</span>
              <button class="rlsh-pop-trigger" id="pop-make" type="button" disabled>
                <span id="pop-make-lbl">Select make</span>
                <span class="rlsh-pop-arrow"></span>
              </button>
              <div class="rlsh-pop-list" id="pop-make-list"></div>
            </div>
            <div class="rlsh-pop-dd" id="pop-dd-model">
              <span class="rlsh-pop-dd-label">Model</span>
              <button class="rlsh-pop-trigger" id="pop-model" type="button" disabled>
                <span id="pop-model-lbl">Select model</span>
                <span class="rlsh-pop-arrow"></span>
              </button>
              <div class="rlsh-pop-list" id="pop-model-list"></div>
            </div>
          </div>
          <button class="rlsh-pop-btn" id="pop-submit" disabled>
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            Show What Fits My Truck
          </button>
          <button class="rlsh-pop-skip" id="pop-skip">Skip for now</button>
        </div>
      </div>
    `;

    return overlay;
  }

  function popDdVal(btnId,lblId,ddId,val,label,enabled){
    var btn=document.getElementById(btnId),lbl=document.getElementById(lblId);
    lbl.textContent=label;
    val?btn.classList.add('has-value'):btn.classList.remove('has-value');
    btn.disabled=!enabled;
    document.getElementById(ddId).classList.remove('open');
  }

  function popBuildList(listId,items,onSelect){
    var list=document.getElementById(listId);
    list.innerHTML='';
    items.forEach(function(item){
      var d=document.createElement('div');
      d.className='rlsh-pop-option';d.textContent=item;
      d.addEventListener('click',function(){onSelect(item);});
      list.appendChild(d);
    });
  }

  function popOpenDd(ddEl){
    document.querySelectorAll('.rlsh-pop-dd.open').forEach(function(el){if(el!==ddEl)el.classList.remove('open');});
    ddEl.classList.toggle('open');
  }

  function closeModal(){
    var overlay=document.getElementById('rlsh-ymm-overlay');
    if(overlay){
      overlay.style.opacity='0';
      overlay.style.transition='opacity .25s';
      setTimeout(function(){if(overlay.parentNode)overlay.parentNode.removeChild(overlay);},260);
    }
    document.body.style.overflow='';
  }

  function initPopup(){
    injectStyles();
    var overlay=buildModal();
    document.body.appendChild(overlay);
    document.body.style.overflow='hidden';

    var popYmm={year:'',make:'',model:''};

    // Dropdown click handlers
    ['pop-year','pop-make','pop-model'].forEach(function(id){
      var btn=document.getElementById(id);
      if(btn){
        btn.addEventListener('click',function(e){
          if(this.disabled)return;
          e.stopPropagation();
          popOpenDd(this.closest('.rlsh-pop-dd'));
        });
      }
    });

    // Outside click closes dropdowns
    overlay.addEventListener('click',function(e){
      if(!e.target.closest('.rlsh-pop-dd'))
        document.querySelectorAll('.rlsh-pop-dd.open').forEach(function(el){el.classList.remove('open');});
    });

    // Populate years
    var years=[];
    for(var y=2025;y>=2005;y--)years.push(String(y));
    popBuildList('pop-year-list',years,function(val){
      popYmm.year=val;popYmm.make='';popYmm.model='';
      popDdVal('pop-year','pop-year-lbl','pop-dd-year',val,val,true);
      popDdVal('pop-make','pop-make-lbl','pop-dd-make','','Select make',true);
      popDdVal('pop-model','pop-model-lbl','pop-dd-model','','Select model',false);
      document.getElementById('pop-submit').disabled=true;
      popBuildList('pop-make-list',Object.keys(YMM.makes),function(mval){
        popYmm.make=mval;popYmm.model='';
        popDdVal('pop-make','pop-make-lbl','pop-dd-make',mval,mval,true);
        popDdVal('pop-model','pop-model-lbl','pop-dd-model','','Select model',true);
        document.getElementById('pop-submit').disabled=true;
        popBuildList('pop-model-list',YMM.makes[mval]||[],function(mdval){
          popYmm.model=mdval;
          popDdVal('pop-model','pop-model-lbl','pop-dd-model',mdval,mdval,true);
          document.getElementById('pop-submit').disabled=false;
        });
      });
    });

    // Submit
    document.getElementById('pop-submit').addEventListener('click',function(){
      if(!popYmm.year||!popYmm.make||!popYmm.model)return;
      sessionStorage.setItem(KEYS.year,popYmm.year);
      sessionStorage.setItem(KEYS.make,popYmm.make);
      sessionStorage.setItem(KEYS.model,popYmm.model);
      window.dispatchEvent(new CustomEvent('rlsh:ymm',{detail:{year:popYmm.year,make:popYmm.make,model:popYmm.model}}));
      closeModal();
    });

    // Skip + close button
    document.getElementById('pop-skip').addEventListener('click',closeModal);
    var closeBtn=document.getElementById('rlsh-ymm-close');
    if(closeBtn)closeBtn.addEventListener('click',closeModal);

    // Close on overlay click (outside modal)
    overlay.addEventListener('click',function(e){
      if(e.target===overlay)closeModal();
    });

    // Escape key
    document.addEventListener('keydown',function handler(e){
      if(e.key==='Escape'){closeModal();document.removeEventListener('keydown',handler);}
    });
  }

  // Expose open function for manual trigger
  window.rlshShowYMMPopup = initPopup;

  // Init on DOM ready — skip auto-show if rlshYmmManual is set
  function maybeShow(){
    if(!window.rlshYmmManual && !hasYMM()){
      setTimeout(initPopup, 600);
    }
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',maybeShow);
  } else {
    maybeShow();
  }

})();
