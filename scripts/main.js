// scripts/main.js

// Ensure light mode on load
document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add('light-mode');
});

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
    <img id="modal-image" src="" alt="" class="w-full h-40 object-contain mb-4" />
    <p class="text-sm mb-2" id="modal-price"></p>
    <p class="text-sm mb-4" id="modal-desc"></p>
    <button class="absolute top-2 right-3 text-gray-500 hover:text-black dark:hover:text-white text-xl" id="modal-close">×</button>
  </div>
`;
document.body.appendChild(modal);

// Modal logic
function showPopup({ title, description, image, price }) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-desc').textContent = description;
  document.getElementById('modal-image').src = image;
  document.getElementById('modal-price').textContent = `Price: ₹${price}`;
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
    const featuredWrapper = document.querySelector('.featured-box .swiper-wrapper');
    if (!container || !featuredWrapper) return;

    container.innerHTML = '';
    featuredWrapper.innerHTML = '';

    // Featured Products
    const featuredItems = data
      .filter(d => (d.Tags || d.Category || '').toLowerCase().includes('featured'))
      .slice(0, 8); // ✅ Show only first 8 featured products

    featuredItems.forEach(item => {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';
      slide.innerHTML = `
        <div class="featured-card flex flex-col justify-between bg-gray-100 dark:bg-gray-800 text-black dark:text-white p-4 rounded shadow-md min-h-[360px] mx-2 text-center">
          <div class="flex flex-col items-center pt-4 pb-4">
            <img src="${item.Image}" alt="${item.Title}" loading="lazy" class="w-full h-32 object-contain rounded mb-3" />
            <h3 class="text-sm font-semibold mb-2">${item.Title}</h3>
            <p class="text-xs mb-3">${item.Description?.slice(0, 80)}...</p>
          </div>
          <div>
            <div class="price text-green-600 font-bold text-base mb-2">₹${item.Price}</div>
            <a href="${item.Link}" target="_blank" class="btn bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition text-sm">Buy Now</a>
          </div>
        </div>        
      `;
      featuredWrapper.appendChild(slide);
    });

    // Swiper for Featured Section
    new Swiper('.mySwiper', {
      loop: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: false,
      },
      navigation: false,
      slidesPerView: 2,
      spaceBetween: 15,
      breakpoints: {
        640: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 4 }, // ✅ 4 per slide on desktop
      }
    });

    // Trending Products with "Load More"
    container.classList.add('grid', 'grid-cols-2', 'sm:grid-cols-3', 'md:grid-cols-4', 'lg:grid-cols-5', 'gap-4');

    let trendingItems = data.filter(d => !(d.Tags || d.Category || '').toLowerCase().includes('featured'));
    let itemsPerPage = 20;
    let currentIndex = 0;

    function renderTrending() {
      let nextItems = trendingItems.slice(currentIndex, currentIndex + itemsPerPage);
      nextItems.forEach(d => {
        const card = document.createElement('div');
        card.className = 'deal-card bg-gray-100 dark:bg-gray-800 p-4 rounded shadow-md flex flex-col justify-between';
        card.innerHTML = `
          <div>
            <img src="${d.Image || '#'}" alt="${d.Title}" loading="lazy" class="w-full h-40 object-contain mb-4" />
            <h3 class="text-base font-semibold mb-2">${d.Title}</h3>
            <p>
              ${d.Description?.slice(0, 80)}...
              <button onclick="showPopup({ 
                title: \`${d.Title}\`, 
                description: \`${d.Description}\`, 
                image: \`${d.Image}\`, 
                price: \`${d.Price}\` 
              })" class="text-blue-600 text-xs ml-1 underline">
                Read More
              </button>
            </p>
          </div>
          <div>
            <div class="price text-green-600 font-bold text-lg mb-2">₹${d.Price}</div>
            <a href="${d.Link}" target="_blank" class="btn bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Buy Now</a>
          </div>
        `;
        container.appendChild(card);
      });
      currentIndex += itemsPerPage;

      if (currentIndex >= trendingItems.length) {
        loadMoreBtn.style.display = 'none';
      }
    }

    // Create Load More button
    let loadMoreBtn = document.createElement('button');
    loadMoreBtn.textContent = 'Load More';
    loadMoreBtn.className = 'mt-6 mx-auto block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition';
    loadMoreBtn.addEventListener('click', renderTrending);
    container.parentElement.appendChild(loadMoreBtn);

    // Initial render
    renderTrending();
  })
  .catch(err => console.error('Failed to fetch deals:', err));
