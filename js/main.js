(function () {
  'use strict';

  // Abas dos temas
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const targetTab = btn.getAttribute('data-tab');
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      document.getElementById(targetTab).classList.add('active');
    });
  });

  // FAQ accordion
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      document.querySelectorAll('.faq-question').forEach(b => b.setAttribute('aria-expanded', 'false'));
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Evento de clique no botão de reservar (WhatsApp) — GA4 + Pixel
  document.querySelectorAll('.btn-consultar, .btn-whatsapp-fixed').forEach(btn => {
    btn.addEventListener('click', () => {
      try { gtag('event', 'clique_whatsapp', { theme: btn.getAttribute('data-theme') || 'geral' }); } catch (e) { /* gtag indisponível */ }
      try { fbq('track', 'Contact'); } catch (e) { /* pixel indisponível */ }
    });
  });

  // Rastreamento de visualização de seção "Como funciona"
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          try { gtag('event', 'view_secao_como_funciona'); } catch (e) { /* gtag indisponível */ }
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    const steps = document.querySelector('.steps');
    if (steps) obs.observe(steps);
  }
})();
