// scripts/main.js

// Force light mode by default
document.body.classList.add('light-mode');

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

// Create popup modal
let modal = document.createElement('div');
modal.id = 'description-modal';
modal.className = 'hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
modal.innerHTML = `
  <div class="bg-white dark:bg-gray-900 text-black dark:text-white rounded-lg p-6 max-w-lg w-full shadow-xl relative">
    <h2 class="text-lg font-semibold mb-2" id="modal-title"></h2>
    <img id="modal-image" src="" alt="" class="w-full h-40 object-contain mb-4" />
    <p class="text-sm mb-2 font-bold" id="modal-price"></p>
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

    // Featured items
    const featuredItems = data.filter(d =>
      (d.Tags || d.Category || '').toLowerCase().includes('featured')
    );

    featuredItems.forEach(item => {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';
      slide.innerHTML = `
        <div class="featured-card bg-gray-100 dark:bg-gray-800 text-black dark:text-white p-4 shadow-md flex flex-col items-center justify-between mx-auto" style="height: 350px; max-width: 250px;">
          <img src="${item.Image}" alt="${item.Title}" loading="lazy" class="w-full h-32 object-contain mb-4" />
          <h3 class="text-md font-semibold text-center mb-2">${item.Title}</h3>
          <p class="text-xs text-center flex-grow overflow-hidden">${item.Description}</p>
          <div class="mt-2">
            <div class="price text-green-600 font-bold text-sm mb-2 text-center">₹${item.Price}</div>
            <a href="${item.Link}" target="_blank" class="btn bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition text-sm">Buy Now</a>
          </div>
        </div>
      `;
      featuredWrapper.appendChild(slide);
    });

    // Featured slider init
    new Swiper('.mySwiper', {
      loop: true,
      autoplay: { delay: 4000, disableOnInteraction: false },
      pagination: { el: '.swiper-pagination', clickable: false },
      navigation: false,
      slidesPerView: 4,
      spaceBetween: 20,
      breakpoints: {
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 4 },
      }
    });

    // Trending items
    let trendingItems = data.filter(d => !(d.Tags || d.Category || '').toLowerCase().includes('featured'));
    let displayedCount = 0;
    const itemsPerLoad = 20;

    function loadMoreTrending() {
      const nextItems = trendingItems.slice(displayedCount, displayedCount + itemsPerLoad);
      nextItems.forEach(d => {
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
      displayedCount += nextItems.length;

      if (displayedCount >= trendingItems.length) {
        document.getElementById('load-more')?.remove();
      }
    }

    // Load initial 20
    loadMoreTrending();

    // Add load more button
    if (trendingItems.length > itemsPerLoad) {
      const loadMoreBtn = document.createElement('button');
      loadMoreBtn.id = 'load-more';
      loadMoreBtn.textContent = 'Load More';
      loadMoreBtn.className = 'btn bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mt-4';
      loadMoreBtn.addEventListener('click', loadMoreTrending);
      container.parentElement.appendChild(loadMoreBtn);
    }
  })
  .catch(err => console.error('Failed to fetch deals:', err));
