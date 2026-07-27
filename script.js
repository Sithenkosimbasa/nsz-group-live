/* ===========================================================
   NSZ Group — site interactions
   Drop-in replacement. No dependencies, no backend required.
   =========================================================== */
(function () {
  "use strict";
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- footer year ---- */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---- sticky-nav scrolled state ---- */
  var nav = document.getElementById('nav');
  function navState(){ if(nav) nav.classList.toggle('scrolled', window.scrollY > 20); }
  navState(); window.addEventListener('scroll', navState, { passive:true });

  /* ---- offset anchor scrolling so targets clear the sticky nav ---- */
  var st = document.createElement('style');
  st.textContent = 'html{scroll-padding-top:96px}';
  document.head.appendChild(st);

  function smoothTo(hash){
    var el = document.querySelector(hash);
    if(!el) return;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block:'start' });
  }

  /* ---- mobile menu ---- */
  var burger = document.getElementById('burger'),
      mm = document.getElementById('mobileMenu');
  if (burger && mm){
    burger.addEventListener('click', function(){
      var open = mm.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
    });
    mm.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        mm.classList.remove('open'); burger.setAttribute('aria-expanded', false);
      });
    });
  }

  /* ---- intercept every in-page anchor for offset smooth scroll ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    var href = a.getAttribute('href');
    if (href === '#' || href.length < 2) return;      // handled separately below
    a.addEventListener('click', function(e){
      var target = document.querySelector(href);
      if (target){ e.preventDefault(); smoothTo(href);
        if (history.replaceState) history.replaceState(null,'',href);
      }
    });
  });

  /* ---- reveal on scroll ---- */
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold:.14 });
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

  /* ---- count-up stats ---- */
  function countUp(el){
    var target = +el.dataset.count, suffix = el.dataset.suffix || '';
    var isYear = target >= 1900, start = isYear ? 1990 : 0, dur = 1500, t0 = performance.now();
    if (reduce){ el.textContent = target + suffix; return; }
    (function step(t){
      var p = Math.min((t - t0)/dur, 1), eased = 0.5 - Math.cos(Math.PI*p)/2;
      el.textContent = Math.floor(start + (target-start)*eased) + (p<1 ? '' : suffix);
      if (p < 1) requestAnimationFrame(step); else el.textContent = target + suffix;
    })(t0);
  }
  var cio = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ countUp(e.target); cio.unobserve(e.target); } });
  }, { threshold:.6 });
  document.querySelectorAll('[data-count]').forEach(function(el){ cio.observe(el); });

  /* ---- active nav on scroll ---- */
  var sections = [].slice.call(document.querySelectorAll('main section[id]')),
      links = [].slice.call(document.querySelectorAll('.nav-links a[data-nav]'));
  function spy(){
    var y = window.scrollY + 140, cur = '';
    sections.forEach(function(s){ if (s.offsetTop <= y) cur = s.id; });
    links.forEach(function(l){ l.classList.toggle('active', l.getAttribute('href') === '#' + cur); });
  }
  spy(); window.addEventListener('scroll', spy, { passive:true });

  /* ===========================================================
     MODAL — for service "Learn more" + project cards
     Injected entirely from JS so no HTML/CSS edits are needed.
     =========================================================== */
  var modalCSS = ''
    + '.nsz-modal-overlay{position:fixed;inset:0;z-index:200;display:none;align-items:center;justify-content:center;padding:20px;background:rgba(1,15,45,.6);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}'
    + '.nsz-modal-overlay.open{display:flex}'
    + '.nsz-modal{max-width:520px;width:100%;background:rgba(10,30,80,.92);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.22);border-radius:20px;padding:30px;box-shadow:0 30px 70px -20px rgba(1,15,45,.7);transform:translateY(14px);opacity:0;transition:.28s cubic-bezier(.22,.61,.36,1)}'
    + '.nsz-modal-overlay.open .nsz-modal{transform:none;opacity:1}'
    + '.nsz-modal .x{position:absolute;top:14px;right:16px;background:none;border:0;color:#BDC8D7;font-size:1.6rem;line-height:1;cursor:pointer}'
    + '.nsz-modal .x:hover{color:#fff}'
    + '.nsz-modal .cat{font-family:"Lexend",sans-serif;font-size:.72rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#EABC39}'
    + '.nsz-modal h3{font-family:"Lexend",sans-serif;font-size:1.5rem;margin:8px 0 12px;color:#fff}'
    + '.nsz-modal p{color:#BDC8D7;margin-bottom:16px;line-height:1.6}'
    + '.nsz-modal ul{list-style:none;margin:0 0 22px;padding:0;display:grid;gap:10px}'
    + '.nsz-modal li{display:flex;gap:10px;color:#e8eefc;font-size:.95rem}'
    + '.nsz-modal li::before{content:"✓";color:#EABC39;font-weight:700}'
    + '.nsz-modal .m-cta{width:100%;justify-content:center}';
  var ms = document.createElement('style'); ms.textContent = modalCSS; document.head.appendChild(ms);

  var overlay = document.createElement('div');
  overlay.className = 'nsz-modal-overlay';
  overlay.setAttribute('role','dialog');
  overlay.setAttribute('aria-modal','true');
  overlay.innerHTML =
    '<div class="nsz-modal" style="position:relative">' +
      '<button class="x" aria-label="Close">×</button>' +
      '<span class="cat"></span>' +
      '<h3></h3><p></p><ul></ul>' +
      '<a href="#contact" class="btn btn-gold m-cta">Request this →</a>' +
    '</div>';
  document.body.appendChild(overlay);
  var mCat = overlay.querySelector('.cat'),
      mTitle = overlay.querySelector('h3'),
      mDesc = overlay.querySelector('p'),
      mList = overlay.querySelector('ul'),
      mCta = overlay.querySelector('.m-cta'),
      lastFocus = null;

  function openModal(data){
    mCat.textContent = data.cat || '';
    mTitle.textContent = data.title || '';
    mDesc.textContent = data.desc || '';
    mList.innerHTML = (data.points || []).map(function(p){ return '<li>' + p + '</li>'; }).join('');
    mCta.textContent = data.ctaLabel || 'Request this →';
    mCta.dataset.service = data.service || '';
    lastFocus = document.activeElement;
    overlay.classList.add('open');
    overlay.querySelector('.x').focus();
    document.body.style.overflow = 'hidden';
  }
  function closeModal(){
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  overlay.querySelector('.x').addEventListener('click', closeModal);
  overlay.addEventListener('click', function(e){ if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal(); });

  /* modal CTA -> close, jump to contact, prefill the service field */
  mCta.addEventListener('click', function(e){
    e.preventDefault();
    var svc = mCta.dataset.service || mTitle.textContent;
    closeModal();
    smoothTo('#contact');
    var f = document.getElementById('cservice');
    if (f){ f.value = svc; setTimeout(function(){ f.focus(); }, reduce ? 0 : 500); }
  });

  /* ---- service card details ---- */
  var serviceInfo = {
    'Web & App Development': ['Custom, responsive front-ends in clean HTML/CSS/JS','Web apps with Supabase auth & data','Performance, SEO & accessibility built in','Handover you fully own — no locked page builder'],
    'E-Commerce': ['Product catalogue & cart','Secure PayFast or Stripe checkout','Order & inventory management','Mobile-first, conversion-focused layout'],
    'Hosting & Domains': ['.co.za & global domain registration','Reliable hosting & SSL setup','Netlify deployment & CI','Business email configuration'],
    'Brand & Design': ['Logo & identity systems','Colour, type & visual direction','Social & marketing assets','Brand guidelines you can reuse'],
    'AI & Automation': ['AI-generated images & video','Chat assistants for your site','Workflow & task automation','Content generation pipelines'],
    'ICT & Digital Solutions': ['Company registration support','Business email & Google Workspace','Third-party integrations','Practical tech setup & advice']
  };
  document.querySelectorAll('#services .card').forEach(function(card){
    card.style.cursor = 'pointer';
    card.setAttribute('tabindex','0');
    card.setAttribute('role','button');
    function open(){
      var title = card.querySelector('h3').textContent.trim();
      openModal({
        cat: 'Service',
        title: title,
        desc: card.querySelector('p').textContent.trim(),
        points: serviceInfo[title] || [],
        service: title,
        ctaLabel: 'Request this service →'
      });
    }
    card.addEventListener('click', open);
    card.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); open(); } });
  });

  /* ---- project card details ---- */
  document.querySelectorAll('#work .work').forEach(function(card){
    card.style.cursor = 'pointer';
    card.setAttribute('tabindex','0');
    card.setAttribute('role','button');
    function open(){
      openModal({
        cat: card.querySelector('.cat').textContent.trim(),
        title: card.querySelector('h3').textContent.trim(),
        desc: card.querySelector('.meta p').textContent.trim(),
        points: ['Designed & built by NSZ Group','Responsive across all devices','Live and shipped'],
        service: 'A project like ' + card.querySelector('h3').textContent.trim(),
        ctaLabel: 'Start a project like this →'
      });
    }
    card.addEventListener('click', open);
    card.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); open(); } });
  });

  /* ---- quote buttons: after scrolling to contact, gently highlight the form ---- */
  function flashForm(){
    var form = document.getElementById('contactForm');
    if (!form || reduce) return;
    form.style.transition = 'box-shadow .5s ease';
    form.style.boxShadow = '0 0 0 2px #EABC39, 0 24px 60px -24px rgba(1,23,63,.55)';
    setTimeout(function(){ form.style.boxShadow = ''; }, 1400);
  }
  document.querySelectorAll('a[href="#contact"]').forEach(function(a){
    a.addEventListener('click', function(){ setTimeout(flashForm, reduce ? 0 : 650); });
  });

  /* ===========================================================
     CONTACT FORM — actually works via the visitor's mail client.
     (Swap the marked block for a Supabase insert when ready.)
     =========================================================== */
  var CONTACT_EMAIL = 'hello@nszgroup.co.za';
  var form = document.getElementById('contactForm');
  if (form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var note = document.getElementById('formNote');
      var name = (document.getElementById('cname').value || '').trim();
      var email = (document.getElementById('cemail').value || '').trim();
      var service = (document.getElementById('cservice').value || '').trim();
      var msg = (document.getElementById('cmsg').value || '').trim();
      var reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!name){ note.textContent = 'Please add your name.'; note.style.color = '#ffd0d0'; return; }
      if (!reEmail.test(email)){ note.textContent = 'Please enter a valid email so we can reply.'; note.style.color = '#ffd0d0'; return; }

      /* ---- default working behaviour: open a prefilled email ---- */
      var subject = 'New enquiry from ' + name + (service ? ' — ' + service : '');
      var body = 'Name: ' + name + '\nEmail: ' + email + '\nService: ' + (service || '—') + '\n\n' + (msg || '');
      var mailto = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      window.location.href = mailto;
      note.textContent = 'Opening your email app… if nothing happens, email ' + CONTACT_EMAIL + ' directly.';
      note.style.color = 'var(--gold)';
      /* -------------------------------------------------------------
         SUPABASE VERSION (uncomment + fill in to store enquiries):

         const SUPABASE_URL = 'https://YOUR-PROJECT.supabase.co';
         const SUPABASE_ANON_KEY = 'YOUR-ANON-KEY';
         fetch(SUPABASE_URL + '/rest/v1/enquiries', {
           method:'POST',
           headers:{ 'Content-Type':'application/json', apikey:SUPABASE_ANON_KEY,
                     Authorization:'Bearer ' + SUPABASE_ANON_KEY, Prefer:'return=minimal' },
           body: JSON.stringify({ name:name, email:email, service:service, message:msg })
         }).then(function(r){
           note.textContent = r.ok ? 'Thanks — we\'ll be in touch shortly.' : 'Something went wrong. Please email ' + CONTACT_EMAIL;
           note.style.color = 'var(--gold)'; if (r.ok) form.reset();
         });
      ------------------------------------------------------------- */
    });
  }
})();
