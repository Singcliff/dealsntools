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

    const featuredItems = data.filter(d =>
      (d.Tags || d.Category || '').toLowerCase().includes('featured')
    );

    featuredItems.forEach(item => {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';
      slide.innerHTML = `
        <div class="featured-card flex flex-col justify-between bg-gray-100 dark:bg-gray-800 text-black dark:text-white p-4 rounded shadow-md min-h-[450px]">
          <div>
            <img src="${item.Image}" alt="${item.Title}" loading="lazy" class="w-full h-48 object-contain rounded mb-4" />
            <h3 class="text-lg font-semibold mb-2">${item.Title}</h3>
            <p class="text-sm mb-4">${item.Description?.slice(0, 100)}...</p>
          </div>
          <div>
            <div class="price text-green-600 font-bold text-lg mb-2">₹${item.Price}</div>
            <a href="${item.Link}" target="_blank" class="btn bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Buy Now</a>
          </div>
        </div>
      `;

      featuredWrapper.appendChild(slide);
    });

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
      spaceBetween: 20,
      breakpoints: {
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }
    });

    data
      .filter(d => !(d.Tags || d.Category || '').toLowerCase().includes('featured'))
      .forEach(d => {
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
  })
  .catch(err => console.error('Failed to fetch deals:', err));
