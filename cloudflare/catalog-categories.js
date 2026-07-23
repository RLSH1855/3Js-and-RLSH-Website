// ── Shared catalog category definitions & lazy data loader ──
//
// Loaded by BOTH parts-catalog.html and product-detail-page.html so the two
// pages always agree on which data files belong to which category and how
// each brand's rows are normalized.
//
// Before this file existed, product-detail-page.html only ever loaded
// catalog-data.js (tonneau covers), so clicking any product in the other 13
// categories landed on "PRODUCT NOT FOUND".
//
// Data files are loaded on demand. Only catalog-data.js and
// extra-tonneau-data.js are loaded up front (the default Tonneau view);
// everything else arrives when a category is actually opened.

(function (global) {
  'use strict';

  // Files already present via static <script> tags on the host page.
  var _loaded = new Set(['catalog-data.js', 'extra-tonneau-data.js']);
  var _CDN = '';

  function loadDataScript(file) {
    return new Promise(function (res) {
      if (_loaded.has(file)) { res(); return; }
      var s = document.createElement('script');
      s.src = _CDN + file;
      s.onload = function () { _loaded.add(file); res(); };
      s.onerror = function () { console.warn('Failed to load:', file); res(); };
      document.head.appendChild(s);
    });
  }

  function loadDataFiles(files) {
    return Promise.all((files || []).map(loadDataScript));
  }

  function safeArr(v) { return typeof v !== 'undefined' ? v : []; }

  // ── Schema normalizers ──
  // Running boards files: [brand,product,partNum,cabType,startYear,endYear,make,model,desc,price,img]
  // Standard format:      [brand,product,partNum,bedIn,bedSize,startYear,endYear,make,model,desc,fitNote,map,img]
  function normRB(rows) {
    return rows.map(function (r) {
      return [r[0], r[1], r[2], null, r[3] || null, r[4], r[5], r[6], r[7], r[8], null, r[9], r[10]];
    });
  }
  // Headache racks: [brand,product,partNum,startYear,endYear,make,model,desc,price,img]
  function normHR(rows) {
    return rows.map(function (r) {
      return [r[0], r[1], r[2], null, null, r[3], r[4], r[5], r[6], r[7], null, r[8], r[9]];
    });
  }

  // Globals are read at call time — the data files that define them are
  // loaded on demand, so these must not be captured when this file runs.
  var g = global;

  // ── Category definitions ──
  // files:   lazy-loaded on first select
  // getData: called after files load, returns rows in the standard format
  var CATEGORY_DEFS = [
    {
      id: 'tonneau', name: 'Tonneau Covers', catLabel: 'Tonneau Covers',
      heroTitle: 'Bed Covers', heroSub: 'Locked-in fitment for your truck. We show you covers that bolt on — nothing else.',
      files: [], approxCount: 51,
      getData: function () { return [].concat(safeArr(g.CATALOG), safeArr(g.EXTRA_TONNEAU), safeArr(g.TRAILFX_TONNEAU)); }
    },
    {
      id: 'running-boards', name: 'Running Boards', catLabel: 'Running Boards',
      heroTitle: 'Running Boards & Steps', heroSub: 'Step up your truck. Professionally installed at 3J\'s Auto Body.',
      files: ['running-boards-data.js', 'amp-data.js', 'gorhino-data.js', 'westin-data.js', 'lund-data.js'], approxCount: 420,
      getData: function () {
        return [].concat(
          normRB([].concat(safeArr(g.RB_CATALOG), safeArr(g.AMP_CATALOG), safeArr(g.GR_CATALOG), safeArr(g.WESTIN_CATALOG), safeArr(g.LUND_CATALOG))),
          safeArr(g.NFAB_STEPS), safeArr(g.LUND_RB), safeArr(g.ARIES_RB), safeArr(g.TRAILFX_RB)
        );
      }
    },
    {
      id: 'headache-racks', name: 'Headache Racks', catLabel: 'Headache Racks',
      heroTitle: 'Headache Racks', heroSub: 'Protect your cab glass and secure your cargo. Professionally installed.',
      files: ['headache-racks-data.js'], approxCount: 85,
      getData: function () { return [].concat(normHR(safeArr(g.HR_CATALOG)), safeArr(g.NFAB_RACKS), safeArr(g.ARIES_HR)); }
    },
    {
      id: 'fender-flares', name: 'Fender Flares', catLabel: 'Fender Flares',
      heroTitle: 'Fender Flares', heroSub: 'Bushwacker, Stampede, and Lund fender flares. Professionally installed.',
      files: ['fender-flares-data.js'], approxCount: 180,
      getData: function () { return [].concat(safeArr(g.FF_CATALOG), safeArr(g.LUND_FF), safeArr(g.ARIES_FF), safeArr(g.TRAILFX_FF)); }
    },
    {
      id: 'deflectors', name: 'Deflectors', catLabel: 'Hood & Window Deflectors',
      heroTitle: 'Hood & Window Deflectors', heroSub: 'AVS Aeroskin, Ventvisor, and Ventshade. Installed at 3J\'s.',
      files: ['deflectors-data.js'], approxCount: 220,
      getData: function () { return [].concat(safeArr(g.DEF_CATALOG), safeArr(g.TRAILFX_DEF)); }
    },
    {
      id: 'lighting', name: 'Lighting', catLabel: 'Lighting',
      heroTitle: 'Lighting', heroSub: 'Off-road and vehicle-specific lighting. Baja Designs, KC HiLites, Morimoto and more.',
      files: ['lighting-data.js'], approxCount: 600,
      getData: function () { return safeArr(g.LIGHTING_CATALOG); }
    },
    {
      id: 'grilles', name: 'Grilles', catLabel: 'Grilles',
      heroTitle: 'Grilles', heroSub: 'Morimoto XB LED and OEM-style grilles. Plug-and-play for your truck.',
      files: ['grilles-data.js'], approxCount: 63,
      getData: function () { return safeArr(g.GRILLE_CATALOG); }
    },
    {
      id: 'bed-protection', name: 'Bed Protection', catLabel: 'Bed Protection',
      heroTitle: 'Bed Mats & Bed Protection', heroSub: 'Husky Liners Guardian bed mats and liners. Installed at 3J\'s.',
      files: ['husky-data.js'], approxCount: 120,
      getData: function () { return [].concat(safeArr(g.HUSKY_CATALOG), safeArr(g.TRAILFX_BEDPROT)); }
    },
    {
      id: 'floor-liners', name: 'Floor Liners', catLabel: 'Floor Liners',
      heroTitle: 'Floor Liners & Mats', heroSub: 'Husky Liners Classic Style, WeatherBeater, and Heavy Duty floor liners. Custom-fit for your truck.',
      files: ['floor-liners-data.js'], approxCount: 310,
      getData: function () { return safeArr(g.FLOOR_CATALOG); }
    },
    {
      id: 'grille-guards', name: 'Grille Guards', catLabel: 'Grille Guards',
      heroTitle: 'Grille Guards & Brush Guards', heroSub: 'Aries steel grille guards and bumper guards. Professionally installed.',
      files: ['grille-guards-data.js'], approxCount: 90,
      getData: function () { return [].concat(safeArr(g.ARIES_GG), safeArr(g.TRAILFX_GG)); }
    },
    {
      id: 'bull-bars', name: 'Bull Bars', catLabel: 'Bull Bars',
      heroTitle: 'Bull Bars', heroSub: 'Lund Revolution and standard bull bars with integrated lighting. Professionally installed.',
      files: ['bull-bars-data.js'], approxCount: 30,
      getData: function () { return [].concat(safeArr(g.BULLBAR_CATALOG), safeArr(g.TRAILFX_BB)); }
    },
    {
      id: 'towing', name: 'Towing', catLabel: 'Towing Equipment',
      heroTitle: 'Towing Equipment', heroSub: 'CURT and B&W hitches, gooseneck, 5th wheel, ball mounts and wiring. Professionally installed.',
      files: ['towing-data.js', 'bw-hitches-data.js'], approxCount: 400,
      getData: function () { return [].concat(safeArr(g.CURT_CATALOG), safeArr(g.BW_CATALOG)); }
    },
    {
      id: 'tool-boxes', name: 'Tool Boxes', catLabel: 'Tool Boxes & Bed Storage',
      heroTitle: 'Tool Boxes & Bed Storage', heroSub: 'TrailFX truck tool boxes and bed side rails. Professionally installed at 3J\'s.',
      files: ['trailfx-data.js'], approxCount: 60,
      getData: function () { return safeArr(g.TRAILFX_TOOLBOX); }
    },
    {
      id: 'jeep-offroad', name: 'Jeep & Off-Road', catLabel: 'Jeep & Off-Road',
      heroTitle: 'Jeep & Off-Road', heroSub: 'Smittybilt bumpers, winches, soft tops and off-road gear. Professionally installed at 3J\'s.',
      files: ['smittybilt-data.js'], approxCount: 196,
      getData: function () { return safeArr(g.SMITTYBILT_CATALOG); }
    }
  ];

  function getCategory(id) {
    for (var i = 0; i < CATEGORY_DEFS.length; i++) {
      if (CATEGORY_DEFS[i].id === id) return CATEGORY_DEFS[i];
    }
    return null;
  }

  // Loads a category's data files, then returns its rows in standard format.
  function loadCategory(id) {
    var def = getCategory(id) || CATEGORY_DEFS[0];
    return loadDataFiles(def.files).then(function () {
      return { def: def, rows: def.getData() };
    });
  }

  global.RLSHCatalog = {
    CATEGORY_DEFS: CATEGORY_DEFS,
    getCategory: getCategory,
    loadCategory: loadCategory,
    loadDataFiles: loadDataFiles,
    safeArr: safeArr,
    normRB: normRB,
    normHR: normHR
  };
})(window);
