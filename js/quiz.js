/**
 * OceanLearn - Interactive Assessment & Quiz System
 * 嚴格涵蓋講義 5 大主題核心考點與概念
 */

window.OceanQuiz = (function() {
  const questions = [
    {
      id: 1,
      topic: '海水物理與化學',
      question: '關於「恆定組成定律（Marcet / Forchhammer 原理）」的敘述，下列何者正確？',
      options: [
        '全球不同海域的海水總鹽度固定不變，各主要離子濃度也完全相同',
        '雖然不同海域因蒸發與降雨導致總鹽度不同，但主要離子之間的相對比例始終保持恆定',
        '海水中主要離子的比例隨深度增加而劇烈改變，表層與深層完全不相稱',
        '只有氯離子與鈉離子的比值固定，其他微量元素比值均隨時間迅速漂移'
      ],
      correct: 1,
      explanation: '恆定組成定律核心為「總量會變，但比例不變」。大洋環流攪拌時間約 1000 年，而主要離子在海中的滯留時間遠大於此，因此各主要離子之間的相對濃度比例在全球大洋中始終恆定。'
    },
    {
      id: 2,
      topic: '海水物理與化學',
      question: '若某海域經 CTD 測得鹽度為 35‰，依據 Knudsen 經驗公式（S = 1.80655 × Cl），其氯度（Cl）約為多少？',
      options: [
        '約 10.78 g/kg',
        '約 19.37 g/kg',
        '約 24.70 g/kg',
        '約 35.00 g/kg'
      ],
      correct: 1,
      explanation: '依據 Knudsen 經驗公式：S = 1.80655 × Cl，因此 Cl = S / 1.80655 = 35 / 1.80655 ≈ 19.3738 g/kg。'
    },
    {
      id: 3,
      topic: '海水物理與化學',
      question: '海水的「最大密度溫度線」與「冰點降低線」在鹽度約為多少時相交？這對海水對流有何關鍵意義？',
      options: [
        'S = 0‰；水溫越低密度越小，直接在表層結冰',
        'S = 24.7‰；當鹽度大於 24.7‰（如大洋 seawater 約 35‰）時，最大密度溫度低於冰點，海水越冷越重直到結冰下沉',
        'S = 35.0‰；所有海水都會在 4°C 達到最大密度並停止下沉',
        'S = 40.0‰；僅有紅海高鹽海水才會持續冷卻下沉'
      ],
      correct: 1,
      explanation: '純水最大密度在 4°C，冰點為 0°C；隨鹽度增加，兩者均下降並在 S = 24.7‰ (-1.332°C) 相交。大洋海水鹽度約 35‰ (> 24.7‰)，最大密度溫度低於冰點，故極地海水受冷後密度持續增加下沉，驅動全球深層溫鹽環流！'
    },
    {
      id: 4,
      topic: '海水物理與化學',
      question: '何謂溫鹽圖中的「混和增密現象（Cabbeling）」？',
      options: [
        '兩水塊混合後因為化學反應釋放熱量，導致密度減小',
        '兩種具有相同密度、但溫鹽特徵不同的水塊混合後，因海水狀態方程式的非線性，新水塊密度反而大於原本兩者',
        '鹽度過高的水塊與純水混合時，鹽分結晶析出使水體變輕',
        '在溫躍層內海流受科氏力影響產生的垂直向上跳躍'
      ],
      correct: 1,
      explanation: '在 T-S 圖上等密度線是彎曲的弧線。連接相同密度的兩點所形成的直線段，其中點必定落在密度更高的等密度線上，因此混合後的密度大於原來兩種水體，這種現象稱為混和增密 (Cabbeling)。'
    },
    {
      id: 5,
      topic: '海水物理與化學',
      question: '深海低頻聲學通道（SOFAR 通道，約 800~1000m 處）之所以能讓聲波長距離傳播，其物理機制為何？',
      options: [
        '該處海水溫度最高，聲速達到極大值，使聲波沿著直線高速射出',
        '該處出現「聲速極小值層」，根據司乃爾折射定律，偏離軸心的聲波會持續被上下兩層高聲速海水彎折回軸心，形成自我聚焦波導',
        '深海壓力過大，將聲波完全吸收轉化為熱能',
        '該處為潛艇金屬外殼與海水共振所形成的特殊人工回音區'
      ],
      correct: 1,
      explanation: '0~1000m 水溫劇降使聲速減小；>1000m 壓力劇增使聲速回升。在 800~1000m 形成聲速極小軸心，聲波偏離時總是被彎向「聲速較慢」的軸心，形成全反射波導管，低頻聲音可傳遞數千公里。'
    },
    {
      id: 6,
      topic: '海水物理與化學',
      question: '關於「海洋酸化（Ocean Acidification）」的正確化學與生態認知為何？',
      options: [
        '海水 pH 值已經小於 7.0，變成具有腐蝕性的強酸液體',
        '海水嚴格來說並非變為酸性（目前平均約 8.1，預估 2100 年約 7.8 仍為弱鹼性），但增多的 H⁺ 搶奪 CO₃²⁻ 形成 HCO₃⁻，使珊瑚與貝類無法合成碳酸鈣外殼甚至被侵蝕',
        '海洋酸化只影響淡水河口，大洋表層具有無限緩衝能力不會受影響',
        '二氧化碳直接與鈣離子反應生成固體碳酸鈣沉澱，導致海洋生物鈣過量'
      ],
      correct: 1,
      explanation: '海洋酸化是指「弱鹼性變弱」（pH 從 8.2 降至 8.1）。過量的 CO₂ 生成 H⁺，游離的 H⁺ 會搶走海水中寶貴的碳酸根離子（H⁺ + CO₃²⁻ → HCO₃⁻），使生物缺乏建構 CaCO₃ 外殼的原料，甚至酸蝕外殼。'
    },
    {
      id: 7,
      topic: '海洋動力學',
      question: '在北半球，當盛行風吹拂海面時，埃克曼螺旋（Ekman Spiral）使得表層流向與整個埃克曼層的淨傳輸（Ekman Transport）分別偏向何方？',
      options: [
        '表層偏向風向右方 45°；淨傳輸偏向風向右方 90°',
        '表層偏向風向左方 45°；淨傳輸偏向風向左方 90°',
        '表層順著風向；淨傳輸垂直向下 180°',
        '表層偏向風向右方 90°；淨傳輸偏向風向右方 45°'
      ],
      correct: 0,
      explanation: '北半球受向右的科氏力與摩擦力共同作用，表層流向偏向風向右方 45°，隨著深度增加流速減小且持續向右旋轉；整層風吹流的質量淨傳輸（Ekman Transport）恰好偏向風向右側 90°。'
    },
    {
      id: 8,
      topic: '海洋動力學',
      question: '北美加州沿岸（位於大洋東側、大陸西岸）夏天常年吹北風，為什麼會形成著名的冷水湧升流與舊金山大霧？',
      options: [
        '北半球北風受科氏力驅使，埃克曼淨傳輸向西（離岸方向），表層水被推離海岸，迫使底層低溫高營養鹽深海水湧升',
        '北風把北極冰山直接吹到加州外海融化',
        '加州沿岸為地轉下沉區，海水往下鑽導致水氣凝結',
        '海風吹向陸地造成向岸堆積，海水翻騰形成上升流'
      ],
      correct: 0,
      explanation: '北半球風向吹向南方（北風），右側 90° 為西方（離岸方向）。表層海水向外海流走，岸邊底層冷水向上補充形成湧升流。冷海水使上方溫暖濕潤的大氣冷卻凝結，形成壯觀的舊金山夏季海霧。'
    },
    {
      id: 9,
      topic: '海洋動力學',
      question: '大洋西側的黑潮與墨西哥灣流「又窄又急」，而東側的加利福尼亞洋流卻「又寬又緩」，斯托梅爾（Henry Stommel）提出的物理機制為何？',
      options: [
        '西側海底火山爆發推動海水加速',
        '風應力在大洋注入順時針渦度，必須有逆時針力矩來煞車平衡；因 β 效應，只有在大洋西岸北上的強流受陸地摩擦才能產生逆時針煞車力矩',
        '地球自西向東自轉將海水全部甩到西岸邊界',
        '西側海水溫度高，熱膨脹使洋流從高處滑向低處'
      ],
      correct: 1,
      explanation: '大洋上方風應力旋度注入順時針旋轉力矩，穩態大洋必須有逆時針摩擦力矩來煞車。若強流在東岸北上，山壁在右手邊會產生順時針摩擦力矩（加速失控）；唯有強流在西岸北上，山壁在左手邊才能產生逆時針摩擦力矩（煞車平衡）。這就是西方邊界強化機制。'
    },
    {
      id: 10,
      topic: '波動學與潮汐',
      question: '波長為 200 公尺的深海風浪，傳播到水深幾公尺以下的海域時，會開始進入「淺水波（Shallow Water Wave）」的範疇？',
      options: [
        '小於 100 公尺 (h < L/2)',
        '小於 10 公尺 (h < L/20)',
        '小於 20 公尺 (h < L/10)',
        '小於 1 公尺 (h < 1m)'
      ],
      correct: 1,
      explanation: '淺水波的嚴格判別條件為水深 h < L/20。當波長 L = 200m 時，h < 200/20 = 10 公尺即為淺水波。在 h > L/2 (100m) 時為深水波，介於其間為過渡波。'
    },
    {
      id: 11,
      topic: '波動學與潮汐',
      question: '為什麼海嘯（Tsunami）即使在水深 4000 公尺的大洋中傳播，本質上仍然屬於「淺水波」？其波速計算公式為何？',
      options: [
        '因為海嘯波長可達數百公里（遠大於水深的 20 倍），滿足 h < L/20，波速為 C = √(g × h)',
        '因為海嘯發生在海底，所以是淺水波，波速為 C = 1.25√L',
        '因為海嘯波高極小，故不受水深影響，波速為 C = L / T = 常數',
        '因為海嘯傳播時不會產生水質點運動，波速等於水中聲速 1500 m/s'
      ],
      correct: 0,
      explanation: '淺水波的定義是水深與波長之比 h/L < 1/20。海嘯波長往往長達 100~300 公里，而大洋平均水深僅 4 公里，4 / 200 = 0.02 < 0.05，因此海嘯在大洋中也是標準的淺水波，波速由水深決定：C = √(gh) ≈ 200 m/s (時速 700 多公里)！'
    },
    {
      id: 12,
      topic: '波動學與潮汐',
      question: '引潮力的大小與引起潮汐的天體（月球或太陽）之間的距離關係為何？為什麼月球的引潮力比太陽還大？',
      options: [
        '與距離平方成反比 (1/R²)；太陽質量遠大於月球所以太陽引潮力大',
        '與距離立方成反比 (1/R³)；月球雖然質量小，但距離地球極近，因此引潮力約為太陽的 2.17 倍',
        '與距離無關，僅取決於天體體積',
        '與距離四次方成反比 (1/R⁴)；因此太陽完全無法引起地球潮汐'
      ],
      correct: 1,
      explanation: '引潮力是萬有引力與繞質心公轉慣性離心力的差值（微分量），公式推導結果與天體距離的「三次方」成反比 (F_tidal ∝ M / R³)。月球與地球距離約 38 萬公里，比太陽近約 390 倍，距離三次方效應遠遠壓過太陽質量優勢，月球引潮力是太陽的約 2.17 倍。'
    },
    {
      id: 13,
      topic: '台灣區域海洋學',
      question: '台灣周邊海流系統中，下列何者屬於四季皆強勁存在、沿著台灣東部近海北上的高溫高鹽洋流？',
      options: [
        '中國沿岸流',
        '南海暖流',
        '黑潮主流（Kuroshio）',
        '親潮（Oyashio）'
      ],
      correct: 2,
      explanation: '黑潮主流是北太平洋副熱帶環流的西方邊界流，源於菲律賓東方海域，四季皆沿著台灣東海岸陡峭陸坡向北奔流，具備高溫、高鹽、流速快且水質清澈等特徵。'
    },
    {
      id: 14,
      topic: '海洋觀測與科技',
      question: '海洋調查中最核心的 CTD 儀器，其縮寫中的三個字母分別代表測量哪三種物理水文參數？',
      options: [
        'Current（海流）、Temperature（溫度）、Density（密度）',
        'Conductivity（導電度）、Temperature（溫度）、Depth / Pressure（深度/水壓）',
        'Carbon（碳量）、Tide（潮位）、Direction（流向）',
        'Chlorinity（氯度）、Turbidity（濁度）、Drift（漂移）'
      ],
      correct: 1,
      explanation: 'CTD 是 Conductivity（電導度，用以推算鹽度）、Temperature（溫度，白金電阻測量）、Depth（深度，以壓力計水壓推算）三者的縮寫，為海洋物理探測標準儀器。'
    },
    {
      id: 15,
      topic: '海洋觀測與科技',
      question: '現代音響都卜勒流速剖面儀（ADCP）測量不同水深海流的物理原理為何？',
      options: [
        '利用機械旋轉的螺旋槳直接觸碰水分子計數',
        '發射高頻聲波照射水中懸浮微粒，利用回波的都卜勒頻率偏移（Doppler Shift）同時計算出不同水深層的流速與流向',
        '測量衛星微波反射時間求得海平面坡度',
        '利用海水電阻變化反推地轉流'
      ],
      correct: 1,
      explanation: 'ADCP（Acoustic Doppler Current Profiler）利用聲波都卜勒效應，發射聲波遇到隨海流漂移的浮游生物或懸浮顆粒反射，根據回波頻率的高低變化（頻移）即可精確推算不同水深斷面的三維海流流速與方向。'
    }
  ];

  let currentQuestionIndex = 0;
  let userAnswers = {};
  let isSubmitted = false;

  function init() {
    renderQuestion(0);
    bindEvents();
    renderNavPills();
  }

  function renderNavPills() {
    const navContainer = document.getElementById('quiz-nav-pills');
    if (!navContainer) return;
    let html = '';
    questions.forEach((q, idx) => {
      const isAns = userAnswers[idx] !== undefined;
      let colorClass = 'bg-slate-800 text-slate-400 border-slate-700';
      if (isSubmitted) {
        const isCorrect = userAnswers[idx] === q.correct;
        colorClass = isCorrect ? 'bg-emerald-900/60 text-emerald-300 border-emerald-500' : 'bg-rose-900/60 text-rose-300 border-rose-500';
      } else if (idx === currentQuestionIndex) {
        colorClass = 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-md shadow-cyan-500/30';
      } else if (isAns) {
        colorClass = 'bg-sky-900/50 text-cyan-300 border-cyan-800';
      }
      html += `
        <button class="w-8 h-8 rounded-lg text-xs font-mono border transition-all ${colorClass}" data-quiz-nav="${idx}">
          ${idx + 1}
        </button>
      `;
    });
    navContainer.innerHTML = html;

    navContainer.querySelectorAll('[data-quiz-nav]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetIdx = parseInt(e.currentTarget.getAttribute('data-quiz-nav'), 10);
        renderQuestion(targetIdx);
      });
    });
  }

  function renderQuestion(index) {
    currentQuestionIndex = index;
    const q = questions[index];
    const card = document.getElementById('quiz-card-content');
    if (!card) return;

    const userAns = userAnswers[index];
    const hasAnswered = userAns !== undefined;

    let optionsHtml = '';
    q.options.forEach((opt, optIdx) => {
      let stateClass = '';
      if (isSubmitted) {
        if (optIdx === q.correct) {
          stateClass = 'correct';
        } else if (userAns === optIdx) {
          stateClass = 'wrong';
        }
      } else if (userAns === optIdx) {
        stateClass = 'selected';
      }

      optionsHtml += `
        <div class="quiz-option ${stateClass}" data-opt-idx="${optIdx}">
          <span class="w-6 h-6 flex items-center justify-center rounded-full bg-slate-800/80 border border-slate-600 text-xs font-mono font-bold text-slate-300">
            ${String.fromCharCode(65 + optIdx)}
          </span>
          <span class="flex-1 text-sm md:text-base leading-relaxed text-slate-200">
            ${opt}
          </span>
        </div>
      `;
    });

    let explanationHtml = '';
    if (isSubmitted) {
      const isCorrect = userAns === q.correct;
      explanationHtml = `
        <div class="mt-4 p-4 rounded-xl border ${isCorrect ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' : 'bg-rose-950/40 border-rose-500/40 text-rose-200'}">
          <div class="font-bold flex items-center gap-2 mb-1">
            <span>${isCorrect ? '✓ 回答正確！' : '✗ 答錯了，請複習觀念：'}</span>
            <span class="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">正解：${String.fromCharCode(65 + q.correct)}</span>
          </div>
          <p class="text-sm text-slate-300 leading-relaxed">${q.explanation}</p>
        </div>
      `;
    }

    card.innerHTML = `
      <div class="flex items-center justify-between gap-2 mb-3">
        <span class="badge badge-cyan text-xs font-mono">第 ${index + 1} / ${questions.length} 題</span>
        <span class="badge badge-amber text-xs">${q.topic}</span>
      </div>
      <h3 class="text-base md:text-lg font-bold text-slate-100 mb-4 leading-snug">
        ${q.question}
      </h3>
      <div class="space-y-3">
        ${optionsHtml}
      </div>
      ${explanationHtml}
    `;

    // Bind option click
    if (!isSubmitted) {
      card.querySelectorAll('.quiz-option').forEach(el => {
        el.addEventListener('click', (e) => {
          const selectedIdx = parseInt(e.currentTarget.getAttribute('data-opt-idx'), 10);
          userAnswers[currentQuestionIndex] = selectedIdx;
          renderQuestion(currentQuestionIndex);
          renderNavPills();
          checkAllAnswered();
        });
      });
    }

    // Prev / Next button states
    const prevBtn = document.getElementById('quiz-btn-prev');
    const nextBtn = document.getElementById('quiz-btn-next');
    if (prevBtn) prevBtn.disabled = (index === 0);
    if (nextBtn) nextBtn.disabled = (index === questions.length - 1);

    renderNavPills();
  }

  function checkAllAnswered() {
    const answeredCount = Object.keys(userAnswers).length;
    const submitBtn = document.getElementById('quiz-btn-submit');
    const countDisplay = document.getElementById('quiz-answered-count');
    if (countDisplay) {
      countDisplay.textContent = `已作答：${answeredCount} / ${questions.length}`;
    }
    if (submitBtn) {
      submitBtn.classList.toggle('opacity-50', answeredCount < questions.length);
      submitBtn.disabled = false; // allow submitting anytime to see score
    }
  }

  function submitQuiz() {
    isSubmitted = true;
    let score = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct) score++;
    });

    const percent = Math.round((score / questions.length) * 100);
    const resultModal = document.getElementById('quiz-result-modal');
    const scoreVal = document.getElementById('quiz-result-score');
    const titleVal = document.getElementById('quiz-result-title');
    const msgVal = document.getElementById('quiz-result-message');

    if (scoreVal) scoreVal.textContent = percent + '%';
    if (titleVal) {
      if (percent >= 90) titleVal.textContent = '🌟 卓越！深海領航學者級';
      else if (percent >= 70) titleVal.textContent = '🌊 優異！遠洋探險大副級';
      else if (percent >= 50) titleVal.textContent = '⚓ 良好！啟航水手級';
      else titleVal.textContent = '⛵ 建議再複習講義重點與模擬實驗';
    }
    if (msgVal) {
      msgVal.textContent = `你共答對了 ${score} / ${questions.length} 題。可切換題號檢視每題詳解與考點分析！`;
    }

    if (resultModal) {
      resultModal.classList.remove('hidden');
      resultModal.classList.add('flex');
    }

    renderQuestion(currentQuestionIndex);
    renderNavPills();
  }

  function resetQuiz() {
    userAnswers = {};
    isSubmitted = false;
    currentQuestionIndex = 0;
    const resultModal = document.getElementById('quiz-result-modal');
    if (resultModal) {
      resultModal.classList.add('hidden');
      resultModal.classList.remove('flex');
    }
    checkAllAnswered();
    renderQuestion(0);
    renderNavPills();
  }

  function bindEvents() {
    const prevBtn = document.getElementById('quiz-btn-prev');
    const nextBtn = document.getElementById('quiz-btn-next');
    const submitBtn = document.getElementById('quiz-btn-submit');
    const resetBtn = document.getElementById('quiz-btn-reset');
    const closeModalBtn = document.getElementById('quiz-close-modal');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentQuestionIndex > 0) renderQuestion(currentQuestionIndex - 1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentQuestionIndex < questions.length - 1) renderQuestion(currentQuestionIndex + 1);
      });
    }
    if (submitBtn) {
      submitBtn.addEventListener('click', submitQuiz);
    }
    if (resetBtn) {
      resetBtn.addEventListener('click', resetQuiz);
    }
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => {
        const resultModal = document.getElementById('quiz-result-modal');
        if (resultModal) {
          resultModal.classList.add('hidden');
          resultModal.classList.remove('flex');
        }
      });
    }
  }

  return {
    init,
    resetQuiz
  };
})();
