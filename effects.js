/**
 * ============================================================================
 * Ashish Rewaskar - Ambient Visual Effects & Micro-Interactions
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initCursorGlow();
  initScrollProgressBar();
  initCardSpotlight();
  initScrollObserver();
});

/**
 * Ambient Cursor Spotlight Glow Effect
 */
function initCursorGlow() {
  const cursorGlow = document.querySelector('.cursor-glow');
  if (!cursorGlow) return;

  if (window.matchMedia('(pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function render() {
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;
      cursorGlow.style.left = `${currentX}px`;
      cursorGlow.style.top = `${currentY}px`;
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  } else {
    cursorGlow.style.display = 'none';
  }
}

/**
 * Top Scroll Progress Bar
 */
function initScrollProgressBar() {
  const progressBar = document.querySelector('.scroll-progress-bar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
  }, { passive: true });
}

/**
 * Dynamic Card Spotlight Mouseover Border Reflection
 */
function initCardSpotlight() {
  const interactiveCards = document.querySelectorAll('.project-card, .value-card, .featured-card, .contact-highlight-card');

  interactiveCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/**
 * Intersection Observer for Reveal on Scroll
 */
function initScrollObserver() {
  const reveals = document.querySelectorAll('.reveal:not(.active)');
  if (!reveals.length) return;

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach(el => revealObserver.observe(el));
}
window.initScrollObserver = initScrollObserver;
