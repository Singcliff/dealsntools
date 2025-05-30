// scripts/main.js

// Theme toggle logic
document.querySelector('.theme-toggle')?.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
});

// Basic search filtering
document.querySelector('.search-bar')?.addEventListener('input', (e) => {
  const term = e.target.value.toLowerCase();
  document.querySelectorAll('.deal-card').forEach(card => {
    const match = card.textContent.toLowerCase().includes(term);
    card.style.display = match ? 'block' : 'none';
  });
});

// Auto-fetch product deals from Google Sheet
const sheetURL = 'https://opensheet.vercel.app/1qRXeav-go7JwQbpOhq6fszxlSUNxmjZ_e3Vu8jjZwiU/Deals';

fetch(sheetURL)
  .then(res => res.json())
  .then(data => {
    const container = document.querySelector('.deals-container');
    if (!container) return;
    container.innerHTML = '';

    if (data.length > 0) {
  const featured = data[0];
  const featuredBox = document.querySelector('.featured-box');
  if (featuredBox) {
    featuredBox.innerHTML = `
      <div class="featured-card">
        <img src="${featured.Image}" alt="${featured.Title}" loading="lazy" />
        <div>
          <h3>${featured.Title}</h3>
          <p>${featured.Description}</p>
          <div class="price">₹${featured.Price}</div>
          <a href="${featured.Link}" target="_blank" class="btn">Buy Now</a>
        </div>
      </div>
    `;
  }

  // Skip first item in Trending Deals
  data.slice(1).forEach(item => {
    const card = document.createElement('div');
    card.className = 'deal-card';
    card.innerHTML = `
      <img src="${item.Image || '#'}" alt="${item.Title}" loading="lazy" />
      <h3>${item.Title}</h3>
      <p>${item.Description}</p>
      <div class="price">₹${item.Price}</div>
      <a href="${item.Link}" target="_blank" class="btn">Buy Now</a>
    `;
    container.appendChild(card);
  });
}
  })
  .catch(err => console.error('Failed to fetch deals:', err));
