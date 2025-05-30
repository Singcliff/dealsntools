// scripts/popup.js

// Create and inject the modal only once
document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('popup-modal')) {
    const modal = document.createElement('div');
    modal.id = 'popup-modal';
    modal.className = 'hidden fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
    modal.innerHTML = `
      <div class="bg-white dark:bg-gray-900 text-black dark:text-white max-w-lg w-full p-6 rounded-lg shadow-xl relative">
        <button id="popup-close" class="absolute top-2 right-4 text-gray-500 hover:text-black dark:hover:text-white text-2xl">&times;</button>
        <img id="popup-image" src="" alt="" class="w-full h-48 object-contain mb-4 rounded" />
        <h2 id="popup-title" class="text-xl font-bold mb-2"></h2>
        <p id="popup-price" class="text-green-600 font-semibold mb-2"></p>
        <p id="popup-description" class="text-sm"></p>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('popup-close').addEventListener('click', () => {
      modal.classList.add('hidden');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.add('hidden');
    });
  }
});

// Function to be used globally
function showPopup({ title, description, image, price }) {
  const modal = document.getElementById('popup-modal');
  if (!modal) return;

  document.getElementById('popup-title').textContent = title;
  document.getElementById('popup-description').textContent = description;
  document.getElementById('popup-image').src = image;
  document.getElementById('popup-image').alt = title;
  document.getElementById('popup-price').textContent = `₹${price}`;

  modal.classList.remove('hidden');
}
