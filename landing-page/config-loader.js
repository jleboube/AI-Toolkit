// Dynamic Configuration Loader for Landing Page
// This script loads products.json and dynamically generates the page content

// Icon library - maps icon names to SVG paths
const iconLibrary = {
    camera: `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor"/><circle cx="12" cy="12" r="3" fill="currentColor"/>`,

    document: `<path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6z" fill="currentColor"/><path d="M13 3.5V9h5.5L13 3.5z" fill="rgba(255,255,255,0.3)"/>`,

    sports: `<circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="2"/><path d="M12 8v8M8 12h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,

    beauty: `<path d="M12 2C9.24 2 7 4.24 7 7c0 2.85 2.92 7.21 5 9.88 2.11-2.69 5-7 5-9.88 0-2.76-2.24-5-5-5z" fill="currentColor"/><circle cx="12" cy="7" r="2" fill="rgba(255,255,255,0.4)"/>`,

    education: `<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" fill="currentColor"/>`,

    link: `<path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" fill="currentColor"/>`,

    // Default icon if none specified
    default: `<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`
};

// Function to get icon SVG
function getIconSVG(iconName) {
    const iconPath = iconLibrary[iconName] || iconLibrary.default;
    return `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">${iconPath}</svg>`;
}

// Function to build URL based on environment
function buildProductURL(product) {
    const domain = window.location.hostname;
    const protocol = window.location.protocol;

    // Check if we're on localhost
    if (domain === 'localhost' || domain === '127.0.0.1') {
        return `${protocol}//${domain}:${product.port}`;
    } else {
        // Production - use subdomain
        return `${protocol}//${product.subdomain}.${domain}`;
    }
}

// Function to create a product card element
function createProductCard(product, index) {
    if (!product.enabled) return null;

    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-aos', 'fade-up');
    if (product.animationDelay > 0) {
        card.setAttribute('data-aos-delay', product.animationDelay.toString());
    }

    const url = buildProductURL(product);

    card.innerHTML = `
        <div class="product-icon">
            ${getIconSVG(product.icon)}
        </div>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <a href="${url}" target="_blank" class="product-link">Launch App →</a>
    `;

    return card;
}

// Function to load and render products
async function loadProducts() {
    try {
        const response = await fetch('/products.json');
        if (!response.ok) {
            throw new Error('Failed to load products configuration');
        }

        const data = await response.json();

        // Update config values
        updateConfigValues(data.config);

        // Render products
        renderProducts(data.products);

        // Update stats
        updateStats(data.products.filter(p => p.enabled).length, data.config.stats);

        console.log('Products loaded successfully');
    } catch (error) {
        console.error('Error loading products:', error);
        // Fallback: show error message
        const container = document.getElementById('products-container');
        if (container) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-muted);">Unable to load products. Please refresh the page.</p>';
        }
    }
}

// Function to update configuration text values
function updateConfigValues(config) {
    document.querySelectorAll('[data-config]').forEach(element => {
        const configKey = element.getAttribute('data-config');
        if (config[configKey]) {
            element.textContent = config[configKey];
        }
    });
}

// Function to render product cards
function renderProducts(products) {
    const container = document.getElementById('products-container');
    if (!container) return;

    // Clear existing content
    container.innerHTML = '';

    // Create and append product cards
    products.forEach((product, index) => {
        const card = createProductCard(product, index);
        if (card) {
            container.appendChild(card);
        }
    });

    // Reinitialize animation observer after adding new elements
    reinitializeAnimations();
}

// Function to update stats
function updateStats(productCount, statsConfig) {
    document.querySelectorAll('[data-stat]').forEach(element => {
        const statKey = element.getAttribute('data-stat');

        if (statKey === 'products' && statsConfig.products === 'auto') {
            element.textContent = productCount;
        } else if (statsConfig[statKey] && statsConfig[statKey] !== 'auto') {
            element.textContent = statsConfig[statKey];
        }
    });
}

// Function to reinitialize animations for dynamically added elements
function reinitializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);

    // Observe all elements with data-aos attribute
    document.querySelectorAll('[data-aos]').forEach(element => {
        // Remove any existing animation class
        element.classList.remove('aos-animate');
        // Re-observe the element
        observer.observe(element);
    });

    // Reinitialize product card interactions
    initializeProductCardInteractions();
}

// Function to initialize product card 3D hover effects
function initializeProductCardInteractions() {
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-8px)
                scale3d(1.02, 1.02, 1.02)
            `;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale3d(1, 1, 1)';
        });
    });
}

// Load products when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadProducts);
} else {
    loadProducts();
}
