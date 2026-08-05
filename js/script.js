// Dark/light mode toggle
const toggleBtn = document.getElementById('theme-toggle');

if (toggleBtn) {
  const currentTheme = localStorage.getItem('theme');

  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    toggleBtn.textContent = '☀️';
  }

  toggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
      toggleBtn.textContent = '🌙';
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      toggleBtn.textContent = '☀️';
    }
  });
}

// Fade-in on scroll
const faders = document.querySelectorAll('.fade-in');

const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.2 });

faders.forEach(fader => appearOnScroll.observe(fader));

// Project filter
const filterBtns = document.querySelectorAll('.filter-btn');
const projectShowcases = document.querySelectorAll('.project-showcase');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    projectShowcases.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.style.display = 'grid';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// Lightbox
const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.innerHTML = `
  <button class="lightbox-close" type="button" aria-label="Close image preview">×</button>
  <div class="lightbox-panel">
    <img alt="Expanded project image preview">
    <div class="lightbox-caption"></div>
  </div>
`;
document.body.appendChild(lightbox);

const lightboxImage = lightbox.querySelector('img');
const lightboxCaption = lightbox.querySelector('.lightbox-caption');
const lightboxClose = lightbox.querySelector('.lightbox-close');
const lightboxTriggers = document.querySelectorAll('[data-lightbox-image]');

const openLightbox = (imageSrc, caption) => {
  lightboxImage.src = imageSrc;
  lightboxImage.alt = caption;
  lightboxCaption.textContent = caption;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
};

lightboxTriggers.forEach(trigger => {
  trigger.addEventListener('click', () => {
    openLightbox(trigger.dataset.lightboxImage, trigger.dataset.lightboxCaption);
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', event => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && lightbox.classList.contains('open')) {
    closeLightbox();
  }
});