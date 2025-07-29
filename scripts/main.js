// scripts/main.js

// Theme toggle logic (default light mode)
document.body.classList.add('light-mode');
document.querySelector('.theme-toggle')?.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
});

// Search filtering
document.querySelector('.search-bar')?.addEventListener('input', (e) => {
  const term = e.target.value.toLowerCase();
  document.querySelectorAll('.deal-card').forEach(card => {
    const match = card.textContent.toLowerCase().includes(term);
    card.style.display = match ? 'block' : 'none';
  });
});

// Create popup modal
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

// Popup handler
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

// Fetch deals from Google Sheet
const sheetURL = 'https://opensheet.vercel.app/1qRXeav-go7JwQbpOhq6fszxlSUNxmjZ_e3Vu8jjZwiU/Deals';

fetch(sheetURL)
  .then(res => res.json())
  .then(data => {
    const container = document.querySelector('.deals-container');
    const featuredWrapper = document.querySelector('.featured-box .swiper-wrapper');
    if (!container || !featuredWrapper) return;

    container.innerHTML = '';
    featuredWrapper.innerHTML = '';

    // Featured Products Only
    const featuredItems = data.filter(d =>
      (d.Tags || d.Category || '').toLowerCase().includes('featured')
    );

    featuredItems.forEach(item => {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';
      slide.innerHTML = `
        <div class="featured-card flex flex-col justify-between h-full bg-gray-100 dark:bg-gray-800 text-black dark:text-white p-4 shadow-md">
          <div class="flex flex-col items-center text-center h-full">
            <img src="${item.Image}" alt="${item.Title}" loading="lazy" class="w-full h-40 object-contain mb-4" />
            <h3 class="text-lg font-semibold mb-2">${item.Title}</h3>
            <p class="text-sm flex-grow">${item.Description}</p>
            <div class="mt-2">
              <div class="price text-green-600 font-bold text-lg mb-2">₹${item.Price}</div>
              <a href="${item.Link}" target="_blank" class="btn bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Buy Now</a>
            </div>
          </div>
        </div>
      `;
      featuredWrapper.appendChild(slide);
    });

    // Swiper config for Featured (4 per slide)
    new Swiper('.mySwiper', {
      loop: true,
      autoplay: { delay: 3000, disableOnInteraction: false },
      slidesPerView: 1,
      spaceBetween: 20,
      breakpoints: {
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 4 }
      }
    });

    // Trending deals (first 20 + load more)
    const trendingItems = data.filter(d => !(d.Tags || d.Category || '').toLowerCase().includes('featured'));
    let itemsToShow = 20;

    function renderTrending() {
      container.innerHTML = '';
      trendingItems.slice(0, itemsToShow).forEach(d => {
        const card = document.createElement('div');
        card.className = 'deal-card';
        card.innerHTML = `
          <img src="${d.Image || '#'}" alt="${d.Title}" loading="lazy" />
          <h3>${d.Title}</h3>
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
          <div class="price">₹${d.Price}</div>
          <a href="${d.Link}" target="_blank" class="btn">Buy Now</a>
        `;
        container.appendChild(card);
      });
    }

    renderTrending();

    // Load More button
    let loadMoreBtn = document.querySelector('#load-more');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        itemsToShow += 20;
        renderTrending();
      });
    }
  })
  .catch(err => console.error('Failed to fetch deals:', err));
