/**
 * OceanLearn - Main Application Controller
 * 負責全局標籤切換、章節導航、搜索過濾、名詞小辭典與模擬器初始化
 */

document.addEventListener('DOMContentLoaded', () => {
  // Navigation tabs
  const tabBtns = document.querySelectorAll('[data-tab-target]');
  const tabContents = document.querySelectorAll('.tab-content-panel');
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');

  // Simulation Lab Subtabs
  const labSubtabs = document.querySelectorAll('[data-lab-target]');
  const labPanels = document.querySelectorAll('.lab-content-panel');

  // Active state tracker
  let activeTab = 'overview';

  function switchTab(targetId) {
    activeTab = targetId;
    tabBtns.forEach(btn => {
      const isTarget = btn.getAttribute('data-tab-target') === targetId;
      btn.classList.toggle('active', isTarget);
      if (isTarget) {
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });

    tabContents.forEach(panel => {
      if (panel.id === `tab-${targetId}`) {
        panel.classList.remove('hidden');
        panel.classList.add('block');
      } else {
        panel.classList.add('hidden');
        panel.classList.remove('block');
      }
    });

    // Close mobile drawer if open
    if (mobileNavDrawer && !mobileNavDrawer.classList.contains('hidden')) {
      mobileNavDrawer.classList.add('hidden');
    }

    // Window scroll to top of content
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Trigger simulation re-layouts if entering simulations
    if (targetId === 'simulations' && window.OceanSims) {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 50);
    }
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget.getAttribute('data-tab-target');
      switchTab(target);
    });
  });

  // Mobile menu toggle
  if (mobileMenuToggle && mobileNavDrawer) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileNavDrawer.classList.toggle('hidden');
    });
  }

  // Simulation Sub-tab switching
  labSubtabs.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const labId = e.currentTarget.getAttribute('data-lab-target');
      labSubtabs.forEach(b => {
        const active = b.getAttribute('data-lab-target') === labId;
        b.classList.toggle('bg-cyan-500/20', active);
        b.classList.toggle('border-cyan-400', active);
        b.classList.toggle('text-cyan-300', active);
        b.classList.toggle('bg-slate-800/60', !active);
        b.classList.toggle('text-slate-400', !active);
      });

      labPanels.forEach(panel => {
        if (panel.id === `lab-${labId}`) {
          panel.classList.remove('hidden');
          panel.classList.add('block');
        } else {
          panel.classList.add('hidden');
          panel.classList.remove('block');
        }
      });

      // trigger resize event to re-render canvas in newly visible tab
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 30);
    });
  });

  // Glossary Search Filter
  const glossarySearch = document.getElementById('glossary-search-input');
  if (glossarySearch) {
    glossarySearch.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      const items = document.querySelectorAll('.glossary-card');
      items.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(q) ? 'block' : 'none';
      });
    });
  }

  // Topic Quick Jump links inside content
  document.querySelectorAll('[data-jump-tab]').forEach(el => {
    el.addEventListener('click', (e) => {
      const target = e.currentTarget.getAttribute('data-jump-tab');
      switchTab(target);
      const subTarget = e.currentTarget.getAttribute('data-jump-lab');
      if (subTarget) {
        const subBtn = document.querySelector(`[data-lab-target="${subTarget}"]`);
        if (subBtn) subBtn.click();
      }
    });
  });

  // Presentation Fullscreen mode toggle
  const fsBtn = document.getElementById('fullscreen-toggle-btn');
  if (fsBtn) {
    fsBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
        fsBtn.innerHTML = `
          <svg class="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
          <span class="text-xs">退出全螢幕</span>
        `;
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
        fsBtn.innerHTML = `
          <svg class="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
          </svg>
          <span class="text-xs">講義投影模式</span>
        `;
      }
    });
  }

  // Hash routing support (e.g. index.html#simulations, index.html#quiz)
  function handleHash() {
    const hash = window.location.hash.replace('#', '').trim();
    if (hash) {
      const matchBtn = document.querySelector(`[data-tab-target="${hash}"]`);
      if (matchBtn) {
        switchTab(hash);
      }
    }
  }

  window.addEventListener('hashchange', handleHash);
  if (window.location.hash) {
    handleHash();
  }

  // Initialize simulations and quiz
  if (window.OceanSims) {
    window.OceanSims.initAll();
  }
  if (window.OceanQuiz) {
    window.OceanQuiz.init();
  }
});
