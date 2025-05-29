// Replace with your actual published CSV export URL
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSAMPLEKEY/pub?output=csv';

async function fetchDeals() {
  try {
    const res = await fetch(SHEET_URL);
    const text = await res.text();
    const rows = text.trim().split('\n').slice(1);

    const products = rows.map(row => {
      const [name, desc, price, img, link, tags, featured] = row.split(',');
      return { name, desc, price, img, link, tags, featured };
    });

    renderDeals(products);
  } catch (err) {
    document.getElementById('product-list').innerText = 'Failed to load deals.';
    console.error('Fetch error:', err);
  }
}

function renderDeals(products) {
  // Featured deal
  const featured = products.find(p => p.featured?.toLowerCase().trim() === 'yes');
  if (featured) {
    document.getElementById('featured-deal').innerHTML = `
      <div class="product-card">
        <h2>🔥 Featured: ${featured.name}</h2>
        <img src="${featured.img}" alt="${featured.name}" />
        <p>${featured.desc}</p>
        <strong>${featured.price}</strong><br/>
        <a href="${featured.link}" target="_blank">Buy Now</a>
      </div>
    `;
  }

  // Trending tags
  const tags = [...new Set(products.flatMap(p => p.tags?.split('|').map(t => t.trim()) || []))];
  document.getElementById('trending-tags').innerHTML = tags.map(tag => `<span>#${tag}</span>`).join(' ');

  // Product grid
  document.getElementById('product-list').innerHTML = products.map(p => `
    <div class="product-card">
      <h3>${p.name}</h3>
      <img src="${p.img}" alt="${p.name}" />
      <p>${p.desc}</p>
      <strong>${p.price}</strong><br/>
      <a href="${p.link}" target="_blank">Buy Now</a>
    </div>
  `).join('');
}

fetchDeals();
