// scripts/main.js

const sheetURL = 'https://docs.google.com/spreadsheets/d/1qRXeav-go7JwQbpOhq6fszxlSUNxmjZ_e3Vu8jjZwiU/gviz/tq?tqx=out:json&sheet=Deals';
const productsGrid = document.querySelector('.card-grid');

async function fetchDeals() {
  try {
    const res = await fetch(sheetURL);
    const text = await res.text();
    const json = JSON.parse(text.substring(47).slice(0, -2));
    const rows = json.table.rows;

    productsGrid.innerHTML = '';

    rows.forEach(row => {
      const [title, price, image, link, tag] = row.c.map(cell => cell?.v || '');
      const card = document.createElement('div');
      card.className = 'deal-card';
      card.innerHTML = `
        <a href="${link}" target="_blank">
          <img src="${image}" alt="${title}" loading="lazy" />
          <h3>${title}</h3>
          <p class="price">${price}</p>
          <span class="tag">${tag}</span>
        </a>
      `;
      productsGrid.appendChild(card);
    });
  } catch (err) {
    console.error('Failed to fetch deals:', err);
    productsGrid.innerHTML = '<p style="color:red">Failed to load deals.</p>';
  }
}

function toggleTheme() {
  document.body.classList.toggle('light-mode');
}

document.addEventListener('DOMContentLoaded', () => {
  fetchDeals();
  document.querySelector('.theme-toggle').addEventListener('click', toggleTheme);
});
