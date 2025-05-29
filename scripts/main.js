// Toggle dark/light theme
document.getElementById('theme-toggle').addEventListener('click', () => {
  document.body.classList.toggle('dark');
  document.body.classList.toggle('light');
});

// Handle newsletter form (simple alert for now)
document.getElementById('subscribe-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  if (name && email) {
    alert(`Thanks, ${name}! You've been subscribed.`);
    e.target.reset(); // clear form
  } else {
    alert('Please fill out both fields.');
  }
});
