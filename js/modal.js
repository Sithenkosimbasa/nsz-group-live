'use strict';

/* Modal open/close and package pre-fill */

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('pricing-modal');
  const modalOverlay = document.querySelector('.modal-overlay');
  const modalClose = document.querySelector('.modal-close');
  const pricingButtons = document.querySelectorAll('.pricing-cta');
  const packageSummary = document.getElementById('selected-package');
  const priceSummary = document.getElementById('selected-price');

  if (!modal || !modalOverlay) return;

  // Open modal
  pricingButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const pkg = btn.dataset.package;
      const category = btn.dataset.category;
      const price = btn.dataset.price;

      // Update package summary
      if (packageSummary) packageSummary.textContent = `${pkg} — ${category}`;
      if (priceSummary) priceSummary.textContent = `Price: ${price}`;

      // Pre-fill hidden form fields
      const packageField = document.querySelector('[name="package"]');
      const categoryField = document.querySelector('[name="category"]');
      const priceField = document.querySelector('[name="price"]');

      if (packageField) packageField.value = pkg;
      if (categoryField) categoryField.value = category;
      if (priceField) priceField.value = price;

      // Open modal
      modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';

      // Focus management
      setTimeout(() => {
        const firstInput = modal.querySelector('input');
        if (firstInput) firstInput.focus();
      }, 100);
    });
  });

  // Close modal functions
  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
    // Clear form
    const form = document.getElementById('pricing-form');
    if (form) form.reset();
    // Clear feedback
    const feedback = document.getElementById('form-feedback-modal');
    if (feedback) {
      feedback.className = 'form-feedback';
      feedback.textContent = '';
    }
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });
});