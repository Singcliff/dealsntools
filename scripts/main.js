// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const subscribeBtn = document.getElementById('subscribeBtn');
const newsletterForm = document.getElementById('newsletterForm');
const loadingScreen = document.getElementById('loadingScreen');
const lastUpdated = document.getElementById('lastUpdated');

// Theme Toggle
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'light') {
        document.documentElement.removeAttribute('data-theme');
        themeToggle.textContent = 'Light Mode';
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggle.textContent = 'Dark Mode';
        localStorage.setItem('theme', 'light');
    }
}

// Check for saved theme preference
function checkTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggle.textContent = 'Dark Mode';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkTheme();
    
    // Set last updated time
    const now = new Date();
    lastUpdated.textContent = now.toLocaleString();
    
    // Hide loading screen after content loads
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 300);
    }, 1000);
});

// Event Listeners
themeToggle.addEventListener('click', toggleTheme);

newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input').value;
    
    // Simple validation
    if (!email.includes('@')) {
        e.target.classList.add('shake');
        setTimeout(() => {
            e.target.classList.remove('shake');
        }, 500);
        return;
    }
    
    // Here you would typically send to a server
    console.log('Subscribed email:', email);
    alert('Thanks for subscribing! You\'ll receive our best deals soon.');
    e.target.reset();
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});