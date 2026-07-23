const form = document.getElementById('property-form');
const imageInput = document.getElementById('images');
const preview = document.getElementById('image-preview');
const priceInput = form.elements.price;
const descriptionInput = form.elements.description;
const priceReductionInput = document.getElementById('price-reduction');
const discountPriceField = document.getElementById('discount-price-field');
const discountPriceInput = document.getElementById('discount-price');
function togglePriceReduction() { const active = priceReductionInput.checked; discountPriceField.hidden = !active; discountPriceInput.disabled = !active; if (!active) discountPriceInput.value = ''; }
priceReductionInput.addEventListener('change', togglePriceReduction);
let selectedImages = [];
let editingProperty = null;
let draggedImageIndex = null;

descriptionInput.classList.add('rich-source');
const richEditor = document.createElement('div');
richEditor.className = 'rich-editor';
richEditor.innerHTML = `<div class="rich-toolbar" role="toolbar">
  <button type="button" data-command="bold" title="Félkövér"><strong>B</strong></button>
  <button type="button" data-command="italic" title="Dőlt"><em>I</em></button>
  <button type="button" data-command="underline" title="Aláhúzott"><u>U</u></button>
  <span></span>
  <button type="button" data-block="h2" title="Címsor">H2</button>
  <button type="button" data-block="p" title="Bekezdés">¶</button>
  <span></span>
  <button type="button" data-command="insertUnorderedList" title="Felsorolás">• Lista</button>
  <button type="button" data-command="justifyLeft" title="Balra igazítás">≡</button>
  <button type="button" data-command="justifyCenter" title="Középre igazítás">≡</button>
  <span></span>
  <button type="button" class="insert-link" title="Hivatkozás beszúrása">🔗</button>
  <button type="button" class="toggle-html" title="HTML-kód nézet">&lt;/&gt;</button>
</div><div class="rich-editable" contenteditable="true" aria-label="Ingatlan részletes leírása"></div><textarea class="html-code" hidden aria-label="HTML-kód"></textarea>`;
descriptionInput.after(richEditor);
const editable = richEditor.querySelector('.rich-editable');
const htmlCode = richEditor.querySelector('.html-code');
let htmlMode = false;
function syncDescription() { descriptionInput.value = htmlMode ? htmlCode.value : editable.innerHTML; }
function renderDescriptionPreview() {
  editable.innerHTML = descriptionInput.value || '<p>Ide írhatja az ingatlan részletes bemutatását.</p>';
  htmlCode.value = descriptionInput.value;
}
editable.addEventListener('input', syncDescription);
htmlCode.addEventListener('input', syncDescription);
richEditor.querySelectorAll('[data-command]').forEach(button => button.addEventListener('click', () => {
  editable.focus(); document.execCommand(button.dataset.command, false); syncDescription();
}));
richEditor.querySelectorAll('[data-block]').forEach(button => button.addEventListener('click', () => {
  editable.focus(); document.execCommand('formatBlock', false, button.dataset.block); syncDescription();
}));
richEditor.querySelector('.insert-link').addEventListener('click', () => {
  const url = prompt('Hivatkozás címe:');
  if (url) { editable.focus(); document.execCommand('createLink', false, url); syncDescription(); }
});
richEditor.querySelector('.toggle-html').addEventListener('click', () => {
  htmlMode = !htmlMode;
  if (htmlMode) { htmlCode.value = editable.innerHTML; editable.hidden = true; htmlCode.hidden = false; }
  else { editable.innerHTML = htmlCode.value; htmlCode.hidden = true; editable.hidden = false; syncDescription(); }
  richEditor.classList.toggle('html-mode', htmlMode);
});
renderDescriptionPreview();

priceInput.addEventListener('blur', () => {
  const value = priceInput.value.trim();
  if (value && !/\bft\.?$/i.test(value)) priceInput.value = `${value} Ft`;
});
discountPriceInput.addEventListener('blur', () => { const value = discountPriceInput.value.trim(); if (value && !/\bft\.?$/i.test(value)) discountPriceInput.value = `${value} Ft`; });

function renderPreviews() {
  preview.replaceChildren(...selectedImages.map((src, index) => {
    const item = document.createElement('div');
    item.draggable = true;
    item.innerHTML = `<img src="${src}" alt="Feltöltött kép ${index + 1}" /><span class="image-order">${index + 1}</span><div class="image-move-buttons"><button type="button" class="move-left" aria-label="Kép balra mozgatása">←</button><button type="button" class="move-right" aria-label="Kép jobbra mozgatása">→</button></div><button type="button" class="remove-image" aria-label="Kép törlése">×</button>`;
    item.querySelector('.remove-image').addEventListener('click', () => { selectedImages.splice(index, 1); renderPreviews(); });
    item.querySelector('.move-left').addEventListener('click', () => { if (index > 0) { [selectedImages[index - 1], selectedImages[index]] = [selectedImages[index], selectedImages[index - 1]]; renderPreviews(); } });
    item.querySelector('.move-right').addEventListener('click', () => { if (index < selectedImages.length - 1) { [selectedImages[index + 1], selectedImages[index]] = [selectedImages[index], selectedImages[index + 1]]; renderPreviews(); } });
    item.addEventListener('dragstart', event => { draggedImageIndex = index; item.classList.add('dragging'); event.dataTransfer.effectAllowed = 'move'; });
    item.addEventListener('dragend', () => item.classList.remove('dragging'));
    item.addEventListener('dragover', event => event.preventDefault());
    item.addEventListener('drop', event => {
      event.preventDefault();
      if (draggedImageIndex === null || draggedImageIndex === index) return;
      const [moved] = selectedImages.splice(draggedImageIndex, 1);
      selectedImages.splice(index, 0, moved);
      draggedImageIndex = null;
      renderPreviews();
    });
    return item;
  }));
}

imageInput.addEventListener('change', async event => {
  const files = [...event.target.files];
  const converted = await Promise.all(files.map(file => new Promise((resolve, reject) => {
    const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file);
  })));
  selectedImages = [...new Set([...selectedImages, ...converted])];
  renderPreviews(); imageInput.value = '';
});

form.addEventListener('submit', async event => {
  event.preventDefault();
  syncDescription();
  if (!selectedImages.length) { alert('Kérjük, töltsön fel legalább egy fényképet.'); return; }
  if (priceInput.value.trim() && !/\bft\.?$/i.test(priceInput.value.trim())) priceInput.value = `${priceInput.value.trim()} Ft`;
  const data = Object.fromEntries(new FormData(form));
  data.priceReduction = priceReductionInput.checked;
  data.discountPrice = priceReductionInput.checked ? discountPriceInput.value.trim() : '';
  if (data.discountPrice && !/\bft\.?$/i.test(data.discountPrice)) data.discountPrice = `${data.discountPrice} Ft`;
  const id = editingProperty?.id || `${data.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now()}`;
  const property = { ...editingProperty, ...data, id, images: selectedImages, createdAt: editingProperty?.createdAt || new Date().toISOString(), status: editingProperty?.status || 'active' };
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true; submitButton.textContent = 'Mentés folyamatban…';
  try { await TLPropertyStore.save(property); window.location.href = `property.html?id=${id}`; }
  catch { submitButton.disabled = false; submitButton.textContent = editingProperty ? 'Módosítások mentése →' : 'Hirdetés mentése →'; alert('A hirdetés mentése nem sikerült.'); }
});

function editProperty(property) {
  editingProperty = property;
  Object.entries(property).forEach(([key, value]) => { if (form.elements[key] && typeof value === 'string') form.elements[key].value = value; });
  selectedImages = [...new Set(property.images || [])];
  renderPreviews(); renderDescriptionPreview();
  priceReductionInput.checked = Boolean(property.priceReduction && property.discountPrice);
  discountPriceInput.value = property.discountPrice || '';
  togglePriceReduction();
  document.querySelector('[data-tab="upload"]').click();
  document.querySelector('.admin-panel-heading h2').textContent = 'Ingatlan szerkesztése';
  form.querySelector('button[type="submit"]').innerHTML = 'Módosítások mentése <span>→</span>';
  form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const profileForm = document.getElementById('profile-form');
const savedProfile = JSON.parse(localStorage.getItem('tlProfile') || '{}');
Object.entries(savedProfile).forEach(([key, value]) => { if (profileForm.elements[key]) profileForm.elements[key].value = value; });
profileForm.addEventListener('submit', event => {
  event.preventDefault();
  localStorage.setItem('tlProfile', JSON.stringify(Object.fromEntries(new FormData(profileForm))));
  const button = profileForm.querySelector('button'); button.textContent = 'Adatok elmentve ✓';
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
      const item = document.createElement('article'); item.className = 'closed-property';
      const state = property.status === 'sold' ? 'Eladott' : property.status === 'rented' ? 'Kiadott' : 'Aktív hirdetés';
      item.innerHTML = `<img src="${property.images?.[0] || ''}" alt="${property.title}" /><div><h3>${property.title}</h3><p>${property.location} · ${property.price} · Jelenlegi állapot: ${state}</p></div><div class="property-actions"><button type="button" class="edit-property">Szerkesztés</button><select aria-label="Hirdetés állapota"><option value="active">Aktív hirdetés</option><option value="sold">Értékesített</option><option value="rented">Kiadott</option></select><label class="reserved-control"><input type="checkbox" ${property.reserved ? "checked" : ""} /> Foglalózva</label></div>`;
      const select = item.querySelector('select'); select.value = property.status || 'active';
      select.addEventListener('change', async () => { property.status = select.value; await TLPropertyStore.save(property); renderProperties(); });
      item.querySelector('.reserved-control input').addEventListener('change', async event => { property.reserved = event.currentTarget.checked; await TLPropertyStore.save(property); renderProperties(); });
      item.querySelector('.edit-property').addEventListener('click', () => editProperty(property));
      return item;
    }));
  } catch { target.innerHTML = '<p class="no-properties">A hirdetések betöltése most nem sikerült.</p>'; }
}
