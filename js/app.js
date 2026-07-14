/* ===================================================
   AniCura Campus ATV — app.js
   Navegación, tema, flashcards, fill-blanks, examen
   =================================================== */

(function () {
  'use strict';

  /* ── TEMA: Siempre claro por defecto ──────────────── */
  const root = document.documentElement;
  // Forzar modo claro siempre al cargar
  root.setAttribute('data-theme', 'light');

  const themeToggle = document.querySelector('[data-theme-toggle]');
  let currentTheme = 'light';
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      currentTheme = currentTheme === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', currentTheme);
      const icon = document.getElementById('theme-icon');
      if (icon) icon.textContent = currentTheme === 'dark' ? '☀' : '◐';
    });
  }

  /* ── NAVEGACIÓN DE PANELES (módulos del campus) ───── */
  const allPanels = () => document.querySelectorAll('.content-panel');
  const allModuleLinks = () => document.querySelectorAll('.module-link');

  function showPanel(panelId) {
    allPanels().forEach(p => {
      p.classList.remove('active');
      p.classList.add('hide');
      p.setAttribute('aria-hidden', 'true');
    });
    const target = document.getElementById(panelId);
    if (target) {
      target.classList.remove('hide');
      target.classList.add('active');
      target.setAttribute('aria-hidden', 'false');
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
    allModuleLinks().forEach(btn => {
      const isActive = btn.dataset.panel === panelId;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Mostrar portada al inicio
  showPanel('campus-home');

  // Listeners en botones del sidebar
  allModuleLinks().forEach(btn => {
    btn.addEventListener('click', () => showPanel(btn.dataset.panel));
  });

  // CTA buttons con data-jump
  document.querySelectorAll('[data-jump]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.jump;
      if (target === 'modulos-grid') {
        showPanel('campus-home');
        setTimeout(() =>
          document.getElementById('modulos-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        , 150);
      } else {
        showPanel(target);
      }
    });
  });


  /* ── NAVEGACIÓN INTERNA DE UNIDADES ───────────────── */
  function initUnitNav() {
    const unitBtns = document.querySelectorAll('.unit-btn');
    unitBtns.forEach(btn => {
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', btn.classList.contains('active') ? 'true' : 'false');

      btn.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      });

      btn.addEventListener('click', () => {
        const parentShell = btn.closest('.lesson-shell');
        if (!parentShell) return;
        parentShell.querySelectorAll('.unit-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        parentShell.querySelectorAll('.lesson-card').forEach(card => {
          card.classList.add('hide');
          card.setAttribute('aria-hidden', 'true');
        });
        const targetCard = document.getElementById(btn.dataset.unit);
        if (targetCard) {
          targetCard.classList.remove('hide');
          targetCard.setAttribute('aria-hidden', 'false');
          targetCard.setAttribute('tabindex', '-1');
          targetCard.focus({ preventScroll: true });
        }
      });
    });
  }
  initUnitNav();

  /* ── FLASHCARDS ───────────────────────────────────── */
  function initFlashcards() {
    const cards = document.querySelectorAll('.atv-fc');
    if (!cards.length) return;
    cards.forEach(card => {
      card.removeAttribute('onclick');
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', 'Tarjeta didáctica interactiva. Pulsa Enter o Espacio para girar y ver la respuesta.');

      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.classList.toggle('atv-flipped');
        }
      });

      card.addEventListener('click', () => card.classList.toggle('atv-flipped'));
    });
  }
  initFlashcards();

  /* ── FILL IN THE BLANKS (Global Engine) ────────────── */
  window.checkFillBlock = function(blockId, resultId) {
    const block = document.getElementById(blockId);
    const res = document.getElementById(resultId);
    if (!block || !res) return;

    const inputs = block.querySelectorAll('.atv-blank');
    let ok = 0;
    inputs.forEach(inp => {
      inp.classList.remove('ok', 'bad');
      const given = inp.value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const expected = (inp.dataset.ans || '').trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      
      if (given === expected) {
        inp.classList.add('ok');
        ok++;
      } else {
        inp.classList.add('bad');
      }
    });

    res.style.display = 'block';
    if (ok === inputs.length) {
      res.style.background = '#D4F5E5'; res.style.color = '#1A6B41';
      res.textContent = `✓ ¡Perfecto! Todos los huecos son correctos (${ok}/${inputs.length}).`;
    } else {
      res.style.background = '#FDEEF0'; res.style.color = '#7B2D2D';
      res.textContent = `Correcto: ${ok}/${inputs.length}. Los huecos en rojo necesitan revisión.`;
    }
  };

  window.resetFillBlock = function(blockId, resultId) {
    const block = document.getElementById(blockId);
    const res = document.getElementById(resultId);
    if (!block || !res) return;

    block.querySelectorAll('.atv-blank').forEach(inp => {
      inp.value = '';
      inp.classList.remove('ok', 'bad');
    });

    res.style.display = 'none';
    res.textContent = '';
  };

  /* ── EXAM ENGINE (Global) ───────────────────────────── */
  window.checkExamBlock = function(containerId, resultId) {
    const container = document.getElementById(containerId);
    const res = document.getElementById(resultId);
    if (!container || !res) return;

    const qs = container.querySelectorAll('.atv-q');
    let total = qs.length, ok = 0, unanswered = 0;

    qs.forEach((q) => {
      const opts = q.querySelectorAll('.atv-opt');
      // Búsqueda del radio button seleccionado dentro de este bloque de pregunta
      const sel = q.querySelector('input[type="radio"]:checked');
      
      opts.forEach(opt => opt.classList.remove('correct', 'wrong'));

      if (!sel) {
        unanswered++;
        return;
      }

      opts.forEach(opt => {
        const r = opt.querySelector('input');
        if (r.value === 'ok') opt.classList.add('correct');
      });

      if (sel.value !== 'ok') {
        sel.closest('.atv-opt').classList.add('wrong');
      } else {
        ok++;
      }
    });

    if (unanswered > 0) {
      res.style.display = 'block';
      res.style.background = '#FDEEF0'; res.style.border = '1px solid #F5C5CB';
      res.innerHTML = `<strong style="color:#7B2D2D">⚠ Responde todas las preguntas antes de corregir (${unanswered} sin contestar).</strong>`;
      return;
    }

    const pct = Math.round((ok / total) * 100);
    const grade = pct >= 90 ? 'Sobresaliente' : pct >= 75 ? 'Notable' : pct >= 60 ? 'Aprobado' : 'Suspenso';
    const pass = pct >= 60;

    res.style.display = 'block';
    res.style.background = pass ? '#D4F5E5' : '#FDEEF0';
    res.style.border = pass ? '1px solid #8EDFC0' : '1px solid #F5C5CB';
    res.innerHTML = `
      <div style="font-family:Nunito,sans-serif;font-size:2.5rem;font-weight:800;color:${pass ? '#1A6B41' : '#E74C3C'};line-height:1">${pct}%</div>
      <div style="color:#5A7A8A;margin:.4rem 0">${ok} de ${total} preguntas correctas</div>
      <div style="display:inline-block;margin-top:.75rem;padding:.5rem 1.5rem;border-radius:999px;background:${pass ? '#2ECC71' : '#E74C3C'};color:#fff;font-weight:700;font-size:1rem">${grade}</div>
      <p style="margin-top:1rem;color:#5A7A8A;font-size:.875rem">
        ${pass ? '¡Enhorabuena! Has superado la evaluación.' : 'No has alcanzado el 60% mínimo. Repasa y vuelve a intentarlo.'}
      </p>`;
  };

  window.resetExamBlock = function(containerId, resultId) {
    const container = document.getElementById(containerId);
    const res = document.getElementById(resultId);
    if (!container || !res) return;

    container.querySelectorAll('input[type=radio]').forEach(r => r.checked = false);
    container.querySelectorAll('.atv-opt').forEach(o => o.classList.remove('correct', 'wrong'));
    res.style.display = 'none';
    res.innerHTML = '';
  };

  /* ── A11Y EXAM ENHANCEMENTS ────────────────────────── */
  document.querySelectorAll('.atv-q').forEach((q, i) => {
    q.setAttribute('role', 'group');
    const text = q.querySelector('.atv-q-text');
    if (text) {
      const id = 'exam-q-label-' + i;
      text.id = id;
      q.setAttribute('aria-labelledby', id);
    }
  });

  /* ── PROGRESS TRACKER ─────────────────────────────── */
  window.renderGlobalProgress = function() {
    const listContainer = document.getElementById('progress-modules-list');
    const globalVal = document.getElementById('global-progress-value');
    const globalBar = document.getElementById('global-progress-bar');
    if (!listContainer || !globalVal || !globalBar) return;

    const allChecks = Array.from(document.querySelectorAll('.unit-check'));
    if (!allChecks.length) {
      listContainer.innerHTML = '<p class="muted">Aún no hay unidades disponibles para trackear.</p>';
      return;
    }

    const modulesMap = {};
    allChecks.forEach(chk => {
      const mod = chk.dataset.module;
      if (!mod) return;
      if (!modulesMap[mod]) modulesMap[mod] = { total: 0, completed: 0, name: mod };
      modulesMap[mod].total++;
      if (chk.checked) modulesMap[mod].completed++;
    });

    const moduleLinks = document.querySelectorAll('.module-link');
    const moduleNames = {};
    moduleLinks.forEach(link => {
      const p = link.dataset.panel;
      const nameEl = link.querySelector('.mod-name');
      if (p && nameEl) moduleNames[p] = nameEl.textContent.trim();
    });

    let totalUnits = 0;
    let totalCompleted = 0;
    let html = '';

    for (const [modId, data] of Object.entries(modulesMap)) {
      totalUnits += data.total;
      totalCompleted += data.completed;
      
      const pct = Math.round((data.completed / data.total) * 100);
      const modName = moduleNames[modId] || modId;
      
      html += `
        <article class="progress-card">
          <strong style="font-size: 1.05rem; line-height: 1.3; margin-bottom: 0.5rem; display: block; color: var(--c-text);">${modName}</strong>
          <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 0.2rem;">
            <span class="muted">${data.completed} de ${data.total} unidades</span>
            <span style="font-weight: 800; color: var(--c-primary); font-family: var(--font-display);">${pct}%</span>
          </div>
          <div class="bar"><span style="width: ${pct}%"></span></div>
        </article>
      `;
    }

    listContainer.innerHTML = html;

    const globalPct = totalUnits > 0 ? Math.round((totalCompleted / totalUnits) * 100) : 0;
    globalVal.textContent = `${globalPct}%`;
    globalBar.style.width = `${globalPct}%`;
  };

  window.updateModuleProgressUI = function(moduleId) {
    const panel = document.getElementById(moduleId);
    if (!panel) return;
    const checks = panel.querySelectorAll('.unit-check');
    if (!checks.length) return;
    
    const total = checks.length;
    const completed = panel.querySelectorAll('.unit-check:checked').length;
    
    const pText = panel.querySelector('.module-progress-text');
    if (pText) {
      pText.textContent = `Has completado ${completed} de ${total} unidades.`;
      if (completed === total) {
        pText.style.color = '#2ECC71';
      } else {
        pText.style.color = 'var(--c-primary)';
      }
    }
  };

  function initProgress() {
    // 1. Restaurar el estado inicial desde localStorage
    const checkboxes = document.querySelectorAll('.unit-check');
    checkboxes.forEach(chk => {
      const mod = chk.dataset.module;
      const unit = chk.dataset.unit;
      if (!mod || !unit) return;

      const key = `anicuraCampus:progress:${mod}:${unit}`;
      if (localStorage.getItem(key) === 'true') {
        chk.checked = true;
      }
    });

    // 2. Listener genérico en document (event delegation)
    document.addEventListener('change', (e) => {
      const chk = e.target;
      if (!chk.matches('.unit-check')) return;

      const mod = chk.dataset.module;
      const unit = chk.dataset.unit;
      if (!mod || !unit) return;

      const key = `anicuraCampus:progress:${mod}:${unit}`;
      localStorage.setItem(key, chk.checked ? 'true' : 'false');
      
      window.updateModuleProgressUI(mod);
      window.renderGlobalProgress();
    });

    // 3. Actualizar la UI inicial para todos los módulos
    const modulesWithChecks = [...new Set([...checkboxes].map(c => c.dataset.module).filter(Boolean))];
    modulesWithChecks.forEach(mod => window.updateModuleProgressUI(mod));
    window.renderGlobalProgress();
  }
  
  initProgress();

})();