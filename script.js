document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('nav');
  const progress = document.querySelector('.progress-bar');
  const cursor = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  const cursorText = document.querySelector('.cursor-label');
  const glow = document.querySelector('.cursor-glow');

  const arabicDigits = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);

  /* scrolling */
  let lastScroll = window.scrollY;
  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
    nav.classList.toggle('scrolled', window.scrollY > 50);
    lastScroll = window.scrollY;
  }, { passive: true });

  /* custom cursor */
  if (window.innerWidth > 700 && cursor && ring && glow) {
    let mx = innerWidth / 2, my = innerHeight / 2;
    let rx = mx, ry = my, gx = mx, gy = my;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = `${mx}px`; cursor.style.top = `${my}px`;
    });
    const tick = () => {
      rx += (mx - rx) * .14;
      ry += (my - ry) * .14;
      gx += (mx - gx) * .045;
      gy += (my - gy) * .045;
      ring.style.left = `${rx}px`; ring.style.top = `${ry}px`;
      glow.style.left = `${gx}px`; glow.style.top = `${gy}px`;
      requestAnimationFrame(tick);
    };
    tick();
    document.querySelectorAll('[data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        ring.classList.add('active');
        const value = el.dataset.cursor || 'استكشف';
        if (ring.querySelector('span')) ring.querySelector('span').textContent = value;
      });
      el.addEventListener('mouseleave', () => ring.classList.remove('active'));
    });
  }

  /* magnetic elements */
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      if (innerWidth < 900) return;
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x * .10}px, ${y * .10}px)`;
    });
    el.addEventListener('mouseleave', () => el.style.transform = 'translate(0,0)');
  });

  /* hero parallax */
  const hero = document.querySelector('.hero');
  const heroImage = document.getElementById('heroImage');
  if (hero && heroImage && innerWidth > 900) {
    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      heroImage.style.transform = `scale(1.06) translate(${x * 16}px, ${y * 12}px)`;
    });
    hero.addEventListener('mouseleave', () => heroImage.style.transform = 'scale(1.06) translate(0,0)');
  }

  /* service image tilt */
  const serviceMedia = document.querySelector('.service-media');
  if (serviceMedia && innerWidth > 900) {
    serviceMedia.addEventListener('mousemove', e => {
      const r = serviceMedia.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      serviceMedia.style.transform = `perspective(1000px) rotateX(${y * -4}deg) rotateY(${x * 4}deg)`;
    });
    serviceMedia.addEventListener('mouseleave', () => serviceMedia.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)');
  }

  /* service switcher */
  const data = [
    { image:'images/haircut.jpg', number:'٠١', mini:'الخدمة الأولى', title:'حلاقة', emphasis:'الشعر', description:'قصات مرتبة ودقيقة، مع اهتمام بالشكل النهائي والتفاصيل الصغيرة.', label:'حلاقة الشعر' },
    { image:'images/interior.jpg', number:'٠٢', mini:'الخدمة الثانية', title:'تجربة', emphasis:'مميزة', description:'مكان نظيف ومرتب، وتعامل نهتم فيه بأن تكون مرتاحًا من أول زيارة.', label:'تجربة مميزة' }
  ];
  const tabs = document.querySelectorAll('.service-tab');
  const serviceImg = document.getElementById('serviceImage');
  const imageNumber = document.getElementById('serviceImageNumber');
  const imageTitle = document.getElementById('serviceImageTitle');
  const mini = document.getElementById('serviceMini');
  const counter = document.getElementById('serviceCounter');
  const title = document.getElementById('serviceTitle');
  const desc = document.getElementById('serviceDescription');
  const status = document.getElementById('serviceStatusText');
  let activeService = 0;
  const setService = index => {
    activeService = index;
    const d = data[index];
    tabs.forEach((t, i) => t.classList.toggle('active', i === index));
    serviceImg.style.opacity = '0';
    setTimeout(() => {
      serviceImg.src = d.image;
      imageNumber.textContent = d.number;
      imageTitle.textContent = d.label;
      mini.textContent = d.mini;
      counter.textContent = d.number;
      title.innerHTML = `${d.title} <em>${d.emphasis}</em>`;
      desc.textContent = d.description;
      status.textContent = d.label;
      serviceImg.style.opacity = '1';
    }, 180);
  };
  tabs.forEach((t, i) => t.addEventListener('click', () => setService(i)));

  /* review slider */
  const reviews = [...document.querySelectorAll('.review-card')];
  const next = document.getElementById('reviewNext');
  const prev = document.getElementById('reviewPrev');
  const current = document.getElementById('reviewCurrent');
  const bar = document.getElementById('reviewBar');
  let reviewIndex = 0;
  const showReview = index => {
    reviewIndex = (index + reviews.length) % reviews.length;
    reviews.forEach((r, i) => r.classList.toggle('active', i === reviewIndex));
    current.textContent = arabicDigits(reviewIndex + 1);
    bar.style.width = `${((reviewIndex + 1) / reviews.length) * 100}%`;
  };
  next.addEventListener('click', () => showReview(reviewIndex + 1));
  prev.addEventListener('click', () => showReview(reviewIndex - 1));
  setInterval(() => showReview(reviewIndex + 1), 6500);

  /* reveal */
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold:.12 });
  reveals.forEach(el => observer.observe(el));

  /* mobile menu */
  const toggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      mobileMenu.setAttribute('aria-hidden', String(!open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }));
  }

  /* booking modal */
  const modal = document.getElementById('bookingModal');
  const openModal = document.getElementById('openModal');
  const closeModal = document.getElementById('modalClose');
  const backdrop = document.getElementById('modalBackdrop');
  const open = () => { modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; };
  const close = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; };
  openModal.addEventListener('click', open);
  closeModal.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  /* smooth anchor links */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior:'smooth', block:'start' });
    });
  });
});
