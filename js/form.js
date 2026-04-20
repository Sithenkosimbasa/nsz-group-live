'use strict';

/* Form validation and submit handler */

document.addEventListener('DOMContentLoaded', () => {
  const pricingForm = document.getElementById('pricing-form');
  const formFeedback = document.getElementById('form-feedback-modal');

  if (!pricingForm) return;

  pricingForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Validation
    let valid = true;
    const required = pricingForm.querySelectorAll('[required]');
    const emailField = pricingForm.querySelector('[type="email"]');
    const phoneField = pricingForm.querySelector('[name="phone"]');
    const contactMethod = pricingForm.querySelector('[name="contact_method"]:checked');

    // Clear previous errors
    required.forEach(field => field.style.borderColor = '');
    if (formFeedback) {
      formFeedback.className = 'form-feedback';
      formFeedback.textContent = '';
    }

    // Check required fields
    required.forEach(field => {
      if (!field.value.trim()) {
        valid = false;
        field.style.borderColor = 'var(--color-error)';
      }
    });

    // Email validation
    if (emailField && emailField.value) {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(emailField.value)) {
        valid = false;
        emailField.style.borderColor = 'var(--color-error)';
      }
    }

    // Phone validation if WhatsApp selected
    if (contactMethod && contactMethod.value === 'whatsapp' && phoneField) {
      const phoneRe = /^[\d\s\-\+\(\)]+$/;
      if (!phoneField.value.trim() || !phoneRe.test(phoneField.value)) {
        valid = false;
        phoneField.style.borderColor = 'var(--color-error)';
      }
    }

    // Contact method required
    if (!contactMethod) {
      valid = false;
      showFeedback('error', 'Please select a preferred contact method.');
      return;
    }

    if (!valid) {
      showFeedback('error', 'Please fill in all required fields correctly.');
      return;
    }

    // Simulate submit
    const submitBtn = pricingForm.querySelector('[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    setTimeout(() => {
      // Success
      pricingForm.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      showFeedback('success', '✓ Thank you! We\'ll be in touch soon.');

      // Handle redirects based on contact method
      const formData = new FormData(pricingForm);
      handleFormRedirect(formData);

      // Close modal after redirect
      setTimeout(() => {
        const modalOverlay = document.querySelector('.modal-overlay');
        if (modalOverlay) {
          modalOverlay.classList.remove('open');
          document.body.style.overflow = '';
        }
      }, 1000);

    }, 1400);
  });

  function showFeedback(type, msg) {
    if (!formFeedback) return;
    formFeedback.className = `form-feedback ${type}`;
    formFeedback.textContent = msg;
  }

  // Clear red border on focus
  pricingForm.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('focus', () => {
      field.style.borderColor = '';
    });
  });
});