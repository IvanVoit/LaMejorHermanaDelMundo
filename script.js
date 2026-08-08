// =========================================================
// Se llama desde el atributo onerror de cada <img> cuando la
// foto todavía no existe en la carpeta Fotos/
// =========================================================
function marcarFotoFaltante(img) {
  const contenedor = img.closest('.polaroid-photo');
  if (contenedor) {
    contenedor.classList.add('placeholder');
  }
}

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
// Botón "Juego de recuerdos": revela la sección del juego
// =========================================================
(function abrirJuego() {
  const boton = document.getElementById('abrirJuego');
  const juego = document.getElementById('juego');
  if (!boton || !juego) return;

  boton.addEventListener('click', () => {
    juego.classList.remove('hidden');
    juego.scrollIntoView({ behavior: 'smooth', block: 'start' });
    boton.style.display = 'none';
  });
})();

// =========================================================
// Minijuego: arrastra cada foto hasta su texto correspondiente
// =========================================================
(function juegoDeRecuerdos() {
  const imagenes = document.querySelectorAll('.game-image');
  const textos = document.querySelectorAll('.game-text');
  const progresoEl = document.getElementById('gameProgress');
  const completoEl = document.getElementById('gameComplete');

  if (imagenes.length === 0 || textos.length === 0) return;

  const TOTAL = imagenes.length;
  let aciertos = 0;

  imagenes.forEach(imagen => {
    let startX = 0, startY = 0;
    let arrastrando = false;

    imagen.addEventListener('pointerdown', (e) => {
      if (imagen.classList.contains('matched')) return;
      arrastrando = true;
      startX = e.clientX;
      startY = e.clientY;
      imagen.classList.add('dragging');
      // Capturamos el puntero para que, aunque nos movamos rápido
      // o salgamos del elemento (incluso cerca del borde de la
      // pantalla), sigamos recibiendo los eventos de este arrastre.
      imagen.setPointerCapture(e.pointerId);
      e.preventDefault();
    });

    imagen.addEventListener('pointermove', (e) => {
      if (!arrastrando) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      imagen.style.transform = `translate(${dx}px, ${dy}px) scale(1.05)`;

      // resaltar el texto sobre el que pasamos
      textos.forEach(t => t.classList.remove('drop-hover'));
      const debajo = document.elementFromPoint(e.clientX, e.clientY);
      const textoDebajo = debajo ? debajo.closest('.game-text') : null;
      if (textoDebajo && !textoDebajo.classList.contains('matched')) {
        textoDebajo.classList.add('drop-hover');
      }
    });

    const soltar = (e) => {
      if (!arrastrando) return;
      arrastrando = false;

      // Importante: comprobamos qué hay debajo ANTES de quitar
      // la clase 'dragging', porque esa clase es la que hace que
      // la propia foto no bloquee la detección (pointer-events: none).
      const debajo = document.elementFromPoint(e.clientX, e.clientY);
      const textoDebajo = debajo ? debajo.closest('.game-text') : null;

      imagen.classList.remove('dragging');
      textos.forEach(t => t.classList.remove('drop-hover'));

      if (textoDebajo && !textoDebajo.classList.contains('matched') &&
          textoDebajo.dataset.pair === imagen.dataset.pair) {
        // ¡Acierto!
        imagen.style.transform = '';
        imagen.classList.add('matched');

        const miniFoto = imagen.querySelector('.polaroid-photo');
        if (miniFoto) {
          const contenedorFoto = document.createElement('div');
          contenedorFoto.className = 'game-text-photo';
          contenedorFoto.appendChild(miniFoto);
          textoDebajo.prepend(contenedorFoto);
        }

        textoDebajo.classList.add('matched');
        aciertos++;
        if (progresoEl) progresoEl.textContent = `${aciertos} / ${TOTAL} encontrados`;

        if (aciertos === TOTAL && completoEl) {
          completoEl.classList.remove('hidden');
        }
      } else if (textoDebajo) {
        // Intento fallido sobre un texto
        imagen.style.transform = '';
        imagen.classList.add('shake');
        setTimeout(() => imagen.classList.remove('shake'), 500);
      } else {
        // Soltada fuera de cualquier texto: vuelve a su sitio
        imagen.style.transform = '';
      }
    };

    imagen.addEventListener('pointerup', soltar);
    imagen.addEventListener('pointercancel', soltar);
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
