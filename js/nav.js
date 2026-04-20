'use strict';

/* Navigation functionality */

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const navMobile = document.querySelector('.nav-mobile');
  const navOverlay = document.querySelector('.nav-overlay');
  const toggleIcon = navToggle ? navToggle.querySelector('.material-symbols-outlined') : null;

  // Sticky header on scroll
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once
  }

  // Mobile menu toggle
  if (navToggle && navMobile) {
    const toggleMenu = () => {
      const isOpen = navMobile.classList.toggle('open');
      if (navOverlay) navOverlay.classList.toggle('open');
      if (toggleIcon) toggleIcon.textContent = isOpen ? 'close' : 'menu';
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.classList.toggle('nav-open', isOpen);
    };

    navToggle.addEventListener('click', toggleMenu);

    // Close on overlay click
    if (navOverlay) {
      navOverlay.addEventListener('click', toggleMenu);
    }

    // Close on mobile link click
    navMobile.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (navMobile.classList.contains('open')) {
          toggleMenu();
        }
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMobile.classList.contains('open')) {
        toggleMenu();
      }
    });
  }

  // Mobile dropdown toggle
  const mobileDropdownToggles = navMobile.querySelectorAll('.dropdown-toggle');

  mobileDropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const dropdownMenu = toggle.nextElementSibling;
      if (dropdownMenu) {
        const isOpen = dropdownMenu.classList.toggle('open');
        toggle.classList.toggle('open', isOpen);
      }
    });
  });