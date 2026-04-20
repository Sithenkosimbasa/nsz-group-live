'use strict';

/* Global initialization and utilities */

// Dark mode persistence
const toggleBtn = document.getElementById('dark-mode-toggle');
const toggleIcon = document.getElementById('dark-mode-icon');

// Load saved preference
if (localStorage.getItem('nsz-dark-mode') === 'true') {
  document.body.classList.add('dark-mode');
  if (toggleIcon) toggleIcon.textContent = 'light_mode';
}

if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('nsz-dark-mode', isDark);
    if (toggleIcon) {
      toggleIcon.textContent = isDark ? 'light_mode' : 'dark_mode';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Counter animation for stats
  const statValues = document.querySelectorAll('.stat-value[data-count]');

  if (statValues.length) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statValues.forEach(el => counterObserver.observe(el));
  }
});

function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1400;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out-quad
    const eased = 1 - (1 - progress) * (1 - progress);
    const current = Math.round(eased * target);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  // Work tab switching (homepage)
  const workTabs = document.querySelectorAll('.work-tab');
  const workContents = document.querySelectorAll('.work-tab-content');

  workTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;

      // Update active tab
      workTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Show target content
      workContents.forEach(content => {
        if (content.dataset.tab === targetTab) {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
        }
      });
    });
  });