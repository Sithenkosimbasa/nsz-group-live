'use strict';

/* Newsletter signup — posts directly to Supabase's REST API.
   Run supabase/newsletter_signups.sql in your Supabase project first,
   then fill in SUPABASE_URL and SUPABASE_ANON_KEY below. */

const SUPABASE_URL = '';
const SUPABASE_ANON_KEY = '';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('newsletter-form');
  const feedback = document.getElementById('newsletter-feedback');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailField = form.querySelector('[name="email"]');
    const email = emailField ? emailField.value.trim() : '';
    const submitBtn = form.querySelector('[type="submit"]');

    setFeedback('', '');

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFeedback('error', 'Please enter a valid email address.');
      return;
    }

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.warn('Newsletter signup: SUPABASE_URL / SUPABASE_ANON_KEY are not configured yet in js/newsletter.js');
      setFeedback('error', 'Signup isn’t connected yet — please check back soon.');
      return;
    }

    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Subscribing…';

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/newsletter_signups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ email })
      });

      if (response.status === 409) {
        setFeedback('success', 'You’re already subscribed — thanks!');
        form.reset();
      } else if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      } else {
        setFeedback('success', '✓ Subscribed! Thanks for signing up.');
        form.reset();
      }
    } catch (err) {
      console.error('Newsletter signup failed:', err);
      setFeedback('error', 'Something went wrong. Please try again later.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });

  function setFeedback(type, message) {
    if (!feedback) return;
    feedback.textContent = message;
    feedback.className = `newsletter-feedback ${type}`;
  }
});
