// =========================================================
// Corazones / pétalos flotando de fondo
// =========================================================
(function generarFloaters() {
  const contenedor = document.getElementById('floaters');
  if (!contenedor) return;

  const CANTIDAD = 16;
  const heartSVG = `<svg viewBox="0 0 32 29"><path d="M16 29 C 16 29, 0 18, 0 8.5 C 0 2, 6 0, 9 0 C 13 0, 16 3, 16 3 C 16 3, 19 0, 23 0 C 26 0, 32 2, 32 8.5 C 32 18, 16 29, 16 29 Z"/></svg>`;

  for (let i = 0; i < CANTIDAD; i++) {
    const el = document.createElement('div');
    el.className = 'floater';

    const size = 12 + Math.random() * 20; // px
    const left = Math.random() * 100; // %
    const duration = 12 + Math.random() * 14; // s
    const delay = Math.random() * -20; // s (negativo = ya en marcha)

    el.style.width = size + 'px';
    el.style.height = size + 'px';
    el.style.left = left + 'vw';
    el.style.animationDuration = duration + 's';
    el.style.animationDelay = delay + 's';
    el.innerHTML = heartSVG;

    contenedor.appendChild(el);
  }
})();

// =========================================================
// Botón de scroll en el hero
// =========================================================
(function scrollCue() {
  const boton = document.getElementById('scrollCue');
  if (!boton) return;

  boton.addEventListener('click', () => {
    const siguiente = document.getElementById('galeria-1');
    if (siguiente) {
      siguiente.scrollIntoView({ behavior: 'smooth' });
    }
  });
})();

// =========================================================
// Aparición suave de las secciones al hacer scroll
// =========================================================
(function revelarAlScroll() {
  const elementos = document.querySelectorAll('.polaroid, .letter-card');
  if (!('IntersectionObserver' in window) || elementos.length === 0) return;

  elementos.forEach(el => {
    el.style.opacity = '0';
    el.style.transform += ' translateY(24px)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  });

  const observer = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        entrada.target.style.opacity = '1';
        entrada.target.style.transform = entrada.target.style.transform.replace(' translateY(24px)', '');
        observer.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.15 });

  elementos.forEach(el => observer.observe(el));
})();
