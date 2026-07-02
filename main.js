/* REEDE redesign — motion & interaction
   Reveals enhance an already-visible default: the `js` class gates initial
   hidden state, IntersectionObserver reveals, and a timeout net guarantees
   nothing ships blank if IO/GSAP never fire. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  if (!reduce) document.body.classList.add('js');

  /* ---------- i18n: ET / EN / RU ---------- */
  // ponytail: static dict + textContent swap. Values are author constants,
  // so innerHTML for the few strings with <br> is safe (no user input).
  const I18N = {
    et: {
      skip: 'Liigu sisu juurde',
      nav_new: 'Uued', nav_men: 'Mehed', nav_women: 'Naised', nav_acc: 'Tarvikud', nav_est: 'Eesti disain', nav_sale: 'Ale',
      menu_new: 'Uued tooted', menu_hours: 'E–R 11–19 · L 12–17',
      hero_kicker: 'Kontseptpood', hero_h1a: 'SEE ON', hero_h1b: 'REEDE.',
      hero_sub: 'Kureeritud rõivad, jalatsid ja objektid meestele ja naistele. Nike, Carhartt WIP, eesti disain — üks vaade, üks tunne.',
      hero_cta1: 'Vaata uusi tooteid', hero_cta2: 'Käi toote ümber', hero_scroll: 'Keri',
      new_h2: 'Uued tooted', new_lead: 'Iga nädal uus valik. Sel reedel — 42 saabumist meestele ja naistele.', new_all: 'Kõik uued →',
      tees_h2: 'Naiste valik', tees_lead: 'Kureeritud jakid, topid ja korsetid — üks stuudio, üks tunne.', tees_all: 'Kõik naistele →', tees_hint: 'Lisa foto siia',
      prod_add: 'Lisa korvi',
      tube_kick: '360° · päris toode, mitte foto', tube_h2: 'Käi toote ümber',
      tube_lead: 'Keeramine, suum, värvivalik — otse brauseris. Vali oma toon ja vaata iga detaili enne, kui korvi lisad.',
      spec_model: 'Mudel', spec_material: 'Materjal', spec_material_val: '7-kihiline vaher', spec_price_label: 'Hind',
      tube_add: 'Lisa korvi — €89', tube_hint: 'Lohista mudelit, et keerata ↻', tube_badge: 'Grip',
      ed_h2: 'Eesti disain,<br>maailma riiulil.',
      ed_p: 'Reede on koht, kus kohalikud tegijad seisavad kõrvuti rahvusvaheliste nimedega. Me ei müü lihtsalt riideid — me kureerime vaadet, mis on korraga tallinlik ja piiritu.',
      ed_link: 'Tutvu disaineritega →',
      look_h2: 'Üks pilk. Üks stiil.', look_p: 'Kõik fotod ühes valguses ja ühes toonis — kaos muutub kollektsiooniks. Hõljuta, et näha värvi.',
      sale_big: 'ALE −30% kuni −50%', sale_sm: 'Hooaja väljamüük · piiratud kogused',
      nl_h: 'Uued tooted, head diilid<br>ja muu — sinu postkasti.', nl_ph: 'sinu@email.ee', nl_btn: 'Telli',
      nl_note: 'Ei rämpsu. Loobu ühe klikiga.', nl_ok: 'Aitäh! Oled nüüd nimekirjas.', nl_err: 'Kontrolli e-posti aadressi.',
      f_shop: 'Pood', f_info: 'Info', f_visit: 'Külasta', f_contact: 'Kontakt',
      f_ship: 'Tarne & tagastus', f_size: 'Suurustabel', f_gift: 'Kingitused', f_help: 'Kliendiabi',
      f_hours: 'E–R 11–19<br>L 12–17', f_made: 'Kontseptmakett — alternatiiv reede.ee-le',
    },
    en: {
      skip: 'Skip to content',
      nav_new: 'New', nav_men: 'Men', nav_women: 'Women', nav_acc: 'Accessories', nav_est: 'Estonian design', nav_sale: 'Sale',
      menu_new: 'New arrivals', menu_hours: 'Mon–Fri 11–19 · Sat 12–17',
      hero_kicker: 'Concept store', hero_h1a: 'THIS IS', hero_h1b: 'REEDE.',
      hero_sub: 'Curated clothing, footwear and objects for men and women. Nike, Carhartt WIP, Estonian design — one look, one feeling.',
      hero_cta1: 'See new arrivals', hero_cta2: 'Walk around it', hero_scroll: 'Scroll',
      new_h2: 'New arrivals', new_lead: 'A new drop every week. This Friday — 42 arrivals for men and women.', new_all: 'All new →',
      tees_h2: "Women's edit", tees_lead: 'Curated jackets, tops and corsets — one studio, one feeling.', tees_all: 'Shop women →', tees_hint: 'Add photo here',
      prod_add: 'Add to cart',
      tube_kick: '360° · the real product, not a photo', tube_h2: 'Walk around the product',
      tube_lead: 'Rotate, zoom, pick a colour — right in the browser. Choose your finish and inspect every detail before you add to cart.',
      spec_model: 'Model', spec_material: 'Material', spec_material_val: '7-ply maple', spec_price_label: 'Price',
      tube_add: 'Add to cart — €89', tube_hint: 'Drag the model to rotate ↻', tube_badge: 'Grip tape',
      ed_h2: 'Estonian design,<br>on the world’s shelf.',
      ed_p: 'Reede is where local makers stand shoulder to shoulder with international names. We don’t just sell clothes — we curate a point of view that’s both Tallinn and boundless.',
      ed_link: 'Meet the designers →',
      look_h2: 'One look. One style.', look_p: 'Every photo in one light and one tone — chaos becomes a collection. Hover to reveal colour.',
      sale_big: 'SALE −30% to −50%', sale_sm: 'Seasonal clearance · limited stock',
      nl_h: 'New arrivals, good deals<br>and more — to your inbox.', nl_ph: 'you@email.com', nl_btn: 'Subscribe',
      nl_note: 'No spam. Unsubscribe in one click.', nl_ok: 'Thanks! You’re on the list.', nl_err: 'Please check your email address.',
      f_shop: 'Shop', f_info: 'Info', f_visit: 'Visit', f_contact: 'Contact',
      f_ship: 'Shipping & returns', f_size: 'Size guide', f_gift: 'Gifts', f_help: 'Customer care',
      f_hours: 'Mon–Fri 11–19<br>Sat 12–17', f_made: 'Concept mockup — an alternative to reede.ee',
    },
    ru: {
      skip: 'Перейти к содержимому',
      nav_new: 'Новинки', nav_men: 'Мужское', nav_women: 'Женское', nav_acc: 'Аксессуары', nav_est: 'Эстонский дизайн', nav_sale: 'Sale',
      menu_new: 'Новинки', menu_hours: 'Пн–Пт 11–19 · Сб 12–17',
      hero_kicker: 'Концепт-стор', hero_h1a: 'ЭТО', hero_h1b: 'REEDE.',
      hero_sub: 'Кураторская одежда, обувь и объекты для мужчин и женщин. Nike, Carhartt WIP, эстонский дизайн — один взгляд, одно настроение.',
      hero_cta1: 'Смотреть новинки', hero_cta2: 'Осмотреть в 3D', hero_scroll: 'Листай',
      new_h2: 'Новинки', new_lead: 'Каждую неделю новый дроп. В эту пятницу — 42 поступления для мужчин и женщин.', new_all: 'Все новинки →',
      tees_h2: 'Женский образ', tees_lead: 'Кураторские жакеты, топы и корсеты — одна студия, одно настроение.', tees_all: 'Всё женское →', tees_hint: 'Добавьте фото сюда',
      prod_add: 'В корзину',
      tube_kick: '360° · настоящий товар, а не фото', tube_h2: 'Осмотрите товар со всех сторон',
      tube_lead: 'Вращение, зум, выбор цвета — прямо в браузере. Выберите оттенок и рассмотрите каждую деталь перед покупкой.',
      spec_model: 'Модель', spec_material: 'Материал', spec_material_val: '7-слойный клён', spec_price_label: 'Цена',
      tube_add: 'В корзину — €89', tube_hint: 'Тяните модель, чтобы вращать ↻', tube_badge: 'Griptape',
      ed_h2: 'Эстонский дизайн<br>на мировой полке.',
      ed_p: 'Reede — место, где локальные авторы стоят плечом к плечу с международными именами. Мы не просто продаём одежду — мы курируем взгляд, одновременно таллиннский и безграничный.',
      ed_link: 'Познакомиться с дизайнерами →',
      look_h2: 'Один взгляд. Один стиль.', look_p: 'Все фото в одном свете и тоне — хаос становится коллекцией. Наведите, чтобы увидеть цвет.',
      sale_big: 'SALE −30% до −50%', sale_sm: 'Сезонная распродажа · ограниченный сток',
      nl_h: 'Новинки, скидки<br>и не только — тебе на почту.', nl_ph: 'ты@email.ru', nl_btn: 'Подписаться',
      nl_note: 'Без спама. Отписка в один клик.', nl_ok: 'Спасибо! Ты в списке.', nl_err: 'Проверьте адрес почты.',
      f_shop: 'Магазин', f_info: 'Инфо', f_visit: 'Визит', f_contact: 'Контакты',
      f_ship: 'Доставка и возврат', f_size: 'Таблица размеров', f_gift: 'Подарки', f_help: 'Поддержка',
      f_hours: 'Пн–Пт 11–19<br>Сб 12–17', f_made: 'Концепт-макет — альтернатива reede.ee',
    },
  };
  let lang = 'et';
  try { lang = localStorage.getItem('reede-lang') || 'et'; } catch (e) {}
  if (!I18N[lang]) lang = 'et';

  const onLang = [];
  function setLang(code) {
    const dict = I18N[code] || I18N.et;
    lang = code;
    document.documentElement.lang = code;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const v = dict[el.dataset.i18n];
      if (v == null) return;
      if (v.indexOf('<') >= 0) el.innerHTML = v; else el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-ph]').forEach((el) => {
      const v = dict[el.dataset.i18nPh]; if (v != null) el.placeholder = v;
    });
    document.querySelectorAll('[data-lang]').forEach((b) => b.classList.toggle('is-on', b.dataset.lang === code));
    try { localStorage.setItem('reede-lang', code); } catch (e) {}
    onLang.forEach((fn) => fn(code));
  }
  document.querySelectorAll('[data-lang]').forEach((b) =>
    b.addEventListener('click', () => setLang(b.dataset.lang)));
  setLang(lang);

  /* ---------- smooth scroll + parallax (skip when reduced) ---------- */
  if (!reduce && window.Lenis && window.gsap) {
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ duration: 1.1, lerp: 0.1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);

    // internal anchors go through Lenis
    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id.length < 2) return;
        const t = document.getElementById(id.slice(1));
        if (!t) return;
        e.preventDefault();
        closeMenu();
        lenis.scrollTo(t, { offset: -70 });
      });
    });

    $$('[data-parallax]').forEach((el) => {
      const img = el.querySelector('.ph') || el;
      gsap.fromTo(img, { yPercent: -6 }, {
        yPercent: 8, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
  }

  /* ---------- reveals ---------- */
  const revealAll = () => $$('[data-reveal], [data-fade], [data-stagger]').forEach(mark);
  function mark(el) {
    if (el.hasAttribute('data-stagger')) {
      [...el.children].forEach((c, i) => { c.style.transitionDelay = (i * 90) + 'ms'; c.classList.add('is-in'); });
    } else {
      el.classList.add('is-in');
    }
  }
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((ents, obs) => {
      ents.forEach((e) => { if (e.isIntersecting) { mark(e.target); obs.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    $$('[data-reveal], [data-fade], [data-stagger]').forEach((el) => io.observe(el));
    setTimeout(revealAll, 3000);                 // safety net — never leave blank
  } else {
    revealAll();
  }

  /* ---------- hero intro (fires on DOM ready, not on full load) ---------- */
  requestAnimationFrame(() => {
    if (reduce) return;
    $$('#hero [data-rise]').forEach((el, i) => setTimeout(() => el.classList.add('is-in'), 120 + i * 90));
    setTimeout(() => $$('#hero [data-fade]').forEach((el) => el.classList.add('is-in')), 520);
  });

  /* ---------- header solidify ---------- */
  const nav = $('[data-nav]');
  let ticking = false;
  const onScroll = () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      nav.classList.toggle('is-solid', window.scrollY > innerHeight * 0.82);
      ticking = false;
    });
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  const burger = $('[data-burger]');
  const menu = $('[data-menu]');
  function openMenu() {
    menu.classList.add('is-open');
    burger.classList.add('is-open'); burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    menu.classList.remove('is-open'); burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false'); document.body.style.overflow = '';
  }
  burger?.addEventListener('click', () => (menu.classList.contains('is-open') ? closeMenu() : openMenu()));
  $$('[data-menu] a').forEach((a) => a.addEventListener('click', closeMenu));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  /* ---------- size selector ---------- */
  $$('.sizes button:not(:disabled)').forEach((b) =>
    b.addEventListener('click', () => {
      $$('.sizes button').forEach((x) => x.classList.remove('is-on'));
      b.classList.add('is-on');
    }));

  /* ---------- newsletter ---------- */
  const form = $('.nl__form');
  const msg = $('[data-nl-msg]');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = $('#email');
    const ok = input.checkValidity() && input.value.trim();
    msg.hidden = false;
    msg.textContent = (I18N[lang] || I18N.et)[ok ? 'nl_ok' : 'nl_err'];
    msg.style.opacity = ok ? '1' : '.85';
    if (ok) { input.value = ''; }
  });

  /* ---------- 3D skateboard deck: drag-orbit + auto-spin + colourways ---------- */
  const deck = $('[data-deck]');
  if (deck) {
    const obj = $('[data-deck-obj]', deck);
    let rotY = -24, rotX = 6, dragging = false, lastX = 0, lastY = 0;
    const apply = () => { obj.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`; };
    apply();

    obj.addEventListener('pointerdown', (e) => {
      dragging = true; lastX = e.clientX; lastY = e.clientY;
      deck.classList.add('is-drag'); obj.setPointerCapture?.(e.pointerId);
    });
    obj.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      rotY += (e.clientX - lastX) * 0.5;
      rotX = Math.max(-40, Math.min(40, rotX - (e.clientY - lastY) * 0.35));
      lastX = e.clientX; lastY = e.clientY; apply();
    });
    const stop = () => { dragging = false; deck.classList.remove('is-drag'); };
    obj.addEventListener('pointerup', stop);
    obj.addEventListener('pointercancel', stop);

    if (!reduce) {
      const spin = () => { if (!dragging) { rotY += 0.22; apply(); } requestAnimationFrame(spin); };
      requestAnimationFrame(spin);
    }

    // colourways change the graphic's sky colour
    const swatchWrap = $('#swatches');
    if (swatchWrap) {
      const CW = [
        { label: 'Blue', c: '#2536d4' }, { label: 'Reede', c: '#0100ca' },
        { label: 'Ink', c: '#15171d' }, { label: 'Rust', c: '#b8482f' },
      ];
      swatchWrap.innerHTML = '';
      deck.style.setProperty('--deck-accent', CW[0].c);
      CW.forEach((cw, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'swatch' + (i === 0 ? ' is-on' : '');
        b.style.background = cw.c;
        b.setAttribute('aria-label', 'Värv / Colour: ' + cw.label);
        b.innerHTML = `<span class="swatch__lbl">${cw.label}</span>`;
        b.addEventListener('click', () => {
          deck.style.setProperty('--deck-accent', cw.c);
          $$('.swatch', swatchWrap).forEach((x) => x.classList.remove('is-on'));
          b.classList.add('is-on');
        });
        swatchWrap.appendChild(b);
      });
    }
  }

  /* ---------- AI assistant (scripted demo, no backend) ---------- */
  // ponytail: rule-based intent match + canned replies. To make it a real LLM,
  // replace reply()'s setTimeout with a fetch() to a Claude proxy — UI is unchanged.
  const CHAT = {
    et: {
      placeholder: 'Kirjuta küsimus…', tag: 'AI',
      welcome: 'Tere! Olen Reede assistent 👋 Aitan lahtiolekuaegade, tarne, suuruste ja toodetega. Millega saan abiks olla?',
      chips: [['Lahtiolekuajad', 'Millal olete avatud?'], ['Tarne', 'Kuidas käib tarne?'], ['Suurused', 'Kuidas valida õige suurus?'], ['3D skate', 'Räägi skateboardist']],
      a: {
        greeting: 'Tere! Küsi julgelt lahtiolekuaegade, tarne, tagastuse või toodete kohta.',
        hours: 'Oleme avatud E–R 11–19 ja L 12–17. Leiad meid aadressilt Rotermanni 5, Tallinn.',
        shipping: 'Saadame üle Eesti 1–3 tööpäevaga. Ostud üle 70 € — tasuta tarne. Saadame ka EL-i.',
        returns: 'Tagastus 30 päeva jooksul, tooted kandmata ja siltidega. Vahetada saab ka poes Rotermannis.',
        sizes: 'Iga toote juures on suurustabel. Skate-decki laius (tollides) sõltub jala suurusest ja stiilist — kirjuta oma kinganumber, soovitan.',
        product: 'Meil on Nike, Carhartt WIP, eesti disain ja skateboarding. Proovi 3D-vaadet: keera Reede Deck ’26 ümber ja vali värv otse lehel!',
        sale: 'Hooaja ALE käib: −30% kuni −50%, kogused piiratud.',
        contact: 'Helista +372 660 9570 või kirjuta hei@reede.ee. Kohtume Rotermanni 5, Tallinn.',
        payment: 'Maksad kaardiga, Apple/Google Pay või pangalingiga. Järelmaks Montonio kaudu.',
        fallback: 'Hea küsimus! Aitan lahtiolekuaegade, tarne, tagastuse, suuruste ja toodetega — või helista +372 660 9570.',
      },
    },
    en: {
      placeholder: 'Type a question…', tag: 'AI',
      welcome: 'Hi! I’m the Reede assistant 👋 I can help with opening hours, delivery, sizing and products. How can I help?',
      chips: [['Opening hours', 'When are you open?'], ['Delivery', 'How does delivery work?'], ['Sizing', 'How do I pick the right size?'], ['3D skate', 'Tell me about the skateboard']],
      a: {
        greeting: 'Hi! Ask me anything about opening hours, delivery, returns or products.',
        hours: 'We’re open Mon–Fri 11–19 and Sat 12–17. Find us at Rotermanni 5, Tallinn.',
        shipping: 'We ship across Estonia in 1–3 business days. Orders over €70 ship free. EU delivery available too.',
        returns: '30-day returns, unworn and with tags. You can also exchange in-store at Rotermanni.',
        sizes: 'Every product has a size chart. Skate-deck width (in inches) depends on your shoe size and style — tell me your size and I’ll suggest one.',
        product: 'We carry Nike, Carhartt WIP, Estonian design and skateboarding. Try the 3D view: spin the Reede Deck ’26 and pick a colour right on the page!',
        sale: 'The seasonal SALE is on: −30% to −50%, limited stock.',
        contact: 'Call +372 660 9570 or email hei@reede.ee. See you at Rotermanni 5, Tallinn.',
        payment: 'Pay by card, Apple/Google Pay or bank link. Instalments via Montonio.',
        fallback: 'Good question! I can help with opening hours, delivery, returns, sizing and products — or call +372 660 9570.',
      },
    },
    ru: {
      placeholder: 'Напишите вопрос…', tag: 'AI',
      welcome: 'Привет! Я ассистент Reede 👋 Помогу с часами работы, доставкой, размерами и товарами. Чем помочь?',
      chips: [['Часы работы', 'Когда вы открыты?'], ['Доставка', 'Как работает доставка?'], ['Размеры', 'Как выбрать размер?'], ['3D скейт', 'Расскажи про скейтборд']],
      a: {
        greeting: 'Привет! Спрашивайте про часы работы, доставку, возврат или товары.',
        hours: 'Мы открыты Пн–Пт 11–19 и Сб 12–17. Адрес: Rotermanni 5, Таллинн.',
        shipping: 'Доставка по Эстонии за 1–3 рабочих дня. Заказы от €70 — бесплатно. Отправляем и по ЕС.',
        returns: 'Возврат в течение 30 дней, товар неношеный и с бирками. Обмен можно и в магазине на Rotermanni.',
        sizes: 'У каждого товара есть таблица размеров. Ширина скейт-деки (в дюймах) зависит от размера ноги и стиля — напишите размер, подскажу.',
        product: 'У нас Nike, Carhartt WIP, эстонский дизайн и скейтбординг. Попробуйте 3D: покрутите Reede Deck ’26 и выберите цвет прямо на странице!',
        sale: 'Идёт сезонный SALE: −30% до −50%, количество ограничено.',
        contact: 'Звоните +372 660 9570 или пишите hei@reede.ee. Ждём на Rotermanni 5, Таллинн.',
        payment: 'Оплата картой, Apple/Google Pay или банковской ссылкой. Рассрочка через Montonio.',
        fallback: 'Хороший вопрос! Помогу с часами работы, доставкой, возвратом, размерами и товарами — или звоните +372 660 9570.',
      },
    },
  };

  const INTENTS = [
    ['hours', /(lahti|avatud|kellaaeg|\baeg\b|hours?|\bopen\b|время|час[ыоа]|режим|работает|когда)/i],
    ['shipping', /(tarne|saatmi|kohaletoi|ship|deliver|достав|отправ|курьер|omniva|smartpost)/i],
    ['returns', /(tagast|return|refund|возврат|обмен|вернуть)/i],
    ['sizes', /(suurus|laius|\bsize|\bfit\b|размер|подойд|подход)/i],
    ['sale', /(\bale\b|\bsale\b|allahind|discount|распрод|скидк|акци)/i],
    ['payment', /(makse|maksa|\bpay\b|\bcard\b|kaart|оплат|карт|рассроч|montonio)/i],
    ['contact', /(kontakt|telefon|helist|e-?mail|phone|звон|контакт|почт|aadress|address|адрес|где вы)/i],
    ['product', /(skate|board|rula|deck|\b3d\b|toode|product|osta|\bbuy\b|nike|carhartt|бренд|brand|скейт|доск|дек|товар|купить)/i],
    ['greeting', /(tere|\bhei\b|hello|\bhi\b|\bhey\b|privet|привет|здравств|добр)/i],
  ];
  const detect = (t) => (INTENTS.find(([, re]) => re.test(t)) || ['fallback'])[0];

  const fab = $('.chat-fab');
  const chat = $('[data-chat]');
  if (fab && chat) {
    const log = $('[data-chat-log]');
    const chipWrap = $('[data-chat-chips]');
    const input = $('[data-chat-input]');
    let started = false;

    const scroll = () => { log.scrollTop = log.scrollHeight; };
    const bubble = (text, who) => {
      const d = document.createElement('div');
      d.className = 'msg msg--' + who;
      d.textContent = text;
      log.appendChild(d); scroll();
    };
    const renderChips = () => {
      chipWrap.innerHTML = '';
      (CHAT[lang] || CHAT.et).chips.forEach(([label, q]) => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'chat__chip'; b.textContent = label;
        b.addEventListener('click', () => send(q));
        chipWrap.appendChild(b);
      });
    };
    const reply = (text) => {
      const dict = CHAT[lang] || CHAT.et;
      const typing = document.createElement('div');
      typing.className = 'msg msg--bot msg--typing';
      typing.innerHTML = '<i></i><i></i><i></i>';
      log.appendChild(typing); scroll();
      setTimeout(() => { typing.remove(); bubble(dict.a[detect(text)], 'bot'); }, 650 + Math.random() * 500);
    };
    function send(text) {
      text = (text || '').trim(); if (!text) return;
      bubble(text, 'user'); input.value = '';
      reply(text);
    }
    const seed = () => { if (started) return; started = true; bubble((CHAT[lang] || CHAT.et).welcome, 'bot'); };

    const openChat = () => { chat.classList.add('is-open'); fab.classList.add('is-hidden'); seed(); setTimeout(() => input.focus(), 350); };
    const closeChat = () => { chat.classList.remove('is-open'); fab.classList.remove('is-hidden'); };

    fab.addEventListener('click', openChat);
    $('[data-chat-close]').addEventListener('click', closeChat);
    $('[data-chat-form]').addEventListener('submit', (e) => { e.preventDefault(); send(input.value); });
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && chat.classList.contains('is-open')) closeChat(); });

    const updateChatLang = (code) => {
      const dict = CHAT[code] || CHAT.et;
      input.placeholder = dict.placeholder;
      const tag = $('[data-chat-tag]'); if (tag) tag.textContent = dict.tag;
      renderChips();
    };
    onLang.push(updateChatLang);
    updateChatLang(lang);
  }
})();
