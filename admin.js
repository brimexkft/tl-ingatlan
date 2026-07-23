const form = document.getElementById('property-form');
const imageInput = document.getElementById('images');
const preview = document.getElementById('image-preview');
let selectedImages = [];

function renderPreviews() {
  preview.replaceChildren(...selectedImages.map((src, index) => {
    const item = document.createElement('div');
    item.innerHTML = `<img src="${src}" alt="Feltöltött kép ${index + 1}" /><button type="button" aria-label="Kép törlése">×</button>`;
    item.querySelector('button').addEventListener('click', () => { selectedImages.splice(index, 1); renderPreviews(); });
    return item;
  }));
}

imageInput.addEventListener('change', async event => {
  const files = [...event.target.files];
  const converted = await Promise.all(files.map(file => new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file); })));
  selectedImages.push(...converted);
  renderPreviews();
  imageInput.value = '';
});

form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!selectedImages.length) { alert('Kérjük, töltsön fel legalább egy fényképet.'); return; }
  const data = Object.fromEntries(new FormData(form));
  const id = `${data.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now()}`;
  const property = { ...data, id, images: selectedImages, createdAt: new Date().toISOString(), status: 'active' };
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = 'Mentés folyamatban…';
  try {
    await TLPropertyStore.save(property);
    window.location.href = `property.html?id=${id}`;
  } catch (error) {
    submitButton.disabled = false;
    submitButton.textContent = 'Hirdetés mentése →';
    alert('A hirdetés mentése nem sikerült. Kérjük, próbálja meg kisebb képfájlokkal.');
  }
});

const profileForm = document.getElementById('profile-form');
const savedProfile = JSON.parse(localStorage.getItem('tlProfile') || '{}');
Object.entries(savedProfile).forEach(([key, value]) => { if (profileForm.elements[key]) profileForm.elements[key].value = value; });
profileForm.addEventListener('submit', event => {
  event.preventDefault();
  localStorage.setItem('tlProfile', JSON.stringify(Object.fromEntries(new FormData(profileForm))));
  const button = profileForm.querySelector('button');
  button.textContent = 'Adatok elmentve ✓';
  setTimeout(() => { button.innerHTML = 'Adatok mentése <span>→</span>'; }, 1800);
});

const tabs = document.querySelectorAll('.admin-tab');
const panels = document.querySelectorAll('.admin-panel');
tabs.forEach(tab => tab.addEventListener('click', () => {
  tabs.forEach(item => item.classList.toggle('active', item === tab));
  panels.forEach(panel => panel.classList.toggle('active', panel.id === `${tab.dataset.tab}-panel`));
  if (tab.dataset.tab === 'closed') renderProperties();
}));

async function renderProperties() {
  const target = document.getElementById('closed-properties');
  try {
    const items = await TLPropertyStore.list();
    if (!items.length) { target.innerHTML = '<p class="no-properties">Még nincs feltöltött ingatlan.</p>'; return; }
    target.replaceChildren(...items.map(property => {
      const item = document.createElement('article');
      item.className = 'closed-property';
      const state = property.status === 'sold' ? 'Eladott' : property.status === 'rented' ? 'Kiadott' : 'Aktív hirdetés';
      item.innerHTML = `<img src="${property.images?.[0] || ''}" alt="${property.title}" /><div><h3>${property.title}</h3><p>${property.location} · ${property.price} · Jelenlegi állapot: ${state}</p></div><select aria-label="Hirdetés állapota"><option value="active">Aktív hirdetés</option><option value="sold">Értékesített</option><option value="rented">Kiadott</option></select>`;
      const select = item.querySelector('select');
      select.value = property.status || 'active';
      select.addEventListener('change', async () => { property.status = select.value; await TLPropertyStore.save(property); renderProperties(); });
      return item;
    }));
  } catch { target.innerHTML = '<p class="no-properties">A hirdetések betöltése most nem sikerült.</p>'; }
}
