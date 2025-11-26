// Product Data
const products = [
  {
    id: 1,
    name: "Elf Bar 1500",
    category: "1500",
    price: 2500,
    image: "'img/p1.JPG'",
    rating: 4.5,
    description: "Compact disposable vape with 1500 puffs",
  },
  {
    id: 2,
    name: "Geek Bar 1500",
    category: "1500",
    price: 4800,
    image: "'img/p2.PNG'",
    rating: 4.7,
    description: "Sleek design with 1500 satisfying puffs",
  },
  {
    id: 3,
    name: "HQD Cuvie Plus 2400",
    category: "3000",
    price: 5500,
    image: "'img/p3.png'",
    rating: 4.3,
    description: "2400 puffs of premium flavor experience",
  },
  {
    id: 4,
    name: "Puff Bar Plus 2000",
    category: "3000",
    price: 5200,
    image: "'img/p4.png'",
    rating: 4.6,
    description: "2000 puffs with enhanced battery life",
  },
  {
    id: 5,
    name: "Hyde Retro 3000",
    category: "3000",
    price: 6200,
    image: "'img/p5.png'",
    rating: 4.8,
    description: "Retro design with 3000 powerful puffs",
  },
  {
    id: 6,
    name: "Elf Bar BC5000",
    category: "5000",
    price: 8500,
    image: "'img/p6.png'",
    rating: 4.9,
    description: "Premium 5000 puff disposable vape",
  },
  {
    id: 7,
    name: "Geek Bar Meloso 5000",
    category: "5000",
    price: 8800,
    image: "'img/p7.png'",
    rating: 4.7,
    description: "5000 puffs with mesh coil technology",
  },
  {
    id: 8,
    name: "Lost Mary OS5000",
    category: "5000",
    price: 9200,
    image: "'img/p8.png'",
    rating: 4.8,
    description: "Innovative design with 5000 puffs",
  },
  {
    id: 9,
    name: "Funky Republic Ti7000",
    category: "5000+",
    price: 11500,
    image: "'img/p9.png'",
    rating: 4.9,
    description: "Advanced technology with 7000 puffs",
  },
  {
    id: 10,
    name: "Raz TN9000",
    category: "5000+",
    price: 12500,
    image: "'img/p10.png'",
    rating: 5.0,
    description: "Ultra-long lasting with 9000 puffs",
  },
];

// DOM Elements
const productsGrid = document.querySelector(".products-grid");
const categoryTabs = document.querySelectorAll(".category-tab");
const cartIcon = document.querySelector(".cart-icon");
const wishlistIcon = document.querySelector(".wishlist-icon");
const cartSidebar = document.querySelector(".cart-sidebar");
const wishlistSidebar = document.querySelector(".wishlist-sidebar");
const closeSidebarBtns = document.querySelectorAll(".close-sidebar");
const overlay = document.querySelector(".overlay");
const checkoutBtn = document.querySelector(".checkout-btn");
const checkoutModal = document.querySelector(".checkout-modal");
const closeModalBtn = document.querySelector(".close-modal");
const cartCount = document.querySelector(".cart-count");
const wishlistCount = document.querySelector(".wishlist-count");
const cartBody = document.querySelector(".cart-sidebar .sidebar-body");
const wishlistBody = document.querySelector(".wishlist-sidebar .sidebar-body");
const subtotalPrice = document.querySelector(".subtotal-price");
const orderSummary = document.querySelector(".order-summary");
const orderTotalPrice = document.querySelector(".order-total-price");
const checkoutForm = document.getElementById("checkout-form");
const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
const nav = document.querySelector("nav");

// State
let cart = [];
let wishlist = [];
let currentSlide = 0;
const slides = document.querySelectorAll(".carousel-slide");
const indicators = document.querySelectorAll(".indicator");

// Initialize the website
function init() {
  renderProducts("all");
  setupEventListeners();
  startCarousel();
}

// Render products based on category
function renderProducts(category) {
  productsGrid.innerHTML = "";

  const filteredProducts =
    category === "all"
      ? products
      : products.filter((product) => product.category === category);

  filteredProducts.forEach((product) => {
    const isInWishlist = wishlist.some((item) => item.id === product.id);

    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-badge">${product.category} Puffs</div>
            <div class="product-actions">
                <div class="action-btn add-to-wishlist ${isInWishlist ? "active" : ""}" data-id="${product.id}">
                    <i class="${isInWishlist ? "fas" : "far"} fa-heart"></i>
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category} Puffs</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">₦${product.price.toLocaleString()}</div>
                <div class="product-rating">
                    ${generateStarRating(product.rating)}
                </div>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;

    productsGrid.appendChild(productCard);
  });

  // Add event listeners to the newly created buttons
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", addToCart);
  });

  document.querySelectorAll(".add-to-wishlist").forEach((button) => {
    button.addEventListener("click", toggleWishlist);
  });
}

// Generate star rating HTML
function generateStarRating(rating) {
  let stars = "";
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fas fa-star"></i>';
  }

  if (hasHalfStar) {
    stars += '<i class="fas fa-star-half-alt"></i>';
  }

  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars += '<i class="far fa-star"></i>';
  }

  return stars;
}

// Add product to cart
function addToCart(e) {
  const productId = parseInt(e.target.dataset.id);
  const product = products.find((p) => p.id === productId);

  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1,
    });
  }

  updateCartUI();
  showNotification(`${product.name} added to cart`);
}

// Toggle product in wishlist
function toggleWishlist(e) {
  const productId = parseInt(e.currentTarget.dataset.id);
  const product = products.find((p) => p.id === productId);
  const wishlistBtn = e.currentTarget;

  const existingIndex = wishlist.findIndex((item) => item.id === productId);

  if (existingIndex !== -1) {
    wishlist.splice(existingIndex, 1);
    wishlistBtn.classList.remove("active");
    wishlistBtn.innerHTML = '<i class="far fa-heart"></i>';
    showNotification(`${product.name} removed from wishlist`);
  } else {
    wishlist.push(product);
    wishlistBtn.classList.add("active");
    wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
    showNotification(`${product.name} added to wishlist`);
  }

  updateWishlistUI();
}

// Update cart UI
function updateCartUI() {
  cartCount.textContent = cart.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  if (cart.length === 0) {
    cartBody.innerHTML = `
            <div class="empty-message">
                <i class="fas fa-shopping-cart fa-2x" style="margin-bottom: 15px;"></i>
                <p>Your cart is empty</p>
            </div>
        `;
    subtotalPrice.textContent = "₦0.00";
    return;
  }

  let cartHTML = "";
  let subtotal = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    cartHTML += `
            <div class="sidebar-item">
                <div class="sidebar-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="sidebar-item-details">
                    <div class="sidebar-item-name">${item.name}</div>
                    <div class="sidebar-item-price">₦${item.price.toLocaleString()}</div>
                    <div class="sidebar-item-actions">
                        <div class="quantity-control">
                            <button class="quantity-btn decrease-quantity" data-id="${item.id}">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn increase-quantity" data-id="${item.id}">+</button>
                        </div>
                        <button class="remove-item" data-id="${item.id}">Remove</button>
                    </div>
                </div>
            </div>
        `;
  });

  cartBody.innerHTML = cartHTML;
  subtotalPrice.textContent = `₦${subtotal.toLocaleString()}`;

  // Add event listeners to cart items
  document.querySelectorAll(".decrease-quantity").forEach((button) => {
    button.addEventListener("click", decreaseQuantity);
  });

  document.querySelectorAll(".increase-quantity").forEach((button) => {
    button.addEventListener("click", increaseQuantity);
  });

  document.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", removeFromCart);
  });
}

// Update wishlist UI
function updateWishlistUI() {
  wishlistCount.textContent = wishlist.length;

  if (wishlist.length === 0) {
    wishlistBody.innerHTML = `
            <div class="empty-message">
                <i class="far fa-heart fa-2x" style="margin-bottom: 15px;"></i>
                <p>Your wishlist is empty</p>
            </div>
        `;
    return;
  }

  let wishlistHTML = "";

  wishlist.forEach((item) => {
    wishlistHTML += `
            <div class="sidebar-item">
                <div class="sidebar-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="sidebar-item-details">
                    <div class="sidebar-item-name">${item.name}</div>
                    <div class="sidebar-item-price">₦${item.price.toLocaleString()}</div>
                    <div class="sidebar-item-actions">
                        <button class="add-to-cart-from-wishlist" data-id="${item.id}">Add to Cart</button>
                        <button class="remove-from-wishlist" data-id="${item.id}">Remove</button>
                    </div>
                </div>
            </div>
        `;
  });

  wishlistBody.innerHTML = wishlistHTML;

  // Add event listeners to wishlist items
  document.querySelectorAll(".add-to-cart-from-wishlist").forEach((button) => {
    button.addEventListener("click", addToCartFromWishlist);
  });

  document.querySelectorAll(".remove-from-wishlist").forEach((button) => {
    button.addEventListener("click", removeFromWishlist);
  });
}

// Decrease item quantity in cart
function decreaseQuantity(e) {
  const productId = parseInt(e.target.dataset.id);
  const item = cart.find((item) => item.id === productId);

  if (item.quantity > 1) {
    item.quantity -= 1;
  } else {
    cart = cart.filter((item) => item.id !== productId);
  }

  updateCartUI();
}

// Increase item quantity in cart
function increaseQuantity(e) {
  const productId = parseInt(e.target.dataset.id);
  const item = cart.find((item) => item.id === productId);

  item.quantity += 1;
  updateCartUI();
}

// Remove item from cart
function removeFromCart(e) {
  const productId = parseInt(e.target.dataset.id);
  cart = cart.filter((item) => item.id !== productId);
  updateCartUI();
  showNotification("Item removed from cart");
}

// Add to cart from wishlist
function addToCartFromWishlist(e) {
  const productId = parseInt(e.target.dataset.id);
  const product = products.find((p) => p.id === productId);

  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1,
    });
  }

  updateCartUI();
  showNotification(`${product.name} added to cart`);
}

// Remove from wishlist
function removeFromWishlist(e) {
  const productId = parseInt(e.target.dataset.id);
  const product = products.find((p) => p.id === productId);

  wishlist = wishlist.filter((item) => item.id !== productId);

  // Update the wishlist button in products grid
  const wishlistBtn = document.querySelector(
    `.add-to-wishlist[data-id="${productId}"]`,
  );
  if (wishlistBtn) {
    wishlistBtn.classList.remove("active");
    wishlistBtn.innerHTML = '<i class="far fa-heart"></i>';
  }

  updateWishlistUI();
  showNotification(`${product.name} removed from wishlist`);
}

// Show notification
function showNotification(message) {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: var(--accent);
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 2000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Animate out and remove
  setTimeout(() => {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Setup checkout modal
function setupCheckoutModal() {
  if (cart.length === 0) {
    showNotification("Your cart is empty");
    return;
  }

  // Update order summary
  let orderHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    orderHTML += `
            <div class="order-item">
                <span>${item.name} x ${item.quantity}</span>
                <span>₦${itemTotal.toLocaleString()}</span>
            </div>
        `;
  });

  orderSummary.innerHTML = `
        <h3>Order Summary</h3>
        ${orderHTML}
        <div class="order-total">
            <span>Total:</span>
            <span class="order-total-price">₦${total.toLocaleString()}</span>
        </div>
    `;

  // Show modal
  checkoutModal.classList.add("active");
  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

// Handle form submission
function handleCheckout(e) {
  e.preventDefault();

  // In a real application, you would send this data to a server
  const formData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    address: document.getElementById("address").value,
    items: cart,
    total: cart.reduce((total, item) => total + item.price * item.quantity, 0),
  };

  // Generate order ID
  const orderId = "VH" + Date.now();

  // Show success message
  showNotification(
    `Order #${orderId} placed successfully! Please complete your bank transfer.`,
  );

  // Reset form and cart
  checkoutForm.reset();
  cart = [];
  updateCartUI();

  // Close modal
  checkoutModal.classList.remove("active");
  overlay.classList.remove("active");
  document.body.style.overflow = "auto";
  cartSidebar.classList.remove("active");
}

// Carousel functionality
function startCarousel() {
  setInterval(() => {
    nextSlide();
  }, 5000);
}

function nextSlide() {
  slides[currentSlide].classList.remove("active");
  indicators[currentSlide].classList.remove("active");

  currentSlide = (currentSlide + 1) % slides.length;

  slides[currentSlide].classList.add("active");
  indicators[currentSlide].classList.add("active");
}

// Setup event listeners
function setupEventListeners() {
  // Category tabs
  categoryTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      categoryTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      renderProducts(tab.dataset.category);
    });
  });

  // Cart and wishlist icons
  cartIcon.addEventListener("click", () => {
    cartSidebar.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  wishlistIcon.addEventListener("click", () => {
    wishlistSidebar.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  // Close sidebars
  closeSidebarBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      cartSidebar.classList.remove("active");
      wishlistSidebar.classList.remove("active");
      overlay.classList.remove("active");
      document.body.style.overflow = "auto";
    });
  });

  // Overlay click
  overlay.addEventListener("click", () => {
    cartSidebar.classList.remove("active");
    wishlistSidebar.classList.remove("active");
    checkoutModal.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "auto";
  });

  // Checkout button
  checkoutBtn.addEventListener("click", setupCheckoutModal);

  // Close modal
  closeModalBtn.addEventListener("click", () => {
    checkoutModal.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "auto";
  });

  // Form submission
  checkoutForm.addEventListener("submit", handleCheckout);

  // Mobile menu
  mobileMenuBtn.addEventListener("click", () => {
    nav.classList.toggle("active");
  });

  // Carousel indicators
  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
      slides[currentSlide].classList.remove("active");
      indicators[currentSlide].classList.remove("active");

      currentSlide = index;

      slides[currentSlide].classList.add("active");
      indicators[currentSlide].classList.add("active");
    });
  });
}

// Initialize the website when DOM is loaded
document.addEventListener("DOMContentLoaded", init);
