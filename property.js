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
