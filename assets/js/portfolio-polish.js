(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealTargets = document.querySelectorAll(
    '.capabilities, .work-section, .process-section, .about-section, .tools-section, .contact-section'
  );

  revealTargets.forEach((section) => section.classList.add('reveal'));
  document.querySelectorAll('.cap-grid, .project-grid, .process-list, .tools-list').forEach((group) => {
    group.classList.add('reveal-group');
    [...group.children].forEach((item, index) => item.style.setProperty('--reveal-delay', `${Math.min(index, 5) * 70}ms`));
  });

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach((section) => section.classList.add('is-visible'));
    document.querySelectorAll('.reveal-group').forEach((group) => group.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll('.reveal, .reveal-group').forEach((element) => observer.observe(element));
})();
