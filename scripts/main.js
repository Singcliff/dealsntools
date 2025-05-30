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

// Create modal container once
let modal = document.createElement('div');
modal.id = 'description-modal';
modal.className = 'hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
modal.innerHTML = `
  <div class="bg-white dark:bg-gray-900 text-black dark:text-white rounded-lg p-6 max-w-lg w-full shadow-xl relative">
    <h2 class="text-lg font-semibold mb-2" id="modal-title"></h2>
    <p class="text-sm mb-4" id="modal-desc"></p>
    <button class="absolute top-2 right-3 text-gray-500 hover:text-black dark:hover:text-white text-xl" id="modal-close">×</button>
  </div>
`;
document.body.appendChild(modal);

// Modal logic
function showDescriptionModal(title, description) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-desc').textContent = description;
  modal.classList.remove('hidden');
}
document.getElementById('modal-close').addEventListener('click', () => {
  modal.classList.add('hidden');
});

// Fetch deals
const sheetURL = 'https://opensheet.vercel.app/1qRXeav-go7JwQbpOhq6fszxlSUNxmjZ_e3Vu8jjZwiU/Deals';

fetch(sheetURL)
  .then(res => res.json())
  .then(data => {
  const container = document.querySelector('.deals-container');
  const featuredBox = document.querySelector('.featured-box');
  if (!container || !featuredBox) return;

  container.innerHTML = '';
  featuredBox.innerHTML = '';

  if (data.length > 0) {
    // Extract featured items
    const featuredItems = data.filter(item =>
      (item.Tags || item.Category || '').toLowerCase().includes('featured')
    );

    // Show the first featured item
    if (featuredItems.length > 0) {
      const featured = featuredItems[0];
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
    } else {
      featuredBox.innerHTML = `<p class="text-center text-sm text-gray-500">✨ Your top deal will appear here!</p>`;
    }

    // Show all items except the one already shown in featured
    data
      .filter(item => item !== featuredItems[0])
      .forEach(item => {
        const card = document.createElement('div');
        card.className = 'deal-card';
        card.innerHTML = `
          <img src="${item.Image || '#'}" alt="${item.Title}" loading="lazy" />
          <h3>${item.Title}</h3>
          <p>
            ${item.Description?.slice(0, 80)}...
            <button onclick="showPopup({ 
              title: \`${item.Title}\`, 
              description: \`${item.Description}\`, 
              image: \`${item.Image}\`, 
              price: \`${item.Price}\` 
            })" class="text-blue-600 text-xs ml-1 underline">
              Read More
            </button>
          </p>
          <div class="price">₹${item.Price}</div>
          <a href="${item.Link}" target="_blank" class="btn">Buy Now</a>
        `;
        container.appendChild(card);
      });
  }
})

  .catch(err => console.error('Failed to fetch deals:', err));
