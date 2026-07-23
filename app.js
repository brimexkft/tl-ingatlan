const tabs = document.querySelectorAll('.tab');
let purpose = 'Eladó';
const propertyPriceMarkup = data => data.priceReduction && data.discountPrice ? `<span class="price-reduction"><s>${data.price}</s><b>ÁRCSÖKKENÉS!</b><strong>${data.discountPrice}</strong></span>` : `<strong>${data.price}</strong>`;

tabs.forEach(tab => tab.addEventListener('click', () => {
  tabs.forEach(item => item.classList.remove('active'));
  tab.classList.add('active');
  purpose = tab.dataset.purpose;
}));

document.querySelectorAll('.heart').forEach(button => button.addEventListener('click', () => {
  button.classList.toggle('liked');
  button.textContent = button.classList.contains('liked') ? '♥' : '♡';
}));

document.getElementById('search-btn').addEventListener('click', () => {
  const type = document.getElementById('type').value;
  const location = document.getElementById('location').value.trim().toLowerCase();
  const min = Number(document.getElementById('min-area').value) || 0;
  const max = Number(document.getElementById('max-area').value) || Infinity;
  let visible = 0;
  document.querySelectorAll('.property-card').forEach(card => {
    const cardPurpose = card.querySelector('.tag').textContent;
    const matches = cardPurpose === purpose && (type === 'Válasszon típust' || card.dataset.type === type) && (!location || card.dataset.location.toLowerCase().includes(location)) && Number(card.dataset.area) >= min && Number(card.dataset.area) <= max;
    card.hidden = !matches;
    if (matches) visible++;
  });
  document.getElementById('empty-state').hidden = visible !== 0;
  document.getElementById('ingatlanok').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

const menu = document.querySelector('.menu-button');
menu.addEventListener('click', () => {
  const nav = document.querySelector('.main-nav');
  nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', nav.classList.contains('open'));
});

const modal = document.getElementById('listing-modal');
const openListingButton = document.getElementById('open-listing');
if (openListingButton) openListingButton.addEventListener('click', () => { modal.hidden = false; });
document.getElementById('close-listing').addEventListener('click', () => { modal.hidden = true; });
modal.addEventListener('click', event => { if (event.target === modal) modal.hidden = true; });

document.getElementById('listing-form').addEventListener('submit', event => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget));
  const card = document.createElement('article');
  card.className = 'property-card';
  card.dataset.type = data.type;
  card.dataset.location = data.location;
  card.dataset.area = data.area;
  card.innerHTML = `<div class="property-image image-one"><span class="tag ${data.purpose === 'Kiadó' ? 'rent' : ''}">${data.purpose}</span><button class="heart" aria-label="Kedvencnek jelölés">♡</button></div><div class="property-info"><p>${data.location}</p><h3>${data.title}</h3><div>${propertyPriceMarkup(data)}<span>${data.area} m² · Új hirdetés</span></div></div>`;
  card.querySelector('.heart').addEventListener('click', e => { e.currentTarget.classList.toggle('liked'); e.currentTarget.textContent = e.currentTarget.classList.contains('liked') ? '♥' : '♡'; });
  document.getElementById('property-grid').prepend(card);
  enablePropertyCard(card);
  event.currentTarget.reset();
  modal.hidden = true;
  document.getElementById('ingatlanok').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

function enablePropertyCard(card) {
  const openDetails = () => { if (card.dataset.id) window.location.href = `property.html?id=${card.dataset.id}`; };
  card.addEventListener('click', event => { if (!event.target.closest('.heart, .details-link, .image-details-link')) openDetails(); });
  card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openDetails(); } });
}

document.querySelectorAll('.property-card').forEach(enablePropertyCard);

const savedProperties = JSON.parse(localStorage.getItem('tlCustomProperties') || '[]');
savedProperties.forEach(data => {
  const card = document.createElement('article');
  card.className = 'property-card';
  card.tabIndex = 0;
  card.setAttribute('role', 'link');
  card.dataset.id = data.id;
  card.dataset.type = data.type;
  card.dataset.location = data.location;
  card.dataset.area = data.area;
  const cover = data.images?.[0] || '';
  card.innerHTML = `<div class="property-image" style="background-image:url('${cover}')">${data.reserved ? '<span class="reservation-ribbon">FOGLALÓZVA</span>' : ''}<span class="tag ${data.purpose === 'Kiadó' ? 'rent' : ''}">${data.purpose}</span><button class="heart" aria-label="Kedvencnek jelölés">♡</button></div><div class="property-info"><p>${data.location}</p><h3>${data.title}</h3><div>${propertyPriceMarkup(data)}<span>${data.area} m² · ${data.rooms}</span></div><a class="image-details-link" href="property.html?id=${data.id}">Megnézem</a></div>`;
  card.querySelector('.heart').addEventListener('click', event => { event.currentTarget.classList.toggle('liked'); event.currentTarget.textContent = event.currentTarget.classList.contains('liked') ? '♥' : '♡'; });
  document.getElementById('property-grid').prepend(card);
  enablePropertyCard(card);
});

TLPropertyStore.list().then(properties => properties.filter(data => !data.status || data.status === 'active').forEach(data => {
  const card = document.createElement('article');
  card.className = 'property-card';
  card.tabIndex = 0;
  card.setAttribute('role', 'link');
  card.dataset.id = data.id;
  card.dataset.type = data.type;
  card.dataset.location = data.location;
  card.dataset.area = data.area;
  const cover = data.images?.[0] || '';
  card.innerHTML = `<div class="property-image" style="background-image:url('${cover}')">${data.reserved ? '<span class="reservation-ribbon">FOGLALÓZVA</span>' : ''}<span class="tag ${data.purpose === 'Kiadó' ? 'rent' : ''}">${data.purpose}</span><button class="heart" aria-label="Kedvencnek jelölés">♡</button></div><div class="property-info"><p>${data.location}</p><h3>${data.title}</h3><div>${propertyPriceMarkup(data)}<span>${data.area} m² · ${data.rooms}</span></div><a class="image-details-link" href="property.html?id=${data.id}">Megnézem</a></div>`;
  card.querySelector('.heart').addEventListener('click', event => { event.currentTarget.classList.toggle('liked'); event.currentTarget.textContent = event.currentTarget.classList.contains('liked') ? '♥' : '♡'; });
  document.getElementById('property-grid').prepend(card);
  enablePropertyCard(card);
})).catch(() => {});
