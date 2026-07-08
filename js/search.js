'use strict';

/* Site-wide client-side search */

document.addEventListener('DOMContentLoaded', () => {
  const SEARCH_INDEX = [
    { title: 'Home', desc: 'NSZ Group homepage — services, work and company overview', url: 'index.html' },
    { title: 'ICT Services', desc: 'Network architecture, cybersecurity, cloud migration & IT support', url: 'ict.html' },
    { title: 'Construction', desc: 'Infrastructure development, project management & quality assurance', url: 'construction.html' },
    { title: 'Digital Solutions & Pricing', desc: 'Website design, mobile apps, e-commerce & digital marketing packages', url: 'pricing.html' },
    { title: 'Our Work', desc: 'Portfolio of websites and design projects', url: 'index.html#our-websites' },
    { title: 'About Us', desc: 'Who NSZ Group is and what drives us', url: 'index.html#about' },
    { title: 'Why Choose Us', desc: 'What sets NSZ Group apart from other providers', url: 'index.html#why-us' },
    { title: 'Contact', desc: 'Get in touch or request a quote', url: 'contact.html' },
    { title: 'SheAté', desc: 'Food ordering web app project', url: 'index.html#our-websites' },
    { title: 'Seveneity', desc: 'E-commerce clothing & accessories project', url: 'index.html#our-websites' },
    { title: 'Talent Tide', desc: 'Jobs & freelancer finding platform project', url: 'index.html#our-websites' },
    { title: 'Java Nomad', desc: 'Coffee shop locating app project', url: 'index.html#our-websites' }
  ];

  const overlay = document.getElementById('search-overlay');
  if (!overlay) return;

  const toggles = document.querySelectorAll('.nav-search-toggle');
  const input = document.getElementById('site-search-input');
  const resultsList = document.getElementById('site-search-results');
  const closeBtn = overlay.querySelector('.search-close');

  function openSearch() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    renderResults('');
    setTimeout(() => input && input.focus(), 100);
  }

  function closeSearch() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    if (input) input.value = '';
  }

  function renderResults(query) {
    if (!resultsList) return;
    const q = query.trim().toLowerCase();
    const matches = q
      ? SEARCH_INDEX.filter(item =>
          item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q))
      : SEARCH_INDEX;

    if (!matches.length) {
      resultsList.innerHTML = '<li class="search-empty">No results found. Try “construction”, “pricing”, or a project name.</li>';
      return;
    }

    resultsList.innerHTML = matches.map(item => `
      <li>
        <a class="search-result-link" href="${item.url}">
          <span class="search-result-title">${item.title}</span>
          <span class="search-result-desc">${item.desc}</span>
        </a>
      </li>
    `).join('');
  }

  toggles.forEach(btn => btn.addEventListener('click', openSearch));
  if (closeBtn) closeBtn.addEventListener('click', closeSearch);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeSearch();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      closeSearch();
      return;
    }

    const isTyping = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);
    if (e.key === '/' && !isTyping && !overlay.classList.contains('open')) {
      e.preventDefault();
      openSearch();
    }
  });

  if (input) input.addEventListener('input', () => renderResults(input.value));
});
