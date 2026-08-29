const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const faders = document.querySelectorAll('.fade-in');
if (reduceMotion || !('IntersectionObserver' in window)) {
  faders.forEach((element) => element.classList.add('visible'));
} else {
  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  faders.forEach((element) => appearOnScroll.observe(element));
}

const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-showcase');
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    projectCards.forEach((card) => {
      card.hidden = filter !== 'all' && card.dataset.category !== filter;
    });
  });
});

const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.setAttribute('role', 'dialog');
lightbox.setAttribute('aria-modal', 'true');
lightbox.setAttribute('aria-label', 'Image preview');
lightbox.innerHTML = `
  <button class="lightbox-close" type="button" aria-label="Close image preview">&times;</button>
  <div class="lightbox-panel"><img alt=""><div class="lightbox-caption"></div></div>`;
document.body.appendChild(lightbox);

const lightboxImage = lightbox.querySelector('img');
const lightboxCaption = lightbox.querySelector('.lightbox-caption');
const lightboxClose = lightbox.querySelector('.lightbox-close');
let lastTrigger = null;
const openLightbox = (trigger) => {
  lastTrigger = trigger;
  lightboxImage.src = trigger.dataset.lightboxImage;
  lightboxImage.alt = trigger.dataset.lightboxCaption || 'Expanded project image';
  lightboxCaption.textContent = trigger.dataset.lightboxCaption || '';
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  lightboxClose.focus();
};
const closeLightbox = () => {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  if (lastTrigger) lastTrigger.focus();
};
document.querySelectorAll('[data-lightbox-image]').forEach((trigger) => {
  trigger.addEventListener('click', () => openLightbox(trigger));
});
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (event) => {
  if (!lightbox.classList.contains('open')) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'Tab') {
    event.preventDefault();
    lightboxClose.focus();
  }
});
