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

// Popup Logic
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('read-more-btn')) {
    const desc = e.target.dataset.description;
    const img = e.target.dataset.image;
    const price = e.target.dataset.price;
    const popup = document.querySelector('.popup');
    popup.innerHTML = `
      <div class="popup-content">
        <span class="popup-close">&times;</span>
        <img src="${img}" alt="Product" class="popup-img" />
        <p class="popup-price">₹${price}</p>
        <p class="popup-desc">${desc}</p>
      </div>
    `;
    popup.style.display = 'block';
  }
});

document.addEventListener('click', function (e) {
  if (e.target.classList.contains('popup-close') || e.target.classList.contains('popup')) {
    document.querySelector('.popup').style.display = 'none';
  }
});

// Google Sheet integration
const sheetURL = 'https://opensheet.vercel.app/1qRXeav-go7JwQbpOhq6fszxlSUNxmjZ_e3Vu8jjZwiU/Deals';

fetch(sheetURL)
  .then(res => res.json())
  .then(data => {
    const container = document.querySelector('.deals-container');
    const featuredBox = document.querySelector('.featured-box');
    if (!container || !featuredBox) return;

    container.innerHTML = '';

    if (data.length > 0) {
      const featured = data[0];
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

    data.slice(1).forEach(item => {
      const card = document.createElement('div');
      card.className = 'deal-card';
      const shortDesc = item.Description?.slice(0, 80);
      const isLong = item.Description?.length > 80;

      card.innerHTML = `
        <img src="${item.Image || '#'}" alt="${item.Title}" loading="lazy" />
        <h3>${item.Title}</h3>
        <p>
          ${shortDesc || ''}
          ${isLong ? `<button class="read-more-btn" data-description="${item.Description}" data-image="${item.Image}" data-price="${item.Price}">Read More</button>` : ''}
        </p>
        <div class="price">₹${item.Price}</div>
        <a href="${item.Link}" target="_blank" class="btn">Buy Now</a>
      `;
      container.appendChild(card);
    });
  })
  .catch(err => console.error('Failed to fetch deals:', err));
