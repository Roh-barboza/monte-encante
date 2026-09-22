(function(){
  'use strict';

  const track = (name, params={}) => {
    try { gtag('event', name, params); } catch(e) {}
  };

  const trackMeta = (name) => {
    try { fbq('track', name); } catch(e) {}
  };

  document.querySelectorAll('.js-whatsapp').forEach(link => {
    link.addEventListener('click', () => {
      const theme = link.dataset.theme || 'geral';
      track('clique_whatsapp', { theme });
      trackMeta('Contact');
    });
  });

  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');

  if(menuToggle && nav){
    menuToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded','false');
      });
    });
  }

  const filterButtons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.theme-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;

      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      cards.forEach(card => {
        const categories = (card.dataset.category || '').split(' ');
        card.hidden = filter !== 'todos' && !categories.includes(filter);
      });

      track('filtro_tema', { categoria: filter });
    });
  });

  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = button.getAttribute('aria-expanded') === 'true';

      document.querySelectorAll('.faq-question').forEach(other => {
        if(other !== button){
          other.setAttribute('aria-expanded','false');
          const otherAnswer = other.closest('.faq-item').querySelector('.faq-answer');
          otherAnswer.style.maxHeight = null;
        }
      });

      button.setAttribute('aria-expanded', String(!isOpen));
      answer.style.maxHeight = isOpen ? null : answer.scrollHeight + 'px';
    });
  });

  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
  const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;

  const closeLightbox = () => {
    if(!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      if(!lightbox || !lightboxImg) return;
      lightboxImg.src = item.dataset.image;
      lightboxImg.alt = item.querySelector('img')?.alt || 'Foto ampliada da Monte Encante';
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden','false');
      document.body.style.overflow = 'hidden';
      track('abrir_galeria', { imagem: item.dataset.image });
    });
  });

  if(lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if(lightbox){
    lightbox.addEventListener('click', e => {
      if(e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', e => {
    if(e.key === 'Escape') closeLightbox();
  });

  if('IntersectionObserver' in window){
    const observed = [
      ['#temas','view_secao_temas'],
      ['#galeria','view_secao_galeria'],
      ['#como-funciona','view_secao_como_funciona'],
      ['#depoimentos','view_secao_depoimentos']
    ];

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          const eventName = entry.target.dataset.analyticsEvent;
          if(eventName) track(eventName);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold:.35 });

    observed.forEach(([selector,eventName]) => {
      const el = document.querySelector(selector);
      if(el){
        el.dataset.analyticsEvent = eventName;
        observer.observe(el);
      }
    });
  }
})();