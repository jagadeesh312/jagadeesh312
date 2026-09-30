const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('.display').forEach((heading) => {
  const original = heading.innerHTML;
  heading.innerHTML = original.split(/(<br\s*\/?\s*>)/gi)
    .map(part => part.match(/<br/i) ? '<br>' : part.replace(/([A-Z0-9]+(?:\s+[A-Z0-9]+)*)/g, '<span class="word">$1</span>')).join('');
});

const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) { entry.target.classList.add('in-view'); revealObserver.unobserve(entry.target); }
}), { threshold: .14, rootMargin: '0px 0px -5% 0px' });
document.querySelectorAll('.reveal, .poster-top, .stack-list').forEach((element) => revealObserver.observe(element));

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.nav-links a')];
const sectionObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (!entry.isIntersecting) return;
  navLinks.forEach(link => link.classList.toggle('is-current', link.getAttribute('href') === `#${entry.target.id}`));
}), { threshold: .45 });
sections.forEach(section => sectionObserver.observe(section));

const progress = document.querySelector('.scroll-progress i');
window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${max ? window.scrollY / max : 0})`;
}, { passive: true });

const projectCards = [...document.querySelectorAll('.project-board')];
document.querySelectorAll('.filter button').forEach((button) => button.addEventListener('click', () => {
  document.querySelector('.filter .active').classList.remove('active');
  button.classList.add('active');
  const selection = button.dataset.filter;
  projectCards.forEach((card, index) => {
    const show = selection === 'all' || card.dataset.category.includes(selection);
    card.classList.toggle('is-filtered', !show);
    if (show) { card.style.transitionDelay = `${index * 70}ms`; requestAnimationFrame(() => card.classList.remove('is-filtered')); }
  });
}));

if (!reducedMotion && window.matchMedia('(pointer: fine)').matches) {
  const glow = document.querySelector('.cursor-glow'); let mouseX = -100, mouseY = -100, currentX = -100, currentY = -100;
  window.addEventListener('pointermove', ({ clientX, clientY }) => { mouseX = clientX; mouseY = clientY; });
  (function moveGlow(){ currentX += (mouseX - currentX) * .12; currentY += (mouseY - currentY) * .12; glow.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`; requestAnimationFrame(moveGlow); })();
  document.querySelectorAll('.project-board, .contact-actions a, .nav-contact').forEach((item) => {
    item.addEventListener('pointerenter', () => glow.classList.add('active')); item.addEventListener('pointerleave', () => glow.classList.remove('active'));
  });
}

window.addEventListener('load', () => document.body.classList.add('site-ready'));

if (!reducedMotion) {
  const counter = document.querySelector('.intro-count');
  const started = performance.now();
  const tick = (now) => {
    const value = Math.min(100, Math.round(((now - started) / 1150) * 100));
    counter.textContent = String(value).padStart(2, '0');
    if (value < 100) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
