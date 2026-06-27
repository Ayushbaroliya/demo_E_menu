/* ════════════════════════════════════════════════════════════════
   ✏️  EDIT-ME ZONE — change restaurant name, items, prices, photos,
   and video links here. Nothing below this object needs to change
   for normal day-to-day menu edits.
   ════════════════════════════════════════════════════════════════ */



/* ---------- helpers ---------- */
const fmtINR = n => CONFIG.currencySymbol + n.toLocaleString('en-IN');
const chiliIcon = filled => `<svg viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.6"><path d="M5 8c3-3 9-4 12-1 2 2 1 6-2 9-3 3-9 4-12 1-2-2-1-6 2-9Z"/></svg>`;

const cart = {}; // id -> qty
let currentUxMode = 'modal'; // Default to original

const uxModeSelect = document.getElementById('uxModeSelect');
if (uxModeSelect) {
  uxModeSelect.addEventListener('change', (e) => {
    currentUxMode = e.target.value;
    // reset UI if needed
    document.querySelectorAll('.dish-accordion').forEach(a => a.remove());
    document.getElementById('aiToast').classList.remove('show');
    document.querySelectorAll('.ai-glow').forEach(el => el.classList.remove('ai-glow'));
    document.getElementById('aiFab').style.display = 'none';
    document.querySelectorAll('.ai-carousel-section').forEach(a => a.remove());
  });
}

/* ---------- render category rail ---------- */
const catRail = document.getElementById('catRail');
CONFIG.categories.forEach((c, i) => {
  const btn = document.createElement('button');
  btn.className = 'cat-btn' + (i === 0 ? ' active' : '');
  btn.dataset.cat = c.id;
  btn.innerHTML = `<span class="cat-thumb"><img src="${c.image || c.img}" alt="${c.name}" loading="lazy"></span><span>${c.name}</span>`;
  btn.addEventListener('click', () => {
    document.getElementById('sec-' + c.id).scrollIntoView({ behavior:'smooth', block:'start' });
  });
  catRail.appendChild(btn);
});

/* ---------- render menu sections ---------- */
const menuEl = document.getElementById('menu');
CONFIG.categories.forEach(cat => {
  const items = CONFIG.items.filter(it => it.category === cat.id);
  if (!items.length) return;

  const section = document.createElement('section');
  section.className = 'section-block';
  section.id = 'sec-' + cat.id;

  const grid = items.map((it, i) => `
    <article class="dish-card" style="--i:${i}" data-id="${it.id}">
      <div class="dish-media">
        <span class="diet-mark ${it.veg ? 'veg' : 'nonveg'}" title="${it.veg ? 'Vegetarian' : 'Non-vegetarian'}"></span>
        ${it.spice > 0 ? `<span class="spice-row">${Array.from({length:3},(_,k)=>chiliIcon(k < it.spice)).join('')}</span>` : ''}
        <img src="${it.image || it.img}" alt="${it.name}" loading="lazy" class="dish-image">
        <video class="dish-video" controls playsinline style="display:none;" data-video="${it.video || ''}"></video>
        <button class="play-btn" data-video="${it.video || ''}" data-title="${it.name}" data-id="${it.id}">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7-11-7Z"/></svg> Preview
        </button>
      </div>
      <div class="dish-body">
        <h3 class="dish-name">${it.name}</h3>
        <p class="dish-note">${it.note || ''}</p>
        <div class="dish-foot">
          <span class="dish-price">${fmtINR(it.price)}</span>
          <div class="qty-zone" data-id="${it.id}"></div>
        </div>
      </div>
    </article>`).join('');

  section.innerHTML = `
    <div class="section-head">
      <h2 class="section-title">${cat.name}</h2>
      <span class="section-count">${items.length} dish${items.length>1?'es':''}</span>
    </div>
    <div class="section-rule"></div>
    <div class="dish-grid">${grid}</div>`;
  menuEl.appendChild(section);
});

/* ---------- qty controls (event delegation) ---------- */
function renderQtyZones(){
  document.querySelectorAll('.qty-zone').forEach(zone => {
    const id = zone.dataset.id;
    const qty = cart[id] || 0;
    zone.innerHTML = qty === 0
      ? `<button class="add-btn" data-add="${id}">Add</button>`
      : `<div class="qty-stepper">
           <button data-dec="${id}">−</button><span>${qty}</span><button data-inc="${id}">+</button>
         </div>`;
  });
}
renderQtyZones();

menuEl.addEventListener('click', e => {
  const playBtn = e.target.closest('.play-btn');
  if (playBtn) {
    const videoSrc = playBtn.dataset.video;
    if (!videoSrc) { showToast('No preview video available'); return; }
    const card = playBtn.closest('.dish-card');
    const video = card.querySelector('.dish-video');
    const image = card.querySelector('.dish-image');
    
    if (video.style.display === 'none') {
      video.src = videoSrc;
      video.style.display = 'block';
      image.style.display = 'none';
      playBtn.classList.add('playing');
      video.play().catch(()=>{});
    }
    
    video.addEventListener('ended', () => {
      video.style.display = 'none';
      image.style.display = 'block';
      playBtn.classList.remove('playing');
    }, { once: true });
    return;
  }

  const add = e.target.closest('[data-add]');
  const inc = e.target.closest('[data-inc]');
  const dec = e.target.closest('[data-dec]');

  if (add) { 
    const id = add.dataset.add;
    // Capture these before the button is detached from the DOM by renderQtyZones()!
    const dishCard = add.closest('.dish-card');
    const sectionBlock = add.closest('.section-block');
    
    cart[id] = 1; 
    renderQtyZones(); 
    updateCart(); 
    
    const item = CONFIG.items.find(i => i.id === id);
    if (item) {
      if (currentUxMode === 'modal') {
        openUpsellModal(item);
      } else if (currentUxMode === 'toast') {
        showToastUpsell(item);
      } else if (currentUxMode === 'accordion') {
        expandAccordionUpsell(dishCard, item);
      } else if (currentUxMode === 'glow') {
        triggerGlowUpsell(item);
      } else if (currentUxMode === 'peek') {
        triggerPeekUpsell(item);
      } else if (currentUxMode === 'carousel') {
        triggerCarouselUpsell(sectionBlock, item);
      }
    }
  }
  if (inc) { cart[inc.dataset.inc] = (cart[inc.dataset.inc]||0) + 1; renderQtyZones(); updateCart(); }
  if (dec) {
    const id = dec.dataset.dec;
    cart[id] = (cart[id]||0) - 1;
    if (cart[id] <= 0) delete cart[id];
    renderQtyZones(); updateCart();
  }
});

/* ---------- cart / chit logic ---------- */
const miniBar = document.getElementById('miniBar');
const miniBarCount = document.getElementById('miniBarCount');
const miniBarTotal = document.getElementById('miniBarTotal');
const chitItems = document.getElementById('chitItems');
const chitTotals = document.getElementById('chitTotals');

function updateCart(){
  const ids = Object.keys(cart);
  const count = ids.reduce((s,id) => s + cart[id], 0);
  const subtotal = ids.reduce((s,id) => {
    const item = CONFIG.items.find(i => i.id === id);
    return s + item.price * cart[id];
  }, 0);

  miniBar.classList.toggle('show', count > 0);
  miniBarCount.textContent = `${count} item${count!==1?'s':''}`;
  miniBarTotal.textContent = fmtINR(subtotal);

  if (count === 0){
    chitItems.innerHTML = `<div class="chit-empty">— chit is empty —<br>add a dish to start your order</div>`;
    chitTotals.innerHTML = '';
    return;
  }

  chitItems.innerHTML = ids.map(id => {
    const item = CONFIG.items.find(i => i.id === id);
    const qty = cart[id];
    return `<div class="chit-row">
      <img src="${item.image || item.img}" alt="${item.name}">
      <div>
        <p class="chit-row-name">${item.name}</p>
        <span class="chit-row-sub">${fmtINR(item.price)} each</span>
      </div>
      <div class="chit-row-right">
        <span class="chit-row-price">${fmtINR(item.price*qty)}</span>
        <div class="chit-qty">
          <button data-dec="${id}">−</button><span>${qty}</span><button data-inc="${id}">+</button>
        </div>
      </div>
    </div>`;
  }).join('');

  const cgst = subtotal * CONFIG.cgstRate;
  const sgst = subtotal * CONFIG.sgstRate;
  const total = subtotal + cgst + sgst;

  chitTotals.innerHTML = `
    <div class="chit-totals-row"><span>Subtotal</span><span>${fmtINR(Math.round(subtotal))}</span></div>
    <div class="chit-totals-row"><span>CGST (2.5%)</span><span>${fmtINR(Math.round(cgst))}</span></div>
    <div class="chit-totals-row"><span>SGST (2.5%)</span><span>${fmtINR(Math.round(sgst))}</span></div>
    <div class="chit-totals-row grand"><span>Total</span><span>${fmtINR(Math.round(total))}</span></div>`;

  if (currentUxMode === 'fab') {
    document.getElementById('aiFab').style.display = count > 0 ? 'flex' : 'none';
  } else {
    document.getElementById('aiFab').style.display = 'none';
  }
}
updateCart();

chitItems.addEventListener('click', e => {
  const inc = e.target.closest('[data-inc]');
  const dec = e.target.closest('[data-dec]');
  if (inc) cart[inc.dataset.inc] = (cart[inc.dataset.inc]||0) + 1;
  if (dec) {
    const id = dec.dataset.dec;
    cart[id] = (cart[id]||0) - 1;
    if (cart[id] <= 0) delete cart[id];
  }
  renderQtyZones(); updateCart();
});

/* ---------- chit open/close ---------- */
const chit = document.getElementById('chit');
const chitOverlay = document.getElementById('chitOverlay');
function openChit(){
  chit.classList.add('open'); chitOverlay.classList.add('open');
  document.getElementById('chitTime').textContent = new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'});
  
  // Render Chit Upsell if mode is active
  const chitAiUpsell = document.getElementById('chitAiUpsell');
  if (currentUxMode === 'chit' && Object.keys(cart).length > 0) {
    const lastAddedId = Object.keys(cart)[Object.keys(cart).length - 1];
    const item = CONFIG.items.find(i => i.id === lastAddedId);
    let mappedIds = item ? (CONFIG.upsellMap[item.id] || CONFIG.upsellMap[item.category]) : null;
    if (!mappedIds || mappedIds.length === 0) mappedIds = CONFIG.upsellMap['default'];
    
    const itemsToUpsell = mappedIds.map(id => CONFIG.items.find(i => i.id === id)).filter(Boolean);
    if (itemsToUpsell.length > 0) {
      chitAiUpsell.style.display = 'block';
      chitAiUpsell.innerHTML = `<div class="chit-ai-upsell-title">✨ AI Chef Recommends</div>` + itemsToUpsell.map(u => `
        <div class="chit-ai-item">
          <img src="${u.image || u.img}" alt="${u.name}">
          <div class="chit-ai-info">
            <p class="chit-ai-name">${u.name}</p>
            <span class="chit-ai-price">₹${u.price}</span>
          </div>
          <button class="chit-ai-add" data-upsell="${u.id}">+ Add</button>
        </div>
      `).join('');
      
      chitAiUpsell.querySelectorAll('.chit-ai-add').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const uId = e.target.dataset.upsell;
          cart[uId] = (cart[uId] || 0) + 1;
          renderQtyZones(); updateCart();
          e.target.textContent = 'Added ✓';
          e.target.disabled = true;
        });
      });
    } else {
      chitAiUpsell.style.display = 'none';
    }
  } else {
    chitAiUpsell.style.display = 'none';
  }
}
function closeChit(){ chit.classList.remove('open'); chitOverlay.classList.remove('open'); }
document.getElementById('openChitBtn').addEventListener('click', openChit);
document.getElementById('closeChitBtn').addEventListener('click', closeChit);
chitOverlay.addEventListener('click', closeChit);
document.getElementById('placeOrderBtn').addEventListener('click', () => {
  if (!Object.keys(cart).length){ showToast('Add a dish before sending your order.'); return; }
  
  if (currentUxMode === 'interstitial') {
    triggerCheckoutInterstitial();
    return;
  }
  
  finalizeOrder();
});

function finalizeOrder() {
  closeChit();
  showToast('Order sent to the kitchen — thank you!');
  Object.keys(cart).forEach(id => delete cart[id]);
  renderQtyZones();
  updateCart();
}

/* ---------- restaurant identity from config ---------- */
document.getElementById('restaurantName').textContent = CONFIG.restaurantName;
document.getElementById('restaurantTag').textContent = CONFIG.restaurantTag;
document.getElementById('tableLabel').textContent = CONFIG.tableLabel;

/* ---------- fullscreen ---------- */
const fsBtn = document.getElementById('fullscreenBtn');
fsBtn.addEventListener('click', () => {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
  else document.exitFullscreen?.();
});
document.addEventListener('fullscreenchange', () => {
  fsBtn.querySelector('span').textContent = document.fullscreenElement ? 'Exit Fullscreen' : 'View Fullscreen';
});

/* ---------- service bell sheet ---------- */
const bellFab = document.getElementById('bellFab');
const sheet = document.getElementById('serviceSheet');
const sheetOverlay = document.getElementById('sheetOverlay');
function openSheet(){ sheet.classList.add('open'); sheetOverlay.classList.add('open'); }
function closeSheet(){ sheet.classList.remove('open'); sheetOverlay.classList.remove('open'); }
bellFab.addEventListener('click', openSheet);
sheetOverlay.addEventListener('click', closeSheet);
sheet.querySelectorAll('.sheet-opt').forEach(btn => {
  btn.addEventListener('click', () => {
    const req = btn.dataset.request;
    closeSheet();
    const msgs = {
      Water: 'Water is on its way.',
      Tissues: 'Tissues are on their way.',
      Waiter: 'Your waiter has been notified.',
      Bill: 'The bill has been requested for ' + CONFIG.tableLabel + '.'
    };
    showToast(msgs[req] || 'Request sent.');
  });
});

/* ---------- toast ---------- */
let toastTimer;
function showToast(msg){
  const toast = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

/* ---------- video modal ---------- */
const videoOverlay = document.getElementById('videoOverlay');
const videoPlayer = document.getElementById('videoPlayer');
let currentVideoCard = null;

function openVideo(src, title){
  if (!src){ showToast('No preview video added for this dish yet.'); return; }
  document.getElementById('videoTitle').textContent = title + ' — preview';
  videoPlayer.src = src;
  videoPlayer.load();
  videoOverlay.classList.add('open');
  videoPlayer.play().catch(()=>{});
}
function closeVideo(){
  videoOverlay.classList.remove('open');
  videoPlayer.pause(); 
  videoPlayer.currentTime = 0;
  videoPlayer.removeAttribute('src');
  currentVideoCard = null;
}
document.getElementById('closeVideoBtn').addEventListener('click', closeVideo);
videoOverlay.addEventListener('click', e => { if (e.target === videoOverlay) closeVideo(); });

// Pause video when overlay is closed or card scrolls out of view
videoOverlay.addEventListener('transitionend', () => {
  if (!videoOverlay.classList.contains('open')) {
    videoPlayer.pause();
  }
});

/* ---------- scroll reveal ---------- */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(en => { 
    if (en.isIntersecting) {
      en.target.classList.add('in-view');
    } else {
      // Stop inline video if card scrolls out of view
      const video = en.target.querySelector('.dish-video');
      const image = en.target.querySelector('.dish-image');
      if (video && video.style.display !== 'none') {
        video.pause();
        video.currentTime = 0;
        video.style.display = 'none';
        if (image) image.style.display = 'block';
        const playBtn = en.target.querySelector('.play-btn');
        if (playBtn) playBtn.classList.remove('playing');
      }
    }
  });
}, { threshold:.1, rootMargin:'0px 0px -50px 0px' });
document.querySelectorAll('.dish-card').forEach(c => revealObserver.observe(c));

/* ---------- scrollspy for category rail ---------- */
const sections = [...document.querySelectorAll('.section-block')];
const catButtons = [...document.querySelectorAll('.cat-btn')];
const spyObserver = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting){
      const id = en.target.id.replace('sec-','');
      catButtons.forEach(b => b.classList.toggle('active', b.dataset.cat === id));
      const activeBtn = catButtons.find(b => b.dataset.cat === id);
      if (activeBtn && !activeBtn.classList.contains('active')) {
        activeBtn.scrollIntoView({ behavior:'auto', inline:'center' });
      }
    }
  });
}, { rootMargin:'-80px 0px -70% 0px', threshold:0 });
sections.forEach(s => spyObserver.observe(s));

/* ---------- lazy loading with animation ---------- */
const loadingCache = new WeakMap();
document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('img[loading="lazy"]');
  
  images.forEach(img => {
    const container = img.closest('.cat-thumb') || img.closest('.dish-media');
    if (container && !loadingCache.has(img)) {
      loadingCache.set(img, true);
      container.classList.add('loading');
      
      const handleLoadEnd = () => {
        container.classList.remove('loading');
      };
      
      img.addEventListener('load', handleLoadEnd, { once: true });
      img.addEventListener('error', handleLoadEnd, { once: true });
    }
  });
});

/* ---------- reset inline videos on page unload ---------- */
window.addEventListener('beforeunload', () => {
  document.querySelectorAll('.dish-video').forEach(video => {
    video.pause();
    video.currentTime = 0;
  });
});
/* ---------- UPSELL MODAL LOGIC ---------- */
const upsellOverlay = document.getElementById('upsellOverlay');
const upsellClose = document.getElementById('upsellClose');
const upsellContinueBtn = document.getElementById('upsellContinueBtn');
const upsellContainer = document.getElementById('upsellContainer');



const aiLoader = document.getElementById('aiLoader');
const upsellTitle = document.getElementById('upsellTitle');

function openUpsellModal(item) {
  upsellContainer.innerHTML = '';
  
  let mappedIds = CONFIG.upsellMap[item.id] || CONFIG.upsellMap[item.category];
  if (!mappedIds || mappedIds.length === 0) {
    mappedIds = CONFIG.upsellMap['default'];
  }
  
  const itemsToUpsell = mappedIds.map(id => CONFIG.items.find(i => i.id === id)).filter(Boolean);

  if (itemsToUpsell.length === 0) return;
  
  upsellOverlay.classList.add('open');
  upsellTitle.textContent = "AI Chef Thinking...";
  aiLoader.style.display = 'flex';
  upsellContainer.style.display = 'none';
  upsellContinueBtn.style.display = 'none';

  setTimeout(() => {
    aiLoader.style.display = 'none';
    upsellTitle.textContent = "✨ AI Suggested Pairings";
    upsellContainer.style.display = '';
    upsellContinueBtn.style.display = '';

    itemsToUpsell.forEach(item => {
      const matchScore = Math.floor(Math.random() * 8) + 92;
      const card = document.createElement('div');
      card.className = 'upsell-card';
      card.innerHTML = `
        <div class="ai-badge">✨ ${matchScore}% Match</div>
        <img src="${item.image || item.img}" alt="${item.name}">
        <p class="upsell-card-name">${item.name}</p>
        <div class="upsell-card-price">₹${item.price}</div>
        <button class="upsell-btn" data-id="${item.id}">+ Add</button>
      `;
      upsellContainer.appendChild(card);
    });

    upsellContainer.querySelectorAll('.upsell-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const b = e.target;
        const id = b.dataset.id;
        cart[id] = (cart[id] || 0) + 1;
        updateCart();
        b.textContent = 'Added ✓';
        b.style.background = 'var(--ink-raise)';
        b.style.color = 'var(--text)';
        b.disabled = true;
      });
    });
  }, 600);
}

function closeUpsellModal() {
  upsellOverlay.classList.remove('open');
}

upsellClose.addEventListener('click', closeUpsellModal);
upsellContinueBtn.addEventListener('click', closeUpsellModal);

/* ---------- NEW UX MODES LOGIC ---------- */

// 1. Toast Upsell Logic
let toastTimeout;
function showToastUpsell(item) {
  let mappedIds = CONFIG.upsellMap[item.id] || CONFIG.upsellMap[item.category];
  if (!mappedIds || mappedIds.length === 0) mappedIds = CONFIG.upsellMap['default'];
  const uItem = CONFIG.items.find(i => i.id === mappedIds[0]);
  if (!uItem) return;

  const aiToast = document.getElementById('aiToast');
  const aiToastText = document.getElementById('aiToastText');
  const aiToastBtn = document.getElementById('aiToastBtn');

  aiToastText.textContent = `Pair with ${uItem.name}?`;
  aiToast.classList.add('show');
  
  aiToastBtn.onclick = () => {
    cart[uItem.id] = (cart[uItem.id] || 0) + 1;
    renderQtyZones(); updateCart();
    aiToastBtn.textContent = 'Added ✓';
    setTimeout(() => aiToast.classList.remove('show'), 1000);
  };
  aiToastBtn.textContent = `+ Add ₹${uItem.price}`;

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    aiToast.classList.remove('show');
  }, 5000);
}

// 2. Accordion Upsell Logic
function expandAccordionUpsell(card, item) {
  let existing = card.querySelector('.dish-accordion');
  if (existing) existing.remove();

  let mappedIds = CONFIG.upsellMap[item.id] || CONFIG.upsellMap[item.category];
  if (!mappedIds || mappedIds.length === 0) mappedIds = CONFIG.upsellMap['default'];
  const itemsToUpsell = mappedIds.map(id => CONFIG.items.find(i => i.id === id)).filter(Boolean);
  if (itemsToUpsell.length === 0) return;

  const accordion = document.createElement('div');
  accordion.className = 'dish-accordion show';
  accordion.innerHTML = `
    <div class="accordion-title">✨ AI Recommended Pairings</div>
    <div class="accordion-items">
      ${itemsToUpsell.map(u => `
        <div class="accordion-item">
          <img src="${u.image || u.img}" alt="${u.name}">
          <p class="accordion-name">${u.name}</p>
          <div class="accordion-foot">
            <span class="accordion-price">₹${u.price}</span>
            <button class="accordion-add" data-uid="${u.id}">+ Add</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  card.appendChild(accordion);

  accordion.querySelectorAll('.accordion-add').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const uId = e.target.dataset.uid;
      cart[uId] = (cart[uId] || 0) + 1;
      renderQtyZones(); updateCart();
      e.target.textContent = 'Added ✓';
      e.target.disabled = true;
    });
  });
}

// 3. Pulse & Glow Mode
function triggerGlowUpsell(item) {
  let mappedIds = CONFIG.upsellMap[item.id] || CONFIG.upsellMap[item.category];
  if (!mappedIds || mappedIds.length === 0) mappedIds = CONFIG.upsellMap['default'];
  const itemsToUpsell = mappedIds.map(id => CONFIG.items.find(i => i.id === id)).filter(Boolean);
  
  itemsToUpsell.forEach(u => {
    const el = document.querySelector(`.dish-card[data-id="${u.id}"]`);
    if (el) {
      el.classList.add('ai-glow');
      setTimeout(() => el.classList.remove('ai-glow'), 6000);
    }
  });
}

// 4. Cart Peek Mode
let peekTimeout;
function triggerPeekUpsell(item) {
  const peekContainer = document.getElementById('miniBarUpsell');
  const miniBar = document.getElementById('miniBar');
  
  let mappedIds = CONFIG.upsellMap[item.id] || CONFIG.upsellMap[item.category];
  if (!mappedIds || mappedIds.length === 0) mappedIds = CONFIG.upsellMap['default'];
  const uItem = CONFIG.items.find(i => i.id === mappedIds[0]);
  if (!uItem) return;

  peekContainer.innerHTML = `
    <img src="${uItem.image || uItem.img}" style="width:30px;height:30px;border-radius:4px;object-fit:cover;">
    <span style="font-size:0.85rem;flex:1;">✨ Add ${uItem.name}?</span>
    <button class="chit-ai-add" style="padding:4px 8px;font-size:0.75rem;" onclick="addFromPeek('${uItem.id}')">+ ₹${uItem.price}</button>
  `;
  
  miniBar.classList.add('peek');
  clearTimeout(peekTimeout);
  peekTimeout = setTimeout(() => {
    miniBar.classList.remove('peek');
  }, 4000);
}
window.addFromPeek = function(id) {
  cart[id] = (cart[id]||0) + 1;
  renderQtyZones(); updateCart();
  document.getElementById('miniBar').classList.remove('peek');
};

// 5. Checkout Interstitial
const checkoutOverlay = document.getElementById('checkoutOverlay');
function triggerCheckoutInterstitial() {
  const container = document.getElementById('checkoutUpsellContainer');
  const cartIds = Object.keys(cart);
  let upsells = new Set();
  cartIds.forEach(id => {
    const item = CONFIG.items.find(i => i.id === id);
    if(item) {
      let m = CONFIG.upsellMap[item.id] || CONFIG.upsellMap[item.category] || CONFIG.upsellMap['default'];
      m.forEach(uid => upsells.add(uid));
    }
  });
  
  const finalUpsells = Array.from(upsells).map(id => CONFIG.items.find(i => i.id === id)).filter(i => i && !cart[i.id]).slice(0, 2);
  
  if (finalUpsells.length === 0) {
    finalizeOrder();
    return;
  }
  
  container.innerHTML = finalUpsells.map(u => `
    <div class="chit-ai-item" style="background:rgba(255,255,255,0.05);padding:12px;border-radius:12px;margin-bottom:8px;">
      <img src="${u.image || u.img}" alt="${u.name}">
      <div class="chit-ai-info">
        <p class="chit-ai-name">${u.name}</p>
        <span class="chit-ai-price">₹${u.price}</span>
      </div>
      <button class="chit-ai-add" onclick="cart['${u.id}']=(cart['${u.id}']||0)+1;this.textContent='Added ✓';this.disabled=true;renderQtyZones();updateCart();">+ Add</button>
    </div>
  `).join('');
  
  checkoutOverlay.classList.add('open');
}
if(document.getElementById('checkoutSkipBtn')) {
  document.getElementById('checkoutSkipBtn').addEventListener('click', () => { checkoutOverlay.classList.remove('open'); finalizeOrder(); });
  document.getElementById('checkoutConfirmBtn').addEventListener('click', () => { checkoutOverlay.classList.remove('open'); finalizeOrder(); });
}

// 6. FAB Mode
const aiFab = document.getElementById('aiFab');
const aiSheetOverlay = document.getElementById('aiSheetOverlay');
const aiSheet = document.getElementById('aiSheet');
if(aiFab) {
  aiFab.addEventListener('click', () => {
    const container = document.getElementById('aiSheetContainer');
    const cartIds = Object.keys(cart);
    let upsells = new Set();
    cartIds.forEach(id => {
      const item = CONFIG.items.find(i => i.id === id);
      if(item) {
        let m = CONFIG.upsellMap[item.id] || CONFIG.upsellMap[item.category] || CONFIG.upsellMap['default'];
        m.forEach(uid => upsells.add(uid));
      }
    });
    const finalUpsells = Array.from(upsells).map(id => CONFIG.items.find(i => i.id === id)).filter(i => i && !cart[i.id]).slice(0, 3);
    
    if (finalUpsells.length === 0) {
      container.innerHTML = `<p style="padding:20px;text-align:center;">Your order is perfect as is!</p>`;
    } else {
      container.innerHTML = finalUpsells.map(u => `
        <div class="chit-ai-item" style="background:var(--ink-deep);padding:12px;border-radius:12px;">
          <img src="${u.image || u.img}" alt="${u.name}">
          <div class="chit-ai-info">
            <p class="chit-ai-name">${u.name}</p>
            <span class="chit-ai-price">₹${u.price}</span>
          </div>
          <button class="chit-ai-add" onclick="cart['${u.id}']=(cart['${u.id}']||0)+1;this.textContent='Added ✓';this.disabled=true;renderQtyZones();updateCart();">+ Add</button>
        </div>
      `).join('');
    }
    
    aiSheetOverlay.classList.add('open');
    aiSheet.classList.add('open');
  });
  aiSheetOverlay.addEventListener('click', () => {
    aiSheetOverlay.classList.remove('open');
    aiSheet.classList.remove('open');
  });
}

// 7. Carousel Mode
function triggerCarouselUpsell(section, item) {
  if (!section || section.nextElementSibling?.classList.contains('ai-carousel-section')) return; // Already exists
  
  let mappedIds = CONFIG.upsellMap[item.id] || CONFIG.upsellMap[item.category];
  if (!mappedIds || mappedIds.length === 0) mappedIds = CONFIG.upsellMap['default'];
  const itemsToUpsell = mappedIds.map(id => CONFIG.items.find(i => i.id === id)).filter(Boolean);
  if (itemsToUpsell.length === 0) return;

  const carousel = document.createElement('section');
  carousel.className = 'ai-carousel-section';
  carousel.innerHTML = `
    <div class="ai-carousel-title">✨ Crafted for your table</div>
    <div class="ai-carousel-track">
      ${itemsToUpsell.map(u => `
        <div class="ai-carousel-card">
          <img src="${u.image || u.img}" alt="${u.name}">
          <p class="ai-carousel-name">${u.name}</p>
          <div class="ai-carousel-price">₹${u.price}</div>
          <button class="chit-ai-add" style="width:100%" onclick="cart['${u.id}']=(cart['${u.id}']||0)+1;this.textContent='Added ✓';this.disabled=true;renderQtyZones();updateCart();">+ Add</button>
        </div>
      `).join('')}
    </div>
  `;
  
  section.insertAdjacentElement('afterend', carousel);
}