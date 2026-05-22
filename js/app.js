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
    });
    const target = document.getElementById(panelId);
    if (target) {
      target.classList.remove('hide');
      target.classList.add('active');
    }
    allModuleLinks().forEach(btn =>
      btn.classList.toggle('active', btn.dataset.panel === panelId)
    );
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

  /* ── CREAR PANELES PARA MÓDULOS "EN DESARROLLO" ───── */
  const devModules = [
    { id: 'tema-1',  title: '1. Material de consulta',                  desc: 'Repositorio de PDFs, guías rápidas, atlas visuales y glosarios de apoyo para el estudiante ATV.' },
    { id: 'tema-2',  title: '2. Origen y domesticación del perro',       desc: 'Evolución del Canis lupus familiaris, etapas de domesticación y su impacto en la conducta y anatomía actuales.' },
    { id: 'tema-3',  title: '3. Razas de perros',                        desc: 'Clasificación FCI, morfotipos, razas frecuentes en clínica veterinaria y predisposiciones patológicas.' },
    { id: 'tema-4',  title: '4. Origen del gato',                        desc: 'Domesticación del Felis silvestris lybica, diferencias biológicas con el perro y base histórica.' },
    { id: 'tema-5',  title: '5. Razas de gatos',                         desc: 'Principales razas reconocidas, morfología, temperamento y predisposiciones clínicas relevantes.' },
    { id: 'tema-6',  title: '6. Fisiología celular',                     desc: 'Estructura y función celular, tipos de tejidos, transporte de membrana y metabolismo básico.' },
    { id: 'tema-8',  title: '8. Nutrición y alimentación',               desc: 'Necesidades nutricionales, formulación de raciones, alimentos terapéuticos y soporte nutricional clínico.' },
    { id: 'tema-9',  title: '9. Farmacología',                           desc: 'Principios de farmacocinética y farmacodinámica, grupos farmacológicos y administración de fármacos en pequeños animales.' },
    { id: 'tema-10', title: '10. Exploración y manejo',                  desc: 'Técnicas de sujeción, exploración física sistemática y manejo del paciente canino y felino en clínica.' },
    { id: 'tema-11', title: '11. Sistema inmunológico y vacunación',     desc: 'Inmunidad innata y adaptativa, protocolos de vacunación y serología aplicada en pequeños animales.' },
    { id: 'tema-12', title: '12. Parásitos gastrointestinales',          desc: 'Nematodos, cestodos y protozoos de interés clínico en perro y gato: ciclo biológico, diagnóstico y tratamiento.' },
    { id: 'tema-13', title: '13. Desparasitación externa',               desc: 'Ectoparásitos (pulgas, garrapatas, ácaros), productos antiparasitarios y protocolos de desparasitación.' },
    { id: 'tema-14', title: '14. Órganos de los sentidos',               desc: 'Anatomía y función del ojo, oído, nariz y piel como órgano sensorial en perro y gato.' },
    { id: 'tema-15', title: '15. Oftalmología',                          desc: 'Patologías oculares frecuentes, técnicas de exploración ocular y asistencia en procedimientos oftalmológicos.' },
    { id: 'tema-16', title: '16. Otología',                              desc: 'Anatomía del oído, otitis externa y media, limpieza auricular y asistencia en otoscopia.' },
    { id: 'tema-17', title: '17. Dermatología',                          desc: 'Lesiones cutáneas primarias y secundarias, dermatopatías frecuentes y apoyo diagnóstico en consulta.' },
    { id: 'tema-18', title: '18. Prurito en perro y gato',              desc: 'Fisiopatología del prurito, abordaje diagnóstico diferencial y manejo del paciente pruriginoso.' },
    { id: 'tema-19', title: '19. Etología',                              desc: 'Comportamiento normal y patológico en perro y gato, comunicación animal y bases del bienestar.' },
  ];

  const mainEl = document.querySelector('main');
  devModules.forEach(mod => {
    const section = document.createElement('section');
    section.id = mod.id;
    section.className = 'content-panel hide';
    section.innerHTML = `
      <div class="dev-hero">
        <span class="pill pill-dev" style="margin-bottom:var(--sp-4);display:inline-flex;">🚧 En desarrollo</span>
        <h3>${mod.title}</h3>
        <p class="muted" style="max-width:60ch;margin-top:.5rem;">${mod.desc}</p>
        <p class="muted" style="max-width:60ch;margin-top:.5rem;font-size:var(--text-sm);">
          Este bloque ya forma parte de la estructura del campus. Se desarrollará con el mismo sistema de unidades, 
          teoría enriquecida, diagramas, actividades interactivas y evaluación que el módulo del Sistema Músculo-Esquelético.
        </p>
        <div class="dev-grid" style="margin-top:var(--sp-6);">
          <div class="skeleton"></div>
          <div class="skeleton"></div>
          <div class="skeleton"></div>
          <div class="skeleton"></div>
        </div>
        <div style="margin-top:var(--sp-6);display:flex;gap:var(--sp-3);">
          <button class="btn btn-outline" data-jump="campus-home">← Volver al campus</button>
          <button class="btn btn-primary" data-jump="tema-7">Ver módulo completo</button>
        </div>
      </div>`;
    mainEl.appendChild(section);

    // Re-attach jump listeners for dynamically created buttons
    section.querySelectorAll('[data-jump]').forEach(btn => {
      btn.addEventListener('click', () => showPanel(btn.dataset.jump));
    });
  });

  /* ── NAVEGACIÓN INTERNA DE UNIDADES ───────────────── */
  function initUnitNav() {
    const unitBtns = document.querySelectorAll('.unit-btn');
    unitBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const parentShell = btn.closest('.lesson-shell');
        if (!parentShell) return;
        parentShell.querySelectorAll('.unit-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        parentShell.querySelectorAll('.lesson-card').forEach(card => {
          card.classList.add('hide');
        });
        const targetCard = document.getElementById(btn.dataset.unit);
        if (targetCard) targetCard.classList.remove('hide');
      });
    });
  }
  initUnitNav();

  /* ── FLASHCARDS ───────────────────────────────────── */
  function initFlashcards() {
    document.querySelectorAll('.flashcard').forEach(card => {
      card.addEventListener('click', () => card.classList.toggle('flipped'));
    });
  }
  initFlashcards();

  /* ── FILL IN THE BLANKS ───────────────────────────── */
  function initFillBlanks() {
    document.querySelectorAll('[data-fill-form]').forEach(form => {
      const btn = form.querySelector('.btn-check-fill');
      const feedback = form.querySelector('.fill-feedback');
      if (!btn || !feedback) return;

      btn.addEventListener('click', () => {
        const inputs = form.querySelectorAll('.blank-input');
        let correct = 0;
        inputs.forEach(input => {
          const expected = (input.dataset.answer || '').trim().toLowerCase();
          const given = input.value.trim().toLowerCase();
          input.classList.remove('correct', 'wrong');
          if (given === expected) {
            input.classList.add('correct');
            correct++;
          } else {
            input.classList.add('wrong');
          }
        });
        feedback.classList.remove('show', 'ok', 'bad');
        feedback.classList.add('show');
        if (correct === inputs.length) {
          feedback.classList.add('ok');
          feedback.textContent = `✓ ¡Perfecto! Has completado correctamente los ${inputs.length} huecos.`;
        } else {
          feedback.classList.add('bad');
          feedback.textContent = `Correcto: ${correct}/${inputs.length}. Los huecos en rojo necesitan revisión.`;
        }
      });

      // Reset button
      const resetBtn = form.querySelector('.btn-reset-fill');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          form.querySelectorAll('.blank-input').forEach(i => {
            i.value = '';
            i.classList.remove('correct', 'wrong');
          });
          feedback.classList.remove('show', 'ok', 'bad');
          feedback.textContent = '';
        });
      }
    });
  }
  initFillBlanks();

  /* ── QUIZ DE PORTADA (data-quiz) ──────────────────── */
  function initOldQuiz() {
    document.querySelectorAll('form[data-quiz]').forEach(form => {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const selected = [...new FormData(form).values()];
        const total = form.querySelectorAll('.q-old').length;
        const correct = selected.filter(v => v === 'ok').length;
        const feedback = form.querySelector('.feedback');
        if (!feedback) return;
        const complete = selected.length === total;
        feedback.className = 'feedback show ' + ((complete && correct === total) ? 'ok' : 'bad');
        if (!complete) {
          feedback.textContent = 'Responde todas las preguntas antes de corregir.';
        } else if (correct === total) {
          feedback.textContent = `¡Muy bien! Has acertado ${correct} de ${total} preguntas.`;
        } else {
          feedback.textContent = `Has acertado ${correct} de ${total}. Revisa la teoría y vuelve a intentarlo.`;
        }
      });
    });
  }
  initOldQuiz();

  /* ── EXAMEN TIPO TEST (U9) ─────────────────────────── */
  function initExam() {
    document.querySelectorAll('[data-exam-form]').forEach(form => {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const fd = new FormData(form);
        const questions = form.querySelectorAll('.question-block');
        let answered = 0, correct = 0, total = questions.length;

        questions.forEach((qBlock, idx) => {
          const name = `exam_q${idx + 1}`;
          const val  = fd.get(name);
          const opts = qBlock.querySelectorAll('.option-label');

          // Reset styles
          opts.forEach(opt => opt.classList.remove('correct-answer', 'wrong-answer'));

          if (val !== null) {
            answered++;
            opts.forEach(opt => {
              const radio = opt.querySelector('input[type="radio"]');
              if (!radio) return;
              if (radio.value === 'ok') opt.classList.add('correct-answer');
              if (radio.value === val && val !== 'ok') opt.classList.add('wrong-answer');
            });
            if (val === 'ok') correct++;
          }
        });

        const result = form.querySelector('.exam-result');
        if (!result) return;

        if (answered < total) {
          result.className = 'exam-result show fail';
          result.innerHTML = `<div class="score" style="color:var(--c-danger)">⚠</div>
            <div class="score-label">Responde todas las preguntas antes de finalizar.</div>`;
          return;
        }

        const pct = Math.round((correct / total) * 100);
        const pass = pct >= 60;
        const grade = pct >= 90 ? 'Sobresaliente' : pct >= 75 ? 'Notable' : pct >= 60 ? 'Aprobado' : 'Suspendido';

        result.className = `exam-result show ${pass ? 'pass' : 'fail'}`;
        result.innerHTML = `
          <div class="score" style="color:${pass ? 'var(--c-success)' : 'var(--c-danger)'}">${pct}%</div>
          <div class="score-label">${correct} de ${total} preguntas correctas</div>
          <div class="grade">${grade}</div>
          <p style="margin-top:.75rem;font-size:var(--text-sm);color:var(--c-text-m);">
            ${pass
              ? '¡Enhorabuena! Has superado la evaluación del módulo de Sistema Músculo-Esquelético.'
              : 'No has alcanzado la nota mínima. Repasa las unidades con conceptos en rojo y vuelve a intentarlo.'}
          </p>`;
      });

      // Botón reiniciar examen
      const resetBtn = form.querySelector('.btn-reset-exam');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          form.reset();
          form.querySelectorAll('.option-label').forEach(opt =>
            opt.classList.remove('correct-answer', 'wrong-answer')
          );
          const result = form.querySelector('.exam-result');
          if (result) { result.className = 'exam-result'; result.innerHTML = ''; }
        });
      }
    });
  }
  initExam();

})();