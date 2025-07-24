// ========== المتغيرات العامة ==========
let cart = JSON.parse(localStorage.getItem('allaf-cart')) || [];
let isCartOpen = false;
let isAIChatOpen = false;

// بيانات المنتجات
const products = [
    {
        id: 1,
        name: 'كرواسون زبدة',
        price: 2,
        category: 'bakery',
        image: 'upload/1000100374.jpg',
        description: 'كرواسون طازج ومقرمش محضر بالزبدة الطبيعية'
    },
    {
        id: 2,
        name: 'مسمن معسل',
        price: 3.5,
        category: 'bakery',
        image: 'upload/1000101444.jpg',
        description: 'مسمن تقليدي محضر بالعسل الطبيعي'
    },
    {
        id: 3,
        name: 'كيكة شوكولا',
        price: 40,
        category: 'cakes',
        image: 'upload/1000101446.jpg',
        description: 'كيكة شوكولا فاخرة مناسبة لجميع المناسبات'
    },
    {
        id: 4,
        name: 'خبز بلدي',
        price: 1.5,
        category: 'bakery',
        image: 'upload/1000101440.jpg',
        description: 'خبز بلدي طازج محضر يومياً'
    },
    {
        id: 5,
        name: 'حلوى اللوز',
        price: 15,
        category: 'sweets',
        image: 'upload/1000101745.png',
        description: 'حلوى لذيذة محضرة من اللوز الطبيعي'
    },
    {
        id: 6,
        name: 'بقلاوة',
        price: 25,
        category: 'sweets',
        image: 'upload/1000101746.jpg',
        description: 'بقلاوة تقليدية بالعسل والمكسرات'
    },
    {
        id: 7,
        name: 'كيك الفانيليا',
        price: 35,
        category: 'cakes',
        image: 'upload/9e9bd7c4-e1f9-45e1-9114-9089f22ed6218004096147942632244.jpg',
        description: 'كيك الفانيليا الكلاسيكي بطعم رائع'
    },
    {
        id: 8,
        name: 'دونات محشي',
        price: 4,
        category: 'sweets',
        image: 'upload/1000101761.jpg',
        description: 'دونات طري محشي بالكريمة'
    }
];

// ========== تهيئة الموقع ==========
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

function initializeWebsite() {
    // إخفاء شاشة التحميل
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }, 2000);

    // تهيئة المكونات
    initializeNavigation();
    initializeProducts();
    initializeCart();
    initializeAIChat();
    initializeScrollEffects();
    initializeContactForm();
    initializeLazyLoading();
    
    // تحديث عداد السلة
    updateCartCount();
    
    console.log('🌟 مرحباً بك في مخبزة علاف! تم تحميل الموقع بنجاح 👨‍🍳');
}

// ========== التنقل ==========
function initializeNavigation() {
    // التمرير السلس للروابط الداخلية
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // تحديث الرابط النشط
                updateActiveNavLink(this.getAttribute('href'));
            }
        });
    });

    // تأثير الهيدر عند التمرير
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.main-header');
        const backToTop = document.getElementById('back-to-top');
        
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
            if (backToTop) backToTop.classList.add('visible');
        } else {
            header.classList.remove('scrolled');
            if (backToTop) backToTop.classList.remove('visible');
        }
        
        // تحديث الرابط النشط حسب الموضع
        updateActiveNavLinkOnScroll();
    });
}

function updateActiveNavLink(href) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`a[href="${href}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

function updateActiveNavLinkOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    const headerHeight = document.querySelector('.main-header').offsetHeight;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 50;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const menuToggle = document.querySelector('.menu-toggle');
    
    navMenu.classList.toggle('mobile-open');
    menuToggle.classList.toggle('active');
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ========== المنتجات ==========
function initializeProducts() {
    renderProducts();
    initializeProductFilters();
}

function renderProducts(filter = 'all') {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(product => product.category === filter);
    
    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="featured-card lazy-load" data-category="${product.category}">
            <div class="card-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <div class="card-overlay">
                    <button class="quick-add-btn" onclick="addToCart('${product.name}', ${product.price}, '${product.image}')">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
            <div class="card-content">
                <h3 class="card-title">${product.name}</h3>
                <p class="card-description">${product.description}</p>
                <div class="card-price">${product.price} درهم</div>
                <button class="add-to-cart-btn" onclick="addToCart('${product.name}', ${product.price}, '${product.image}')">
                    <i class="fas fa-shopping-cart"></i>
                    أضف للسلة
                </button>
            </div>
        </div>
    `).join('');
    
    // تطبيق تأثير التحميل التدريجي
    setTimeout(() => {
        document.querySelectorAll('.lazy-load').forEach(element => {
            element.classList.add('loaded');
        });
    }, 100);
}

function initializeProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // إزالة الفئة النشطة من جميع الأزرار
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // إضافة الفئة النشطة للزر المحدد
            this.classList.add('active');
            
            // تصفية المنتجات
            const filter = this.getAttribute('data-filter');
            renderProducts(filter);
        });
    });
}

// ========== السلة ==========
function initializeCart() {
    renderCart();
    updateCartCount();
}

function addToCart(name, price, image) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    renderCart();
    
    // تأثير بصري للإضافة
    showAddToCartAnimation();
    
    // فتح السلة تلقائياً
    if (!isCartOpen) {
        toggleCart();
    }
}

function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    saveCart();
    updateCartCount();
    renderCart();
}

function updateQuantity(name, change) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(name);
        } else {
            saveCart();
            updateCartCount();
            renderCart();
        }
    }
}

function renderCart() {
    const cartItems = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.style.display = 'none';
        if (cartEmpty) cartEmpty.style.display = 'block';
        if (cartTotal) cartTotal.textContent = '0 درهم';
        return;
    }
    
    cartItems.style.display = 'block';
    if (cartEmpty) cartEmpty.style.display = 'none';
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item fade-in">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.price} درهم</div>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="updateQuantity('${item.name}', -1)">
                    <i class="fas fa-minus"></i>
                </button>
                <span class="quantity-display">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity('${item.name}', 1)">
                    <i class="fas fa-plus"></i>
                </button>
                <button class="remove-item" onclick="removeFromCart('${item.name}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    // حساب المجموع
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotal) cartTotal.textContent = `${total} درهم`;
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // تأثير بصري للعداد
        if (totalItems > 0) {
            cartCount.classList.add('pulse');
            setTimeout(() => cartCount.classList.remove('pulse'), 1000);
        }
    }
}

function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    if (!cartSidebar) return;
    
    isCartOpen = !isCartOpen;
    
    if (isCartOpen) {
        cartSidebar.classList.add('open');
        document.body.style.overflow = 'hidden';
    } else {
        cartSidebar.classList.remove('open');
        document.body.style.overflow = '';
    }
}

function saveCart() {
    localStorage.setItem('allaf-cart', JSON.stringify(cart));
}

function checkout() {
    if (cart.length === 0) {
        alert('السلة فارغة! أضف بعض المنتجات أولاً.');
        return;
    }
    
    const orderDetails = cart.map((item, index) => 
        `${index + 1}. ${item.name} × ${item.quantity} = ${item.price * item.quantity} درهم`
    ).join('\n');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const message = `🧾 *طلب جديد من مخبزة علاف*\n\n${orderDetails}\n\n💰 *المجموع الإجمالي:* ${total} درهم\n\n📦 شكراً لاختياركم مخبزة علاف!\n🕐 سيتم تحضير طلبكم في أقرب وقت ممكن.`;
    
    const phone = "212681848262";
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    
    // إفراغ السلة بعد الطلب
    cart = [];
    saveCart();
    updateCartCount();
    renderCart();
    toggleCart();
}

function showAddToCartAnimation() {
    // إنشاء تأثير بصري للإضافة للسلة
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
        cartBtn.style.transform = 'scale(1.2)';
        cartBtn.style.background = 'var(--accent-color)';
        
        setTimeout(() => {
            cartBtn.style.transform = '';
            cartBtn.style.background = '';
        }, 300);
    }
}

// ========== بوت الذكاء الاصطناعي ==========
function initializeAIChat() {
    const chatInput = document.getElementById('chat-input-field');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}

function toggleAIChat() {
    const aiChat = document.getElementById('ai-chat');
    if (!aiChat) return;
    
    isAIChatOpen = !isAIChatOpen;
    
    if (isAIChatOpen) {
        aiChat.classList.add('open');
    } else {
        aiChat.classList.remove('open');
    }
}

function sendMessage() {
    const chatInput = document.getElementById('chat-input-field');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // إضافة رسالة المستخدم
    addMessageToChat(message, 'user');
    
    // مسح حقل الإدخال
    chatInput.value = '';
    
    // محاكاة رد البوت
    setTimeout(() => {
        const botResponse = generateBotResponse(message);
        addMessageToChat(botResponse, 'bot');
    }, 1000);
}

function askAI(question) {
    const chatInput = document.getElementById('chat-input-field');
    chatInput.value = question;
    sendMessage();
}

function addMessageToChat(message, sender) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}-message fade-in`;
    
    const avatar = sender === 'bot' 
        ? '<i class="fas fa-robot"></i>' 
        : '<i class="fas fa-user"></i>';
    
    messageElement.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">
            <p>${message}</p>
        </div>
    `;
    
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // ردود ذكية بناءً على الرسالة
    if (message.includes('منتجات') || message.includes('مميزة')) {
        return 'منتجاتنا المميزة تشمل الكرواسون الطازج، المسمن المعسل، وكيكات الشوكولا الفاخرة. جميعها محضرة يومياً بأجود المكونات الطبيعية! 🥐🍰';
    }
    
    if (message.includes('طلب') || message.includes('كيف')) {
        return 'يمكنك الطلب بسهولة! أضف المنتجات التي تريدها إلى السلة، ثم اضغط على "إرسال الطلب" وسيتم توجيهك لواتساب لإكمال الطلب. 📱✨';
    }
    
    if (message.includes('أسعار') || message.includes('سعر')) {
        return 'أسعارنا تنافسية جداً! الكرواسون بـ2 درهم، المسمن بـ3.5 درهم، والكيك يبدأ من 35 درهم. جودة عالية بأسعار معقولة! 💰';
    }
    
    if (message.includes('ساعات') || message.includes('وقت') || message.includes('متى')) {
        return 'نحن مفتوحون يومياً من الساعة 6:00 صباحاً حتى 10:00 مساءً. نعمل طوال الأسبوع لخدمتكم! 🕐';
    }
    
    if (message.includes('موقع') || message.includes('عنوان') || message.includes('أين')) {
        return 'يمكنك العثور على موقعنا بالضغط على رابط "موقعنا على الخريطة" في الموقع. نحن في انتظاركم! 📍';
    }
    
    if (message.includes('شكر') || message.includes('ممتاز') || message.includes('رائع')) {
        return 'شكراً لك! نحن سعداء بخدمتك. إذا كان لديك أي استفسار آخر، لا تتردد في السؤال! 😊';
    }
    
    if (message.includes('مساعدة') || message.includes('مشكلة')) {
        return 'بالطبع! أنا هنا لمساعدتك. يمكنك سؤالي عن المنتجات، الأسعار، طريقة الطلب، أو أي شيء آخر تريد معرفته عن مخبزة علاف! 🤝';
    }
    
    // رد افتراضي
    return 'شكراً لرسالتك! أنا سارة، مساعدتك في مخبزة علاف. يمكنني مساعدتك في معرفة المنتجات، الأسعار، وطريقة الطلب. كيف يمكنني مساعدتك اليوم؟ 🌟';
}

// ========== تأثيرات التمرير ==========
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('slide-up');
            }
        });
    }, observerOptions);
    
    // مراقبة العناصر للتأثيرات
    document.querySelectorAll('.featured-card, .feature-item, .contact-item').forEach(el => {
        observer.observe(el);
    });
}

// ========== التحميل التدريجي ==========
function initializeLazyLoading() {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========== نموذج التواصل ==========
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const name = formData.get('name');
        const phone = formData.get('phone');
        const message = formData.get('message');
        
        if (!name || !phone || !message) {
            alert('يرجى ملء جميع الحقول المطلوبة');
            return;
        }
        
        // إرسال الرسالة عبر واتساب
        const whatsappMessage = `🌟 *رسالة جديدة من موقع مخبزة علاف*\n\n👤 *الاسم:* ${name}\n📱 *الهاتف:* ${phone}\n💬 *الرسالة:*\n${message}\n\n📅 *التاريخ:* ${new Date().toLocaleDateString('ar-SA')}`;
        
        const whatsappUrl = `https://wa.me/212681848262?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, '_blank');
        
        // إعادة تعيين النموذج
        this.reset();
        
        // رسالة تأكيد
        alert('شكراً لك! تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.');
    });
}

// ========== وظائف مساعدة ==========
function formatPrice(price) {
    return `${price} درهم`;
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('ar-SA');
}

function showNotification(message, type = 'success') {
    // إنشاء إشعار مؤقت
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--accent-color)' : '#e74c3c'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ========== معالجة الأخطاء ==========
window.addEventListener('error', function(e) {
    console.error('خطأ في الموقع:', e.error);
});

// ========== تحسين الأداء ==========
// تأجيل تحميل الموارد غير الضرورية
window.addEventListener('load', function() {
    // تحميل الخطوط الإضافية
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
});

// ========== PWA Support ==========
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('Service Worker registered successfully');
            })
            .catch(function(error) {
                console.log('Service Worker registration failed');
            });
    });
}

// ========== تصدير الوظائف للاستخدام العام ==========
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.toggleCart = toggleCart;
window.checkout = checkout;
window.toggleAIChat = toggleAIChat;
window.sendMessage = sendMessage;
window.askAI = askAI;
window.toggleMobileMenu = toggleMobileMenu;
window.scrollToTop = scrollToTop;

