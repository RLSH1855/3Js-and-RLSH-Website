(function(){
  var _inFrame=(function(){try{return window.self!==window.top;}catch(e){return true;}})();
  var css=':root{--gc-red:#8B0000;--gc-red-dark:#6d0000;}.gc-fab{position:fixed;bottom:24px;right:24px;z-index:99998;height:44px;padding:0 16px;background:#8B0000;border:none;cursor:pointer;display:flex;align-items:center;gap:8px;box-shadow:0 4px 16px rgba(0,0,0,0.3);transition:background 0.2s;font-family:"Montserrat",Arial,sans-serif;font-size:10px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:#fff;white-space:nowrap;}.gc-fab:hover{background:#6d0000;}.gc-fab svg{width:16px;height:16px;stroke:#fff;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0;}.gc-ov{display:none;position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.68);align-items:center;justify-content:center;padding:0;}.gc-ov.open{display:flex;}.gc-modal{background:#fff;width:100%;max-width:520px;max-height:90vh;overflow-y:auto;position:relative;animation:gcPop 0.25s ease;}@keyframes gcPop{from{transform:scale(0.94) translateY(16px);opacity:0;}to{transform:none;opacity:1;}}.gc-hdr{position:relative;min-height:160px;display:flex;align-items:flex-end;overflow:hidden;}.gc-hdr-bg{position:absolute;inset:0;background:url("My_Garage_Header_image.png") center/cover no-repeat;}.gc-hdr-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.82) 0%,rgba(0,0,0,0.30) 55%,rgba(0,0,0,0.0) 100%);}.gc-hdr-txt{position:relative;z-index:2;padding:22px 26px;}.gc-eyebrow{display:block;font-family:"Montserrat",Arial,sans-serif;font-size:9px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:#fff;margin-bottom:6px;}.gc-title{font-family:"Montserrat",Arial,sans-serif;font-size:clamp(18px,3vw,24px);font-weight:800;letter-spacing:-0.5px;color:#fff;line-height:1.1;text-transform:uppercase;}.gc-title em{font-style:normal;color:#8B0000;}.gc-close{position:absolute;top:12px;right:12px;z-index:10;background:#8B0000;border:none;color:#fff;width:40px;height:40px;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 10px rgba(0,0,0,0.45);transition:background 0.2s;}.gc-close:hover{background:#A00000;}.gc-close svg{width:16px;height:16px;stroke:#fff;stroke-width:3;stroke-linecap:round;fill:none;pointer-events:none;}.gc-body{padding:24px 26px;min-height:280px;}.gc-tabs{display:flex;border:2px solid #e8e8e8;margin-bottom:22px;}.gc-tab{flex:1;padding:11px 8px;text-align:center;font-family:"Montserrat",Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#999;background:#fff;border:none;cursor:pointer;transition:background 0.2s,color 0.2s;}.gc-tab.active{background:#8B0000;color:#fff;}.gc-panel{display:none;min-height:140px;}.gc-panel.active{display:block;}.gc-ymm-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;}.gc-field{margin-bottom:0;}.gc-field label{display:block;font-family:"Montserrat",Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;color:#1a1a1a;margin-bottom:5px;}.gc-field select{width:100%;padding:11px 12px;border:2px solid #e8e8e8;border-radius:0;font-family:"Montserrat",Arial,sans-serif;font-size:13px;font-weight:700;color:#1a1a1a;background:#fff;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' viewBox=\'0 0 12 8\'%3E%3Cpath d=\'M1 1l5 5 5-5\' stroke=\'%238B0000\' stroke-width=\'2\' fill=\'none\' stroke-linecap=\'round\'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;cursor:pointer;transition:border-color 0.2s;}.gc-field select:focus{outline:none;border-color:#8B0000;}.gc-field select:disabled{color:#bbb;background-color:#fafafa;cursor:not-allowed;}.gc-year-wrap{position:relative;}.gc-year-btn{width:100%;padding:11px 12px;border:2px solid #e8e8e8;border-radius:0;font-family:"Montserrat",Arial,sans-serif;font-size:11px;font-weight:700;color:#1a1a1a;letter-spacing:1.5px;text-transform:uppercase;background:#fff;cursor:pointer;text-align:left;display:flex;align-items:center;justify-content:space-between;min-height:44px;transition:border-color 0.2s;}.gc-year-btn.open{border-color:#8B0000;}.gc-year-btn .ph{color:#bbb;font-weight:500;}.gc-year-arrow{font-size:9px;color:#8B0000;transition:transform 0.2s;}.gc-year-btn.open .gc-year-arrow{transform:rotate(180deg);}.gc-year-panel{display:none;position:fixed;background:#fff;border:2px solid #e8e8e8;box-shadow:0 8px 32px rgba(0,0,0,0.14);z-index:999999;padding:10px;max-height:220px;overflow-y:auto;}.gc-year-panel.open{display:block;}.gc-year-inner{display:grid;grid-template-columns:repeat(3,1fr);gap:3px;}.gc-year-cell{padding:7px 4px;text-align:center;font-family:"Montserrat",Arial,sans-serif;font-size:12px;font-weight:700;color:#1a1a1a;cursor:pointer;transition:background 0.12s,color 0.12s;}.gc-year-cell:hover{background:#f5f5f5;}.gc-year-cell.sel{background:#8B0000;color:#fff;}.gc-vin-row{display:flex;gap:8px;}.gc-vin-input{flex:1;padding:11px 12px;border:2px solid #e8e8e8;border-radius:0;font-family:"Montserrat",Arial,sans-serif;font-size:13px;font-weight:600;color:#1a1a1a;letter-spacing:1px;text-transform:uppercase;transition:border-color 0.2s;}.gc-vin-input:focus{outline:none;border-color:#8B0000;}.gc-vin-input::placeholder{text-transform:none;letter-spacing:0;font-weight:400;color:#bbb;}.gc-vin-btn{display:inline-flex;align-items:center;justify-content:center;padding:0 18px;min-height:44px;background:#8B0000;color:#fff;border:none;cursor:pointer;font-family:"Montserrat",Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;transition:background 0.2s;}.gc-vin-btn:hover{background:#6d0000;}.gc-vin-btn:disabled{background:#ccc;cursor:not-allowed;}.gc-vin-status{margin-top:8px;font-size:12px;color:#666;min-height:16px;}.gc-vin-status.err{color:#c00;}.gc-vin-status.ok{color:#8B0000;}.gc-confirm{display:none;margin-top:18px;border:2px solid #e8e8e8;}.gc-confirm.show{display:block;}.gc-confirm-hdr{background:#f9f9f9;border-bottom:2px solid #e8e8e8;padding:10px 16px;font-family:"Montserrat",Arial,sans-serif;font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#8B0000;}.gc-confirm-body{padding:16px;}.gc-vehicle-name{font-family:"Montserrat",Arial,sans-serif;font-size:16px;font-weight:800;color:#1a1a1a;margin-bottom:14px;}.gc-extras{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;}.gc-color-label{font-family:"Montserrat",Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;color:#1a1a1a;margin-bottom:7px;}.gc-swatches{display:flex;flex-wrap:wrap;gap:6px;}.gc-swatch{width:24px;height:24px;border-radius:50%;border:2px solid transparent;cursor:pointer;transition:transform 0.12s,border-color 0.12s;}.gc-swatch:hover{transform:scale(1.18);}.gc-swatch.sel{border-color:#8B0000;transform:scale(1.18);}.gc-save-btn{width:100%;display:flex;align-items:center;justify-content:center;gap:8px;height:48px;background:#8B0000;color:#fff;border:none;cursor:pointer;font-family:"Montserrat",Arial,sans-serif;font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;transition:background 0.2s;margin-top:16px;}.gc-save-btn:hover{background:#6d0000;}.gc-saved{display:none;text-align:center;padding:28px 26px;}.gc-saved.show{display:block;}.gc-saved-title{font-family:"Montserrat",Arial,sans-serif;font-size:17px;font-weight:800;color:#1a1a1a;margin-bottom:4px;}.gc-saved-pill{font-family:"Montserrat",Arial,sans-serif;font-size:13px;font-weight:700;color:#1a1a1a;letter-spacing:0.5px;margin-bottom:14px;}.gc-saved-actions{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-bottom:18px;}.gc-continue-btn{background:none;border:none;color:#8B0000;font-family:"Montserrat",Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;padding:6px;text-decoration:underline;display:block;margin:0 auto;}.gc-clear-btn{background:none;border:none;color:#aaa;font-family:"Montserrat",Arial,sans-serif;font-size:9px;font-weight:600;letter-spacing:1px;text-transform:uppercase;cursor:pointer;padding:4px;text-decoration:underline;display:block;margin:4px auto 0;}.gc-saved-btn{display:inline-flex;align-items:center;justify-content:center;height:44px;padding:0 20px;font-family:"Montserrat",Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;text-decoration:none;cursor:pointer;}.gc-saved-btn.red{background:#8B0000;color:#fff;border:none;}.gc-saved-btn.red:hover{background:#6d0000;}.gc-saved-btn.out{background:#fff;color:#1a1a1a;border:2px solid #e8e8e8;}.gc-saved-btn.out:hover{border-color:#1a1a1a;}@media(max-width:540px){.gc-ymm-grid{grid-template-columns:1fr;}.gc-extras{grid-template-columns:1fr;}.gc-fab{bottom:16px;right:16px;}}';
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

  document.body.insertAdjacentHTML('beforeend',
    '<div class="gc-ov" id="gc-ov"><div class="gc-modal" id="gc-modal">'+
    '<div class="gc-hdr"><div class="gc-hdr-bg"></div><div class="gc-hdr-ov"></div><div class="gc-hdr-txt"><span class="gc-eyebrow">3J\'s Auto Body</span><h2 class="gc-title">My <em>Garage</em></h2></div><button class="gc-close" id="gc-close"><svg viewBox="0 0 16 16"><line x1="2" y1="2" x2="14" y2="14"/><line x1="14" y1="2" x2="2" y2="14"/></svg></button></div>'+
    '<div class="gc-body" id="gc-body">'+
    '<div class="gc-tabs"><button class="gc-tab active" id="gc-tab-ymm">Year / Make / Model</button><button class="gc-tab" id="gc-tab-vin">Enter VIN</button></div>'+
    '<div class="gc-panel active" id="gc-panel-ymm"><div class="gc-ymm-grid">'+
    '<div class="gc-field"><label>Year</label><div class="gc-year-wrap"><button type="button" class="gc-year-btn" id="gc-year-btn"><span id="gc-year-label" class="ph">Select Year</span><span class="gc-year-arrow">&#9660;</span></button><div class="gc-year-panel" id="gc-year-panel"><div class="gc-year-inner" id="gc-year-grid"></div></div></div><input type="hidden" id="gc-ymm-year" value=""/></div>'+
    '<div class="gc-field"><label>Make</label><select id="gc-ymm-make" disabled><option value="">Select Make</option></select></div>'+
    '<div class="gc-field" style="grid-column:1/-1;"><label>Model</label><select id="gc-ymm-model" disabled><option value="">Select Model</option></select></div>'+
    '</div></div>'+
    '<div class="gc-panel" id="gc-panel-vin"><div class="gc-vin-row"><input class="gc-vin-input" id="gc-vin-input" type="text" maxlength="17" placeholder="Enter your 17-digit VIN"/><button class="gc-vin-btn" id="gc-vin-btn">Decode</button></div><p class="gc-vin-status" id="gc-vin-status"></p></div>'+
    '<div class="gc-confirm" id="gc-confirm"><div class="gc-confirm-hdr">Confirm Your Vehicle</div><div class="gc-confirm-body">'+
    '<p class="gc-vehicle-name" id="gc-vehicle-name">&#8212;</p>'+
    '<div class="gc-extras"><div class="gc-field"><label>Trim Level</label><select id="gc-sel-trim"><option value="">Unknown / Not Listed</option></select></div><div><p class="gc-color-label">Truck Color</p><div class="gc-swatches" id="gc-swatches"></div></div></div>'+
    '<div class="gc-field" id="gc-bed-field" style="display:none;margin-bottom:12px;"><label>Bed Size</label><select id="gc-sel-bed"><option value="">Select Bed Size</option></select></div>'+
    '<button class="gc-save-btn" id="gc-save-btn">Save to My Garage</button></div></div>'+
    '</div>'+
    '<div class="gc-saved" id="gc-saved">'+
    '<p class="gc-saved-title">Vehicle Saved!</p>'+
    '<p class="gc-saved-pill" id="gc-saved-pill">&#8212;</p>'+
    '<div class="gc-saved-actions"><a href="/exterior-accessories-V2" class="gc-saved-btn red">Shop Accessories</a><button class="gc-saved-btn out" id="gc-change-btn">Change Vehicle</button></div>'+
    '<button class="gc-continue-btn" id="gc-continue-btn">Continue Browsing</button>'+
    '<button class="gc-clear-btn" id="gc-clear-btn">Clear Vehicle</button>'+
    '</div>'+
    '</div></div>'
  );


  var GC_COLORS=[{name:'White',hex:'#F5F5F0'},{name:'Silver',hex:'#C0C0C0'},{name:'Gray',hex:'#808080'},{name:'Black',hex:'#1a1a1a'},{name:'Red',hex:'#B22222'},{name:'Blue',hex:'#1E3A8A'},{name:'Navy',hex:'#0a1628'},{name:'Green',hex:'#2D5016'},{name:'Brown',hex:'#6B3A2A'},{name:'Orange',hex:'#CC5500'},{name:'Yellow',hex:'#D4A017'},{name:'Beige',hex:'#D2B48C'}];
  var GC_MAKES={'Ford':['F-150','F-150 Lightning','Super Duty F-250/F-350','Ranger','Maverick'],'Chevrolet':['Silverado 1500','Silverado 2500HD/3500HD','Colorado'],'GMC':['Sierra 1500','Sierra 2500HD/3500HD','Sierra EV','Canyon','Canyon AT4'],'RAM':['1500','1500 TRX','1500 RHO','2500/3500'],'Toyota':['Tacoma','Tundra','Pickup','T100'],'Nissan':['Titan','Titan XD','Frontier'],'Honda':['Ridgeline'],'Jeep':['Gladiator']};
  var GC_TRIMS={'F-150':['XL','XLT','Lariat','King Ranch','Platinum','Limited','Raptor','Raptor R'],'F-150 Lightning':['Pro','XLT','Lariat','Platinum','Black'],'Super Duty F-250/F-350':['XL','XLT','Lariat','King Ranch','Platinum','Limited','Tremor'],'Ranger':['XL','XLT','Lariat','Raptor'],'Maverick':['XL','XLT','Lariat'],'Silverado 1500':['WT','Custom','LT','RST','LTZ','High Country','Trail Boss','ZR2'],'Silverado 2500HD/3500HD':['WT','Custom','LT','LTZ','High Country'],'Colorado':['WT','LT','Z71','ZR2','Trail Boss'],'Sierra 1500':['Pro','SLE','Elevation','SLT','AT4','Denali','Denali Ultimate'],'Sierra 2500HD/3500HD':['Pro','SLE','SLT','AT4','Denali'],'Sierra EV':['Standard Range WT','Standard Range SLT','Standard Range Denali','Extended Range Denali'],'Canyon':['Pro','SLE','Elevation','SLT','AT4X','Denali'],'Canyon AT4':['AT4'],'1500':['Tradesman','Big Horn','Lone Star','Laramie','Rebel','TRX','Limited','Longhorn'],'1500 TRX':['TRX'],'1500 RHO':['RHO'],'2500/3500':['Tradesman','Big Horn','Laramie','Power Wagon','Limited','Longhorn'],'Tacoma':['SR','SR5','TRD Sport','TRD Off-Road','Limited','TRD Pro','Trailhunter'],'Tundra':['SR','SR5','Limited','Platinum','1794 Edition','TRD Pro','Capstone'],'Pickup':['DLX','SR5','Xtracab'],'T100':['DX','SR5'],'Titan':['S','SV','Pro-4X','Platinum Reserve'],'Titan XD':['S','SV','Pro-4X','Platinum Reserve'],'Frontier':['S','SV','Pro-4X','PRO-X'],'Ridgeline':['Sport','RTL','RTL-E','Black Edition'],'Gladiator':['Sport','Sport S','Willys','Rubicon','Mojave']};
  var GC_BEDS={'F-150':[["5'6\" Short Bed",66],["6'6\" Standard Bed",78]],'F-150 Lightning':[["5'6\" Short Bed",66]],'Super Duty F-250/F-350':[["6'9\" Standard Bed",81],["8' Long Bed",96]],'Ranger':[["5' Short Bed",60],["6' Standard Bed",72]],'Maverick':[["4'6\" Compact Bed",54]],'Silverado 1500':[["5'9\" Short Bed",69],["6'7\" Standard Bed",79]],'Silverado 2500HD/3500HD':[["6'7\" Standard Bed",79],["8' Long Bed",96]],'Sierra 1500':[["5'9\" Short Bed",69],["6'7\" Standard Bed",79]],'Sierra 2500HD/3500HD':[["6'7\" Standard Bed",79],["8' Long Bed",96]],'Sierra EV':[["5'11\" Short Bed",71]],'Colorado':[["5'2\" Short Bed",62],["6'7\" Standard Bed",79]],'Canyon':[["5'2\" Short Bed",62],["6'7\" Standard Bed",79]],'Canyon AT4':[["5'2\" Short Bed",62]],'1500':[["5'7\" Short Bed",67],["6'4\" Standard Bed",76],["8' Long Bed",96]],'1500 TRX':[["5'7\" Short Bed",67]],'1500 RHO':[["5'7\" Short Bed",67],["6'4\" Standard Bed",76]],'2500/3500':[["6'4\" Standard Bed",76],["8' Long Bed",96]],'Tacoma':[["5' Short Bed",60],["6' Standard Bed",72]],'Tundra':[["5'6\" Short Bed",66],["6'6\" Standard Bed",78],["8' Long Bed",96]],'Pickup':[["6' Standard Bed",72],["7'6\" Long Bed",90]],'T100':[["6' Standard Bed",72],["7'6\" Long Bed",90]],'Titan':[["5'7\" Short Bed",67],["6'7\" Standard Bed",79]],'Titan XD':[["6'7\" Standard Bed",79]],'Frontier':[["5' Short Bed",60],["6' Standard Bed",72]],'Ridgeline':[["5'4\" Bed",64]],'Gladiator':[["5' Bed",60]]};

  var gcColor=GC_COLORS[0], gcPending={}, gcAutoCloseTimer=null;

  // Build year grid
  (function(){
    var grid=document.getElementById('gc-year-grid');
    for(var y=2026;y>=1981;y--){
      (function(yr){
        var cell=document.createElement('div');
        cell.className='gc-year-cell';
        cell.textContent=yr;
        cell.addEventListener('click',function(){
          document.getElementById('gc-ymm-year').value=yr;
          var lbl=document.getElementById('gc-year-label');
          lbl.textContent=yr;lbl.classList.remove('ph');
          document.querySelectorAll('.gc-year-cell').forEach(function(c){c.classList.remove('sel');});
          cell.classList.add('sel');
          gcCloseYear();gcYearChange();
        });
        grid.appendChild(cell);
      })(y);
    }
  })();

  function gcBuildSwatches(){
    var wrap=document.getElementById('gc-swatches');wrap.innerHTML='';
    GC_COLORS.forEach(function(c){
      var s=document.createElement('div');
      s.className='gc-swatch'+(c.name===gcColor.name?' sel':'');
      s.style.background=c.hex;
      if(c.name==='White')s.style.border='2px solid #ddd';
      s.title=c.name;
      s.addEventListener('click',function(){gcColor=c;gcBuildSwatches();});
      wrap.appendChild(s);
    });
  }

  function gcOpen(){
    document.getElementById('gc-ov').classList.add('open');
    var saved=localStorage.getItem('garage_vehicle');
    if(saved){try{gcShowSaved(JSON.parse(saved));}catch(e){}}
  }
  function gcClose(){if(gcAutoCloseTimer){clearTimeout(gcAutoCloseTimer);gcAutoCloseTimer=null;}document.getElementById('gc-ov').classList.remove('open');}

  function gcTab(tab){
    document.getElementById('gc-tab-ymm').classList.toggle('active',tab==='ymm');
    document.getElementById('gc-tab-vin').classList.toggle('active',tab==='vin');
    document.getElementById('gc-panel-ymm').classList.toggle('active',tab==='ymm');
    document.getElementById('gc-panel-vin').classList.toggle('active',tab==='vin');
    document.getElementById('gc-confirm').classList.remove('show');
  }

  function gcToggleYear(){
    var panel=document.getElementById('gc-year-panel');
    var btn=document.getElementById('gc-year-btn');
    var open=panel.classList.contains('open');
    if(!open){
      var rect=btn.getBoundingClientRect();
      panel.style.top=(rect.bottom+4)+'px';
      panel.style.left=rect.left+'px';
      panel.style.width=rect.width+'px';
    }
    panel.classList.toggle('open',!open);btn.classList.toggle('open',!open);
  }
  function gcCloseYear(){
    document.getElementById('gc-year-panel').classList.remove('open');
    document.getElementById('gc-year-btn').classList.remove('open');
  }

  function gcYearChange(){
    var makeSel=document.getElementById('gc-ymm-make');
    var modelSel=document.getElementById('gc-ymm-model');
    makeSel.innerHTML='<option value="">Select Make</option>';
    modelSel.innerHTML='<option value="">Select Model</option>';
    makeSel.disabled=false;modelSel.disabled=true;
    Object.keys(GC_MAKES).forEach(function(m){
      var o=document.createElement('option');o.value=m;o.textContent=m;makeSel.appendChild(o);
    });
    document.getElementById('gc-confirm').classList.remove('show');
  }

  function gcMakeChange(){
    var make=document.getElementById('gc-ymm-make').value;
    var modelSel=document.getElementById('gc-ymm-model');
    modelSel.innerHTML='<option value="">Select Model</option>';modelSel.disabled=true;
    if(!make)return;
    (GC_MAKES[make]||[]).forEach(function(m){
      var o=document.createElement('option');o.value=m;o.textContent=m;modelSel.appendChild(o);
    });
    modelSel.disabled=false;
    document.getElementById('gc-confirm').classList.remove('show');
  }

  function gcModelChange(){
    var year=document.getElementById('gc-ymm-year').value;
    var make=document.getElementById('gc-ymm-make').value;
    var model=document.getElementById('gc-ymm-model').value;
    if(!year||!make||!model)return;
    gcPending={year:year,make:make,model:model,trim:'',vin:''};
    gcShowConfirm(year,make,model,'');
  }

  function gcDecodeVIN(){
    var vin=document.getElementById('gc-vin-input').value.trim().toUpperCase();
    var status=document.getElementById('gc-vin-status');
    var btn=document.getElementById('gc-vin-btn');
    if(vin.length!==17){status.className='gc-vin-status err';status.textContent='VIN must be 17 characters.';return;}
    status.className='gc-vin-status';status.textContent='Decoding...';btn.disabled=true;
    fetch('https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/'+vin+'?format=json')
      .then(function(r){return r.json();})
      .then(function(data){
        btn.disabled=false;
        var get=function(n){var i=data.Results.find(function(r){return r.Variable===n;});return i?(i.Value||''):''};
        var year=get('Model Year'),make=get('Make'),model=get('Model'),trim=get('Trim');
        make=make.charAt(0).toUpperCase()+make.slice(1).toLowerCase();
        if(make==='Ram')make='RAM';
        if(!year||!make||!model){status.className='gc-vin-status err';status.textContent='Could not decode. Try Year/Make/Model.';return;}
        status.className='gc-vin-status ok';status.textContent='VIN decoded!';
        gcPending={year:year,make:make,model:model,trim:trim,vin:vin};
        gcShowConfirm(year,make,model,trim);
      })
      .catch(function(){btn.disabled=false;status.className='gc-vin-status err';status.textContent='Decode failed. Check your connection.';});
  }

  function gcShowConfirm(year,make,model,trim){
    document.getElementById('gc-vehicle-name').textContent=year+' '+make+' '+model;
    var trimSel=document.getElementById('gc-sel-trim');
    trimSel.innerHTML='<option value="">Unknown / Not Listed</option>';
    (GC_TRIMS[model]||[]).forEach(function(t){
      var o=document.createElement('option');o.value=t;o.textContent=t;
      if(t===trim)o.selected=true;trimSel.appendChild(o);
    });
    var bedSel=document.getElementById('gc-sel-bed');
    var bedField=document.getElementById('gc-bed-field');
    var bedList=GC_BEDS[model]||[];
    bedSel.innerHTML='<option value="">Select Bed Size</option>';
    if(bedList.length){
      bedList.forEach(function(b){var o=document.createElement('option');o.value=b[1];o.textContent=b[0];bedSel.appendChild(o);});
      if(bedList.length===1)bedSel.value=bedList[0][1];
      bedField.style.display='block';
    }else{bedField.style.display='none';}
    gcBuildSwatches();
    document.getElementById('gc-confirm').classList.add('show');
    setTimeout(function(){document.getElementById('gc-modal').scrollTop=9999;},50);
  }

  function gcSave(){
    var trim=document.getElementById('gc-sel-trim').value;
    var bedIn=parseFloat(document.getElementById('gc-sel-bed').value)||null;
    var bedList=GC_BEDS[gcPending.model]||[];
    var bedLabel='';
    if(bedIn){var m=bedList.find(function(b){return b[1]===bedIn;});bedLabel=m?m[0]:'';}
    var v={year:gcPending.year,make:gcPending.make,model:gcPending.model,trim:trim||gcPending.trim||'',bedIn:bedIn,bedSize:bedLabel,color:gcColor.name,colorHex:gcColor.hex,vin:gcPending.vin||''};
    localStorage.setItem('garage_vehicle',JSON.stringify(v));
    gcShowSaved(v);
    gcBroadcast();
    try{window.dispatchEvent(new CustomEvent('garageUpdated',{detail:v}));}catch(e){}
    // Notify Wix parent so the nav button label can update
    if(_inFrame){try{window.parent.postMessage({type:'garage_saved',vehicle:v},'*');}catch(e){}}
  }

  function gcShowSaved(v){
    var label=v.year+' '+v.make+' '+v.model+(v.trim?' '+v.trim:'')+(v.bedSize?' · '+v.bedSize:'');
    document.getElementById('gc-saved-pill').textContent=label;
    document.getElementById('gc-body').style.display='none';
    document.getElementById('gc-saved').classList.add('show');
    var fabLabel=document.getElementById('gc-fab-label');
    if(fabLabel) fabLabel.textContent=v.year+' '+v.make+' '+v.model;
    if(gcAutoCloseTimer) clearTimeout(gcAutoCloseTimer);
    gcAutoCloseTimer=setTimeout(gcClose,13000);
  }

  function gcClearVehicle(){
    localStorage.removeItem('garage_vehicle');
    var fabLabel=document.getElementById('gc-fab-label');
    if(fabLabel) fabLabel.textContent='My Garage';
    try{window.dispatchEvent(new CustomEvent('garageUpdated',{detail:null}));}catch(e){}
    if(_inFrame){try{window.parent.postMessage({type:'garage_clear',vehicle:null},'*');}catch(e){}}
    gcClose();
  }

  function gcReset(){
    localStorage.removeItem('garage_vehicle');
    document.getElementById('gc-body').style.display='block';
    document.getElementById('gc-saved').classList.remove('show');
    document.getElementById('gc-confirm').classList.remove('show');
    document.getElementById('gc-ymm-year').value='';
    var lbl=document.getElementById('gc-year-label');lbl.textContent='Select Year';lbl.classList.add('ph');
    document.querySelectorAll('.gc-year-cell').forEach(function(c){c.classList.remove('sel');});
    document.getElementById('gc-ymm-make').innerHTML='<option value="">Select Make</option>';
    document.getElementById('gc-ymm-make').disabled=true;
    document.getElementById('gc-ymm-model').innerHTML='<option value="">Select Model</option>';
    document.getElementById('gc-ymm-model').disabled=true;
    var fabLabel=document.getElementById('gc-fab-label');
    if(fabLabel) fabLabel.textContent='My Garage';
  }

  // Expose globally + listen for postMessage from Wix HTML embeds
  window.gcOpen = gcOpen;
  window.addEventListener('message',function(e){
    if(e.data==='openGarage') gcOpen();
    if(e.data&&e.data.type==='garageRequest') gcBroadcast();
  });

  function gcBroadcast(){
    var saved=localStorage.getItem('garage_vehicle');
    if(!saved) return;
    var frames=document.querySelectorAll('iframe');
    frames.forEach(function(f){try{f.contentWindow.postMessage({type:'garageSync',vehicle:JSON.parse(saved)},'*');}catch(e){} });
  }

  // Wire all events via addEventListener — no inline handlers
  document.getElementById('gc-close').addEventListener('click',gcClose);
  document.getElementById('gc-tab-ymm').addEventListener('click',function(){gcTab('ymm');});
  document.getElementById('gc-tab-vin').addEventListener('click',function(){gcTab('vin');});
  document.getElementById('gc-year-btn').addEventListener('click',gcToggleYear);
  document.getElementById('gc-ymm-make').addEventListener('change',gcMakeChange);
  document.getElementById('gc-ymm-model').addEventListener('change',gcModelChange);
  document.getElementById('gc-vin-btn').addEventListener('click',gcDecodeVIN);
  document.getElementById('gc-save-btn').addEventListener('click',gcSave);
  document.getElementById('gc-change-btn').addEventListener('click',function(){if(gcAutoCloseTimer){clearTimeout(gcAutoCloseTimer);gcAutoCloseTimer=null;}gcReset();});
  document.getElementById('gc-continue-btn').addEventListener('click',gcClose);
  document.getElementById('gc-clear-btn').addEventListener('click',gcClearVehicle);
  document.getElementById('gc-ov').addEventListener('click',function(e){if(e.target===document.getElementById('gc-ov'))gcClose();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')gcClose();});
  document.addEventListener('click',function(e){
    var yb=document.getElementById('gc-year-btn');
    var yp=document.getElementById('gc-year-panel');
    if(yb&&yp&&!yb.contains(e.target)&&!yp.contains(e.target))gcCloseYear();
  });

  // Restore saved vehicle on load + broadcast to iframes + notify Wix parent
  (function(){
    var saved=localStorage.getItem('garage_vehicle');
    if(saved){try{gcShowSaved(JSON.parse(saved));}catch(e){}}
    // Broadcast immediately to any already-loaded iframes, then wire load events for late ones
    gcBroadcast();
    document.querySelectorAll('iframe').forEach(function(f){f.addEventListener('load',gcBroadcast);});
    if(window.MutationObserver){
      new MutationObserver(function(muts){
        muts.forEach(function(m){m.addedNodes.forEach(function(n){if(n.tagName==='IFRAME')n.addEventListener('load',gcBroadcast);});});
      }).observe(document.body,{childList:true,subtree:true});
    }
    // Tell Wix parent nav button the current garage state
    if(_inFrame){
      try{
        var v=saved?JSON.parse(saved):null;
        window.parent.postMessage({type:v?'garage_saved':'garage_clear',vehicle:v},'*');
      }catch(e){}
    }
  })();
})();
