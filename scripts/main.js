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

// Track expanded states for descriptions
const expandedStates = {};

// Toggle description text
function toggleDescription(index, fullText) {
  expandedStates[index] = !expandedStates[index];
  const descEl = document.querySelector(`#desc-${index}`);
  const toggleEl = document.querySelector(`#toggle-${index}`);

  if (expandedStates[index]) {
    descEl.textContent = fullText;
    toggleEl.textContent = 'Read Less';
  } else {
    descEl.textContent = fullText.slice(0, 80);
    toggleEl.textContent = 'Read More';
  }
}

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
          <div class="featured-card bg-gray-100 dark:bg-gray-800 text-black dark:text-white p-4 rounded shadow-md flex flex-col sm:flex-row gap-4">
            <img src="${featured.Image}" alt="${featured.Title}" loading="lazy" class="w-full sm:w-48 object-contain rounded" />
            <div>
              <h3 class="text-xl font-semibold mb-2">${featured.Title}</h3>
              <p class="text-sm mb-2">${featured.Description}</p>
              <div class="price text-green-600 font-bold text-lg mb-2">₹${featured.Price}</div>
              <a href="${featured.Link}" target="_blank" class="btn bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Buy Now</a>
            </div>
          </div>
        `;
      }

      // Skip first item for Trending Deals
      data.slice(1).forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'deal-card bg-gray-100 dark:bg-gray-900 p-4 rounded shadow flex flex-col justify-between';

        const shortDesc = item.Description?.slice(0, 80) || '';
        const fullDesc = item.Description || '';

        card.innerHTML = `
          <img src="${item.Image || '#'}" alt="${item.Title}" loading="lazy" class="w-full h-32 object-contain mb-2 rounded" />
          <h3 class="font-semibold text-black dark:text-white text-sm mb-1">${item.Title}</h3>
          <p class="text-sm text-gray-700 dark:text-gray-300">
            <span id="desc-${index}">${shortDesc}</span>
            ${fullDesc.length > 80
              ? `<button id="toggle-${index}" class="text-blue-600 text-xs ml-1" onclick="toggleDescription(${index}, \`${fullDesc.replace(/`/g, '\\`')}\`)">Read More</button>`
              : ''}
          </p>
          <div class="price text-green-600 font-bold mt-2">₹${item.Price}</div>
          <a href="${item.Link}" target="_blank" class="btn bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition text-sm mt-2">Buy Now</a>
        `;

        container.appendChild(card);
      });
    }
  })
  .catch(err => console.error('Failed to fetch deals:', err));
