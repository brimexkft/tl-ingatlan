const profile = JSON.parse(localStorage.getItem('tlProfile') || '{}');
window.addEventListener('storage', event => { if (event.key === 'tlProfile') window.location.reload(); });

document.querySelectorAll('a[href^="tel:"]').forEach(link => {
  if (!profile.phone) return;
  link.href = `tel:${profile.phone.replace(/\s/g, '')}`;
  link.textContent = profile.phone;
  if (link.classList.contains('header-phone')) link.innerHTML = `<span>☎</span> ${profile.phone}`;
});
document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
  if (!profile.email) return;
  link.href = `mailto:${profile.email}`;
  link.textContent = profile.email;
});

const footer = document.querySelector('footer');
if (footer) {
  const officeText = footer.querySelector('div:first-child p');
  const addressText = footer.querySelector('div:nth-child(3) span:first-of-type');
  if (profile.office && officeText) officeText.textContent = profile.office;
  if (profile.name && officeText) { const name = document.createElement('p'); name.className = 'profile-name'; name.textContent = profile.name; officeText.after(name); }
  if (profile.address && addressText) addressText.textContent = profile.address;
  const contactColumn = footer.querySelector('div:nth-child(2)');
  if (contactColumn) [['website', 'Weboldal'], ['facebook', 'Facebook'], ['instagram', 'Instagram']].forEach(([key, label]) => {
    if (!profile[key]) return;
    const link = document.createElement('a');
    link.href = profile[key].startsWith('http') ? profile[key] : `https://${profile[key]}`;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = label;
    contactColumn.append(link);
  });
}
