const properties = {
  'panoramas-csaladi-haz': { location: 'Budapest II. kerület', title: 'Panorámás családi ház', price: '189 M Ft', type: 'Családi ház', area: '145 m²', rooms: '5 szoba', plot: '780 m² telek', year: '2021', description: 'Tágas, világos családi ház Budapest egyik legkedveltebb részén. A nagy üvegfelületek és a gondosan kialakított kert minden nap különleges hangulatot adnak. Ideális választás azoknak, akik nyugodt környezetben, mégis a város közelében szeretnének élni.', images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85', 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=85', 'https://images.unsplash.com/photo-1600566753051-f0b89df2dd90?auto=format&fit=crop&w=900&q=85'] },
  'elegans-belvarosi-lakas': { location: 'Budapest V. kerület', title: 'Elegáns belvárosi lakás', price: '119 M Ft', type: 'Társasházi lakás', area: '78 m²', rooms: '3 szoba', plot: 'Belvárosi elhelyezkedés', year: '2023 felújítva', description: 'Igényesen felújított, elegáns lakás a belváros szívében. A prémium anyaghasználat, a praktikus alaprajz és a kiváló közlekedés együtt teszik igazán szerethető otthonná.', images: ['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85', 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=900&q=85', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=85'] },
  'modern-otthon-szentendre': { location: 'Szentendre', title: 'Modern otthon a természetben', price: '650 e Ft / hó', type: 'Családi ház', area: '112 m²', rooms: '4 szoba', plot: '620 m² telek', year: '2020', description: 'Kortárs otthon Szentendre csendes, zöldövezeti részén. A terasz és a napfényes közösségi terek a kikapcsolódás, a különálló hálószobák pedig a kényelmes mindennapok helyszínei.', images: ['https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=85', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85', 'https://images.unsplash.com/photo-1600585152915-d208bec867a1?auto=format&fit=crop&w=900&q=85'] }
};
const propertyId = new URLSearchParams(location.search).get('id');

function showProperty(property, custom = false) {
  document.title = `${property.title} | TL Ingatlaniroda`;
  document.getElementById('property-location').textContent = property.location;
  document.getElementById('property-title').textContent = property.title;
  document.getElementById('property-price').textContent = property.price;
  document.getElementById('property-subtitle').textContent = `${property.type} · ${property.area} · ${property.rooms}`;
  document.getElementById('property-description').textContent = property.description;
  document.getElementById('main-photo').src = property.images[0];
  document.getElementById('main-photo').alt = property.title;
  document.getElementById('side-photos').innerHTML = property.images.slice(1).map((image, index) => `<button type="button" aria-label="${index + 2}. kép megnyitása"><img src="${image}" alt="${property.title} ${index + 2}. kép" /></button>`).join('');
  document.querySelectorAll('.side-photos button').forEach((button, index) => button.addEventListener('click', () => { const previous = document.getElementById('main-photo').src; document.getElementById('main-photo').src = property.images[index + 1]; button.querySelector('img').src = previous; }));
  const features = custom ? [['Ingatlan típusa', property.type], ['Alapterület', property.area], ['Szobák száma', property.rooms], ['Ingatlan állapota', property.condition], ['Építés éve', property.year || 'Nincs megadva'], ['Emelet', property.floor], ['Emeletek száma', property.floors || 'Nincs megadva'], ['Lift', property.lift], ['Épület külső állapota', property.outside], ['Épület belső állapota', property.inside], ['Fényviszonyok', property.light], ['Parkolás', property.parking], ['Erkély / terasz', property.balcony], ['Nézet', property.view], ['Tájolás', property.orientation], ['Fűtés', property.heating || 'Nincs megadva'], ['Energetikai besorolás', property.energy]] : [['Ingatlan típusa', property.type], ['Alapterület', property.area], ['Szobák száma', property.rooms], ['Telek / környezet', property.plot], ['Építés / felújítás', property.year], ['Állapot', 'Újszerű']];
  document.getElementById('feature-grid').innerHTML = features.map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join('');
}

TLPropertyStore.get(propertyId).then(custom => {
  if (custom) showProperty({ ...custom, area: `${custom.area} m²`, plot: custom.plot ? `${custom.plot} m² telek` : 'Nincs megadva' }, true);
  else showProperty(properties[propertyId] || properties['panoramas-csaladi-haz']);
}).catch(() => showProperty(properties[propertyId] || properties['panoramas-csaladi-haz']));

/* Enhanced gallery: images are unique and open in a lightbox instead of swapping/duplicating. */
let lightbox;
function openLightbox(images, startIndex) {
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.className = 'image-lightbox';
    lightbox.innerHTML = '<button class="lightbox-close" aria-label="Bezárás">×</button><button class="lightbox-prev" aria-label="Előző kép">‹</button><img alt="Ingatlan nagyított kép" /><button class="lightbox-next" aria-label="Következő kép">›</button><span class="lightbox-count"></span>';
    document.body.append(lightbox);
    lightbox.addEventListener('click', event => { if (event.target === lightbox || event.target.classList.contains('lightbox-close')) lightbox.hidden = true; });
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && !lightbox.hidden) lightbox.hidden = true; });
  }
  let index = startIndex;
  const image = lightbox.querySelector('img');
  const render = () => { image.src = images[index]; lightbox.querySelector('.lightbox-count').textContent = `${index + 1} / ${images.length}`; };
  lightbox.querySelector('.lightbox-prev').onclick = () => { index = (index - 1 + images.length) % images.length; render(); };
  lightbox.querySelector('.lightbox-next').onclick = () => { index = (index + 1) % images.length; render(); };
  render(); lightbox.hidden = false;
}

function showProperty(property, custom = false) {
  const images = [...new Set((property.images || []).filter(Boolean))];
  document.title = `${property.title} | TL Ingatlaniroda`;
  document.getElementById('property-location').textContent = property.location;
  document.getElementById('property-title').textContent = property.title;
  document.getElementById('property-price').textContent = property.price;
  document.getElementById('property-subtitle').textContent = `${property.type} · ${property.area} · ${property.rooms}`;
  document.getElementById('property-description').innerHTML = property.description;
  const main = document.getElementById('main-photo');
  main.src = images[0] || ''; main.alt = property.title;
  main.onclick = () => openLightbox(images, 0);
  document.getElementById('side-photos').innerHTML = images.slice(1, 3).map((image, index) => `<button type="button" aria-label="${index + 2}. kép megnyitása"><img src="${image}" alt="${property.title} ${index + 2}. kép" /></button>`).join('');
  document.querySelectorAll('.side-photos button').forEach((button, index) => button.addEventListener('click', () => openLightbox(images, index + 1)));
  const features = custom ? [['Ingatlan típusa', property.type], ['Alapterület', property.area], ['Szobák száma', property.rooms], ['Ingatlan állapota', property.condition], ['Építés éve', property.year || 'Nincs megadva'], ['Emelet', property.floor], ['Emeletek száma', property.floors || 'Nincs megadva'], ['Lift', property.lift], ['Épület külső állapota', property.outside], ['Épület belső állapota', property.inside], ['Fényviszonyok', property.light], ['Parkolás', property.parking], ['Erkély / terasz', property.balcony], ['Nézet', property.view], ['Tájolás', property.orientation], ['Fűtés', property.heating || 'Nincs megadva'], ['Energetikai besorolás', property.energy]] : [['Ingatlan típusa', property.type], ['Alapterület', property.area], ['Szobák száma', property.rooms], ['Telek / környezet', property.plot], ['Építés / felújítás', property.year], ['Állapot', 'Újszerű']];
  document.getElementById('feature-grid').innerHTML = features.map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join('');
}
const galleryStyle = document.createElement('style');
galleryStyle.textContent = '.main-photo{cursor:zoom-in}.image-lightbox{position:fixed;z-index:1000;inset:0;background:rgba(20,10,4,.9);display:grid;place-items:center;padding:55px}.image-lightbox[hidden]{display:none}.image-lightbox img{display:block;max-width:90vw;max-height:82vh;object-fit:contain}.lightbox-close,.lightbox-prev,.lightbox-next{position:absolute;border:0;background:rgba(255,255,255,.14);color:#fff;cursor:pointer}.lightbox-close{right:24px;top:18px;width:42px;height:42px;font-size:30px}.lightbox-prev,.lightbox-next{top:50%;transform:translateY(-50%);width:52px;height:70px;font-size:52px;line-height:1}.lightbox-prev{left:20px}.lightbox-next{right:20px}.lightbox-count{position:absolute;bottom:22px;color:#fff;font:600 14px "DM Sans"}';
document.head.append(galleryStyle);

/* Pageable in-page gallery: every uploaded image can be reached with the arrows. */
function showProperty(property, custom = false) {
  const images = [...new Set((property.images || []).filter(Boolean))];
  document.title = `${property.title} | TL Ingatlaniroda`;
  document.getElementById('property-location').textContent = property.location;
  document.getElementById('property-title').textContent = property.title;
  document.getElementById('property-price').textContent = property.price;
  document.getElementById('property-subtitle').textContent = `${property.type} · ${property.area} · ${property.rooms}`;
  document.getElementById('property-description').innerHTML = property.description;
  const main = document.getElementById('main-photo');
  const sidePhotos = document.getElementById('side-photos');
  const gallery = document.querySelector('.gallery-layout');
  let navigation = document.getElementById('gallery-navigation');
  if (!navigation) {
    navigation = document.createElement('div');
    navigation.id = 'gallery-navigation';
    navigation.className = 'gallery-navigation';
    navigation.innerHTML = '<button type="button" class="gallery-back" aria-label="Előző képek">←</button><span></span><button type="button" class="gallery-forward" aria-label="Következő képek">→</button>';
    gallery.after(navigation);
  }
  let start = 0;
  const imageAt = offset => images[(start + offset) % images.length];
  const renderGallery = () => {
    main.src = imageAt(0) || ''; main.alt = property.title;
    main.onclick = () => openLightbox(images, start);
    sidePhotos.innerHTML = images.length > 1 ? [1, 2].filter(offset => images.length > offset).map(offset => `<button type="button" aria-label="${offset + 1}. kép megnyitása"><img src="${imageAt(offset)}" alt="${property.title} ${offset + 1}. kép" /></button>`).join('') : '';
    sidePhotos.querySelectorAll('button').forEach((button, index) => button.addEventListener('click', () => openLightbox(images, (start + index + 1) % images.length)));
    navigation.querySelector('span').textContent = images.length ? `${start + 1}–${Math.min(start + 3, images.length)} / ${images.length} kép` : '';
    navigation.hidden = images.length <= 3;
  };
  navigation.querySelector('.gallery-back').onclick = () => { start = (start - 3 + images.length) % images.length; renderGallery(); };
  navigation.querySelector('.gallery-forward').onclick = () => { start = (start + 3) % images.length; renderGallery(); };
  renderGallery();
  const features = custom ? [['Ingatlan típusa', property.type], ['Alapterület', property.area], ['Szobák száma', property.rooms], ['Ingatlan állapota', property.condition], ['Építés éve', property.year || 'Nincs megadva'], ['Emelet', property.floor], ['Emeletek száma', property.floors || 'Nincs megadva'], ['Lift', property.lift], ['Épület külső állapota', property.outside], ['Épület belső állapota', property.inside], ['Fényviszonyok', property.light], ['Parkolás', property.parking], ['Erkély / terasz', property.balcony], ['Nézet', property.view], ['Tájolás', property.orientation], ['Fűtés', property.heating || 'Nincs megadva'], ['Energetikai besorolás', property.energy]] : [['Ingatlan típusa', property.type], ['Alapterület', property.area], ['Szobák száma', property.rooms], ['Telek / környezet', property.plot], ['Építés / felújítás', property.year], ['Állapot', 'Újszerű']];
  document.getElementById('feature-grid').innerHTML = features.map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join('');
}
const pageGalleryStyle = document.createElement('style');
pageGalleryStyle.textContent = '.gallery-navigation{display:flex;justify-content:center;align-items:center;gap:20px;margin:16px 0 0}.gallery-navigation button{border:0;background:transparent;color:var(--brown);font-size:27px;line-height:1;cursor:pointer;padding:6px 12px}.gallery-navigation button:hover{color:var(--gold)}.gallery-navigation span{min-width:90px;text-align:center;font-size:12px;color:#796c63}.gallery-navigation[hidden]{display:none}';
document.head.append(pageGalleryStyle);

/* Ribbon carousel: large image cards slide one by one, with the next card partially visible. */
function showProperty(property, custom = false) {
  const images = [...new Set((property.images || []).filter(Boolean))];
  document.title = `${property.title} | TL Ingatlaniroda`;
  document.getElementById('property-location').textContent = property.location;
  document.getElementById('property-title').textContent = property.title;
  document.getElementById('property-price').textContent = property.price;
  document.getElementById('property-subtitle').textContent = `${property.type} · ${property.area} · ${property.rooms}`;
  document.getElementById('property-description').innerHTML = property.description;
  const gallery = document.querySelector('.gallery-layout');
  gallery.classList.add('ribbon-gallery');
  gallery.innerHTML = '<div class="gallery-viewport"><div class="gallery-track"></div></div>';
  const track = gallery.querySelector('.gallery-track');
  track.innerHTML = images.map((image, index) => `<button type="button" class="gallery-card" aria-label="${index + 1}. kép megnyitása"><img src="${image}" alt="${property.title} ${index + 1}. kép" /></button>`).join('');
  track.querySelectorAll('.gallery-card').forEach((card, index) => {
    card.addEventListener('click', () => openLightbox(images, index));
    const image = card.querySelector('img');
    const fitCardToImage = () => {
      if (!image.naturalWidth || !image.naturalHeight) return;
      card.style.flexBasis = `${Math.round(card.clientHeight * image.naturalWidth / image.naturalHeight)}px`;
      renderGallery();
    };
    image.addEventListener('load', fitCardToImage);
    if (image.complete) setTimeout(fitCardToImage, 0);
  });
  let navigation = document.getElementById('gallery-navigation');
  if (!navigation) { navigation = document.createElement('div'); navigation.id = 'gallery-navigation'; navigation.className = 'gallery-navigation'; navigation.innerHTML = '<button type="button" class="gallery-back" aria-label="Előző kép">←</button><span></span><button type="button" class="gallery-forward" aria-label="Következő kép">→</button>'; gallery.after(navigation); }
  let start = 0;
  const renderGallery = () => {
    const card = track.querySelector('.gallery-card');
    const step = card ? card.getBoundingClientRect().width + 16 : 0;
    track.style.transform = `translateX(-${start * step}px)`;
    navigation.querySelector('span').textContent = images.length ? `${start + 1} / ${images.length} kép` : '';
    navigation.hidden = images.length <= 1;
    navigation.querySelector('.gallery-back').disabled = start === 0;
    navigation.querySelector('.gallery-forward').disabled = start >= images.length - 1;
  };
  navigation.querySelector('.gallery-back').onclick = () => { start = Math.max(0, start - 1); renderGallery(); };
  navigation.querySelector('.gallery-forward').onclick = () => { start = Math.min(images.length - 1, start + 1); renderGallery(); };
  window.addEventListener('resize', renderGallery, { passive: true });
  requestAnimationFrame(renderGallery);
  const features = custom ? [['Ingatlan típusa', property.type], ['Alapterület', property.area], ['Szobák száma', property.rooms], ['Ingatlan állapota', property.condition], ['Építés éve', property.year || 'Nincs megadva'], ['Emelet', property.floor], ['Emeletek száma', property.floors || 'Nincs megadva'], ['Lift', property.lift], ['Épület külső állapota', property.outside], ['Épület belső állapota', property.inside], ['Fényviszonyok', property.light], ['Parkolás', property.parking], ['Erkély / terasz', property.balcony], ['Nézet', property.view], ['Tájolás', property.orientation], ['Fűtés', property.heating || 'Nincs megadva'], ['Energetikai besorolás', property.energy]] : [['Ingatlan típusa', property.type], ['Alapterület', property.area], ['Szobák száma', property.rooms], ['Telek / környezet', property.plot], ['Építés / felújítás', property.year], ['Állapot', 'Újszerű']];
  document.getElementById('feature-grid').innerHTML = features.map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join('');
}
