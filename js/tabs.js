'use strict';

/* Pricing tab switching logic */

document.addEventListener('DOMContentLoaded', () => {
  const pricingTabs = document.querySelectorAll('.pricing-tab');
  const pricingContents = document.querySelectorAll('.pricing-content');

  if (pricingTabs.length && pricingContents.length) {
    pricingTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;

        // Update active tab
        pricingTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Show target content with fade
        pricingContents.forEach(content => {
          if (content.id === targetTab) {
            content.style.display = 'grid';
            content.classList.add('fade-in');
            setTimeout(() => content.classList.remove('fade-in'), 300);
          } else {
            content.style.display = 'none';
          }
        });
      });
    });
  }
});