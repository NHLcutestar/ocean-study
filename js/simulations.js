/**
 * OceanLearn - Interactive Oceanography Physics Simulations Engine
 * 包含 6 大互動模擬實驗室：
 * 1. T-S Diagram & Cabbeling (溫鹽圖與混和增密)
 * 2. Marcet's Law & Seawater Ion Calculator (恆定組成定律與離子計算機)
 * 3. Wave Particle Orbits & Breaking Limit (深水波/淺水波水質點運動與碎波極限)
 * 4. SOFAR Acoustic Waveguide Tracer (深海低頻聲道司乃爾射線折射追蹤)
 * 5. Earth-Moon-Sun Tidal Bulge Simulator (日地月引潮力與大潮小潮幾何)
 * 6. Ekman Transport & Coastal Upwelling (埃克曼傳輸與沿岸湧升流動態模擬)
 */

window.OceanSims = (function() {
  // UNESCO simplified equation of state for seawater density anomaly sigma_t (kg/m^3)
  function calcDensityAnomaly(T, S) {
    // T in deg C, S in PSU/ppt
    // Pure water density
    const rhow = 999.842594 + 6.793952e-2 * T - 9.095290e-3 * Math.pow(T, 2) +
                 1.001685e-4 * Math.pow(T, 3) - 1.120083e-6 * Math.pow(T, 4) + 6.536332e-9 * Math.pow(T, 5);
    // Salinity contribution
    const A = 8.24493e-1 - 4.0899e-3 * T + 7.6438e-5 * Math.pow(T, 2) - 8.2467e-7 * Math.pow(T, 3) + 5.3875e-9 * Math.pow(T, 4);
    const B = -5.72466e-3 + 1.0227e-4 * T - 1.6546e-6 * Math.pow(T, 2);
    const C = 4.8314e-4;
    const rho = rhow + A * S + B * Math.pow(S, 1.5) + C * Math.pow(S, 2);
    return rho - 1000.0; // sigma_t in kg/m^3
  }

  // Freezing point of seawater (Tf in deg C)
  function calcFreezingPoint(S) {
    return -0.0575 * S + 1.710523e-3 * Math.pow(S, 1.5) - 2.154996e-4 * Math.pow(S, 2);
  }

  // Temperature of maximum density for liquid water
  function calcTmaxDensity(S) {
    return 3.98 - 0.2229 * S;
  }

  // =========================================================================
  // SIMULATION 1: T-S Diagram & Cabbeling Simulator
  // =========================================================================
  function initTSDiagram() {
    const canvas = document.getElementById('tsCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Controls
    const tAInput = document.getElementById('ts-ta');
    const sAInput = document.getElementById('ts-sa');
    const tBInput = document.getElementById('ts-tb');
    const sBInput = document.getElementById('ts-sb');

    const taVal = document.getElementById('val-ta');
    const saVal = document.getElementById('val-sa');
    const tbVal = document.getElementById('val-tb');
    const sbVal = document.getElementById('val-sb');

    const resSigA = document.getElementById('res-sigA');
    const resSigB = document.getElementById('res-sigB');
    const resSigMix = document.getElementById('res-sigMix');
    const resDelta = document.getElementById('res-deltaSig');
    const cabbelingNote = document.getElementById('cabbeling-status');

    // Bounds
    const S_MIN = 33.0, S_MAX = 37.0;
    const T_MIN = 0.0, T_MAX = 20.0;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * (window.devicePixelRatio || 1);
      canvas.height = rect.height * (window.devicePixelRatio || 1);
      draw();
    }

    function toCanvasX(S, w, padL, padR) {
      return padL + ((S - S_MIN) / (S_MAX - S_MIN)) * (w - padL - padR);
    }

    function toCanvasY(T, h, padT, padB) {
      return h - padB - ((T - T_MIN) / (T_MAX - T_MIN)) * (h - padT - padB);
    }

    function draw() {
      const w = canvas.width;
      const h = canvas.height;
      const dpr = window.devicePixelRatio || 1;
      ctx.clearRect(0, 0, w, h);

      const padL = 60 * dpr;
      const padR = 30 * dpr;
      const padT = 30 * dpr;
      const padB = 50 * dpr;

      // Draw background grid & isopycnals
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 1 * dpr;

      // Grid lines
      for (let s = 33; s <= 37; s += 0.5) {
        const x = toCanvasX(s, w, padL, padR);
        ctx.beginPath();
        ctx.moveTo(x, padT);
        ctx.lineTo(x, h - padB);
        ctx.stroke();

        ctx.fillStyle = '#64748b';
        ctx.font = `${11 * dpr}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(s.toFixed(1), x, h - padB + 18 * dpr);
      }

      for (let t = 0; t <= 20; t += 2) {
        const y = toCanvasY(t, h, padT, padB);
        ctx.beginPath();
        ctx.moveTo(padL, y);
        ctx.lineTo(w - padR, y);
        ctx.stroke();

        ctx.fillStyle = '#64748b';
        ctx.font = `${11 * dpr}px sans-serif`;
        ctx.textAlign = 'right';
        ctx.fillText(t + '°C', padL - 10 * dpr, y + 4 * dpr);
      }

      // Axis labels
      ctx.fillStyle = '#94a3b8';
      ctx.font = `bold ${12 * dpr}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('鹽度 Salinity (‰ / PSU)', padL + (w - padL - padR) / 2, h - 12 * dpr);

      ctx.save();
      ctx.translate(18 * dpr, padT + (h - padT - padB) / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('溫度 Temperature (°C)', 0, 0);
      ctx.restore();

      // Render Isopycnals (sigma_t contours) from 24.0 to 29.0
      ctx.lineWidth = 1.2 * dpr;
      for (let sigma = 24.0; sigma <= 29.0; sigma += 0.5) {
        ctx.beginPath();
        ctx.strokeStyle = (sigma % 1 === 0) ? 'rgba(0, 242, 254, 0.35)' : 'rgba(0, 242, 254, 0.15)';
        let started = false;
        let lastPt = null;

        for (let s = S_MIN; s <= S_MAX; s += 0.05) {
          // Binary search for temperature matching this sigma
          let tLow = T_MIN, tHigh = T_MAX;
          let matchT = null;
          for (let step = 0; step < 15; step++) {
            let tMid = (tLow + tHigh) / 2;
            let sig = calcDensityAnomaly(tMid, s);
            if (sig < sigma) {
              tHigh = tMid; // warmer -> lighter
            } else {
              tLow = tMid;  // colder -> denser
            }
          }
          let foundT = (tLow + tHigh) / 2;
          if (foundT >= T_MIN && foundT <= T_MAX) {
            const px = toCanvasX(s, w, padL, padR);
            const py = toCanvasY(foundT, h, padT, padB);
            if (!started) {
              ctx.moveTo(px, py);
              started = true;
            } else {
              ctx.lineTo(px, py);
            }
            lastPt = { x: px, y: py, s, t: foundT };
          }
        }
        ctx.stroke();

        // Label on contour
        if (lastPt && sigma % 1 === 0) {
          ctx.fillStyle = 'rgba(0, 242, 254, 0.6)';
          ctx.font = `${10 * dpr}px sans-serif`;
          ctx.textAlign = 'left';
          ctx.fillText(`σt=${sigma}`, lastPt.x - 45 * dpr, lastPt.y - 4 * dpr);
        }
      }

      // Read values
      const tA = parseFloat(tAInput.value);
      const sA = parseFloat(sAInput.value);
      const tB = parseFloat(tBInput.value);
      const sB = parseFloat(sBInput.value);

      taVal.textContent = tA.toFixed(1) + ' °C';
      saVal.textContent = sA.toFixed(1) + ' ‰';
      tbVal.textContent = tB.toFixed(1) + ' °C';
      sbVal.textContent = sB.toFixed(1) + ' ‰';

      const sigA = calcDensityAnomaly(tA, sA);
      const sigB = calcDensityAnomaly(tB, sB);

      // 50:50 Mixture
      const tMix = (tA + tB) / 2;
      const sMix = (sA + sB) / 2;
      const sigMix = calcDensityAnomaly(tMix, sMix);
      const avgSig = (sigA + sigB) / 2;
      const deltaSig = sigMix - avgSig;

      resSigA.textContent = sigA.toFixed(3) + ' kg/m³';
      resSigB.textContent = sigB.toFixed(3) + ' kg/m³';
      resSigMix.textContent = sigMix.toFixed(3) + ' kg/m³';
      resDelta.textContent = (deltaSig >= 0 ? '+' : '') + deltaSig.toFixed(4) + ' kg/m³';

      if (deltaSig > 0.001) {
        cabbelingNote.innerHTML = `<span class="text-teal-300 font-semibold">⚡ 混和增密現象 (Cabbeling) 發生！</span> 兩水塊混合後平均密度增加 <strong>+${deltaSig.toFixed(4)} kg/m³</strong>，混合水體將下沉！`;
        cabbelingNote.className = "p-3 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-200 text-sm";
      } else {
        cabbelingNote.innerHTML = `請調整兩水團溫鹽，使兩者密度相近但溫鹽不同（例如 A: 低溫淡水、B: 高溫鹹水），即可觀察到顯著的混和增密效應。`;
        cabbelingNote.className = "p-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 text-sm";
      }

      const xA = toCanvasX(sA, w, padL, padR);
      const yA = toCanvasY(tA, h, padT, padB);
      const xB = toCanvasX(sB, w, padL, padR);
      const yB = toCanvasY(tB, h, padT, padB);
      const xMix = toCanvasX(sMix, w, padL, padR);
      const yMix = toCanvasY(tMix, h, padT, padB);

      // Mixing Line
      ctx.beginPath();
      ctx.setLineDash([5 * dpr, 4 * dpr]);
      ctx.strokeStyle = '#feca57';
      ctx.lineWidth = 2 * dpr;
      ctx.moveTo(xA, yA);
      ctx.lineTo(xB, yB);
      ctx.stroke();
      ctx.setLineDash([]);

      // Point A
      ctx.beginPath();
      ctx.arc(xA, yA, 7 * dpr, 0, Math.PI * 2);
      ctx.fillStyle = '#00f2fe';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2 * dpr;
      ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${12 * dpr}px sans-serif`;
      ctx.fillText(`水塊 A (σt=${sigA.toFixed(2)})`, xA + 12 * dpr, yA - 4 * dpr);

      // Point B
      ctx.beginPath();
      ctx.arc(xB, yB, 7 * dpr, 0, Math.PI * 2);
      ctx.fillStyle = '#ff7675';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2 * dpr;
      ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.fillText(`水塊 B (σt=${sigB.toFixed(2)})`, xB + 12 * dpr, yB - 4 * dpr);

      // Point Mix
      ctx.beginPath();
      ctx.arc(xMix, yMix, 8 * dpr, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2.5 * dpr;
      ctx.stroke();
      ctx.fillStyle = '#6ee7b7';
      ctx.fillText(`混合水體 C (σt=${sigMix.toFixed(2)})`, xMix + 12 * dpr, yMix + 18 * dpr);
    }

    [tAInput, sAInput, tBInput, sBInput].forEach(el => el.addEventListener('input', draw));

    // Preset Buttons
    document.querySelectorAll('[data-ts-preset]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const preset = e.target.getAttribute('data-ts-preset');
        if (preset === 'equal-density') {
          // A: 0 C, 34.25 PSU (~27.5), B: 10 C, 35.65 PSU (~27.5)
          tAInput.value = 0.5; sAInput.value = 34.25;
          tBInput.value = 10.0; sBInput.value = 35.65;
        } else if (preset === 'polar') {
          tAInput.value = -0.5; sAInput.value = 34.4;
          tBInput.value = 4.0; sBInput.value = 34.9;
        }
        draw();
      });
    });

    window.addEventListener('resize', resize);
    resize();
  }

  // =========================================================================
  // SIMULATION 2: Marcet's Law & Knudsen Ion Calculator
  // =========================================================================
  function initIonCalculator() {
    const sInput = document.getElementById('calc-salinity');
    const clInput = document.getElementById('calc-chlorinity');
    const tableBody = document.getElementById('ion-table-body');
    if (!sInput || !clInput || !tableBody) return;

    // Grasshoff et al. (1999) Table 11-1 at S = 35
    const standardIons = [
      { name: '氯離子 (Cl⁻)', formula: 'Cl⁻', stdG: 19.3530, stdMol: 0.54588, gCl: 0.99891, molCl: 0.0281759 },
      { name: '鈉離子 (Na⁺)', formula: 'Na⁺', stdG: 10.7816, stdMol: 0.46897, gCl: 0.55650, molCl: 0.0242100 },
      { name: '硫酸根 (SO₄²⁻)', formula: 'SO₄²⁻', stdG: 2.7124, stdMol: 0.02824, gCl: 0.14000, molCl: 0.0145740 },
      { name: '鎂離子 (Mg²⁺)', formula: 'Mg²⁺', stdG: 1.2837, stdMol: 0.05282, gCl: 0.06626, molCl: 0.0272600 },
      { name: '鈣離子 (Ca²⁺)', formula: 'Ca²⁺', stdG: 0.4121, stdMol: 0.01028, gCl: 0.02127, molCl: 0.0005307 },
      { name: '鉀離子 (K⁺)', formula: 'K⁺', stdG: 0.3991, stdMol: 0.01021, gCl: 0.02060, molCl: 0.0005269 },
      { name: '碳酸氫根 (HCO₃⁻)', formula: 'HCO₃⁻', stdG: 0.1135, stdMol: 0.00186, gCl: 0.00586, molCl: 0.0000960 },
      { name: '溴離子 (Br⁻)', formula: 'Br⁻', stdG: 0.0067, stdMol: 0.00084, gCl: 0.00347, molCl: 0.0000434 },
      { name: '硼酸 (B(OH)₃)', formula: 'B(OH)₃', stdG: 0.0203, stdMol: 0.00033, gCl: 0.00105, molCl: 0.0000170 },
      { name: '碳酸根 (CO₃²⁻)', formula: 'CO₃²⁻', stdG: 0.0116, stdMol: 0.00019, gCl: 0.00060, molCl: 0.0000100 },
      { name: '鍶離子 (Sr²⁺)', formula: 'Sr²⁺', stdG: 0.0079, stdMol: 0.00009, gCl: 0.00041, molCl: 0.0000047 },
      { name: '氟離子 (F⁻)', formula: 'F⁻', stdG: 0.0013, stdMol: 0.00007, gCl: 0.000067, molCl: 0.0000035 }
    ];

    let updating = false;

    function renderTable(S, Cl) {
      const factor = S / 35.0;
      let html = '';
      standardIons.forEach((ion) => {
        const curG = (ion.stdG * factor).toFixed(4);
        const curMol = (ion.stdMol * factor).toFixed(5);
        html += `
          <tr>
            <td class="font-medium text-slate-200">${ion.name}</td>
            <td class="font-mono text-cyan-300 font-semibold">${curG}</td>
            <td class="font-mono text-slate-300">${curMol}</td>
            <td class="font-mono text-emerald-400 font-semibold">${ion.gCl.toFixed(5)}</td>
            <td class="font-mono text-slate-400">${ion.molCl.toFixed(7)}</td>
          </tr>
        `;
      });
      tableBody.innerHTML = html;
    }

    sInput.addEventListener('input', () => {
      if (updating) return;
      updating = true;
      const S = parseFloat(sInput.value) || 35.0;
      // Knudsen formula S = 1.80655 * Cl => Cl = S / 1.80655
      const Cl = S / 1.80655;
      clInput.value = Cl.toFixed(4);
      renderTable(S, Cl);
      updating = false;
    });

    clInput.addEventListener('input', () => {
      if (updating) return;
      updating = true;
      const Cl = parseFloat(clInput.value) || 19.3530;
      const S = 1.80655 * Cl;
      sInput.value = S.toFixed(3);
      renderTable(S, Cl);
      updating = false;
    });

    // Preset button triggers
    document.querySelectorAll('[data-ion-preset]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const val = e.target.getAttribute('data-ion-preset');
        if (val === 'standard-35') {
          sInput.value = 35.0;
          clInput.value = (35.0 / 1.80655).toFixed(4);
        } else if (val === 'red-sea-40') {
          sInput.value = 40.0;
          clInput.value = (40.0 / 1.80655).toFixed(4);
        } else if (val === 'baltic-10') {
          sInput.value = 10.0;
          clInput.value = (10.0 / 1.80655).toFixed(4);
        } else if (val === 'scenario-30') {
          sInput.value = 30.0;
          clInput.value = (30.0 / 1.80655).toFixed(4);
        }
        renderTable(parseFloat(sInput.value), parseFloat(clInput.value));
      });
    });

    renderTable(35.0, 19.3530);
  }

  // =========================================================================
  // SIMULATION 3: Wave Physics, Particle Orbits & Shoaling
  // =========================================================================
  function initWaveSimulator() {
    const canvas = document.getElementById('waveCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const depthSlider = document.getElementById('wave-depth');
    const lengthSlider = document.getElementById('wave-length');
    const heightSlider = document.getElementById('wave-height');

    const depthVal = document.getElementById('val-wave-depth');
    const lengthVal = document.getElementById('val-wave-length');
    const heightVal = document.getElementById('val-wave-height');

    const typeBadge = document.getElementById('wave-type-badge');
    const speedVal = document.getElementById('val-wave-speed');
    const periodVal = document.getElementById('val-wave-period');
    const steepnessVal = document.getElementById('val-wave-steepness');
    const breakAlert = document.getElementById('wave-breaking-alert');

    let animId = null;
    let tTime = 0;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * (window.devicePixelRatio || 1);
      canvas.height = rect.height * (window.devicePixelRatio || 1);
    }

    function render() {
      const w = canvas.width;
      const h = canvas.height;
      const dpr = window.devicePixelRatio || 1;
      ctx.clearRect(0, 0, w, h);

      const depth = parseFloat(depthSlider.value);      // m
      const wavelength = parseFloat(lengthSlider.value); // m
      const height = parseFloat(heightSlider.value);    // m

      depthVal.textContent = depth + ' m';
      lengthVal.textContent = wavelength + ' m';
      heightVal.textContent = height + ' m';

      const g = 9.81;
      const k = (2 * Math.PI) / wavelength;
      const kh = k * depth;

      // Wave speed C
      const C = Math.sqrt((g * wavelength / (2 * Math.PI)) * Math.tanh(kh));
      const period = wavelength / C;
      const steepness = height / wavelength;
      const hOverL = depth / wavelength;

      speedVal.textContent = C.toFixed(2) + ' m/s (' + (C * 3.6).toFixed(1) + ' km/h)';
      periodVal.textContent = period.toFixed(2) + ' 秒';
      steepnessVal.textContent = steepness.toFixed(4) + (steepness >= 1/7 ? ' [超過極限 1/7!]' : ' (臨界 0.143)');

      // Classify wave type
      if (hOverL > 0.5) {
        typeBadge.textContent = '深水波 (Deep Water Wave: h > L/2)';
        typeBadge.className = 'badge badge-cyan';
      } else if (hOverL < 0.05) {
        typeBadge.textContent = '淺水波 (Shallow Water Wave: h < L/20)';
        typeBadge.className = 'badge badge-coral';
      } else {
        typeBadge.textContent = '過渡波 (Transitional Wave: L/20 ≤ h ≤ L/2)';
        typeBadge.className = 'badge badge-amber';
      }

      if (steepness >= 1/7) {
        breakAlert.classList.remove('hidden');
      } else {
        breakAlert.classList.add('hidden');
      }

      // Drawing coordinate maps
      // Visual depth display: let seabed be at bottom 85% of canvas
      const seaSurfaceY = 90 * dpr;
      const seaBedY = h - 40 * dpr;
      const visualDepthHeight = seaBedY - seaSurfaceY;

      // Draw Seabed
      ctx.fillStyle = '#2d1e12';
      ctx.fillRect(0, seaBedY, w, 40 * dpr);
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 3 * dpr;
      ctx.beginPath();
      ctx.moveTo(0, seaBedY);
      ctx.lineTo(w, seaBedY);
      ctx.stroke();

      ctx.fillStyle = '#b45309';
      ctx.font = `${11 * dpr}px sans-serif`;
      ctx.textAlign = 'left';
      ctx.fillText('海底面 (Seabed)', 15 * dpr, seaBedY + 22 * dpr);

      // Water background gradient
      const waterGrad = ctx.createLinearGradient(0, seaSurfaceY - 40, 0, seaBedY);
      waterGrad.addColorStop(0, 'rgba(0, 180, 216, 0.45)');
      waterGrad.addColorStop(0.4, 'rgba(10, 61, 98, 0.65)');
      waterGrad.addColorStop(1, 'rgba(3, 10, 25, 0.95)');

      // Scale for wave amplitude visually
      const ampPx = Math.min((height / 2) * 5 * dpr, visualDepthHeight * 0.35);
      const wavePxL = Math.max(80 * dpr, Math.min(w * 0.7, (wavelength / 150) * w));

      // Draw Water Body Polygon
      ctx.beginPath();
      ctx.moveTo(0, seaBedY);
      for (let x = 0; x <= w; x += 3 * dpr) {
        const phase = (x / wavePxL) * 2 * Math.PI - (tTime * 2 * Math.PI / period);
        const y = seaSurfaceY + Math.cos(phase) * ampPx;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, seaBedY);
      ctx.closePath();
      ctx.fillStyle = waterGrad;
      ctx.fill();

      // Draw Surface Wave Line
      ctx.beginPath();
      for (let x = 0; x <= w; x += 3 * dpr) {
        const phase = (x / wavePxL) * 2 * Math.PI - (tTime * 2 * Math.PI / period);
        const y = seaSurfaceY + Math.cos(phase) * ampPx;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = '#00f2fe';
      ctx.lineWidth = 3 * dpr;
      ctx.stroke();

      // Draw Water Particle Orbits at several depth layers
      const numLayers = 5;
      const numColumns = 7;
      for (let c = 0; c < numColumns; c++) {
        const xCenter = (c + 0.8) * (w / (numColumns + 0.6));

        for (let l = 0; l <= numLayers; l++) {
          const frac = l / numLayers;
          const zRel = frac * depth; // depth from surface 0..depth
          const yCenter = seaSurfaceY + frac * visualDepthHeight;

          // Horizontal & Vertical semimajor/minor axes of particle trajectory
          // Analytical Airy wave theory:
          // A_horiz = (H/2) * cosh(k*(depth - z)) / sinh(k*depth)
          // A_vert  = (H/2) * sinh(k*(depth - z)) / sinh(k*depth)
          const sinhKh = Math.sinh(kh);
          const arg = k * (depth - zRel);
          const aHoriz = Math.max(1, (ampPx) * (Math.cosh(arg) / (sinhKh > 30 ? Math.exp(kh)/2 : sinhKh)));
          const aVert = Math.max(0, (ampPx) * (Math.sinh(arg) / (sinhKh > 30 ? Math.exp(kh)/2 : sinhKh)));

          // Draw orbit path
          ctx.beginPath();
          ctx.ellipse(xCenter, yCenter, aHoriz, aVert, 0, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.lineWidth = 1 * dpr;
          ctx.stroke();

          // Particle position
          const phase = (xCenter / wavePxL) * 2 * Math.PI - (tTime * 2 * Math.PI / period);
          const px = xCenter + aHoriz * Math.sin(phase);
          const py = yCenter - aVert * Math.cos(phase);

          ctx.beginPath();
          ctx.arc(px, py, (l === 0 ? 4.5 : 3.5) * dpr, 0, Math.PI * 2);
          ctx.fillStyle = l === 0 ? '#feca57' : '#64ffda';
          ctx.fill();
        }
      }

      tTime += 0.04;
      animId = requestAnimationFrame(render);
    }

    [depthSlider, lengthSlider, heightSlider].forEach(el => el.addEventListener('input', () => {
      // live updates triggered inside render
    }));

    window.addEventListener('resize', resize);
    resize();
    render();
  }

  // =========================================================================
  // SIMULATION 4: SOFAR Acoustic Ray Tracer (深海低頻聲道)
  // =========================================================================
  function initSOFARSimulator() {
    const canvas = document.getElementById('sofarCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const sourceDepthSlider = document.getElementById('sofar-src-depth');
    const angleSpreadSlider = document.getElementById('sofar-angle');
    const numRaysSlider = document.getElementById('sofar-rays');

    const srcDepthVal = document.getElementById('val-sofar-depth');
    const angleVal = document.getElementById('val-sofar-angle');
    const raysVal = document.getElementById('val-sofar-rays');

    const channelAxis = 1000; // SOFAR axis at 1000m
    const MAX_DEPTH = 3500;   // 3500m depth
    const MAX_DIST = 40000;   // 40km distance

    function soundSpeed(z) {
      // Realistic Munk ocean sound speed profile:
      // Minimum at z = 1000m (~1480 m/s), Surface ~1525 m/s, Deep ~1535 m/s
      if (z < 1000) {
        // Thermocline dominated: T drops, speed drops
        const frac = z / 1000;
        return 1525 - 45 * Math.sin(frac * Math.PI / 2);
      } else {
        // Deep layer: Pressure dominates: linear increase ~0.0163 per meter
        return 1480 + 0.022 * (z - 1000);
      }
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * (window.devicePixelRatio || 1);
      canvas.height = rect.height * (window.devicePixelRatio || 1);
      draw();
    }

    function draw() {
      const w = canvas.width;
      const h = canvas.height;
      const dpr = window.devicePixelRatio || 1;
      ctx.clearRect(0, 0, w, h);

      const srcDepth = parseFloat(sourceDepthSlider.value);
      const angleMax = parseFloat(angleSpreadSlider.value);
      const numRays = parseInt(numRaysSlider.value, 10);

      srcDepthVal.textContent = srcDepth + ' m';
      angleVal.textContent = '±' + angleMax + '°';
      raysVal.textContent = numRays + ' 條';

      const padL = 70 * dpr;
      const padR = 30 * dpr;
      const padT = 40 * dpr;
      const padB = 40 * dpr;

      const profileW = 110 * dpr; // left graph for Sound Speed Profile
      const traceW = w - padL - padR - profileW - 20 * dpr;

      // Draw Grid for Profile
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1 * dpr;

      // Depth ticks (0m to 3500m)
      for (let z = 0; z <= MAX_DEPTH; z += 500) {
        const y = padT + (z / MAX_DEPTH) * (h - padT - padB);
        ctx.beginPath();
        ctx.moveTo(padL, y);
        ctx.lineTo(w - padR, y);
        ctx.stroke();

        ctx.fillStyle = '#64748b';
        ctx.font = `${10 * dpr}px sans-serif`;
        ctx.textAlign = 'right';
        ctx.fillText(z + 'm', padL - 8 * dpr, y + 4 * dpr);
      }

      // Draw Sound Speed Profile Curve
      ctx.beginPath();
      ctx.strokeStyle = '#00f2fe';
      ctx.lineWidth = 2 * dpr;
      for (let z = 0; z <= MAX_DEPTH; z += 50) {
        const c = soundSpeed(z);
        // Map 1470..1540 to profile box width
        const x = padL + ((c - 1475) / (1540 - 1475)) * profileW;
        const y = padT + (z / MAX_DEPTH) * (h - padT - padB);
        if (z === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Axis labels for Profile
      ctx.fillStyle = '#38bdf8';
      ctx.font = `bold ${10 * dpr}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('聲速 C (m/s)', padL + profileW / 2, padT - 16 * dpr);
      ctx.fillStyle = '#64748b';
      ctx.fillText('1480', padL + ((1480 - 1475) / 65) * profileW, padT - 4 * dpr);
      ctx.fillText('1530', padL + ((1530 - 1475) / 65) * profileW, padT - 4 * dpr);

      // Separator Line
      const startTraceX = padL + profileW + 20 * dpr;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.beginPath();
      ctx.moveTo(startTraceX - 10 * dpr, padT);
      ctx.lineTo(startTraceX - 10 * dpr, h - padB);
      ctx.stroke();

      // SOFAR Channel Axis highlight (z = 1000m)
      const sofarY = padT + (channelAxis / MAX_DEPTH) * (h - padT - padB);
      ctx.fillStyle = 'rgba(254, 202, 87, 0.08)';
      ctx.fillRect(startTraceX, sofarY - 18 * dpr, traceW, 36 * dpr);

      ctx.beginPath();
      ctx.setLineDash([6 * dpr, 4 * dpr]);
      ctx.strokeStyle = '#feca57';
      ctx.lineWidth = 1.5 * dpr;
      ctx.moveTo(startTraceX, sofarY);
      ctx.lineTo(startTraceX + traceW, sofarY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#feca57';
      ctx.font = `bold ${11 * dpr}px sans-serif`;
      ctx.textAlign = 'left';
      ctx.fillText('★ SOFAR 聲速極小軸心 (深海波導管 ~1000m)', startTraceX + 10 * dpr, sofarY - 6 * dpr);

      // Distance labels along trace area
      for (let dist = 0; dist <= MAX_DIST; dist += 10000) {
        const x = startTraceX + (dist / MAX_DIST) * traceW;
        ctx.fillStyle = '#64748b';
        ctx.font = `${10 * dpr}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText((dist / 1000) + ' km', x, h - padB + 18 * dpr);
      }
      ctx.fillStyle = '#94a3b8';
      ctx.font = `bold ${11 * dpr}px sans-serif`;
      ctx.fillText('傳播距離 Distance (km)', startTraceX + traceW / 2, h - padB + 32 * dpr);

      // Acoustic Ray Tracing Simulation
      const c0 = soundSpeed(srcDepth);
      const angles = [];
      if (numRays === 1) angles.push(0);
      else {
        for (let i = 0; i < numRays; i++) {
          const a = -angleMax + (i / (numRays - 1)) * (2 * angleMax);
          angles.push(a);
        }
      }

      // Step integration
      const ds = 100; // step length in meters
      angles.forEach((deg, idx) => {
        let rad = (deg * Math.PI) / 180;
        let curX = 0;
        let curZ = srcDepth;
        const snellConst = Math.cos(rad) / c0; // Snell's invariant cos(theta)/c = const

        ctx.beginPath();
        const startPx = startTraceX;
        const startPy = padT + (curZ / MAX_DEPTH) * (h - padT - padB);
        ctx.moveTo(startPx, startPy);

        let color = deg === 0 ? '#00f2fe' : (deg > 0 ? '#ff7675' : '#a29bfe');
        ctx.strokeStyle = color;
        ctx.lineWidth = (deg === 0 ? 2.5 : 1.4) * dpr;

        while (curX < MAX_DIST) {
          const curC = soundSpeed(curZ);
          const cosTheta = snellConst * curC;

          // Check if turning point reached (cosTheta > 1)
          let theta;
          if (Math.abs(cosTheta) > 1.0) {
            // Ray turns back (refraction inversion)
            rad = -rad;
            theta = rad;
          } else {
            theta = Math.sign(rad) * Math.acos(Math.min(1.0, Math.max(-1.0, cosTheta)));
          }

          curX += ds * Math.cos(theta);
          curZ += ds * Math.sin(theta);

          // Surface reflection
          if (curZ <= 0) {
            curZ = 0;
            rad = Math.abs(rad); // bounce down
          }
          // Bottom reflection
          if (curZ >= MAX_DEPTH) {
            curZ = MAX_DEPTH;
            rad = -Math.abs(rad); // bounce up
          }

          const px = startTraceX + (curX / MAX_DIST) * traceW;
          const py = padT + (curZ / MAX_DEPTH) * (h - padT - padB);
          ctx.lineTo(px, py);
        }
        ctx.stroke();
      });

      // Sound Source Icon
      const srcPx = startTraceX;
      const srcPy = padT + (srcDepth / MAX_DEPTH) * (h - padT - padB);
      ctx.beginPath();
      ctx.arc(srcPx, srcPy, 6 * dpr, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2 * dpr;
      ctx.stroke();

      ctx.fillStyle = '#f59e0b';
      ctx.font = `bold ${11 * dpr}px sans-serif`;
      ctx.textAlign = 'left';
      ctx.fillText(`聲源 (${srcDepth}m)`, srcPx + 10 * dpr, srcPy + 4 * dpr);
    }

    [sourceDepthSlider, angleSpreadSlider, numRaysSlider].forEach(el => el.addEventListener('input', draw));

    document.querySelectorAll('[data-sofar-preset]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const preset = e.target.getAttribute('data-sofar-preset');
        if (preset === 'channel-axis') {
          sourceDepthSlider.value = 1000;
          angleSpreadSlider.value = 10;
        } else if (preset === 'surface-shadow') {
          sourceDepthSlider.value = 50;
          angleSpreadSlider.value = 12;
        } else if (preset === 'deep') {
          sourceDepthSlider.value = 2500;
          angleSpreadSlider.value = 15;
        }
        draw();
      });
    });

    window.addEventListener('resize', resize);
    resize();
  }

  // =========================================================================
  // SIMULATION 5: Earth-Moon-Sun Tidal Bulge Simulator
  // =========================================================================
  function initTideSimulator() {
    const canvas = document.getElementById('tideCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const moonAngleSlider = document.getElementById('moon-angle');
    const angleVal = document.getElementById('val-moon-angle');
    const tideTypeDisplay = document.getElementById('tide-type-display');
    const tideRangeDisplay = document.getElementById('tide-range-display');

    function resize() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * (window.devicePixelRatio || 1);
      canvas.height = rect.height * (window.devicePixelRatio || 1);
      draw();
    }

    function draw() {
      const w = canvas.width;
      const h = canvas.height;
      const dpr = window.devicePixelRatio || 1;
      ctx.clearRect(0, 0, w, h);

      const angleDeg = parseFloat(moonAngleSlider.value);
      angleVal.textContent = angleDeg.toFixed(0) + '°';

      const centerX = w * 0.45;
      const centerY = h * 0.5;
      const earthR = 55 * dpr;
      const moonOrbitR = 150 * dpr;

      // Sun vector is always pointing from the left (-X direction)
      // Angle 0 = New Moon (Moon between Earth and Sun)
      // Angle 90 = First Quarter Moon (Moon at top)
      // Angle 180 = Full Moon (Moon opposite to Sun)
      // Angle 270 = Third Quarter Moon (Moon at bottom)

      const moonRad = (angleDeg * Math.PI) / 180;
      // Coordinates of Moon
      const moonX = centerX - moonOrbitR * Math.cos(moonRad);
      const moonY = centerY - moonOrbitR * Math.sin(moonRad);

      // Determine tide condition
      // Spring tide when angle ~ 0 or 180 (within 20 deg)
      const diffSpring = Math.min(Math.abs(angleDeg - 0), Math.abs(angleDeg - 180), Math.abs(angleDeg - 360));
      const diffNeap = Math.min(Math.abs(angleDeg - 90), Math.abs(angleDeg - 270));

      if (diffSpring <= 25) {
        tideTypeDisplay.innerHTML = '<span class="text-rose-400 font-bold">大潮 (Spring Tide)</span> - 日月共線引潮力疊加';
        tideRangeDisplay.textContent = '潮差最大 (Max Range)';
      } else if (diffNeap <= 25) {
        tideTypeDisplay.innerHTML = '<span class="text-sky-400 font-bold">小潮 (Neap Tide)</span> - 日月垂直引潮力部分抵消';
        tideRangeDisplay.textContent = '潮差最小 (Min Range)';
      } else {
        tideTypeDisplay.innerHTML = '<span class="text-slate-300 font-medium">過渡潮型 (Transitional)</span>';
        tideRangeDisplay.textContent = '一般潮差 (Intermediate)';
      }

      // Draw Orbit Track
      ctx.beginPath();
      ctx.arc(centerX, centerY, moonOrbitR, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.setLineDash([4 * dpr, 4 * dpr]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Sunlight rays coming from left
      ctx.strokeStyle = 'rgba(254, 202, 87, 0.25)';
      ctx.lineWidth = 1.5 * dpr;
      for (let y = centerY - 100 * dpr; y <= centerY + 100 * dpr; y += 25 * dpr) {
        ctx.beginPath();
        ctx.moveTo(15 * dpr, y);
        ctx.lineTo(centerX - 100 * dpr, y);
        ctx.stroke();
      }
      ctx.fillStyle = '#feca57';
      ctx.font = `bold ${12 * dpr}px sans-serif`;
      ctx.textAlign = 'left';
      ctx.fillText('☀️ 太陽平行光線與太陽潮', 15 * dpr, centerY - 110 * dpr);

      // Draw Resulting Tidal Water Bulge on Earth
      // Sun tidal bulge elongation along X-axis
      // Moon tidal bulge elongation along (moonX - centerX, moonY - centerY)
      // We calculate deformed radius R(phi) = earthR + delta_moon * cos(2*(phi - moonRad)) + delta_sun * cos(2*phi)
      const deltaMoon = 18 * dpr; // Lunar tide bulge
      const deltaSun = 8.5 * dpr;  // Solar tide bulge (~0.46 of Lunar)

      ctx.beginPath();
      for (let p = 0; p <= 360; p += 3) {
        const phi = (p * Math.PI) / 180;
        const rTide = earthR + deltaMoon * Math.cos(2 * (phi - (moonRad + Math.PI))) + deltaSun * Math.cos(2 * phi);
        const wx = centerX + rTide * Math.cos(phi);
        const wy = centerY + rTide * Math.sin(phi);
        if (p === 0) ctx.moveTo(wx, wy);
        else ctx.lineTo(wx, wy);
      }
      ctx.closePath();
      ctx.fillStyle = 'rgba(0, 242, 254, 0.28)';
      ctx.fill();
      ctx.strokeStyle = '#00f2fe';
      ctx.lineWidth = 2 * dpr;
      ctx.stroke();

      // Draw Earth Sphere
      const earthGrad = ctx.createRadialGradient(centerX - 15 * dpr, centerY - 15 * dpr, 5, centerX, centerY, earthR);
      earthGrad.addColorStop(0, '#1e40af');
      earthGrad.addColorStop(0.7, '#1e293b');
      earthGrad.addColorStop(1, '#0f172a');
      ctx.beginPath();
      ctx.arc(centerX, centerY, earthR, 0, Math.PI * 2);
      ctx.fillStyle = earthGrad;
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5 * dpr;
      ctx.stroke();

      ctx.fillStyle = '#e2e8f0';
      ctx.font = `bold ${12 * dpr}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('地球 Earth', centerX, centerY + 4 * dpr);

      // Draw Moon
      const moonGrad = ctx.createRadialGradient(moonX - 4 * dpr, moonY - 4 * dpr, 2, moonX, moonY, 15 * dpr);
      moonGrad.addColorStop(0, '#f8fafc');
      moonGrad.addColorStop(1, '#64748b');
      ctx.beginPath();
      ctx.arc(moonX, moonY, 14 * dpr, 0, Math.PI * 2);
      ctx.fillStyle = moonGrad;
      ctx.fill();
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1.5 * dpr;
      ctx.stroke();

      ctx.fillStyle = '#cbd5e1';
      ctx.font = `bold ${11 * dpr}px sans-serif`;
      ctx.fillText('月球 Moon', moonX, moonY - 18 * dpr);

      // Label Bulges
      ctx.fillStyle = 'rgba(100, 255, 218, 0.9)';
      ctx.font = `${11 * dpr}px sans-serif`;
      ctx.fillText('海水潮隆 (Tidal Bulge)', centerX, centerY + earthR + 32 * dpr);
    }

    moonAngleSlider.addEventListener('input', draw);

    // Preset buttons
    document.querySelectorAll('[data-moon-phase]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const phase = e.target.getAttribute('data-moon-phase');
        if (phase === 'new-moon') moonAngleSlider.value = 0;
        else if (phase === 'first-quarter') moonAngleSlider.value = 90;
        else if (phase === 'full-moon') moonAngleSlider.value = 180;
        else if (phase === 'third-quarter') moonAngleSlider.value = 270;
        draw();
      });
    });

    window.addEventListener('resize', resize);
    resize();
  }

  // =========================================================================
  // SIMULATION 6: Ekman Transport & Coastal Upwelling Sandbox
  // =========================================================================
  function initEkmanSimulator() {
    const canvas = document.getElementById('ekmanCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const hemiSelect = document.getElementById('ekman-hemisphere');
    const windSelect = document.getElementById('ekman-wind');
    const coastSelect = document.getElementById('ekman-coast');

    const outcomeBadge = document.getElementById('ekman-outcome-badge');
    const explainText = document.getElementById('ekman-explain-text');

    let particles = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random(),
        y: Math.random(),
        speed: 0.003 + Math.random() * 0.004,
        size: 2 + Math.random() * 2
      });
    }

    let animId = null;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * (window.devicePixelRatio || 1);
      canvas.height = rect.height * (window.devicePixelRatio || 1);
    }

    function render() {
      const w = canvas.width;
      const h = canvas.height;
      const dpr = window.devicePixelRatio || 1;
      ctx.clearRect(0, 0, w, h);

      const hemi = hemiSelect.value;   // 'north' or 'south'
      const wind = windSelect.value;   // 'northward' (吹向北) or 'southward' (吹向南)
      const coast = coastSelect.value; // 'west' (西海岸, 陸地在東) or 'east' (東海岸, 陸地在西)

      // Determine Ekman Transport direction relative to wind:
      // In Northern Hemisphere: 90 deg to right of wind direction
      // In Southern Hemisphere: 90 deg to left of wind direction
      let transportDir = ''; // 'east' or 'west'
      if (hemi === 'north') {
        if (wind === 'southward') transportDir = 'west'; // blowing South, right is West
        else transportDir = 'east';                      // blowing North, right is East
      } else {
        if (wind === 'southward') transportDir = 'east'; // blowing South, left is East
        else transportDir = 'west';                      // blowing North, left is West
      }

      // Coastal Upwelling vs Downwelling
      let isUpwelling = false;
      if (coast === 'west') {
        // Coastline is on right side (East is land, West is open ocean)
        // Transport to West = Offshore = Upwelling!
        isUpwelling = (transportDir === 'west');
      } else {
        // East coast: Coastline is on left side (West is land, East is open ocean)
        // Transport to East = Offshore = Upwelling!
        isUpwelling = (transportDir === 'east');
      }

      if (isUpwelling) {
        outcomeBadge.textContent = '🌊 強烈湧升流 (Coastal Upwelling)';
        outcomeBadge.className = 'badge badge-cyan';
        explainText.innerHTML = `表層海水發生<strong>離岸傳輸 (Offshore Ekman Transport)</strong>，海水被推向大洋，底層<strong>極冷且富含營養鹽</strong>的深層水被迫向上湧升補充！形成超級漁場（如加州或秘魯漁場）。`;
      } else {
        outcomeBadge.textContent = '⬇️ 海水下降流 (Coastal Downwelling)';
        outcomeBadge.className = 'badge badge-coral';
        explainText.innerHTML = `表層海水發生<strong>向岸傳輸 (Onshore Ekman Transport)</strong>，海水在海岸邊堆積並下沉，壓制底層營養鹽上湧，表層水溫較高、生物生產力相對較低。`;
      }

      // Draw 2D Section View
      // Coastline landmass on one side, ocean on the other
      const landW = 120 * dpr;
      const landOnRight = (coast === 'west'); // California is west coast of continent -> land is to east (right)

      const oceanXStart = landOnRight ? 0 : landW;
      const oceanXEnd = landOnRight ? (w - landW) : w;
      const oceanW = oceanXEnd - oceanXStart;

      // Draw Land
      ctx.fillStyle = '#334155';
      const landX = landOnRight ? (w - landW) : 0;
      ctx.fillRect(landX, 40 * dpr, landW, h - 40 * dpr);

      ctx.fillStyle = '#64748b';
      ctx.font = `bold ${13 * dpr}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('陸地 / 海岸', landX + landW / 2, 70 * dpr);

      // Slope of seabed near coast
      ctx.beginPath();
      if (landOnRight) {
        ctx.moveTo(oceanXEnd, 40 * dpr);
        ctx.lineTo(oceanXEnd - 60 * dpr, h - 30 * dpr);
        ctx.lineTo(oceanXStart, h - 30 * dpr);
        ctx.lineTo(oceanXStart, 40 * dpr);
      } else {
        ctx.moveTo(oceanXStart, 40 * dpr);
        ctx.lineTo(oceanXStart + 60 * dpr, h - 30 * dpr);
        ctx.lineTo(oceanXEnd, h - 30 * dpr);
        ctx.lineTo(oceanXEnd, 40 * dpr);
      }
      ctx.closePath();

      const oceanGrad = ctx.createLinearGradient(0, 40 * dpr, 0, h - 30 * dpr);
      if (isUpwelling) {
        oceanGrad.addColorStop(0, '#0284c7');
        oceanGrad.addColorStop(1, '#0c4a6e');
      } else {
        oceanGrad.addColorStop(0, '#38bdf8');
        oceanGrad.addColorStop(1, '#0369a1');
      }
      ctx.fillStyle = oceanGrad;
      ctx.fill();

      // Sea surface line
      ctx.beginPath();
      ctx.moveTo(oceanXStart, 40 * dpr);
      ctx.lineTo(oceanXEnd, 40 * dpr);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3 * dpr;
      ctx.stroke();

      // Draw Animated Stream Particles
      particles.forEach(p => {
        let px, py;
        if (isUpwelling) {
          // Flow: deep cold water moves upward along slope, then exits horizontally
          if (p.x < 0.6) {
            // Rising up
            p.y -= p.speed;
            if (p.y < 0.15) { p.x += p.speed * 2; }
            if (p.y < 0.05) { p.y = 0.9; p.x = 0.2 + Math.random() * 0.4; }
          } else {
            // Flowing away offshore
            p.x += (landOnRight ? -1 : 1) * p.speed * 2;
            if (p.x > 1.0 || p.x < 0.0) { p.x = 0.4; p.y = 0.8; }
          }
        } else {
          // Downwelling: surface water flows towards coast, sinks along slope
          p.x += (landOnRight ? 1 : -1) * p.speed * 1.5;
          if (p.x > 0.7 || p.x < 0.3) {
            p.y += p.speed * 2;
            if (p.y > 0.85) { p.y = 0.1; p.x = 0.5; }
          }
        }

        px = oceanXStart + p.x * oceanW;
        py = 40 * dpr + p.y * (h - 70 * dpr);

        ctx.beginPath();
        ctx.arc(px, py, p.size * dpr, 0, Math.PI * 2);
        ctx.fillStyle = isUpwelling ? '#67e8f9' : '#fcd34d';
        ctx.fill();
      });

      // Overlay Vector Indicators
      // Wind Stress Banner
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.fillRect(oceanXStart + 20 * dpr, 55 * dpr, 260 * dpr, 75 * dpr);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.strokeRect(oceanXStart + 20 * dpr, 55 * dpr, 260 * dpr, 75 * dpr);

      ctx.fillStyle = '#fde047';
      ctx.font = `bold ${12 * dpr}px sans-serif`;
      ctx.textAlign = 'left';
      ctx.fillText(`💨 盛行風向：${wind === 'southward' ? '向南吹 (Northerly wind)' : '向北吹 (Southerly wind)'}`, oceanXStart + 30 * dpr, 75 * dpr);

      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`🧭 科氏偏轉：${hemi === 'north' ? '北半球 (向右偏 90°)' : '南半球 (向左偏 90°)'}`, oceanXStart + 30 * dpr, 95 * dpr);

      ctx.fillStyle = isUpwelling ? '#6ee7b7' : '#fca5a5';
      ctx.fillText(`➡️ 埃克曼淨位移：${transportDir === 'west' ? '向西 (離岸)' : '向東 (向岸)'}`, oceanXStart + 30 * dpr, 115 * dpr);

      animId = requestAnimationFrame(render);
    }

    [hemiSelect, windSelect, coastSelect].forEach(el => el.addEventListener('change', () => {}));

    window.addEventListener('resize', resize);
    resize();
    render();
  }

  // Master Initializer
  function initAll() {
    initTSDiagram();
    initIonCalculator();
    initWaveSimulator();
    initSOFARSimulator();
    initTideSimulator();
    initEkmanSimulator();
  }

  return {
    initAll,
    initTSDiagram,
    initIonCalculator,
    initWaveSimulator,
    initSOFARSimulator,
    initTideSimulator,
    initEkmanSimulator
  };
})();
