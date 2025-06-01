document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart if it doesn't exist
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
    
    // Update cart count on all pages
    updateCartCount();
    
    // Setup cart functionality on cart page
    if (document.getElementById('cart-section')) {
        setupCartPage();
    }
    
    // Add event listeners to all Add to Cart buttons
    document.querySelectorAll('.add-cart-btn').forEach(button => {
        button.addEventListener('click', addToCartHandler);
    });
});

// Add to cart functionality
function addToCartHandler(event) {
    const menuItem = event.target.closest('.menu-item');
    const item = {
        name: menuItem.querySelector('h3').textContent,
        description: menuItem.querySelector('p') ? menuItem.querySelector('p').textContent : '',
        price: parseFloat(menuItem.querySelector('.price').textContent.replace(/[^\d.]/g, '')),
        image: menuItem.querySelector('img').src,
        quantity: 1
    };
    
    const cart = JSON.parse(localStorage.getItem('cart'));
    const existingItem = cart.find(i => i.name === item.name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(item);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show confirmation
    showAddedToCart(item.name);
}

// Update cart count in header
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = totalItems;
    });
}

// Setup cart page functionality
function setupCartPage() {
    const cartGrid = document.querySelector('.cart-grid');
    const cartTotalSpan = document.getElementById('cart-total');
    
    function renderCart() {
        cartGrid.innerHTML = '';
        const cart = JSON.parse(localStorage.getItem('cart'));
        
        if (cart.length === 0) {
            cartGrid.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            cartTotalSpan.textContent = 'Rs.0.00';
            return;
        }
        
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-details">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <span class="price">Rs.${item.price.toFixed(2)}</span>
                    <div class="quantity-control">
                        <button class="decrease">-</button>
                        <input type="text" value="${item.quantity}" readonly>
                        <button class="increase">+</button>
                    </div>
                </div>
                <button class="remove-btn"><i class="fas fa-trash-alt"></i></button>
            `;
            cartGrid.appendChild(cartItem);
            
            // Add event listeners
            cartItem.querySelector('.decrease').addEventListener('click', () => updateQuantity(index, -1));
            cartItem.querySelector('.increase').addEventListener('click', () => updateQuantity(index, 1));
            cartItem.querySelector('.remove-btn').addEventListener('click', () => removeItem(index));
        });
        
        // Update total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalSpan.textContent = `Rs.${total.toFixed(2)}`;
    }
    
    function updateQuantity(index, change) {
        const cart = JSON.parse(localStorage.getItem('cart'));
        cart[index].quantity += change;
        
        if (cart[index].quantity < 1) {
            cart.splice(index, 1);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartCount();
    }
    
    function removeItem(index) {
        const cart = JSON.parse(localStorage.getItem('cart'));
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartCount();
    }
    
    renderCart();
    
    // Add checkout functionality
    document.querySelector('.checkout-btn').addEventListener('click', () => {
        alert('Order placed successfully!');
        localStorage.setItem('cart', JSON.stringify([]));
        renderCart();
        updateCartCount();
    });
}

// Show added to cart notification
function showAddedToCart(itemName) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        ${itemName} added to cart!
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}