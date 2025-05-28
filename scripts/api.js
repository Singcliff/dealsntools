// Mock API data - in a real app, you would fetch from a server
const mockDeals = [
    {
        id: 1,
        title: "Premium Wireless Headphones",
        description: "Noise-cancelling wireless headphones with 30-hour battery life.",
        image: "assets/images/placeholder-product.webp",
        currentPrice: 89.99,
        originalPrice: 129.99,
        discount: 30,
        category: "electronics",
        store: "Amazon",
        timestamp: "2023-05-15T10:30:00Z",
        featured: true
    },
    {
        id: 2,
        title: "Smart Home Assistant",
        description: "Voice-controlled smart assistant with premium sound quality.",
        image: "assets/images/placeholder-product.webp",
        currentPrice: 59.99,
        originalPrice: 99.99,
        discount: 40,
        category: "electronics",
        store: "Best Buy",
        timestamp: "2023-05-15T09:15:00Z",
        featured: true
    },
    {
        id: 3,
        title: "Ergonomic Office Chair",
        description: "Comfortable chair with lumbar support for long work sessions.",
        image: "assets/images/placeholder-product.webp",
        currentPrice: 149.99,
        originalPrice: 199.99,
        discount: 25,
        category: "home",
        store: "Wayfair",
        timestamp: "2023-05-14T14:45:00Z",
        featured: true
    },
    {
        id: 4,
        title: "Fitness Tracker Watch",
        description: "Track your workouts, heart rate, and sleep patterns.",
        image: "assets/images/placeholder-product.webp",
        currentPrice: 79.99,
        originalPrice: 119.99,
        discount: 33,
        category: "electronics",
        store: "Walmart",
        timestamp: "2023-05-14T11:20:00Z"
    },
    {
        id: 5,
        title: "Portable Bluetooth Speaker",
        description: "Waterproof speaker with 20-hour playtime.",
        image: "assets/images/placeholder-product.webp",
        currentPrice: 45.99,
        originalPrice: 69.99,
        discount: 34,
        category: "electronics",
        store: "Target",
        timestamp: "2023-05-13T16:10:00Z"
    }
];

const mockAITools = [
    {
        id: 101,
        title: "AI Writing Assistant Pro",
        description: "Advanced AI tool for content creation and editing.",
        image: "assets/images/placeholder-product.webp",
        category: "writing",
        price: "Free trial",
        timestamp: "2023-05-15T08:30:00Z",
        featured: true
    },
    {
        id: 102,
        title: "DesignAI Creator",
        description: "Generate stunning graphics with AI-powered design tool.",
        image: "assets/images/placeholder-product.webp",
        category: "design",
        price: "$29/month",
        timestamp: "2023-05-15T07:45:00Z",
        featured: true
    },
    {
        id: 103,
        title: "CodeCompleter AI",
        description: "AI pair programmer that suggests code completions.",
        image: "assets/images/placeholder-product.webp",
        category: "coding",
        price: "Free for students",
        timestamp: "2023-05-14T13:20:00Z",
        featured: true
    },
    {
        id: 104,
        title: "ProductivityBot",
        description: "AI assistant that helps optimize your workflow.",
        image: "assets/images/placeholder-product.webp",
        category: "productivity",
        price: "$9.99/month",
        timestamp: "2023-05-14T10:15:00Z"
    },
    {
        id: 105,
        title: "AI Photo Enhancer",
        description: "Enhance and restore old photos with AI technology.",
        image: "assets/images/placeholder-product.webp",
        category: "design",
        price: "Free with limitations",
        timestamp: "2023-05-13T15:30:00Z"
    }
];

// Function to fetch deals (mock implementation)
function fetchDeals() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockDeals);
        }, 800);
    });
}

// Function to fetch AI tools (mock implementation)
function fetchAITools() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockAITools);
        }, 800);
    });
}

// Function to render deals
function renderDeals(deals, containerId, isFeatured = false) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    const dealsToShow = isFeatured ? deals.filter(deal => deal.featured) : deals;
    
    dealsToShow.forEach(deal => {
        const dealElement = document.createElement('div');
        dealElement.className = 'deal-card hover-grow fade-in';
        dealElement.innerHTML = `
            <img src="${deal.image}" alt="${deal.title}" class="deal-image">
            <div class="deal-info">
                <h3 class="deal-title">${deal.title}</h3>
                <p class="deal-description">${deal.description}</p>
                <div class="deal-price">
                    <span class="current-price">$${deal.currentPrice}</span>
                    <span class="original-price">$${deal.originalPrice}</span>
                    <span class="discount-badge">${deal.discount}% OFF</span>
                </div>
                <div class="deal-meta">
                    <span>${deal.store}</span>
                    <div class="deal-actions">
                        <button class="btn btn-secondary btn-sm">Details</button>
                        <button class="btn btn-primary btn-sm">Get Deal</button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(dealElement);
    });
}

// Function to render AI tools
function renderAITools(tools, containerId, isFeatured = false) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    const toolsToShow = isFeatured ? tools.filter(tool => tool.featured) : tools;
    
    toolsToShow.forEach(tool => {
        const toolElement = document.createElement('div');
        toolElement.className = 'tool-card hover-grow fade-in';
        toolElement.innerHTML = `
            <img src="${tool.image}" alt="${tool.title}" class="tool-image">
            <div class="tool-info">
                <h3 class="tool-title">${tool.title}</h3>
                <p class="tool-description">${tool.description}</p>
                <div class="tool-meta">
                    <span class="tool-category">${tool.category}</span>
                    <span>${tool.price}</span>
                </div>
                <div class="tool-actions">
                    <button class="btn btn-secondary btn-sm">Learn More</button>
                    <button class="btn btn-primary btn-sm">Try Now</button>
                </div>
            </div>
        `;
        container.appendChild(toolElement);
    });
}

// Initialize content
async function initializeContent() {
    try {
        const deals = await fetchDeals();
        const aiTools = await fetchAITools();
        
        renderDeals(deals, 'featuredDealsContainer', true);
        renderDeals(deals, 'shoppingDealsContainer');
        renderAITools(aiTools, 'aiToolsContainer');
        
        // Update stats
        document.getElementById('totalDeals').textContent = deals.length;
        document.getElementById('aiTools').textContent = aiTools.length;
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

// Filter functionality
document.getElementById('aiCategoryFilter').addEventListener('change', async (e) => {
    const category = e.target.value;
    const tools = await fetchAITools();
    
    if (category === 'all') {
        renderAITools(tools, 'aiToolsContainer');
    } else {
        const filteredTools = tools.filter(tool => tool.category === category);
        renderAITools(filteredTools, 'aiToolsContainer');
    }
});

document.getElementById('shoppingCategoryFilter').addEventListener('change', async (e) => {
    const category = e.target.value;
    const deals = await fetchDeals();