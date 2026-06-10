/* ============================================================================
   RLSH Sparkle  v1.0
   A self-contained metallic-shine overlay for the RLSH logo.

   - No dependencies. Vanilla JS. ~6 KB.
   - Background-agnostic: the shine is clipped to the logo art, so it works on
     white, black, or a split between them.
   - Auto-scales: glint size is proportional to the rendered logo width, and a
     ResizeObserver keeps the canvas locked to the image at any size.
   - Reads the logo's bright metal pixels to place the glints (skips the red
     leather), with one slow "sweeping" hero shine on the star's top point.

   USAGE (see README.md):
     <span class="rlsh-sparkle" data-rlsh>
       <img src="rlsh-logo.png" alt="RLSH">   <!-- transparent PNG -->
       <canvas></canvas>
     </span>
   Then load rlsh-sparkle.css once and this file once. It auto-initialises
   every element that has the [data-rlsh] attribute.
   ============================================================================ */
(function () {
  'use strict';

  /* ---- Config -------------------------------------------------------------
     FEATURE_SPOTS : spots that always get a long, slow SWEEPING shine
                     (fractions of the logo: {fx, fy}). Default = star's top point.
     FIXED_SPOTS   : to hand-pick EVERY glint location instead of auto-detecting,
                     list them here as {fx, fy}. Leave empty to auto-detect.
     REF_WIDTH     : the px width the look was tuned at (keeps proportions
                     identical at any rendered size). Don't change unless you
                     re-tune the sizes.
  -------------------------------------------------------------------------- */
  const FEATURE_SPOTS = [{ fx: 0.32, fy: 0.18 }];
  const FIXED_SPOTS   = [];
  const REF_WIDTH     = 560;

  const easeOut = t => 1 - (1 - t) ** 2;
  const easeIn  = t => t * t;

  /* Find bright, non-red metal pixels + their edge orientation */
  function findHighlights(data, iw, ih, sx, sy) {
    const pts = [], STEP = 4;
    const lum = (px, py) => {
      if (px < 0 || py < 0 || px >= iw || py >= ih) return -1;
      const j = (py * iw + px) * 4;
      if (data[j + 3] < 40) return -1;
      return (data[j] + data[j+1] + data[j+2]) / 3;
    };
    for (let y = STEP; y < ih - STEP; y += STEP) {
      for (let x = STEP; x < iw - STEP; x += STEP) {
        const i = (y * iw + x) * 4;
        if (data[i + 3] < 80) continue;
        const r = data[i], g = data[i+1], b = data[i+2];
        const br = (r + g + b) / 3;
        const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
        const sat = mx > 0 ? (mx - mn) / mx : 0;
        const redness = r - Math.max(g, b);
        if (br > 155 && br < 252 && sat < 0.30 && redness < 18) {
          const o = 3, l = lum(x-o,y), rr = lum(x+o,y), u = lum(x,y-o), dn = lum(x,y+o);
          let gx = 0, gy = 0;
          if (l >= 0 && rr >= 0) gx = rr - l;
          if (u >= 0 && dn >= 0) gy = dn - u;
          const mag = Math.hypot(gx, gy);
          const angle = mag > 6 ? Math.atan2(gy, gx) + Math.PI / 2 : (Math.random() - 0.5) * 0.6;
          const intensity = Math.min(1, Math.max(0, (br - 130) / 95));
          pts.push({ x: x * sx, y: y * sy, b: br, intensity, angle });
        }
      }
    }
    return pts;
  }

  function spreadOut(points, count, minDist) {
    const ranked = points.slice().sort((a, b) => (b.b + Math.random()*45) - (a.b + Math.random()*45));
    const chosen = [], md2 = minDist * minDist;
    for (const p of ranked) {
      if (chosen.length >= count) break;
      let ok = true;
      for (const c of chosen) {
        const dx = c.x - p.x, dy = c.y - p.y;
        if (dx*dx + dy*dy < md2) { ok = false; break; }
      }
      if (ok) chosen.push(p);
    }
    return chosen;
  }

  /* Draw one glimmer; bright hotspot sits at `sweep` along the streak */
  function drawSparkle(g, x, y, size, opacity, angle, streak, sweep) {
    if (opacity < 0.01) return;
    g.save();
    g.globalAlpha = opacity;
    g.translate(x, y);
    g.rotate(angle);

    const bloomR = size * 5.5;
    const g1 = g.createRadialGradient(0,0,0, 0,0,bloomR);
    g1.addColorStop(0,    'rgba(255,251,228,0.85)');
    g1.addColorStop(0.25, 'rgba(255,247,210,0.28)');
    g1.addColorStop(0.6,  'rgba(255,244,198,0.07)');
    g1.addColorStop(1,    'rgba(255,242,190,0)');
    g.fillStyle = g1;
    g.beginPath(); g.arc(0,0,bloomR,0,Math.PI*2); g.fill();

    const hr = size * streak, vr = size * 1.4, sh = 0.07;
    const p = (sweep === undefined) ? 0.5 : sweep;
    const lo = p - 0.5, hi = p + 0.5;
    const g2 = g.createLinearGradient(-hr, 0, hr, 0);
    g2.addColorStop(0, 'rgba(255,248,212,0)');
    if (lo > 0.001) g2.addColorStop(lo, 'rgba(255,248,212,0)');
    g2.addColorStop(Math.max(0.001, Math.min(0.999, p)), 'rgba(255,255,255,0.88)');
    if (hi < 0.999) g2.addColorStop(hi, 'rgba(255,248,212,0)');
    g2.addColorStop(1, 'rgba(255,248,212,0)');
    g.fillStyle = g2;
    g.beginPath();
    g.moveTo( sh*hr, -sh*vr); g.lineTo(0,  -vr);
    g.lineTo(-sh*hr, -sh*vr); g.lineTo(-hr,  0);
    g.lineTo(-sh*hr,  sh*vr); g.lineTo(0,   vr);
    g.lineTo( sh*hr,  sh*vr); g.lineTo( hr,  0);
    g.closePath(); g.fill();

    const g3 = g.createRadialGradient(0,0,0, 0,0,size*0.7);
    g3.addColorStop(0, 'rgba(255,255,255,0.9)');
    g3.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = g3;
    g.beginPath(); g.arc(0,0,size*0.7,0,Math.PI*2); g.fill();

    g.restore();
  }

  class Sparkle {
    constructor(bx, by, initDelay, intensity, edgeAngle, scale) {
      this.bx = bx; this.by = by; this.x = bx; this.y = by;
      this.delay = (initDelay !== undefined) ? initDelay : ~~(Math.random()*180);
      this.bright = (intensity !== undefined) ? intensity : Math.random();
      this.edgeAngle = (edgeAngle !== undefined) ? edgeAngle : (Math.random()-0.5)*0.6;
      this.scale = scale || 1;
      this.feature = false; this.sweep = 0.5; this.elapsed = 0; this.totalLife = 1;
      this.phase = 'delay'; this.life = 0;
      this.size = 0; this.opacity = 0; this.maxOp = 0;
      this.angle = 0; this.streak = 1; this.inD = 0; this.holdD = 0; this.outD = 0;
    }
    spawn() {
      const k = this.bright, S = this.scale;
      if (this.feature) {
        this.size = (4.0 + Math.random()*1.6) * S;
        this.maxOp = 0.85;
        this.streak = 11 + Math.random()*3;
        this.angle = this.edgeAngle + (Math.random()-0.5)*0.12;
        this.inD = 60 + ~~(Math.random()*30);
        this.holdD = 26 + ~~(Math.random()*30);
        this.outD = 80 + ~~(Math.random()*50);
        this.x = this.bx; this.y = this.by;
      } else {
        const kk = k * k;
        this.size = (1.8 + Math.random()*1.0 + kk*3.2) * S;
        this.maxOp = 0.12 + Math.random()*0.07 + kk*0.72;
        this.streak = 2.2 + kk*7.5;
        this.angle = this.edgeAngle + (Math.random()-0.5)*0.25;
        this.inD = 26 + ~~(Math.random()*34);
        this.holdD = 2 + ~~(Math.random()*8) + ~~(k*16);
        this.outD = 34 + ~~(Math.random()*46) + ~~(k*34);
        this.x = this.bx + (Math.random()-0.5)*11*S;
        this.y = this.by + (Math.random()-0.5)*11*S;
      }
      this.totalLife = this.inD + this.holdD + this.outD;
      this.elapsed = 0; this.life = 0; this.phase = 'in';
    }
    update() {
      if (this.phase === 'delay') { if (--this.delay <= 0) this.spawn(); return; }
      this.life++; this.elapsed++;
      if (this.feature) this.sweep = Math.min(1, this.elapsed / this.totalLife);
      if (this.phase === 'in') {
        this.opacity = this.maxOp * easeOut(Math.min(1, this.life/this.inD));
        if (this.life >= this.inD) { this.phase='hold'; this.life=0; this.opacity=this.maxOp; }
      } else if (this.phase === 'hold') {
        if (this.life >= this.holdD) { this.phase='out'; this.life=0; }
      } else {
        this.opacity = this.maxOp * (1 - easeIn(Math.min(1, this.life/this.outD)));
        if (this.life >= this.outD) { this.phase='delay'; this.delay = 90 + ~~(Math.random()*480); }
      }
    }
    draw(g) { drawSparkle(g, this.x, this.y, this.size, this.opacity, this.angle, this.streak, this.sweep); }
  }

  function initOne(root) {
    const img = root.querySelector('img');
    const canvas = root.querySelector('canvas');
    if (!img || !canvas) return;
    const ctx = canvas.getContext('2d');
    let rafId = null, timer = null, sparkles = [];
    let metalData = null, metalIW = 0, metalIH = 0, LW = 0, LH = 0;

    function sampleMetal(fx, fy) {
      if (!metalData) return { intensity: 0.7, angle: (Math.random()-0.5)*0.6 };
      const px = Math.min(metalIW-1, Math.max(0, Math.round(fx*metalIW)));
      const py = Math.min(metalIH-1, Math.max(0, Math.round(fy*metalIH)));
      const idx = (py*metalIW+px)*4;
      const br = (metalData[idx]+metalData[idx+1]+metalData[idx+2])/3;
      const L = (x,y) => {
        if (x<0||y<0||x>=metalIW||y>=metalIH) return -1;
        const j = (y*metalIW+x)*4;
        if (metalData[j+3] < 40) return -1;
        return (metalData[j]+metalData[j+1]+metalData[j+2])/3;
      };
      const o = 3, l=L(px-o,py), rr=L(px+o,py), u=L(px,py-o), dn=L(px,py+o);
      let gx=0, gy=0;
      if (l>=0&&rr>=0) gx=rr-l;
      if (u>=0&&dn>=0) gy=dn-u;
      const mag = Math.hypot(gx,gy);
      const angle = mag>6 ? Math.atan2(gy,gx)+Math.PI/2 : (Math.random()-0.5)*0.6;
      const intensity = Math.max(0.5, Math.min(1, (br-130)/95));
      return { intensity, angle };
    }

    function build() {
      const W = img.offsetWidth, H = img.offsetHeight;
      if (!W || !H) { clearTimeout(timer); timer = setTimeout(build, 100); return; }
      if (rafId) cancelAnimationFrame(rafId);

      canvas.width = W; canvas.height = H;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      LW = W; LH = H;
      const S = W / REF_WIDTH;

      const off = document.createElement('canvas');
      off.width = img.naturalWidth; off.height = img.naturalHeight;
      const oc = off.getContext('2d');
      oc.drawImage(img, 0, 0);
      metalIW = off.width; metalIH = off.height;

      const mask = document.createElement('canvas');
      mask.width = W; mask.height = H;
      const mc = mask.getContext('2d');
      mc.filter = 'blur(' + Math.max(1, 3 * S) + 'px)';
      mc.drawImage(img, 0, 0, W, H);
      mc.filter = 'none';

      const fx = document.createElement('canvas');
      fx.width = W; fx.height = H;
      const fxc = fx.getContext('2d');

      let pts = [];
      try {
        const id = oc.getImageData(0, 0, off.width, off.height);
        metalData = id.data;
        pts = findHighlights(id.data, off.width, off.height, W/off.width, H/off.height);
      } catch (e) { metalData = null; }   // tainted canvas (cross-origin image)

      sparkles = [];
      if (FIXED_SPOTS.length) {
        FIXED_SPOTS.forEach(s => {
          const m = sampleMetal(s.fx, s.fy);
          sparkles.push(new Sparkle(s.fx*W, s.fy*H, ~~(Math.random()*320), m.intensity, m.angle, S));
        });
      } else if (pts.length) {
        spreadOut(pts, 13, W*0.12).forEach(p =>
          sparkles.push(new Sparkle(p.x, p.y, ~~(Math.random()*320), p.intensity, p.angle, S)));
      }
      FEATURE_SPOTS.forEach(s => {
        const m = sampleMetal(s.fx, s.fy);
        const f = new Sparkle(s.fx*W, s.fy*H, 40 + ~~(Math.random()*120), Math.max(0.9, m.intensity), m.angle, S);
        f.feature = true;
        sparkles.push(f);
      });

      function loop() {
        ctx.clearRect(0, 0, W, H);
        fxc.clearRect(0, 0, W, H);
        sparkles.forEach(s => { s.update(); s.draw(fxc); });
        fxc.globalCompositeOperation = 'destination-in';
        fxc.drawImage(mask, 0, 0);
        fxc.globalCompositeOperation = 'source-over';
        ctx.drawImage(fx, 0, 0);
        rafId = requestAnimationFrame(loop);
      }
      loop();
    }

    if (img.complete && img.naturalWidth > 0) build();
    else img.addEventListener('load', build);

    window.addEventListener('resize', () => { clearTimeout(timer); timer = setTimeout(build, 200); });
    if (window.ResizeObserver) {
      new ResizeObserver(() => { clearTimeout(timer); timer = setTimeout(build, 120); }).observe(img);
    }
  }

  function initAll() { document.querySelectorAll('[data-rlsh]').forEach(initOne); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAll);
  else initAll();
})();
