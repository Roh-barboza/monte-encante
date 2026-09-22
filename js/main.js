(function(){
  'use strict';

  const WHATSAPP = '5511910604169';

  const collections = [
    {name:'Safari Baby', category:'bebes', label:'Bebês', price:'R$129', pieces:'20 peças', image:'/images/safari-baby.webp', description:'Uma composição suave e acolhedora para aniversários e comemorações com clima delicado.'},
    {name:'Mickey Baby', category:'bebes infantil', label:'Bebês & infantil', price:'R$139', pieces:'18 peças', image:'/images/mickey-baby.webp', description:'Um clássico em versão baby, leve e afetivo para uma celebração cheia de personalidade.'},
    {name:'Patrulha Canina', category:'infantil herois', label:'Infantil', price:'R$179', pieces:'25 peças', image:'/images/patrulha-canina.webp', description:'Cores marcantes e um tema querido para uma mesa divertida e cheia de energia.'},
    {name:'Dinossauros', category:'infantil', label:'Aventura', price:'R$149', pieces:'22 peças', image:'/images/dinossauros.webp', description:'Uma coleção lúdica com presença visual forte para pequenos exploradores.'},
    {name:'Carros', category:'infantil', label:'Infantil', price:'R$159', pieces:'24 peças', image:'/images/carros.webp', description:'Velocidade, cor e diversão em uma composição feita para fãs de quatro rodas.'},
    {name:'Unicórnio', category:'encantados infantil', label:'Encantados', price:'R$159', pieces:'23 peças', image:'/images/unicornio.webp', description:'Tons delicados e uma atmosfera encantada para uma festa leve, bonita e fotogênica.'},
    {name:'Princesas', category:'encantados infantil', label:'Encantados', price:'R$169', pieces:'26 peças', image:'/images/princesas.webp', description:'Uma coleção clássica com clima de conto de fadas e presença delicada na mesa.'},
    {name:'Minnie Rosa', category:'encantados infantil', label:'Clássicos', price:'R$149', pieces:'21 peças', image:'/images/minnie-rosa.webp', description:'Uma leitura romântica e charmosa de um dos temas mais queridos das festas infantis.'},
    {name:'Homem-Aranha', category:'herois infantil', label:'Heróis', price:'R$169', pieces:'24 peças', image:'/images/homem-aranha.webp', description:'Contraste, ação e um herói icônico para uma comemoração com bastante presença.'},
    {name:'Stranger Things', category:'teen', label:'Teen', price:'R$199', pieces:'22 peças', image:'/images/stranger-things.webp', description:'Uma opção de atmosfera mais intensa e contemporânea para festas teen e temáticas.'},
    {name:'Tardezinha', category:'teen', label:'Teen & adulto', price:'R$189', pieces:'20 peças', image:'/images/tardezinha.webp', description:'Uma composição descontraída para comemorações adultas, encontros e aniversários especiais.'}
  ];

  const track = (name, params={}) => {
    try { gtag('event', name, params); } catch(e) {}
  };

  const trackMeta = (name) => {
    try { fbq('track', name); } catch(e) {}
  };

  const grid = document.querySelector('#collectionGrid');
  const themeSelect = document.querySelector('#consultTheme');

  const cardTemplate = (item, index) => `
    <article class="collection-card reveal" data-category="${item.category}" data-index="${index}">
      <div class="collection-card-media">
        <img src="${item.image}" alt="Coleção ${item.name} da Monte Encante" loading="lazy">
        <span class="card-badge">${index === 2 ? 'Mais procurado' : index === 5 ? 'Queridinho' : item.price}</span>
        <button class="card-quick js-collection-details" type="button" data-index="${index}" aria-label="Ver detalhes de ${item.name}">
          <i class="fa-solid fa-arrow-up-right-from-square"></i>
        </button>
      </div>
      <div class="collection-card-body">
        <span class="collection-card-type">${item.label} • ${item.pieces}</span>
        <div class="collection-card-top">
          <h3>${item.name}</h3>
          <span class="collection-card-price">a partir de <strong>${item.price}</strong></span>
        </div>
        <div class="collection-card-actions">
          <button class="card-consult js-card-consult" type="button" data-theme="${item.name}">Consultar data</button>
          <button class="card-details js-collection-details" type="button" data-index="${index}" aria-label="Mais informações sobre ${item.name}">
            <i class="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>
    </article>`;

  if(grid){
    grid.innerHTML = collections.map(cardTemplate).join('');
  }

  if(themeSelect){
    themeSelect.insertAdjacentHTML('beforeend', collections.map(item => `<option value="${item.name}">${item.name}</option>`).join(''));
  }

  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');

  if(menuToggle && nav){
    menuToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(open));
    });

    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded','false');
    }));
  }

  const sheet = document.querySelector('.consult-sheet');
  const openConsult = (theme='') => {
    if(themeSelect && theme) themeSelect.value = theme;
    document.body.classList.add('sheet-open');
    if(sheet) sheet.setAttribute('aria-hidden','false');
    window.setTimeout(() => document.querySelector('#consultName')?.focus(), 280);
    track('abrir_consulta', { tema: theme || 'nao_informado' });
  };

  const closeConsult = () => {
    document.body.classList.remove('sheet-open');
    if(sheet) sheet.setAttribute('aria-hidden','true');
  };

  document.addEventListener('click', e => {
    const opener = e.target.closest('.js-open-consult');
    if(opener){
      openConsult(opener.dataset.theme || '');
      return;
    }

    const cardConsult = e.target.closest('.js-card-consult');
    if(cardConsult){
      openConsult(cardConsult.dataset.theme || '');
      return;
    }

    if(e.target.closest('[data-close-consult]')){
      closeConsult();
    }
  });

  document.querySelector('#consultForm')?.addEventListener('submit', e => {
    e.preventDefault();

    const name = document.querySelector('#consultName')?.value.trim() || '';
    const dateValue = document.querySelector('#consultDate')?.value || '';
    const theme = document.querySelector('#consultTheme')?.value || '';
    const region = document.querySelector('#consultRegion')?.value.trim() || '';

    if(!name || !dateValue || !theme) return;

    const date = new Date(dateValue + 'T12:00:00');
    const formattedDate = new Intl.DateTimeFormat('pt-BR').format(date);

    const lines = [
      'Olá! Vi o site da Monte Encante e quero consultar uma data.',
      '',
      `Nome: ${name}`,
      `Data da festa: ${formattedDate}`,
      `Coleção: ${theme}`,
      region ? `Bairro/região: ${region}` : '',
      '',
      'Poderiam verificar a disponibilidade para mim?'
    ].filter(Boolean);

    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`;

    track('enviar_consulta_whatsapp', { tema:theme, data_festa:dateValue });
    trackMeta('Contact');
    window.open(url,'_blank','noopener');
  });

  const dateInput = document.querySelector('#consultDate');
  if(dateInput){
    const now = new Date();
    const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0,10);
    dateInput.min = localDate;
  }

  const filterButtons = document.querySelectorAll('.filter-btn');
  const getCards = () => document.querySelectorAll('.collection-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;

      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      getCards().forEach(card => {
        const categories = (card.dataset.category || '').split(' ');
        card.hidden = filter !== 'todos' && !categories.includes(filter);
      });

      track('filtro_colecao', { categoria:filter });
    });
  });

  const modal = document.querySelector('.collection-modal');
  const modalImage = document.querySelector('#modalImage');
  const modalCategory = document.querySelector('#modalCategory');
  const modalTitle = document.querySelector('#modalTitle');
  const modalDescription = document.querySelector('#modalDescription');
  const modalPrice = document.querySelector('#modalPrice');
  const modalPieces = document.querySelector('#modalPieces');
  const modalConsult = document.querySelector('#modalConsult');
  let activeCollection = '';

  const openCollection = index => {
    const item = collections[Number(index)];
    if(!item || !modal) return;

    activeCollection = item.name;
    modalImage.src = item.image;
    modalImage.alt = `Coleção ${item.name}`;
    modalCategory.textContent = item.label;
    modalTitle.textContent = item.name;
    modalDescription.textContent = item.description;
    modalPrice.textContent = item.price;
    modalPieces.textContent = item.pieces;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    track('abrir_detalhe_colecao', { tema:item.name });
  };

  const closeCollection = () => {
    if(!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  };

  document.addEventListener('click', e => {
    const details = e.target.closest('.js-collection-details');
    if(details){
      openCollection(details.dataset.index);
      return;
    }

    if(e.target.closest('[data-close-collection]')){
      closeCollection();
    }
  });

  modalConsult?.addEventListener('click', () => {
    closeCollection();
    openConsult(activeCollection);
  });

  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const open = button.getAttribute('aria-expanded') === 'true';

      document.querySelectorAll('.faq-question').forEach(other => {
        if(other !== button){
          other.setAttribute('aria-expanded','false');
          const otherAnswer = other.closest('.faq-item')?.querySelector('.faq-answer');
          if(otherAnswer) otherAnswer.style.maxHeight = null;
        }
      });

      button.setAttribute('aria-expanded',String(!open));
      answer.style.maxHeight = open ? null : answer.scrollHeight + 'px';
    });
  });

  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox?.querySelector('img');
  const closeLightbox = () => {
    if(!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
  };

  document.querySelectorAll('.mosaic-item').forEach(item => {
    item.addEventListener('click', () => {
      if(!lightbox || !lightboxImg) return;
      lightboxImg.src = item.dataset.image;
      lightboxImg.alt = item.querySelector('img')?.alt || 'Imagem ampliada do catálogo Monte Encante';
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden','false');
      document.body.style.overflow='hidden';
      track('abrir_inspiracao', { imagem:item.dataset.image });
    });
  });

  document.querySelector('.lightbox-close')?.addEventListener('click',closeLightbox);
  lightbox?.addEventListener('click',e => {
    if(e.target === lightbox) closeLightbox();
  });

  document.querySelectorAll('.js-whatsapp-direct').forEach(link => {
    link.addEventListener('click', () => {
      track('clique_whatsapp_direto');
      trackMeta('Contact');
    });
  });

  document.addEventListener('keydown', e => {
    if(e.key === 'Escape'){
      closeConsult();
      closeCollection();
      closeLightbox();
    }
  });

  if('IntersectionObserver' in window){
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {threshold:.12,rootMargin:'0px 0px -30px'});

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          track('visualizar_secao', { secao:entry.target.id });
          sectionObserver.unobserve(entry.target);
        }
      });
    }, {threshold:.3});

    ['colecoes','experiencia','inspiracoes','duvidas'].forEach(id => {
      const el = document.getElementById(id);
      if(el) sectionObserver.observe(el);
    });
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view'));
  }
})();