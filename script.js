/* ============================================================
   SUMMERIE — Romantic Invitation Logic
   ============================================================ */

(function () {
  'use strict';

  // --- State ---
  let noCount = 0;
  const MAX_NO = 4;

  // --- DOM refs ---
  const sceneWelcome = document.getElementById('scene-welcome');
  const sceneInvitation = document.getElementById('scene-invitation');
  const sceneCelebration = document.getElementById('scene-celebration');
  const btnOpen = document.getElementById('btn-open');
  const btnYes = document.getElementById('btn-yes');
  const btnNo = document.getElementById('btn-no');
  const reconsiderMsg = document.getElementById('reconsider-message');
  const confettiCanvas = document.getElementById('confetti-canvas');

  // --- Reconsider messages ---
  const reconsiderMessages = [
    'Are you sure? Please reconsider… I put my whole heart into this.',
    'You\'re breaking my heart… just give me one chance?',
    'I\'m literally on my knees here, Summerie… please?',
    'I think we both know what the right answer is…'
  ];

  // --- Scene transitions ---
  function switchScene(from, to) {
    from.classList.remove('active');
    setTimeout(() => {
      to.classList.add('active');
    }, 400);
  }

  // --- Welcome → Invitation ---
  btnOpen.addEventListener('click', function () {
    switchScene(sceneWelcome, sceneInvitation);
  });

  // --- No button logic ---
  btnNo.addEventListener('click', function () {
    if (noCount >= MAX_NO) return;

    noCount++;
    const stage = 'stage-' + noCount;

    // Remove previous stages
    for (let i = 1; i <= MAX_NO; i++) {
      btnYes.classList.remove('stage-' + i);
      btnNo.classList.remove('stage-' + i);
    }

    // Add current stage
    btnYes.classList.add(stage);
    btnNo.classList.add(stage);

    // Show reconsider message
    reconsiderMsg.textContent = reconsiderMessages[noCount - 1];
    reconsiderMsg.classList.remove('visible');
    // Force reflow for re-animation
    void reconsiderMsg.offsetWidth;
    reconsiderMsg.classList.add('visible');
  });

  // --- Yes button → Celebration ---
  btnYes.addEventListener('click', function () {
    switchScene(sceneInvitation, sceneCelebration);
    setTimeout(startConfetti, 600);
  });

  // --- Confetti System ---
  function startConfetti() {
    const canvas = confettiCanvas;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const colors = [
      '#E8960C', '#F5C518', '#FFF3A3', '#D97200',
      '#FFE87A', '#FFF8E0', '#FBBF24', '#E05A1A',
      '#ffffff', '#ffe0a0'
    ];

    function createParticle() {
      return {
        x: Math.random() * canvas.width,
        y: -20,
        size: Math.random() * 8 + 4,
        speedY: Math.random() * 3 + 1.5,
        speedX: (Math.random() - 0.5) * 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 1,
        shape: Math.random() > 0.5 ? 'rect' : 'circle',
        wobble: Math.random() * 10,
        wobbleSpeed: Math.random() * 0.05 + 0.02
      };
    }

    // Initial burst
    for (let i = 0; i < 120; i++) {
      const p = createParticle();
      p.y = Math.random() * canvas.height;
      particles.push(p);
    }

    let spawnTimer = 0;
    const spawnInterval = 3;

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      spawnTimer++;
      if (spawnTimer >= spawnInterval && particles.length < 300) {
        particles.push(createParticle());
        spawnTimer = 0;
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.wobble) * 0.5;
        p.wobble += p.wobbleSpeed;
        p.rotation += p.rotationSpeed;

        if (p.y > canvas.height + 30) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(animate);
    }

    animate();
  }

  // --- Floating Decorations ---
  function createFloatingDecorations() {
    const container = document.querySelector('.floating-decorations');
    if (!container) return;

    const heartSVG = `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;

    const roseSVG = `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2C9 2 6.5 4 5.5 6.5C4.5 9 5 12 7 14c1.5 1.5 3 2.5 5 3 2-.5 3.5-1.5 5-3 2-2 2.5-5 1.5-7.5C17.5 4 15 2 12 2zm0 2c1.5 0 3 1 3.8 2.5.5 1 .5 2.5-.2 3.5-.5.8-1.5 1.5-2.6 2-.3.1-.7.2-1 .2s-.7-.1-1-.2c-1.1-.5-2.1-1.2-2.6-2-.7-1-.7-2.5-.2-3.5C9 5 10.5 4 12 4z"/></svg>`;

    const starSVG = `<svg viewBox="0 0 24 24" fill="currentColor" width="10" height="10"><circle cx="12" cy="12" r="3"/></svg>`;

    // Sun rose (sunflower) — her favourite
    const sunroseSVG = `<svg viewBox="0 0 32 32" width="22" height="22"><circle cx="16" cy="16" r="5" fill="#5a3a00" opacity="0.85"/><ellipse cx="16" cy="5" rx="3" ry="5" fill="currentColor"/><ellipse cx="16" cy="27" rx="3" ry="5" fill="currentColor"/><ellipse cx="5" cy="16" rx="5" ry="3" fill="currentColor"/><ellipse cx="27" cy="16" rx="5" ry="3" fill="currentColor"/><ellipse cx="8.5" cy="8.5" rx="3" ry="5" transform="rotate(45 8.5 8.5)" fill="currentColor"/><ellipse cx="23.5" cy="8.5" rx="3" ry="5" transform="rotate(-45 23.5 8.5)" fill="currentColor"/><ellipse cx="8.5" cy="23.5" rx="3" ry="5" transform="rotate(-45 8.5 23.5)" fill="currentColor"/><ellipse cx="23.5" cy="23.5" rx="3" ry="5" transform="rotate(45 23.5 23.5)" fill="currentColor"/></svg>`;

    const decorItems = [
      { svg: heartSVG, className: 'decor-heart', count: 5, color: 'rgba(183, 110, 121, 0.5)' },
      { svg: roseSVG, className: 'decor-rose', count: 3, color: 'rgba(139, 34, 82, 0.4)' },
      { svg: starSVG, className: 'decor-star', count: 22, color: 'rgba(212, 175, 55, 0.6)' },
      { svg: sunroseSVG, className: 'decor-sunrose', count: 5, color: 'rgba(228, 180, 30, 0.65)' }
    ];

    decorItems.forEach(item => {
      for (let i = 0; i < item.count; i++) {
        const el = document.createElement('div');
        el.className = `floating-decor ${item.className}`;
        el.innerHTML = item.svg;
        el.style.color = item.color;
        el.style.left = Math.random() * 100 + '%';
        el.style.top = Math.random() * 100 + '%';
        el.style.setProperty('--duration', (Math.random() * 10 + 8) + 's');
        el.style.setProperty('--delay', (Math.random() * 8) + 's');

        if (item.className === 'decor-star') {
          el.style.setProperty('--duration', (Math.random() * 3 + 2) + 's');
        }

        container.appendChild(el);
      }
    });
  }

  // Also create decorations for celebration scene
  function createCelebrationDecorations() {
    const container = document.querySelector('.celebration-decorations');
    if (!container) return;

    const heartSVG = `<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;

    const starSVG = `<svg viewBox="0 0 24 24" fill="currentColor" width="8" height="8"><circle cx="12" cy="12" r="4"/></svg>`;

    for (let i = 0; i < 8; i++) {
      const el = document.createElement('div');
      el.className = 'floating-decor decor-heart';
      el.innerHTML = heartSVG;
      el.style.color = 'rgba(212, 175, 55, 0.4)';
      el.style.left = Math.random() * 100 + '%';
      el.style.top = Math.random() * 100 + '%';
      el.style.setProperty('--duration', (Math.random() * 10 + 10) + 's');
      el.style.setProperty('--delay', (Math.random() * 6) + 's');
      container.appendChild(el);
    }

    for (let i = 0; i < 30; i++) {
      const el = document.createElement('div');
      el.className = 'floating-decor decor-star';
      el.innerHTML = starSVG;
      el.style.color = 'rgba(212, 175, 55, 0.5)';
      el.style.left = Math.random() * 100 + '%';
      el.style.top = Math.random() * 100 + '%';
      el.style.setProperty('--duration', (Math.random() * 3 + 2) + 's');
      el.style.setProperty('--delay', (Math.random() * 4) + 's');
      container.appendChild(el);
    }
  }

  // --- Init ---
  createFloatingDecorations();
  createCelebrationDecorations();
})();
