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
  if (navMobile) {
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
  }

  // Desktop mega-menu dropdown (click + keyboard; hover is handled by CSS)
  const desktopDropdowns = document.querySelectorAll('.nav-desktop .dropdown');

  desktopDropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    const menu = dropdown.querySelector('.dropdown-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = menu.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
    });
  });

  document.addEventListener('click', (e) => {
    desktopDropdowns.forEach(dropdown => {
      if (!dropdown.contains(e.target)) {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        if (menu) menu.classList.remove('open');
        if (toggle) {
          toggle.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      desktopDropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        if (menu) menu.classList.remove('open');
        if (toggle) {
          toggle.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
  });
});