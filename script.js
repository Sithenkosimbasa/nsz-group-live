// year
document.getElementById('yr').textContent=new Date().getFullYear();

// nav scrolled state
const nav=document.getElementById('nav');
const onScroll=()=>nav.classList.toggle('scrolled',window.scrollY>20);
onScroll();window.addEventListener('scroll',onScroll,{passive:true});

// mobile menu
const burger=document.getElementById('burger'),mm=document.getElementById('mobileMenu');
burger.addEventListener('click',()=>{const o=mm.classList.toggle('open');burger.setAttribute('aria-expanded',o)});
mm.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mm.classList.remove('open');burger.setAttribute('aria-expanded',false)}));

// reveal on scroll
const io=new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.14});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// count-up
const countUp=(el)=>{
  const target=+el.dataset.count, suffix=el.dataset.suffix||'';
  const isYear=target>=1900, start=isYear?1990:0, dur=1500, t0=performance.now();
  const step=(t)=>{
    const p=Math.min((t-t0)/dur,1), eased=0.5-Math.cos(Math.PI*p)/2;
    const val=Math.floor(start+(target-start)*eased);
    el.textContent=val+(p<1?'':suffix);
    if(p<1) requestAnimationFrame(step); else el.textContent=target+suffix;
  };
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){el.textContent=target+suffix;return;}
  requestAnimationFrame(step);
};
const cio=new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting){countUp(e.target);cio.unobserve(e.target)}})},{threshold:.6});
document.querySelectorAll('[data-count]').forEach(el=>cio.observe(el));

// active nav on scroll
const sections=[...document.querySelectorAll('main section[id]')];
const links=[...document.querySelectorAll('.nav-links a[data-nav]')];
const spy=()=>{const y=window.scrollY+140;let cur='';sections.forEach(s=>{if(s.offsetTop<=y)cur=s.id});
  links.forEach(l=>l.classList.toggle('active',l.getAttribute('href')==='#'+cur));};
spy();window.addEventListener('scroll',spy,{passive:true});

// contact form (demo)
document.getElementById('contactForm').addEventListener('submit',(e)=>{
  e.preventDefault();const n=document.getElementById('formNote');
  const email=document.getElementById('cemail').value.trim();
  if(!email){n.textContent='Please add your email so we can reply.';n.style.color='#ffd0d0';return;}
  n.textContent='Thanks — this is a demo. Wire it to Supabase to receive real enquiries.';n.style.color='var(--gold)';
  e.target.reset();
});
