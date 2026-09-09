const root = document.documentElement;
const languageButtons = document.querySelectorAll('[data-set-lang]');
const languageParam = new URLSearchParams(window.location.search).get('lang');

function getSavedLanguage() {
  if (languageParam === 'en' || languageParam === 'zh') return languageParam;
  try {
    return localStorage.getItem('wenyi-v2-language') || 'zh';
  } catch (error) {
    return 'zh';
  }
}

function setLanguage(language) {
  const lang = language === 'en' ? 'en' : 'zh';
  root.dataset.lang = lang;
  root.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.title = lang === 'zh'
    ? '杜雯怡 — 公关传播 · 活动营销 · 品牌营销'
    : 'Wenyi Du — PR · Events · Brand Marketing';

  languageButtons.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.setLang === lang));
  });

  document.querySelectorAll('[data-alt-zh]').forEach((image) => {
    image.alt = lang === 'zh' ? image.dataset.altZh : image.dataset.altEn;
  });

  try {
    localStorage.setItem('wenyi-v2-language', lang);
  } catch (error) {}
}

languageButtons.forEach((button) => {
  button.addEventListener('click', () => setLanguage(button.dataset.setLang));
});
setLanguage(getSavedLanguage());

document.getElementById('year').textContent = new Date().getFullYear();

const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.getElementById('mobile-menu');

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  mobileMenu.hidden = true;
  document.body.classList.remove('menu-open');
}

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  mobileMenu.hidden = open;
  document.body.classList.toggle('menu-open', !open);
});

mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
window.addEventListener('resize', () => {
  if (window.innerWidth > 1120) closeMenu();
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');

if (reduceMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
  revealItems.forEach((item) => revealObserver.observe(item));
}

const navLinks = document.querySelectorAll('[data-nav]');
function setActiveNav(section) {
  navLinks.forEach((link) => link.classList.toggle('active', link.dataset.nav === section));
}

const sectionObserver = new IntersectionObserver((entries) => {
  const visible = entries
    .filter((entry) => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (visible) setActiveNav(visible.target.dataset.section);
}, { threshold: [0.15, 0.35, 0.6], rootMargin: '-20% 0px -55% 0px' });

document.querySelectorAll('.observed-section').forEach((section) => sectionObserver.observe(section));

const projectLinks = document.querySelectorAll('[data-project-link]');
function setActiveProject(project) {
  projectLinks.forEach((link) => link.classList.toggle('active', link.dataset.projectLink === project));
  setActiveNav('projects');
}

const projectObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) setActiveProject(entry.target.dataset.project);
  });
}, { threshold: 0.32, rootMargin: '-18% 0px -38% 0px' });

document.querySelectorAll('.observed-project').forEach((project) => projectObserver.observe(project));

if (!reduceMotion) {
  const collage = document.querySelector('.photo-collage');
  const photos = collage.querySelectorAll('.hero-photo');
  collage.addEventListener('pointermove', (event) => {
    if (window.innerWidth < 900) return;
    const bounds = collage.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    photos.forEach((photo, index) => {
      const depth = (index + 1) * 4;
      photo.style.translate = `${x * depth}px ${y * depth}px`;
    });
  });
  collage.addEventListener('pointerleave', () => {
    photos.forEach((photo) => { photo.style.translate = '0 0'; });
  });
}
