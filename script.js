/* script.js */

document.addEventListener('DOMContentLoaded', () => {

  /* ── loader ── */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => setTimeout(() => loader.classList.add('hidden'), 500));
  setTimeout(() => loader && loader.classList.add('hidden'), 2800);

  /* ── cursor glow ── */
  const glow = document.getElementById('cursorGlow');
  if (glow) {
    document.addEventListener('mousemove', e => {
      glow.style.left = e.clientX + 'px';
      glow.style.top  = e.clientY + 'px';
    });
  }

  /* ── particle canvas ── */
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W = canvas.width  = innerWidth;
    let H = canvas.height = innerHeight;
    const N = Math.min(55, Math.floor(W * H / 22000));

    class P {
      constructor() { this.reset(); }
      reset() {
        this.x  = Math.random() * W;
        this.y  = Math.random() * H;
        this.r  = Math.random() * 1.4 + 0.3;
        this.vx = (Math.random() - 0.5) * 0.28;
        this.vy = (Math.random() - 0.5) * 0.28;
        this.a  = Math.random() * 0.35 + 0.1;
      }
      move() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(239,212,10,${this.a})`;
        ctx.fill();
      }
    }

    const pts = Array.from({ length: N }, () => new P());

    function connect() {
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d  = Math.sqrt(dx*dx + dy*dy);
          if (d < 115) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(239,212,10,${0.055*(1-d/115)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    (function tick() {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => { p.move(); p.draw(); });
      connect();
      requestAnimationFrame(tick);
    })();

    addEventListener('resize', () => {
      W = canvas.width  = innerWidth;
      H = canvas.height = innerHeight;
    });
  }

  /* ── sticky header ── */
  const header = document.getElementById('header');
  if (header) addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 50));

  /* ── scroll reveal  (class names: rv-up / rv-left / rv-right → add .in) ── */
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });

  document.querySelectorAll('.rv-up, .rv-left, .rv-right').forEach(el => obs.observe(el));

  /* ── animated counters ── */
  const cObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const max = parseInt(el.dataset.target, 10);
      let v = 0;
      const step = Math.max(1, Math.ceil(max / 45));
      const id = setInterval(() => {
        v = Math.min(v + step, max);
        el.textContent = v;
        if (v >= max) clearInterval(id);
      }, 38);
      cObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-num').forEach(el => cObs.observe(el));

  /* ── skill bars ── */
  const sObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.style.width = e.target.dataset.width + '%';
      sObs.unobserve(e.target);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.skill-fill').forEach(el => sObs.observe(el));

  /* ── close mobile menu on link tap ── */
  const tog = document.getElementById('menu-toggle');
  document.querySelectorAll('.dropdown a').forEach(a =>
    a.addEventListener('click', () => tog && (tog.checked = false))
  );

  /* ── smooth anchor scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior:'smooth', block:'start' }); }
    });
  });

});
