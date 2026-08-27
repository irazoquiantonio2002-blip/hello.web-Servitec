/* ============================================================
   SERVITEC — Interacciones de la landing
   Reparación y mantenimiento de lavadoras · Cancún y Riviera Maya
   ------------------------------------------------------------
   Conserva las animaciones e interacciones originales de la
   plantilla: loader, navbar, menú móvil, reveal on scroll,
   marquee, contadores, canvas del hero y envío a WhatsApp.
   ============================================================ */
(function () {
  'use strict';
  var doc = document;

  /* --- WhatsApp de Servitec Olmar del Sureste (formato internacional, sin signos) ---
     Tel. alterno: +52 998 733 2389 · Facebook: fb.com/share/19WAzvBg58 */
  var WA_NUMBER = '525621098716';

  /* ---------- Año dinámico en el footer ---------- */
  var yearEl = doc.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Loader + entrada de la portada ---------- */
  function markLoaded() { doc.body.classList.add('loaded'); }
  /* La entrada del hero no debe esperar a que carguen las imágenes de fondo */
  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', function () { setTimeout(markLoaded, 500); });
  } else {
    setTimeout(markLoaded, 200);
  }
  /* Respaldo definitivo */
  setTimeout(markLoaded, 1600);

  window.addEventListener('load', function () {
    markLoaded();
    var loader = doc.getElementById('loader');
    if (loader) {
      setTimeout(function () { loader.classList.add('hidden'); }, 400);
      setTimeout(function () { loader.style.display = 'none'; }, 1100);
    }
    startHeroCanvas();
  });
  /* Si 'load' tarda, oculta el loader de todos modos */
  setTimeout(function () {
    var loader = doc.getElementById('loader');
    if (loader && !loader.classList.contains('hidden')) {
      loader.classList.add('hidden');
      setTimeout(function () { loader.style.display = 'none'; }, 600);
    }
    startHeroCanvas();
  }, 3000);

  /* ---------- Navbar: estado al hacer scroll ---------- */
  var navbar = doc.getElementById('navbar');
  function onScroll() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 24);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Menú móvil ---------- */
  var burger = doc.getElementById('hamburger');
  var mob = doc.getElementById('mob-menu');
  function closeMob() {
    if (!mob || !burger) return;
    mob.classList.remove('open');
    burger.classList.remove('active');
    burger.setAttribute('aria-expanded', 'false');
  }
  if (burger && mob) {
    burger.addEventListener('click', function () {
      var open = mob.classList.toggle('open');
      burger.classList.toggle('active', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    Array.prototype.forEach.call(mob.querySelectorAll('a'), function (a) {
      a.addEventListener('click', closeMob);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = doc.querySelectorAll('.reveal');
  function revealAll() {
    Array.prototype.forEach.call(reveals, function (el) { el.classList.add('in'); });
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });
    Array.prototype.forEach.call(reveals, function (el) { io.observe(el); });
    /* Red de seguridad: si el observer no dispara (algún navegador/estado raro),
       el contenido nunca se queda invisible */
    setTimeout(revealAll, 2500);
  } else {
    revealAll();
  }

  /* ---------- Marquee ---------- */
  var marquee = doc.getElementById('marquee');
  if (marquee) {
    var items = [
      'Servicio técnico', 'Mantenimiento', 'Reparación', 'Instalaciones',
      'Servicio a domicilio', 'Todas las marcas', 'Diagnóstico profesional',
      'Cancún', 'Puerto Morelos', 'Playa del Carmen', 'Isla Mujeres', 'Cozumel',
      'Atención personalizada'
    ];
    var html = '';
    for (var pass = 0; pass < 2; pass++) {
      items.forEach(function (t) {
        html += '<span class="marquee-item">' + t + '</span>';
        html += '<span class="marquee-sep" aria-hidden="true">&#9679;</span>';
      });
    }
    marquee.innerHTML = html;
  }

  /* ---------- Contadores de estadísticas ---------- */
  function runCounters() {
    Array.prototype.forEach.call(doc.querySelectorAll('.stat-num[data-count]'), function (el) {
      if (el.dataset.done) return;
      el.dataset.done = '1';
      var target = parseFloat(el.getAttribute('data-count')) || 0;
      var suffix = el.getAttribute('data-suffix') || '';
      var dur = 1600, start = null;
      function tick(now) {
        if (start === null) start = now;
        var p = Math.min((now - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString('es-MX') + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }
  var statsSection = doc.getElementById('stats');
  if (statsSection && 'IntersectionObserver' in window) {
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { runCounters(); sio.disconnect(); }
      });
    }, { threshold: 0.3 });
    sio.observe(statsSection);
  } else {
    runCounters();
  }

  /* ---------- Formulario -> WhatsApp ---------- */
  var form = doc.getElementById('wa-form');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var val = function (id) { var n = doc.getElementById(id); return n ? n.value.trim() : ''; };
      var name = val('f-name');
      var city = val('f-city');
      var interest = val('f-interest');
      var msg = val('f-msg');

      if (!name || !msg) {
        form.classList.add('shake');
        setTimeout(function () { form.classList.remove('shake'); }, 500);
        return;
      }

      var text =
        'Hola Servitec Olmar, soy ' + name + '.' +
        '\nMe encuentro en: ' + (city || '(indicar ciudad)') +
        '\nServicio que necesito: ' + interest +
        '\nDetalle de la falla: ' + msg;

      var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
      window.open(url, '_blank', 'noopener');
    });
  }

  /* ---------- Hero: canvas de burbujas / orbes ---------- */
  var heroCanvasStarted = false;
  function startHeroCanvas() {
    if (heroCanvasStarted) return;
    var canvas = doc.getElementById('hero-canvas');
    if (!canvas || !canvas.getContext) return;
    heroCanvasStarted = true;
    var ctx = canvas.getContext('2d');
    var w = 0, h = 0, dpr = 1, bubbles = [];
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function seed() {
      var count = Math.max(12, Math.round(w / 52));
      bubbles = [];
      for (var i = 0; i < count; i++) {
        bubbles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 2 + Math.random() * 5,
          sp: 0.2 + Math.random() * 0.7,
          drift: (Math.random() - 0.5) * 0.4,
          a: 0.05 + Math.random() * 0.16
        });
      }
    }
    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < bubbles.length; i++) {
        var b = bubbles[i];
        b.y -= b.sp;
        b.x += b.drift;
        if (b.y < -12) { b.y = h + 12; b.x = Math.random() * w; }
        var g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r * 3);
        g.addColorStop(0, 'rgba(55,227,223,' + b.a + ')');
        g.addColorStop(1, 'rgba(55,227,223,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r * 3, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduce) requestAnimationFrame(frame);
    }
    resize();
    seed();
    window.addEventListener('resize', function () { resize(); seed(); });
    frame();
  }
})();
