// ===== MOHAMED HADOUNI WEBSITE - ADVANCED JAVASCRIPT =====
// Advanced Interactive Website with Modern JavaScript Features
// Author: AI Assistant
// Version: 3.0 - Ultra Advanced Edition

'use strict';

// ===== GLOBAL CONFIGURATION =====
const CONFIG = {
    // Animation settings
    animations: {
        duration: 600,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        stagger: 100,
        threshold: 0.1
    },
    
    // Theme settings
    theme: {
        default: 'light',
        storageKey: 'mohamed-theme-preference',
        transitions: true
    },
    
    // Performance settings
    performance: {
        debounceDelay: 250,
        throttleDelay: 16,
        lazyLoadOffset: 100,
        maxParticles: 50
    },
    
    // API endpoints
    api: {
        contact: '/api/contact',
        newsletter: '/api/newsletter',
        analytics: '/api/analytics'
    },
    
    // Feature flags
    features: {
        particles: true,
        smoothScroll: true,
        lazyLoading: true,
        analytics: true,
        notifications: true,
        aiAssistant: true,
        darkMode: true,
        animations: true
    }
};

// ===== UTILITY FUNCTIONS =====
class Utils {
    // Debounce function
    static debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }
    
    // Throttle function
    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Generate unique ID
    static generateId(prefix = 'id') {
        return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    // Format date
    static formatDate(date, locale = 'ar-MA') {
        return new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    }
    
    // Format number
    static formatNumber(number, locale = 'ar-MA') {
        return new Intl.NumberFormat(locale).format(number);
    }
    
    // Validate email
    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Validate phone
    static validatePhone(phone) {
        const re = /^(\+212|0)[5-7][0-9]{8}$/;
        return re.test(phone.replace(/\s/g, ''));
    }
    
    // Get random color
    static getRandomColor() {
        const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // Calculate reading time
    static calculateReadingTime(text) {
        const wordsPerMinute = 200;
        const words = text.trim().split(/\s+/).length;
        return Math.ceil(words / wordsPerMinute);
    }
    
    // Smooth scroll to element
    static smoothScrollTo(element, offset = 0) {
        const targetPosition = element.offsetTop - offset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
    
    // Check if element is in viewport
    static isInViewport(element, threshold = 0) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        
        return (
            rect.top >= -threshold &&
            rect.left >= -threshold &&
            rect.bottom <= windowHeight + threshold &&
            rect.right <= windowWidth + threshold
        );
    }
    
    // Get device type
    static getDeviceType() {
        const width = window.innerWidth;
        if (width < 768) return 'mobile';
        if (width < 1024) return 'tablet';
        return 'desktop';
    }
    
    // Check if user prefers reduced motion
    static prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    
    // Local storage with error handling
    static storage = {
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.warn('Failed to save to localStorage:', error);
                return false;
            }
        },
        
        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (error) {
                console.warn('Failed to read from localStorage:', error);
                return defaultValue;
            }
        },
        
        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.warn('Failed to remove from localStorage:', error);
                return false;
            }
        }
    };
}

// ===== EVENT EMITTER =====
class EventEmitter {
    constructor() {
        this.events = {};
    }
    
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }
    
    off(event, callback) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
    
    emit(event, data) {
        if (!this.events[event]) return;
        this.events[event].forEach(callback => callback(data));
    }
    
    once(event, callback) {
        const onceCallback = (data) => {
            callback(data);
            this.off(event, onceCallback);
        };
        this.on(event, onceCallback);
    }
}

// ===== GLOBAL EVENT EMITTER =====
const globalEvents = new EventEmitter();

// ===== LOADER MANAGER =====
class LoaderManager {
    constructor() {
        this.loader = document.querySelector('.loader');
        this.progress = 0;
        this.isLoading = true;
        this.loadingTasks = [];
    }
    
    init() {
        this.addLoadingTasks();
        this.startLoading();
    }
    
    addLoadingTasks() {
        this.loadingTasks = [
            { name: 'DOM Content', weight: 20 },
            { name: 'Stylesheets', weight: 15 },
            { name: 'Images', weight: 30 },
            { name: 'Scripts', weight: 20 },
            { name: 'Animations', weight: 15 }
        ];
    }
    
    startLoading() {
        let currentTask = 0;
        const progressBar = document.querySelector('.progress-bar');
        
        const loadNextTask = () => {
            if (currentTask >= this.loadingTasks.length) {
                this.completeLoading();
                return;
            }
            
            const task = this.loadingTasks[currentTask];
            const duration = Math.random() * 1000 + 500; // 500-1500ms
            
            // Simulate task loading
            const startTime = Date.now();
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const taskProgress = Math.min(elapsed / duration, 1);
                
                // Calculate total progress
                let totalProgress = 0;
                for (let i = 0; i < currentTask; i++) {
                    totalProgress += this.loadingTasks[i].weight;
                }
                totalProgress += taskProgress * task.weight;
                
                this.progress = totalProgress;
                
                if (progressBar) {
                    progressBar.style.width = `${this.progress}%`;
                }
                
                if (taskProgress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    currentTask++;
                    setTimeout(loadNextTask, 100);
                }
            };
            
            animate();
        };
        
        loadNextTask();
    }
    
    completeLoading() {
        setTimeout(() => {
            this.isLoading = false;
            if (this.loader) {
                this.loader.classList.add('hidden');
                setTimeout(() => {
                    this.loader.style.display = 'none';
                    globalEvents.emit('loadingComplete');
                }, 500);
            }
        }, 500);
    }
    
    show() {
        if (this.loader) {
            this.loader.style.display = 'flex';
            this.loader.classList.remove('hidden');
        }
    }
    
    hide() {
        if (this.loader) {
            this.loader.classList.add('hidden');
        }
    }
}

// ===== THEME MANAGER =====
class ThemeManager {
    constructor() {
        this.currentTheme = Utils.storage.get(CONFIG.theme.storageKey, CONFIG.theme.default);
        this.themeToggle = null;
    }
    
    init() {
        this.themeToggle = document.querySelector('.theme-toggle');
        this.applyTheme(this.currentTheme);
        this.bindEvents();
    }
    
    bindEvents() {
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (this.currentTheme === 'auto') {
                this.applyTheme('auto');
            }
        });
    }
    
    toggleTheme() {
        const themes = ['light', 'dark', 'auto'];
        const currentIndex = themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        this.setTheme(themes[nextIndex]);
    }
    
    setTheme(theme) {
        this.currentTheme = theme;
        this.applyTheme(theme);
        Utils.storage.set(CONFIG.theme.storageKey, theme);
        globalEvents.emit('themeChanged', theme);
    }
    
    applyTheme(theme) {
        const html = document.documentElement;
        
        // Remove existing theme classes
        html.classList.remove('theme-light', 'theme-dark', 'theme-auto');
        
        if (theme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            html.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        } else {
            html.setAttribute('data-theme', theme);
        }
        
        html.classList.add(`theme-${theme}`);
        
        // Update theme toggle icon
        this.updateThemeToggleIcon(theme);
    }
    
    updateThemeToggleIcon(theme) {
        if (!this.themeToggle) return;
        
        const icons = {
            light: 'fas fa-sun',
            dark: 'fas fa-moon',
            auto: 'fas fa-adjust'
        };
        
        const icon = this.themeToggle.querySelector('i');
        if (icon) {
            icon.className = icons[theme] || icons.light;
        }
    }
    
    getTheme() {
        return this.currentTheme;
    }
    
    isDark() {
        const html = document.documentElement;
        return html.getAttribute('data-theme') === 'dark';
    }
}

// ===== NAVIGATION MANAGER =====
class NavigationManager {
    constructor() {
        this.navbar = null;
        this.navToggle = null;
        this.navMenu = null;
        this.navLinks = [];
        this.isMenuOpen = false;
        this.lastScrollY = 0;
        this.scrollThreshold = 100;
    }
    
    init() {
        this.navbar = document.querySelector('.navbar');
        this.navToggle = document.querySelector('.nav-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.bindEvents();
        this.initSmoothScroll();
        this.initActiveSection();
    }
    
    bindEvents() {
        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && !this.navbar.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
        
        // Scroll events
        window.addEventListener('scroll', Utils.throttle(() => {
            this.handleScroll();
        }, CONFIG.performance.throttleDelay));
        
        // Resize events
        window.addEventListener('resize', Utils.debounce(() => {
            this.handleResize();
        }, CONFIG.performance.debounceDelay));
        
        // Navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e, link));
        });
    }
    
    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        
        if (this.navMenu) {
            this.navMenu.classList.toggle('active', this.isMenuOpen);
        }
        
        if (this.navToggle) {
            this.navToggle.classList.toggle('active', this.isMenuOpen);
        }
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
        
        globalEvents.emit('mobileMenuToggle', this.isMenuOpen);
    }
    
    closeMobileMenu() {
        this.isMenuOpen = false;
        
        if (this.navMenu) {
            this.navMenu.classList.remove('active');
        }
        
        if (this.navToggle) {
            this.navToggle.classList.remove('active');
        }
        
        document.body.style.overflow = '';
    }
    
    handleScroll() {
        const currentScrollY = window.scrollY;
        
        // Add scrolled class to navbar
        if (this.navbar) {
            this.navbar.classList.toggle('scrolled', currentScrollY > this.scrollThreshold);
        }
        
        // Hide/show navbar on scroll
        if (Math.abs(currentScrollY - this.lastScrollY) > 10) {
            if (currentScrollY > this.lastScrollY && currentScrollY > 200) {
                // Scrolling down
                this.navbar?.classList.add('nav-hidden');
            } else {
                // Scrolling up
                this.navbar?.classList.remove('nav-hidden');
            }
        }
        
        this.lastScrollY = currentScrollY;
        
        // Update active section
        this.updateActiveSection();
    }
    
    handleResize() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth >= 768 && this.isMenuOpen) {
            this.closeMobileMenu();
        }
    }
    
    handleNavClick(e, link) {
        const href = link.getAttribute('href');
        
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const navbarHeight = this.navbar?.offsetHeight || 0;
                Utils.smoothScrollTo(targetElement, navbarHeight + 20);
                this.closeMobileMenu();
            }
        }
    }
    
    initSmoothScroll() {
        // Add smooth scroll behavior
        if (CONFIG.features.smoothScroll && !Utils.prefersReducedMotion()) {
            document.documentElement.style.scrollBehavior = 'smooth';
        }
    }
    
    initActiveSection() {
        // Set up intersection observer for active sections
        const sections = document.querySelectorAll('section[id]');
        const options = {
            root: null,
            rootMargin: '-20% 0px -80% 0px',
            threshold: 0
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.setActiveNavLink(entry.target.id);
                }
            });
        }, options);
        
        sections.forEach(section => observer.observe(section));
    }
    
    updateActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const navbarHeight = this.navbar?.offsetHeight || 0;
        const scrollPosition = window.scrollY + navbarHeight + 100;
        
        let activeSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                activeSection = section.id;
            }
        });
        
        if (activeSection) {
            this.setActiveNavLink(activeSection);
        }
    }
    
    setActiveNavLink(sectionId) {
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            const isActive = href === `#${sectionId}`;
            link.classList.toggle('active', isActive);
        });
    }
}

// ===== ANIMATION MANAGER =====
class AnimationManager {
    constructor() {
        this.observers = new Map();
        this.animatedElements = new Set();
    }
    
    init() {
        if (!CONFIG.features.animations || Utils.prefersReducedMotion()) {
            return;
        }
        
        this.initScrollAnimations();
        this.initCounterAnimations();
        this.initTypewriterAnimations();
        this.initParallaxEffects();
    }
    
    initScrollAnimations() {
        const elements = document.querySelectorAll('[data-aos]');
        
        if (elements.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateElement(entry.target);
                    this.animatedElements.add(entry.target);
                }
            });
        }, {
            threshold: CONFIG.animations.threshold,
            rootMargin: '0px 0px -10% 0px'
        });
        
        elements.forEach(element => observer.observe(element));
        this.observers.set('scroll', observer);
    }
    
    animateElement(element) {
        const animation = element.getAttribute('data-aos');
        const delay = parseInt(element.getAttribute('data-aos-delay')) || 0;
        const duration = parseInt(element.getAttribute('data-aos-duration')) || CONFIG.animations.duration;
        
        setTimeout(() => {
            element.style.transition = `all ${duration}ms ${CONFIG.animations.easing}`;
            element.classList.add('aos-animate');
            
            // Apply specific animation
            switch (animation) {
                case 'fade-up':
                    element.style.transform = 'translateY(0)';
                    element.style.opacity = '1';
                    break;
                case 'fade-down':
                    element.style.transform = 'translateY(0)';
                    element.style.opacity = '1';
                    break;
                case 'fade-left':
                    element.style.transform = 'translateX(0)';
                    element.style.opacity = '1';
                    break;
                case 'fade-right':
                    element.style.transform = 'translateX(0)';
                    element.style.opacity = '1';
                    break;
                case 'zoom-in':
                    element.style.transform = 'scale(1)';
                    element.style.opacity = '1';
                    break;
                case 'flip-left':
                    element.style.transform = 'rotateY(0)';
                    element.style.opacity = '1';
                    break;
                default:
                    element.style.opacity = '1';
            }
        }, delay);
    }
    
    initCounterAnimations() {
        const counters = document.querySelectorAll('[data-count]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateCounter(entry.target);
                    this.animatedElements.add(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => observer.observe(counter));
    }
    
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const startTime = Date.now();
        const startValue = 0;
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart);
            
            element.textContent = Utils.formatNumber(currentValue);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = Utils.formatNumber(target);
            }
        };
        
        animate();
    }
    
    initTypewriterAnimations() {
        const typewriters = document.querySelectorAll('[data-typewriter]');
        
        typewriters.forEach(element => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                        this.animateTypewriter(entry.target);
                        this.animatedElements.add(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(element);
        });
    }
    
    animateTypewriter(element) {
        const text = element.textContent;
        const speed = parseInt(element.getAttribute('data-typewriter-speed')) || 50;
        
        element.textContent = '';
        element.style.borderRight = '2px solid currentColor';
        
        let i = 0;
        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                // Blinking cursor effect
                setInterval(() => {
                    element.style.borderRight = element.style.borderRight === 'none' 
                        ? '2px solid currentColor' 
                        : 'none';
                }, 500);
            }
        };
        
        type();
    }
    
    initParallaxEffects() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        if (parallaxElements.length === 0) return;
        
        const handleScroll = Utils.throttle(() => {
            const scrollY = window.scrollY;
            
            parallaxElements.forEach(element => {
                const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
                const yPos = -(scrollY * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        }, CONFIG.performance.throttleDelay);
        
        window.addEventListener('scroll', handleScroll);
    }
    
    // Utility method to trigger custom animations
    triggerAnimation(element, animationType, options = {}) {
        const {
            duration = CONFIG.animations.duration,
            delay = 0,
            easing = CONFIG.animations.easing
        } = options;
        
        setTimeout(() => {
            element.style.transition = `all ${duration}ms ${easing}`;
            element.classList.add(`animate-${animationType}`);
        }, delay);
    }
    
    // Clean up observers
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        this.animatedElements.clear();
    }
}

// ===== PARTICLE SYSTEM =====
class ParticleSystem {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.isRunning = false;
        this.animationId = null;
    }
    
    init() {
        if (!CONFIG.features.particles || Utils.prefersReducedMotion()) {
            return;
        }
        
        this.createParticles();
        this.start();
    }
    
    createParticles() {
        const particleCount = Math.min(CONFIG.performance.maxParticles, 30);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }
    
    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random properties
        const size = Math.random() * 4 + 2;
        const x = Math.random() * this.container.offsetWidth;
        const y = Math.random() * this.container.offsetHeight;
        const speedX = (Math.random() - 0.5) * 2;
        const speedY = (Math.random() - 0.5) * 2;
        const opacity = Math.random() * 0.5 + 0.2;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${Utils.getRandomColor()};
            border-radius: 50%;
            opacity: ${opacity};
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
        `;
        
        // Store particle properties
        particle.speedX = speedX;
        particle.speedY = speedY;
        particle.originalOpacity = opacity;
        
        this.container.appendChild(particle);
        return particle;
    }
    
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.animate();
    }
    
    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
    
    animate() {
        if (!this.isRunning) return;
        
        this.particles.forEach(particle => {
            // Update position
            let x = parseFloat(particle.style.left);
            let y = parseFloat(particle.style.top);
            
            x += particle.speedX;
            y += particle.speedY;
            
            // Bounce off edges
            if (x <= 0 || x >= this.container.offsetWidth) {
                particle.speedX *= -1;
            }
            if (y <= 0 || y >= this.container.offsetHeight) {
                particle.speedY *= -1;
            }
            
            // Keep particles in bounds
            x = Math.max(0, Math.min(x, this.container.offsetWidth));
            y = Math.max(0, Math.min(y, this.container.offsetHeight));
            
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            
            // Pulse opacity
            const time = Date.now() * 0.001;
            const pulseOpacity = particle.originalOpacity * (0.5 + 0.5 * Math.sin(time + x * 0.01));
            particle.style.opacity = pulseOpacity;
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        this.stop();
        this.particles.forEach(particle => particle.remove());
        this.particles = [];
    }
}

// ===== FORM MANAGER =====
class FormManager {
    constructor() {
        this.forms = new Map();
        this.validators = new Map();
    }
    
    init() {
        this.initContactForm();
        this.initNewsletterForm();
        this.setupValidators();
    }
    
    initContactForm() {
        const contactForm = document.querySelector('#contact-form');
        if (!contactForm) return;
        
        this.forms.set('contact', contactForm);
        
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleContactSubmit(contactForm);
        });
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', Utils.debounce(() => {
                this.clearFieldError(input);
            }, 300));
        });
    }
    
    initNewsletterForm() {
        const newsletterForms = document.querySelectorAll('.newsletter-form');
        
        newsletterForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterSubmit(form);
            });
        });
    }
    
    setupValidators() {
        this.validators.set('email', (value) => {
            if (!value) return 'البريد الإلكتروني مطلوب';
            if (!Utils.validateEmail(value)) return 'البريد الإلكتروني غير صحيح';
            return null;
        });
        
        this.validators.set('phone', (value) => {
            if (!value) return 'رقم الهاتف مطلوب';
            if (!Utils.validatePhone(value)) return 'رقم الهاتف غير صحيح';
            return null;
        });
        
        this.validators.set('name', (value) => {
            if (!value) return 'الاسم مطلوب';
            if (value.length < 2) return 'الاسم قصير جداً';
            if (value.length > 50) return 'الاسم طويل جداً';
            return null;
        });
        
        this.validators.set('message', (value) => {
            if (!value) return 'الرسالة مطلوبة';
            if (value.length < 10) return 'الرسالة قصيرة جداً';
            if (value.length > 1000) return 'الرسالة طويلة جداً';
            return null;
        });
        
        this.validators.set('subject', (value) => {
            if (!value) return 'الموضوع مطلوب';
            if (value.length < 3) return 'الموضوع قصير جداً';
            return null;
        });
    }
    
    validateField(field) {
        const fieldType = field.getAttribute('data-validate') || field.type;
        const validator = this.validators.get(fieldType);
        
        if (!validator) return true;
        
        const error = validator(field.value.trim());
        
        if (error) {
            this.showFieldError(field, error);
            return false;
        } else {
            this.clearFieldError(field);
            return true;
        }
    }
    
    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.classList.add('error');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        
        field.parentNode.appendChild(errorElement);
    }
    
    clearFieldError(field) {
        field.classList.remove('error');
        
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
    
    validateForm(form) {
        const fields = form.querySelectorAll('input[data-validate], textarea[data-validate], select[data-validate]');
        let isValid = true;
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    async handleContactSubmit(form) {
        if (!this.validateForm(form)) {
            this.showNotification('يرجى تصحيح الأخطاء في النموذج', 'error');
            return;
        }
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'جاري الإرسال...';
        submitButton.disabled = true;
        
        try {
            // Simulate API call
            await this.simulateApiCall(CONFIG.api.contact, data);
            
            this.showNotification('تم إرسال رسالتك بنجاح! سأتواصل معك قريباً.', 'success');
            form.reset();
            
            // Track event
            this.trackEvent('contact_form_submit', {
                name: data.name,
                email: data.email,
                subject: data.subject
            });
            
        } catch (error) {
            console.error('Contact form error:', error);
            this.showNotification('حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.', 'error');
        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }
    
    async handleNewsletterSubmit(form) {
        const emailInput = form.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (!Utils.validateEmail(email)) {
            this.showNotification('يرجى إدخال بريد إلكتروني صحيح', 'error');
            return;
        }
        
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'جاري الاشتراك...';
        submitButton.disabled = true;
        
        try {
            await this.simulateApiCall(CONFIG.api.newsletter, { email });
            
            this.showNotification('تم اشتراكك في النشرة الإخبارية بنجاح!', 'success');
            form.reset();
            
            this.trackEvent('newsletter_subscribe', { email });
            
        } catch (error) {
            console.error('Newsletter error:', error);
            this.showNotification('حدث خطأ أثناء الاشتراك. يرجى المحاولة مرة أخرى.', 'error');
        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }
    
    async simulateApiCall(endpoint, data) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        // Simulate occasional failures
        if (Math.random() < 0.1) {
            throw new Error('Network error');
        }
        
        return { success: true, data };
    }
    
    showNotification(message, type = 'info') {
        globalEvents.emit('showNotification', { message, type });
    }
    
    trackEvent(eventName, data) {
        globalEvents.emit('trackEvent', { eventName, data });
    }
}

// ===== NOTIFICATION MANAGER =====
class NotificationManager {
    constructor() {
        this.container = null;
        this.notifications = new Map();
        this.defaultDuration = 5000;
    }
    
    init() {
        this.createContainer();
        this.bindEvents();
    }
    
    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'notification-container';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            pointer-events: none;
        `;
        document.body.appendChild(this.container);
    }
    
    bindEvents() {
        globalEvents.on('showNotification', (data) => {
            this.show(data.message, data.type, data.duration);
        });
    }
    
    show(message, type = 'info', duration = this.defaultDuration) {
        const notification = this.createNotification(message, type);
        const id = Utils.generateId('notification');
        
        this.notifications.set(id, notification);
        this.container.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        });
        
        // Auto remove
        if (duration > 0) {
            setTimeout(() => {
                this.remove(id);
            }, duration);
        }
        
        return id;
    }
    
    createNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            warning: '#FF9800',
            info: '#2196F3'
        };
        
        notification.style.cssText = `
            background: white;
            border-left: 4px solid ${colors[type] || colors.info};
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            margin-bottom: 10px;
            max-width: 400px;
            opacity: 0;
            padding: 16px;
            pointer-events: auto;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <i class="${icons[type] || icons.info}" style="color: ${colors[type] || colors.info}; font-size: 18px;"></i>
                <span style="flex: 1; color: #333; line-height: 1.4;">${message}</span>
                <button class="notification-close" style="background: none; border: none; color: #999; cursor: pointer; font-size: 18px; padding: 0;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Close button
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            const id = Array.from(this.notifications.entries())
                .find(([, notif]) => notif === notification)?.[0];
            if (id) this.remove(id);
        });
        
        return notification;
    }
    
    remove(id) {
        const notification = this.notifications.get(id);
        if (!notification) return;
        
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            this.notifications.delete(id);
        }, 300);
    }
    
    clear() {
        this.notifications.forEach((notification, id) => {
            this.remove(id);
        });
    }
}

// ===== AI ASSISTANT =====
class AIAssistant {
    constructor() {
        this.isOpen = false;
        this.container = null;
        this.chatContainer = null;
        this.messageInput = null;
        this.messages = [];
        this.isTyping = false;
    }
    
    init() {
        if (!CONFIG.features.aiAssistant) return;
        
        this.createAssistant();
        this.bindEvents();
        this.addWelcomeMessage();
    }
    
    createAssistant() {
        this.container = document.createElement('div');
        this.container.className = 'ai-assistant';
        this.container.innerHTML = `
            <div class="assistant-toggle">
                <i class="fas fa-robot"></i>
            </div>
            <div class="assistant-chat">
                <div class="chat-header">
                    <h4>مساعد ذكي</h4>
                    <button class="chat-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="chat-messages"></div>
                <div class="chat-input">
                    <input type="text" placeholder="اكتب رسالتك هنا...">
                    <button type="submit">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.container);
        
        this.chatContainer = this.container.querySelector('.chat-messages');
        this.messageInput = this.container.querySelector('.chat-input input');
    }
    
    bindEvents() {
        const toggle = this.container.querySelector('.assistant-toggle');
        const closeButton = this.container.querySelector('.chat-close');
        const chatForm = this.container.querySelector('.chat-input');
        const sendButton = this.container.querySelector('.chat-input button');
        
        toggle.addEventListener('click', () => this.toggle());
        closeButton.addEventListener('click', () => this.close());
        
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendMessage();
        });
        
        sendButton.addEventListener('click', () => this.sendMessage());
        
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }
    
    toggle() {
        this.isOpen = !this.isOpen;
        const chat = this.container.querySelector('.assistant-chat');
        chat.classList.toggle('active', this.isOpen);
        
        if (this.isOpen) {
            this.messageInput.focus();
        }
    }
    
    close() {
        this.isOpen = false;
        const chat = this.container.querySelector('.assistant-chat');
        chat.classList.remove('active');
    }
    
    addWelcomeMessage() {
        const welcomeMessage = 'مرحباً! أنا المساعد الذكي لمحمد الهدوني. كيف يمكنني مساعدتك اليوم؟';
        this.addMessage(welcomeMessage, 'bot');
    }
    
    sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;
        
        this.addMessage(message, 'user');
        this.messageInput.value = '';
        
        // Simulate AI response
        this.showTyping();
        setTimeout(() => {
            this.hideTyping();
            this.generateResponse(message);
        }, 1000 + Math.random() * 2000);
    }
    
    addMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}-message`;
        messageElement.textContent = text;
        
        this.chatContainer.appendChild(messageElement);
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
        
        this.messages.push({ text, sender, timestamp: Date.now() });
    }
    
    showTyping() {
        if (this.isTyping) return;
        
        this.isTyping = true;
        const typingElement = document.createElement('div');
        typingElement.className = 'message bot-message typing-indicator';
        typingElement.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        
        this.chatContainer.appendChild(typingElement);
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }
    
    hideTyping() {
        this.isTyping = false;
        const typingElement = this.chatContainer.querySelector('.typing-indicator');
        if (typingElement) {
            typingElement.remove();
        }
    }
    
    generateResponse(userMessage) {
        const responses = {
            'مرحبا': 'مرحباً بك! كيف يمكنني مساعدتك؟',
            'خدمات': 'أقدم خدمات تسيير المقاولات والتصميم الجرافيكي. هل تريد معرفة المزيد عن خدمة معينة؟',
            'تواصل': 'يمكنك التواصل مع محمد عبر البريد الإلكتروني: elhaddouny.11@gmail.com أو الهاتف: +212681848292',
            'أسعار': 'الأسعار تختلف حسب نوع المشروع ومتطلباته. يمكنك طلب عرض سعر مخصص من خلال نموذج التواصل.',
            'مشاريع': 'لدى محمد خبرة في العديد من المشاريع المتنوعة. يمكنك الاطلاع على معرض الأعمال لرؤية أمثلة على مشاريعه.',
            'default': 'شكراً لك على رسالتك. للحصول على إجابة مفصلة، يرجى التواصل مع محمد مباشرة من خلال نموذج التواصل.'
        };
        
        // Simple keyword matching
        let response = responses.default;
        for (const [keyword, reply] of Object.entries(responses)) {
            if (keyword !== 'default' && userMessage.toLowerCase().includes(keyword)) {
                response = reply;
                break;
            }
        }
        
        this.addMessage(response, 'bot');
    }
}

// ===== ANALYTICS MANAGER =====
class AnalyticsManager {
    constructor() {
        this.sessionId = Utils.generateId('session');
        this.startTime = Date.now();
        this.events = [];
        this.pageViews = [];
        this.userAgent = navigator.userAgent;
        this.screenResolution = `${screen.width}x${screen.height}`;
    }
    
    init() {
        if (!CONFIG.features.analytics) return;
        
        this.trackPageView();
        this.bindEvents();
        this.startSessionTracking();
    }
    
    bindEvents() {
        // Track custom events
        globalEvents.on('trackEvent', (data) => {
            this.trackEvent(data.eventName, data.data);
        });
        
        // Track scroll depth
        let maxScrollDepth = 0;
        window.addEventListener('scroll', Utils.throttle(() => {
            const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollDepth > maxScrollDepth) {
                maxScrollDepth = scrollDepth;
                this.trackEvent('scroll_depth', { depth: scrollDepth });
            }
        }, 1000));
        
        // Track time on page
        window.addEventListener('beforeunload', () => {
            this.trackEvent('session_end', {
                duration: Date.now() - this.startTime,
                maxScrollDepth
            });
            this.sendAnalytics();
        });
        
        // Track clicks on important elements
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a, button, .btn');
            if (target) {
                this.trackEvent('click', {
                    element: target.tagName.toLowerCase(),
                    text: target.textContent?.trim().substring(0, 50),
                    href: target.href || null,
                    className: target.className
                });
            }
        });
        
        // Track form interactions
        document.addEventListener('focus', (e) => {
            if (e.target.matches('input, textarea, select')) {
                this.trackEvent('form_field_focus', {
                    field: e.target.name || e.target.id,
                    type: e.target.type
                });
            }
        }, true);
    }
    
    trackPageView() {
        const pageView = {
            url: window.location.href,
            title: document.title,
            referrer: document.referrer,
            timestamp: Date.now(),
            userAgent: this.userAgent,
            screenResolution: this.screenResolution,
            viewportSize: `${window.innerWidth}x${window.innerHeight}`,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
        
        this.pageViews.push(pageView);
    }
    
    trackEvent(eventName, data = {}) {
        const event = {
            name: eventName,
            data,
            timestamp: Date.now(),
            sessionId: this.sessionId,
            url: window.location.href
        };
        
        this.events.push(event);
        
        // Send critical events immediately
        const criticalEvents = ['contact_form_submit', 'newsletter_subscribe', 'error'];
        if (criticalEvents.includes(eventName)) {
            this.sendAnalytics();
        }
    }
    
    startSessionTracking() {
        // Track session every 30 seconds
        setInterval(() => {
            this.trackEvent('session_ping', {
                duration: Date.now() - this.startTime,
                isActive: document.hasFocus()
            });
        }, 30000);
    }
    
    async sendAnalytics() {
        if (this.events.length === 0) return;
        
        const payload = {
            sessionId: this.sessionId,
            pageViews: this.pageViews,
            events: this.events,
            timestamp: Date.now()
        };
        
        try {
            // In a real application, this would send to your analytics endpoint
            console.log('Analytics data:', payload);
            
            // Clear sent events
            this.events = [];
            
        } catch (error) {
            console.warn('Failed to send analytics:', error);
        }
    }
    
    // Get analytics summary
    getSummary() {
        return {
            sessionId: this.sessionId,
            sessionDuration: Date.now() - this.startTime,
            pageViews: this.pageViews.length,
            events: this.events.length,
            userAgent: this.userAgent,
            screenResolution: this.screenResolution
        };
    }
}

// ===== PERFORMANCE MONITOR =====
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.observers = [];
    }
    
    init() {
        this.measurePageLoad();
        this.observePerformance();
        this.monitorResources();
        this.trackUserInteractions();
    }
    
    measurePageLoad() {
        window.addEventListener('load', () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            
            this.metrics.pageLoad = {
                domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                totalTime: navigation.loadEventEnd - navigation.fetchStart,
                dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
                tcpConnection: navigation.connectEnd - navigation.connectStart,
                serverResponse: navigation.responseEnd - navigation.requestStart,
                domProcessing: navigation.domComplete - navigation.domLoading
            };
            
            globalEvents.emit('trackEvent', {
                eventName: 'performance_page_load',
                data: this.metrics.pageLoad
            });
        });
    }
    
    observePerformance() {
        // Observe Largest Contentful Paint
        if ('PerformanceObserver' in window) {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                
                this.metrics.lcp = lastEntry.startTime;
                
                globalEvents.emit('trackEvent', {
                    eventName: 'performance_lcp',
                    data: { lcp: this.metrics.lcp }
                });
            });
            
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            this.observers.push(lcpObserver);
            
            // Observe First Input Delay
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    this.metrics.fid = entry.processingStart - entry.startTime;
                    
                    globalEvents.emit('trackEvent', {
                        eventName: 'performance_fid',
                        data: { fid: this.metrics.fid }
                    });
                });
            });
            
            fidObserver.observe({ entryTypes: ['first-input'] });
            this.observers.push(fidObserver);
            
            // Observe Cumulative Layout Shift
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                
                this.metrics.cls = clsValue;
            });
            
            clsObserver.observe({ entryTypes: ['layout-shift'] });
            this.observers.push(clsObserver);
        }
    }
    
    monitorResources() {
        window.addEventListener('load', () => {
            const resources = performance.getEntriesByType('resource');
            
            const resourceMetrics = {
                totalResources: resources.length,
                totalSize: 0,
                slowestResource: null,
                resourceTypes: {}
            };
            
            let slowestTime = 0;
            
            resources.forEach(resource => {
                const loadTime = resource.responseEnd - resource.startTime;
                const size = resource.transferSize || 0;
                
                resourceMetrics.totalSize += size;
                
                if (loadTime > slowestTime) {
                    slowestTime = loadTime;
                    resourceMetrics.slowestResource = {
                        name: resource.name,
                        loadTime,
                        size
                    };
                }
                
                // Group by resource type
                const type = this.getResourceType(resource.name);
                if (!resourceMetrics.resourceTypes[type]) {
                    resourceMetrics.resourceTypes[type] = { count: 0, size: 0 };
                }
                resourceMetrics.resourceTypes[type].count++;
                resourceMetrics.resourceTypes[type].size += size;
            });
            
            this.metrics.resources = resourceMetrics;
            
            globalEvents.emit('trackEvent', {
                eventName: 'performance_resources',
                data: resourceMetrics
            });
        });
    }
    
    trackUserInteractions() {
        let interactionCount = 0;
        
        ['click', 'keydown', 'scroll', 'touchstart'].forEach(eventType => {
            document.addEventListener(eventType, Utils.throttle(() => {
                interactionCount++;
            }, 1000));
        });
        
        // Report interaction count every minute
        setInterval(() => {
            if (interactionCount > 0) {
                globalEvents.emit('trackEvent', {
                    eventName: 'user_interactions',
                    data: { count: interactionCount }
                });
                interactionCount = 0;
            }
        }, 60000);
    }
    
    getResourceType(url) {
        const extension = url.split('.').pop()?.toLowerCase();
        
        const types = {
            js: ['js', 'mjs'],
            css: ['css'],
            image: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'],
            font: ['woff', 'woff2', 'ttf', 'otf', 'eot'],
            video: ['mp4', 'webm', 'ogg'],
            audio: ['mp3', 'wav', 'ogg']
        };
        
        for (const [type, extensions] of Object.entries(types)) {
            if (extensions.includes(extension)) {
                return type;
            }
        }
        
        return 'other';
    }
    
    getMetrics() {
        return {
            ...this.metrics,
            memoryUsage: this.getMemoryUsage(),
            connectionType: this.getConnectionType()
        };
    }
    
    getMemoryUsage() {
        if ('memory' in performance) {
            return {
                usedJSHeapSize: performance.memory.usedJSHeapSize,
                totalJSHeapSize: performance.memory.totalJSHeapSize,
                jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
            };
        }
        return null;
    }
    
    getConnectionType() {
        if ('connection' in navigator) {
            return {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt
            };
        }
        return null;
    }
    
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
    }
}

// ===== LAZY LOADING MANAGER =====
class LazyLoadManager {
    constructor() {
        this.observer = null;
        this.images = new Set();
    }
    
    init() {
        if (!CONFIG.features.lazyLoading) return;
        
        this.setupObserver();
        this.findLazyImages();
    }
    
    setupObserver() {
        const options = {
            root: null,
            rootMargin: `${CONFIG.performance.lazyLoadOffset}px`,
            threshold: 0.1
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);
    }
    
    findLazyImages() {
        const lazyImages = document.querySelectorAll('img[data-src], img[loading="lazy"]');
        
        lazyImages.forEach(img => {
            this.images.add(img);
            this.observer.observe(img);
        });
    }
    
    loadImage(img) {
        const src = img.getAttribute('data-src');
        if (src) {
            img.src = src;
            img.removeAttribute('data-src');
        }
        
        img.classList.add('loaded');
        this.images.delete(img);
        
        // Track loading
        globalEvents.emit('trackEvent', {
            eventName: 'image_lazy_loaded',
            data: { src: img.src }
        });
    }
    
    loadAll() {
        this.images.forEach(img => {
            this.loadImage(img);
            this.observer.unobserve(img);
        });
    }
    
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.images.clear();
    }
}

// ===== TESTIMONIALS MANAGER =====
class TestimonialsManager {
    constructor() {
        this.container = null;
        this.items = [];
        this.currentIndex = 0;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000;
    }
    
    init() {
        this.container = document.querySelector('.testimonials-slider');
        if (!this.container) return;
        
        this.items = Array.from(this.container.querySelectorAll('.testimonial-item'));
        this.setupNavigation();
        this.startAutoPlay();
        this.bindEvents();
    }
    
    setupNavigation() {
        const navigation = this.container.querySelector('.testimonials-navigation');
        if (!navigation) return;
        
        const prevButton = navigation.querySelector('.testimonial-prev');
        const nextButton = navigation.querySelector('.testimonial-next');
        const dotsContainer = navigation.querySelector('.testimonials-dots');
        
        if (prevButton) {
            prevButton.addEventListener('click', () => this.previous());
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', () => this.next());
        }
        
        // Create dots
        if (dotsContainer) {
            this.items.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.className = 'dot';
                dot.addEventListener('click', () => this.goTo(index));
                dotsContainer.appendChild(dot);
            });
        }
        
        this.updateNavigation();
    }
    
    bindEvents() {
        // Pause auto-play on hover
        this.container.addEventListener('mouseenter', () => this.pauseAutoPlay());
        this.container.addEventListener('mouseleave', () => this.startAutoPlay());
        
        // Keyboard navigation
        this.container.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    this.previous();
                    break;
                case 'ArrowRight':
                    this.next();
                    break;
            }
        });
        
        // Touch/swipe support
        let startX = 0;
        let endX = 0;
        
        this.container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        this.container.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.next();
                } else {
                    this.previous();
                }
            }
        });
    }
    
    goTo(index) {
        if (index < 0 || index >= this.items.length) return;
        
        // Hide current item
        this.items[this.currentIndex].classList.remove('active');
        
        // Show new item
        this.currentIndex = index;
        this.items[this.currentIndex].classList.add('active');
        
        this.updateNavigation();
        this.restartAutoPlay();
        
        globalEvents.emit('trackEvent', {
            eventName: 'testimonial_view',
            data: { index: this.currentIndex }
        });
    }
    
    next() {
        const nextIndex = (this.currentIndex + 1) % this.items.length;
        this.goTo(nextIndex);
    }
    
    previous() {
        const prevIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
        this.goTo(prevIndex);
    }
    
    updateNavigation() {
        const dots = this.container.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    startAutoPlay() {
        if (this.autoPlayInterval) return;
        
        this.autoPlayInterval = setInterval(() => {
            this.next();
        }, this.autoPlayDelay);
    }
    
    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    restartAutoPlay() {
        this.pauseAutoPlay();
        this.startAutoPlay();
    }
    
    destroy() {
        this.pauseAutoPlay();
    }
}

// ===== FAQ MANAGER =====
class FAQManager {
    constructor() {
        this.items = [];
    }
    
    init() {
        this.items = Array.from(document.querySelectorAll('.faq-item'));
        this.bindEvents();
    }
    
    bindEvents() {
        this.items.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => this.toggleItem(item));
            }
        });
    }
    
    toggleItem(item) {
        const isActive = item.classList.contains('active');
        
        // Close all other items (accordion behavior)
        this.items.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });
        
        // Toggle current item
        item.classList.toggle('active', !isActive);
        
        globalEvents.emit('trackEvent', {
            eventName: 'faq_toggle',
            data: { 
                question: item.querySelector('.faq-question h3')?.textContent,
                opened: !isActive
            }
        });
    }
    
    openItem(index) {
        if (this.items[index]) {
            this.items[index].classList.add('active');
        }
    }
    
    closeItem(index) {
        if (this.items[index]) {
            this.items[index].classList.remove('active');
        }
    }
    
    closeAll() {
        this.items.forEach(item => item.classList.remove('active'));
    }
}

// ===== PORTFOLIO FILTER =====
class PortfolioFilter {
    constructor() {
        this.container = null;
        this.items = [];
        this.filters = [];
        this.currentFilter = 'all';
    }
    
    init() {
        this.container = document.querySelector('.portfolio');
        if (!this.container) return;
        
        this.items = Array.from(this.container.querySelectorAll('.portfolio-item'));
        this.filters = Array.from(this.container.querySelectorAll('.filter-btn'));
        
        this.bindEvents();
        this.initMasonry();
    }
    
    bindEvents() {
        this.filters.forEach(filter => {
            filter.addEventListener('click', () => {
                const category = filter.getAttribute('data-filter');
                this.filterItems(category);
                this.setActiveFilter(filter);
            });
        });
    }
    
    filterItems(category) {
        this.currentFilter = category;
        
        this.items.forEach(item => {
            const itemCategories = item.getAttribute('data-category')?.split(',') || [];
            const shouldShow = category === 'all' || itemCategories.includes(category);
            
            if (shouldShow) {
                item.style.display = 'block';
                item.classList.add('portfolio-visible');
            } else {
                item.style.display = 'none';
                item.classList.remove('portfolio-visible');
            }
        });
        
        // Re-layout masonry
        setTimeout(() => this.layoutMasonry(), 300);
        
        globalEvents.emit('trackEvent', {
            eventName: 'portfolio_filter',
            data: { category }
        });
    }
    
    setActiveFilter(activeFilter) {
        this.filters.forEach(filter => {
            filter.classList.remove('active');
        });
        activeFilter.classList.add('active');
    }
    
    initMasonry() {
        // Simple masonry layout
        this.layoutMasonry();
        window.addEventListener('resize', Utils.debounce(() => {
            this.layoutMasonry();
        }, 250));
    }
    
    layoutMasonry() {
        const grid = this.container.querySelector('.portfolio-grid');
        if (!grid) return;
        
        const items = grid.querySelectorAll('.portfolio-item:not([style*="display: none"])');
        const columns = this.getColumnCount();
        const columnHeights = new Array(columns).fill(0);
        
        items.forEach(item => {
            const shortestColumn = columnHeights.indexOf(Math.min(...columnHeights));
            
            item.style.position = 'absolute';
            item.style.left = `${(shortestColumn * 100) / columns}%`;
            item.style.top = `${columnHeights[shortestColumn]}px`;
            item.style.width = `${100 / columns}%`;
            
            columnHeights[shortestColumn] += item.offsetHeight + 20; // 20px gap
        });
        
        grid.style.height = `${Math.max(...columnHeights)}px`;
    }
    
    getColumnCount() {
        const width = window.innerWidth;
        if (width < 768) return 1;
        if (width < 1024) return 2;
        return 3;
    }
}

// ===== BACK TO TOP BUTTON =====
class BackToTopButton {
    constructor() {
        this.button = null;
        this.threshold = 300;
    }
    
    init() {
        this.createButton();
        this.bindEvents();
    }
    
    createButton() {
        this.button = document.createElement('button');
        this.button.className = 'back-to-top';
        this.button.innerHTML = '<i class="fas fa-arrow-up"></i>';
        this.button.setAttribute('aria-label', 'العودة إلى الأعلى');
        
        document.body.appendChild(this.button);
    }
    
    bindEvents() {
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            globalEvents.emit('trackEvent', {
                eventName: 'back_to_top_click',
                data: { scrollPosition: window.scrollY }
            });
        });
        
        window.addEventListener('scroll', Utils.throttle(() => {
            this.updateVisibility();
        }, 100));
    }
    
    updateVisibility() {
        const shouldShow = window.scrollY > this.threshold;
        this.button.classList.toggle('visible', shouldShow);
    }
}

// ===== MAIN APPLICATION =====
class MohamedHadouniWebsite {
    constructor() {
        this.modules = new Map();
        this.isInitialized = false;
    }
    
    async init() {
        if (this.isInitialized) return;
        
        try {
            // Initialize core modules
            await this.initializeModules();
            
            // Set up global event listeners
            this.bindGlobalEvents();
            
            // Mark as initialized
            this.isInitialized = true;
            
            console.log('Mohamed Hadouni Website initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize website:', error);
            this.handleInitializationError(error);
        }
    }
    
    async initializeModules() {
        const moduleConfigs = [
            { name: 'loader', class: LoaderManager, priority: 1 },
            { name: 'theme', class: ThemeManager, priority: 2 },
            { name: 'navigation', class: NavigationManager, priority: 3 },
            { name: 'animation', class: AnimationManager, priority: 4 },
            { name: 'form', class: FormManager, priority: 5 },
            { name: 'notification', class: NotificationManager, priority: 6 },
            { name: 'aiAssistant', class: AIAssistant, priority: 7 },
            { name: 'analytics', class: AnalyticsManager, priority: 8 },
            { name: 'performance', class: PerformanceMonitor, priority: 9 },
            { name: 'lazyLoad', class: LazyLoadManager, priority: 10 },
            { name: 'testimonials', class: TestimonialsManager, priority: 11 },
            { name: 'faq', class: FAQManager, priority: 12 },
            { name: 'portfolio', class: PortfolioFilter, priority: 13 },
            { name: 'backToTop', class: BackToTopButton, priority: 14 }
        ];
        
        // Sort by priority
        moduleConfigs.sort((a, b) => a.priority - b.priority);
        
        // Initialize modules sequentially
        for (const config of moduleConfigs) {
            try {
                const module = new config.class();
                this.modules.set(config.name, module);
                
                if (typeof module.init === 'function') {
                    await module.init();
                }
                
                console.log(`Module ${config.name} initialized`);
                
            } catch (error) {
                console.warn(`Failed to initialize module ${config.name}:`, error);
            }
        }
        
        // Initialize particle system for hero section
        const heroSection = document.querySelector('.hero');
        if (heroSection && CONFIG.features.particles) {
            const particleSystem = new ParticleSystem(heroSection);
            particleSystem.init();
            this.modules.set('particles', particleSystem);
        }
    }
    
    bindGlobalEvents() {
        // Handle loading completion
        globalEvents.on('loadingComplete', () => {
            document.body.classList.add('loaded');
            this.triggerEntranceAnimations();
        });
        
        // Handle theme changes
        globalEvents.on('themeChanged', (theme) => {
            document.body.setAttribute('data-theme', theme);
        });
        
        // Handle errors
        window.addEventListener('error', (event) => {
            this.handleError(event.error);
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(event.reason);
        });
        
        // Handle visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.handlePageHidden();
            } else {
                this.handlePageVisible();
            }
        });
        
        // Handle online/offline status
        window.addEventListener('online', () => {
            globalEvents.emit('showNotification', {
                message: 'تم استعادة الاتصال بالإنترنت',
                type: 'success'
            });
        });
        
        window.addEventListener('offline', () => {
            globalEvents.emit('showNotification', {
                message: 'انقطع الاتصال بالإنترنت',
                type: 'warning'
            });
        });
    }
    
    triggerEntranceAnimations() {
        // Trigger initial animations
        const heroElements = document.querySelectorAll('.hero [data-aos]');
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('aos-animate');
            }, index * 100);
        });
    }
    
    handlePageHidden() {
        // Pause non-essential animations and processes
        const particleSystem = this.modules.get('particles');
        if (particleSystem) {
            particleSystem.stop();
        }
        
        const testimonials = this.modules.get('testimonials');
        if (testimonials) {
            testimonials.pauseAutoPlay();
        }
    }
    
    handlePageVisible() {
        // Resume animations and processes
        const particleSystem = this.modules.get('particles');
        if (particleSystem) {
            particleSystem.start();
        }
        
        const testimonials = this.modules.get('testimonials');
        if (testimonials) {
            testimonials.startAutoPlay();
        }
    }
    
    handleError(error) {
        console.error('Application error:', error);
        
        // Track error
        globalEvents.emit('trackEvent', {
            eventName: 'javascript_error',
            data: {
                message: error.message,
                stack: error.stack,
                userAgent: navigator.userAgent
            }
        });
        
        // Show user-friendly error message
        globalEvents.emit('showNotification', {
            message: 'حدث خطأ غير متوقع. يرجى إعادة تحميل الصفحة.',
            type: 'error',
            duration: 10000
        });
    }
    
    handleInitializationError(error) {
        console.error('Initialization error:', error);
        
        // Fallback initialization
        document.body.classList.add('loaded', 'fallback-mode');
        
        // Hide loader
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.style.display = 'none';
        }
        
        // Show error message
        const errorMessage = document.createElement('div');
        errorMessage.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #f44336;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            font-family: Arial, sans-serif;
        `;
        errorMessage.textContent = 'تم تحميل الموقع في الوضع الأساسي. بعض الميزات قد لا تعمل بشكل صحيح.';
        
        document.body.appendChild(errorMessage);
        
        setTimeout(() => {
            errorMessage.remove();
        }, 10000);
    }
    
    // Public API methods
    getModule(name) {
        return this.modules.get(name);
    }
    
    getAllModules() {
        return Array.from(this.modules.entries());
    }
    
    getConfig() {
        return CONFIG;
    }
    
    getUtils() {
        return Utils;
    }
    
    // Cleanup method
    destroy() {
        this.modules.forEach(module => {
            if (typeof module.destroy === 'function') {
                module.destroy();
            }
        });
        
        this.modules.clear();
        this.isInitialized = false;
    }
}

// ===== INITIALIZATION =====
// Create global instance
window.MohamedHadouniWebsite = MohamedHadouniWebsite;
window.websiteApp = new MohamedHadouniWebsite();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.websiteApp.init();
    });
} else {
    window.websiteApp.init();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MohamedHadouniWebsite;
}

// ===== DEVELOPMENT HELPERS =====
if (process?.env?.NODE_ENV === 'development') {
    // Development-only code
    window.debugWebsite = {
        app: window.websiteApp,
        config: CONFIG,
        utils: Utils,
        events: globalEvents,
        
        // Debug methods
        showAllModules() {
            console.table(window.websiteApp.getAllModules());
        },
        
        triggerEvent(eventName, data) {
            globalEvents.emit(eventName, data);
        },
        
        getPerformanceMetrics() {
            const perfMonitor = window.websiteApp.getModule('performance');
            return perfMonitor ? perfMonitor.getMetrics() : null;
        },
        
        getAnalyticsSummary() {
            const analytics = window.websiteApp.getModule('analytics');
            return analytics ? analytics.getSummary() : null;
        }
    };
    
    console.log('Development mode enabled. Use window.debugWebsite for debugging.');
}

// ===== END OF SCRIPT =====
console.log('Mohamed Hadouni Website Script Loaded - Version 3.0 Ultra Advanced Edition');



// ===== ADDITIONAL ADVANCED FEATURES =====

// ===== ADVANCED SEARCH SYSTEM =====
class AdvancedSearchSystem {
    constructor() {
        this.searchIndex = new Map();
        this.searchResults = [];
        this.searchInput = null;
        this.searchModal = null;
        this.isIndexed = false;
    }
    
    init() {
        this.createSearchModal();
        this.bindEvents();
        this.buildSearchIndex();
    }
    
    createSearchModal() {
        this.searchModal = document.createElement('div');
        this.searchModal.className = 'search-modal';
        this.searchModal.innerHTML = `
            <div class="search-overlay"></div>
            <div class="search-container">
                <div class="search-header">
                    <input type="text" class="search-input" placeholder="ابحث في الموقع...">
                    <button class="search-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="search-results">
                    <div class="search-suggestions">
                        <h4>اقتراحات البحث:</h4>
                        <div class="suggestion-tags">
                            <span class="suggestion-tag">خدمات</span>
                            <span class="suggestion-tag">مشاريع</span>
                            <span class="suggestion-tag">تواصل</span>
                            <span class="suggestion-tag">تسيير المقاولات</span>
                        </div>
                    </div>
                    <div class="search-results-list"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.searchModal);
        this.searchInput = this.searchModal.querySelector('.search-input');
    }
    
    bindEvents() {
        // Search trigger (Ctrl+K or Cmd+K)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.openSearch();
            }
            
            if (e.key === 'Escape') {
                this.closeSearch();
            }
        });
        
        // Search input
        this.searchInput.addEventListener('input', Utils.debounce((e) => {
            this.performSearch(e.target.value);
        }, 300));
        
        // Close search
        this.searchModal.querySelector('.search-close').addEventListener('click', () => {
            this.closeSearch();
        });
        
        this.searchModal.querySelector('.search-overlay').addEventListener('click', () => {
            this.closeSearch();
        });
        
        // Suggestion tags
        this.searchModal.querySelectorAll('.suggestion-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                this.searchInput.value = tag.textContent;
                this.performSearch(tag.textContent);
            });
        });
    }
    
    buildSearchIndex() {
        const contentElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, .card-title, .service-title');
        
        contentElements.forEach((element, index) => {
            const text = element.textContent.trim();
            const words = text.toLowerCase().split(/\s+/);
            
            words.forEach(word => {
                if (word.length > 2) {
                    if (!this.searchIndex.has(word)) {
                        this.searchIndex.set(word, []);
                    }
                    
                    this.searchIndex.get(word).push({
                        element,
                        text,
                        section: this.findSection(element),
                        weight: this.calculateWeight(element),
                        index
                    });
                }
            });
        });
        
        this.isIndexed = true;
    }
    
    findSection(element) {
        const section = element.closest('section');
        return section ? section.id || section.className : 'unknown';
    }
    
    calculateWeight(element) {
        const tagWeights = {
            'H1': 10,
            'H2': 8,
            'H3': 6,
            'H4': 4,
            'H5': 3,
            'H6': 2
        };
        
        return tagWeights[element.tagName] || 1;
    }
    
    performSearch(query) {
        if (!query || query.length < 2) {
            this.showSuggestions();
            return;
        }
        
        const words = query.toLowerCase().split(/\s+/);
        const results = new Map();
        
        words.forEach(word => {
            if (this.searchIndex.has(word)) {
                this.searchIndex.get(word).forEach(item => {
                    const key = item.index;
                    if (!results.has(key)) {
                        results.set(key, { ...item, score: 0 });
                    }
                    results.get(key).score += item.weight;
                });
            }
            
            // Partial matching
            this.searchIndex.forEach((items, indexWord) => {
                if (indexWord.includes(word)) {
                    items.forEach(item => {
                        const key = item.index;
                        if (!results.has(key)) {
                            results.set(key, { ...item, score: 0 });
                        }
                        results.get(key).score += item.weight * 0.5;
                    });
                }
            });
        });
        
        this.searchResults = Array.from(results.values())
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);
        
        this.displayResults();
        
        globalEvents.emit('trackEvent', {
            eventName: 'search_performed',
            data: { query, resultsCount: this.searchResults.length }
        });
    }
    
    displayResults() {
        const resultsContainer = this.searchModal.querySelector('.search-results-list');
        
        if (this.searchResults.length === 0) {
            resultsContainer.innerHTML = '<div class="no-results">لم يتم العثور على نتائج</div>';
            return;
        }
        
        resultsContainer.innerHTML = this.searchResults.map(result => `
            <div class="search-result-item" data-section="${result.section}">
                <h4>${this.highlightQuery(result.text)}</h4>
                <p>القسم: ${this.getSectionName(result.section)}</p>
            </div>
        `).join('');
        
        // Bind click events
        resultsContainer.querySelectorAll('.search-result-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                this.navigateToResult(this.searchResults[index]);
            });
        });
    }
    
    highlightQuery(text) {
        const query = this.searchInput.value.toLowerCase();
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
    
    getSectionName(sectionId) {
        const sectionNames = {
            'hero': 'الصفحة الرئيسية',
            'about': 'من أنا',
            'services': 'خدماتي',
            'portfolio': 'أعمالي',
            'testimonials': 'آراء العملاء',
            'contact': 'تواصل معي',
            'blog': 'المدونة'
        };
        
        return sectionNames[sectionId] || 'قسم غير محدد';
    }
    
    navigateToResult(result) {
        this.closeSearch();
        
        const targetElement = result.element;
        const section = targetElement.closest('section');
        
        if (section) {
            Utils.smoothScrollTo(section, 100);
            
            // Highlight the element briefly
            targetElement.style.backgroundColor = 'rgba(102, 126, 234, 0.2)';
            setTimeout(() => {
                targetElement.style.backgroundColor = '';
            }, 2000);
        }
        
        globalEvents.emit('trackEvent', {
            eventName: 'search_result_clicked',
            data: { section: result.section, text: result.text }
        });
    }
    
    showSuggestions() {
        const resultsContainer = this.searchModal.querySelector('.search-results-list');
        resultsContainer.innerHTML = '';
        
        const suggestions = this.searchModal.querySelector('.search-suggestions');
        suggestions.style.display = 'block';
    }
    
    openSearch() {
        this.searchModal.classList.add('active');
        this.searchInput.focus();
        document.body.style.overflow = 'hidden';
        
        globalEvents.emit('trackEvent', {
            eventName: 'search_opened',
            data: {}
        });
    }
    
    closeSearch() {
        this.searchModal.classList.remove('active');
        this.searchInput.value = '';
        this.showSuggestions();
        document.body.style.overflow = '';
    }
}

// ===== ADVANCED MODAL SYSTEM =====
class AdvancedModalSystem {
    constructor() {
        this.modals = new Map();
        this.activeModal = null;
        this.modalStack = [];
    }
    
    init() {
        this.bindEvents();
        this.initExistingModals();
    }
    
    bindEvents() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.close(this.activeModal);
            }
        });
        
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-modal]')) {
                e.preventDefault();
                const modalId = e.target.getAttribute('data-modal');
                this.open(modalId);
            }
        });
    }
    
    initExistingModals() {
        const modalElements = document.querySelectorAll('.modal');
        modalElements.forEach(modal => {
            this.register(modal.id, modal);
        });
    }
    
    register(id, element) {
        this.modals.set(id, {
            element,
            isOpen: false,
            options: {}
        });
        
        // Add close button functionality
        const closeButtons = element.querySelectorAll('.modal-close, [data-modal-close]');
        closeButtons.forEach(button => {
            button.addEventListener('click', () => this.close(id));
        });
        
        // Add overlay close functionality
        const overlay = element.querySelector('.modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.close(id);
                }
            });
        }
    }
    
    create(id, content, options = {}) {
        const modal = document.createElement('div');
        modal.id = id;
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content ${options.size || 'medium'}">
                    <div class="modal-header">
                        <h3>${options.title || ''}</h3>
                        <button class="modal-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                    ${options.footer ? `<div class="modal-footer">${options.footer}</div>` : ''}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.register(id, modal);
        
        return modal;
    }
    
    open(id, data = {}) {
        const modal = this.modals.get(id);
        if (!modal) return;
        
        // Close current modal if exists
        if (this.activeModal && this.activeModal !== id) {
            this.modalStack.push(this.activeModal);
            this.close(this.activeModal, false);
        }
        
        modal.isOpen = true;
        modal.element.classList.add('active');
        this.activeModal = id;
        
        document.body.style.overflow = 'hidden';
        
        // Focus management
        const firstFocusable = modal.element.querySelector('input, button, textarea, select, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            firstFocusable.focus();
        }
        
        globalEvents.emit('modalOpened', { id, data });
        
        globalEvents.emit('trackEvent', {
            eventName: 'modal_opened',
            data: { modalId: id }
        });
    }
    
    close(id, restorePrevious = true) {
        const modal = this.modals.get(id);
        if (!modal || !modal.isOpen) return;
        
        modal.isOpen = false;
        modal.element.classList.remove('active');
        
        if (this.activeModal === id) {
            this.activeModal = null;
            
            // Restore previous modal if exists
            if (restorePrevious && this.modalStack.length > 0) {
                const previousModal = this.modalStack.pop();
                this.open(previousModal);
            } else {
                document.body.style.overflow = '';
            }
        }
        
        globalEvents.emit('modalClosed', { id });
        
        globalEvents.emit('trackEvent', {
            eventName: 'modal_closed',
            data: { modalId: id }
        });
    }
    
    closeAll() {
        this.modals.forEach((modal, id) => {
            if (modal.isOpen) {
                this.close(id, false);
            }
        });
        
        this.modalStack = [];
        document.body.style.overflow = '';
    }
    
    isOpen(id) {
        const modal = this.modals.get(id);
        return modal ? modal.isOpen : false;
    }
    
    destroy(id) {
        const modal = this.modals.get(id);
        if (modal) {
            if (modal.isOpen) {
                this.close(id);
            }
            modal.element.remove();
            this.modals.delete(id);
        }
    }
}

// ===== ADVANCED TOOLTIP SYSTEM =====
class AdvancedTooltipSystem {
    constructor() {
        this.tooltips = new Map();
        this.activeTooltip = null;
    }
    
    init() {
        this.bindEvents();
        this.initExistingTooltips();
    }
    
    bindEvents() {
        document.addEventListener('mouseenter', (e) => {
            const element = e.target.closest('[data-tooltip]');
            if (element) {
                this.show(element);
            }
        }, true);
        
        document.addEventListener('mouseleave', (e) => {
            const element = e.target.closest('[data-tooltip]');
            if (element) {
                this.hide(element);
            }
        }, true);
        
        document.addEventListener('focus', (e) => {
            const element = e.target.closest('[data-tooltip]');
            if (element) {
                this.show(element);
            }
        }, true);
        
        document.addEventListener('blur', (e) => {
            const element = e.target.closest('[data-tooltip]');
            if (element) {
                this.hide(element);
            }
        }, true);
    }
    
    initExistingTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        tooltipElements.forEach(element => {
            this.register(element);
        });
    }
    
    register(element) {
        const id = Utils.generateId('tooltip');
        const text = element.getAttribute('data-tooltip');
        const position = element.getAttribute('data-tooltip-position') || 'top';
        const delay = parseInt(element.getAttribute('data-tooltip-delay')) || 500;
        
        this.tooltips.set(element, {
            id,
            text,
            position,
            delay,
            element: null,
            timeout: null
        });
    }
    
    show(element) {
        const tooltip = this.tooltips.get(element);
        if (!tooltip) return;
        
        // Clear any existing timeout
        if (tooltip.timeout) {
            clearTimeout(tooltip.timeout);
        }
        
        tooltip.timeout = setTimeout(() => {
            this.createTooltip(element, tooltip);
        }, tooltip.delay);
    }
    
    hide(element) {
        const tooltip = this.tooltips.get(element);
        if (!tooltip) return;
        
        // Clear timeout
        if (tooltip.timeout) {
            clearTimeout(tooltip.timeout);
            tooltip.timeout = null;
        }
        
        // Remove tooltip element
        if (tooltip.element) {
            tooltip.element.remove();
            tooltip.element = null;
        }
        
        if (this.activeTooltip === tooltip) {
            this.activeTooltip = null;
        }
    }
    
    createTooltip(element, tooltip) {
        // Remove existing tooltip
        if (tooltip.element) {
            tooltip.element.remove();
        }
        
        const tooltipElement = document.createElement('div');
        tooltipElement.className = `tooltip tooltip-${tooltip.position}`;
        tooltipElement.textContent = tooltip.text;
        
        document.body.appendChild(tooltipElement);
        tooltip.element = tooltipElement;
        this.activeTooltip = tooltip;
        
        // Position tooltip
        this.positionTooltip(element, tooltipElement, tooltip.position);
        
        // Animate in
        requestAnimationFrame(() => {
            tooltipElement.classList.add('visible');
        });
    }
    
    positionTooltip(element, tooltipElement, position) {
        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltipElement.getBoundingClientRect();
        
        let top, left;
        
        switch (position) {
            case 'top':
                top = rect.top - tooltipRect.height - 10;
                left = rect.left + (rect.width - tooltipRect.width) / 2;
                break;
            case 'bottom':
                top = rect.bottom + 10;
                left = rect.left + (rect.width - tooltipRect.width) / 2;
                break;
            case 'left':
                top = rect.top + (rect.height - tooltipRect.height) / 2;
                left = rect.left - tooltipRect.width - 10;
                break;
            case 'right':
                top = rect.top + (rect.height - tooltipRect.height) / 2;
                left = rect.right + 10;
                break;
            default:
                top = rect.top - tooltipRect.height - 10;
                left = rect.left + (rect.width - tooltipRect.width) / 2;
        }
        
        // Keep tooltip in viewport
        top = Math.max(10, Math.min(top, window.innerHeight - tooltipRect.height - 10));
        left = Math.max(10, Math.min(left, window.innerWidth - tooltipRect.width - 10));
        
        tooltipElement.style.top = `${top + window.scrollY}px`;
        tooltipElement.style.left = `${left + window.scrollX}px`;
    }
    
    hideAll() {
        this.tooltips.forEach((tooltip, element) => {
            this.hide(element);
        });
    }
}

// ===== ADVANCED KEYBOARD SHORTCUTS =====
class KeyboardShortcutManager {
    constructor() {
        this.shortcuts = new Map();
        this.isEnabled = true;
    }
    
    init() {
        this.registerDefaultShortcuts();
        this.bindEvents();
    }
    
    registerDefaultShortcuts() {
        // Navigation shortcuts
        this.register('ctrl+1', () => this.scrollToSection('hero'));
        this.register('ctrl+2', () => this.scrollToSection('about'));
        this.register('ctrl+3', () => this.scrollToSection('services'));
        this.register('ctrl+4', () => this.scrollToSection('portfolio'));
        this.register('ctrl+5', () => this.scrollToSection('contact'));
        
        // Utility shortcuts
        this.register('ctrl+k', () => globalEvents.emit('openSearch'));
        this.register('ctrl+/', () => this.showShortcutsHelp());
        this.register('ctrl+shift+d', () => this.toggleDarkMode());
        this.register('ctrl+shift+l', () => this.toggleLanguage());
        
        // Accessibility shortcuts
        this.register('alt+1', () => this.focusMainContent());
        this.register('alt+2', () => this.focusNavigation());
        this.register('alt+3', () => this.skipToFooter());
        
        // Developer shortcuts (only in development)
        if (process?.env?.NODE_ENV === 'development') {
            this.register('ctrl+shift+i', () => this.showDebugInfo());
            this.register('ctrl+shift+p', () => this.showPerformanceMetrics());
        }
    }
    
    bindEvents() {
        document.addEventListener('keydown', (e) => {
            if (!this.isEnabled) return;
            
            const shortcut = this.getShortcutString(e);
            const handler = this.shortcuts.get(shortcut);
            
            if (handler) {
                e.preventDefault();
                handler(e);
                
                globalEvents.emit('trackEvent', {
                    eventName: 'keyboard_shortcut_used',
                    data: { shortcut }
                });
            }
        });
    }
    
    register(shortcut, handler, description = '') {
        this.shortcuts.set(shortcut.toLowerCase(), {
            handler,
            description,
            shortcut
        });
    }
    
    unregister(shortcut) {
        this.shortcuts.delete(shortcut.toLowerCase());
    }
    
    getShortcutString(event) {
        const parts = [];
        
        if (event.ctrlKey) parts.push('ctrl');
        if (event.altKey) parts.push('alt');
        if (event.shiftKey) parts.push('shift');
        if (event.metaKey) parts.push('meta');
        
        const key = event.key.toLowerCase();
        if (key !== 'control' && key !== 'alt' && key !== 'shift' && key !== 'meta') {
            parts.push(key);
        }
        
        return parts.join('+');
    }
    
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            Utils.smoothScrollTo(section, 100);
        }
    }
    
    showShortcutsHelp() {
        const shortcuts = Array.from(this.shortcuts.entries())
            .filter(([, data]) => data.description)
            .map(([shortcut, data]) => `
                <div class="shortcut-item">
                    <kbd>${shortcut}</kbd>
                    <span>${data.description}</span>
                </div>
            `).join('');
        
        const modalSystem = window.websiteApp.getModule('modal');
        if (modalSystem) {
            modalSystem.create('shortcuts-help', `
                <div class="shortcuts-help">
                    <h3>اختصارات لوحة المفاتيح</h3>
                    ${shortcuts}
                </div>
            `, { title: 'اختصارات لوحة المفاتيح' });
            
            modalSystem.open('shortcuts-help');
        }
    }
    
    toggleDarkMode() {
        const themeManager = window.websiteApp.getModule('theme');
        if (themeManager) {
            themeManager.toggleTheme();
        }
    }
    
    toggleLanguage() {
        // Language toggle functionality
        globalEvents.emit('showNotification', {
            message: 'تبديل اللغة غير متاح حالياً',
            type: 'info'
        });
    }
    
    focusMainContent() {
        const mainContent = document.querySelector('main, #main, .main-content');
        if (mainContent) {
            mainContent.focus();
        }
    }
    
    focusNavigation() {
        const navigation = document.querySelector('nav, .navbar, .navigation');
        if (navigation) {
            const firstLink = navigation.querySelector('a, button');
            if (firstLink) {
                firstLink.focus();
            }
        }
    }
    
    skipToFooter() {
        const footer = document.querySelector('footer');
        if (footer) {
            footer.focus();
            Utils.smoothScrollTo(footer);
        }
    }
    
    showDebugInfo() {
        console.log('Debug Info:', window.debugWebsite);
    }
    
    showPerformanceMetrics() {
        const perfMonitor = window.websiteApp.getModule('performance');
        if (perfMonitor) {
            console.log('Performance Metrics:', perfMonitor.getMetrics());
        }
    }
    
    enable() {
        this.isEnabled = true;
    }
    
    disable() {
        this.isEnabled = false;
    }
    
    getShortcuts() {
        return Array.from(this.shortcuts.entries());
    }
}

// ===== ADVANCED ACCESSIBILITY MANAGER =====
class AccessibilityManager {
    constructor() {
        this.isHighContrast = false;
        this.isLargeText = false;
        this.isReducedMotion = false;
        this.focusVisible = true;
    }
    
    init() {
        this.detectPreferences();
        this.setupAccessibilityFeatures();
        this.bindEvents();
        this.createAccessibilityPanel();
    }
    
    detectPreferences() {
        // Detect user preferences
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.isHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
        
        // Apply initial settings
        if (this.isReducedMotion) {
            document.body.classList.add('reduce-motion');
        }
        
        if (this.isHighContrast) {
            document.body.classList.add('high-contrast');
        }
    }
    
    setupAccessibilityFeatures() {
        // Skip links
        this.createSkipLinks();
        
        // Focus management
        this.setupFocusManagement();
        
        // ARIA live regions
        this.createLiveRegions();
        
        // Keyboard navigation
        this.enhanceKeyboardNavigation();
    }
    
    createSkipLinks() {
        const skipLinks = document.createElement('div');
        skipLinks.className = 'skip-links';
        skipLinks.innerHTML = `
            <a href="#main-content" class="skip-link">تخطي إلى المحتوى الرئيسي</a>
            <a href="#navigation" class="skip-link">تخطي إلى التنقل</a>
            <a href="#footer" class="skip-link">تخطي إلى التذييل</a>
        `;
        
        document.body.insertBefore(skipLinks, document.body.firstChild);
    }
    
    setupFocusManagement() {
        // Focus visible polyfill
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
        
        // Focus trap for modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const activeModal = document.querySelector('.modal.active');
                if (activeModal) {
                    this.trapFocus(e, activeModal);
                }
            }
        });
    }
    
    trapFocus(event, container) {
        const focusableElements = container.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    }
    
    createLiveRegions() {
        // Polite live region for non-urgent updates
        const politeRegion = document.createElement('div');
        politeRegion.setAttribute('aria-live', 'polite');
        politeRegion.setAttribute('aria-atomic', 'true');
        politeRegion.className = 'sr-only';
        politeRegion.id = 'live-region-polite';
        document.body.appendChild(politeRegion);
        
        // Assertive live region for urgent updates
        const assertiveRegion = document.createElement('div');
        assertiveRegion.setAttribute('aria-live', 'assertive');
        assertiveRegion.setAttribute('aria-atomic', 'true');
        assertiveRegion.className = 'sr-only';
        assertiveRegion.id = 'live-region-assertive';
        document.body.appendChild(assertiveRegion);
    }
    
    enhanceKeyboardNavigation() {
        // Add keyboard support to custom interactive elements
        document.querySelectorAll('[role="button"]:not(button)').forEach(element => {
            element.setAttribute('tabindex', '0');
            
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    element.click();
                }
            });
        });
        
        // Enhance dropdown menus
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            this.enhanceDropdown(dropdown);
        });
    }
    
    enhanceDropdown(dropdown) {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        const menu = dropdown.querySelector('.dropdown-menu');
        const items = menu.querySelectorAll('a, button');
        
        if (!trigger || !menu) return;
        
        trigger.setAttribute('aria-haspopup', 'true');
        trigger.setAttribute('aria-expanded', 'false');
        menu.setAttribute('role', 'menu');
        
        items.forEach(item => {
            item.setAttribute('role', 'menuitem');
        });
        
        trigger.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    this.openDropdown(dropdown);
                    items[0]?.focus();
                    break;
                case 'Escape':
                    this.closeDropdown(dropdown);
                    break;
            }
        });
        
        items.forEach((item, index) => {
            item.addEventListener('keydown', (e) => {
                switch (e.key) {
                    case 'ArrowDown':
                        e.preventDefault();
                        items[(index + 1) % items.length].focus();
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        items[(index - 1 + items.length) % items.length].focus();
                        break;
                    case 'Escape':
                        e.preventDefault();
                        this.closeDropdown(dropdown);
                        trigger.focus();
                        break;
                }
            });
        });
    }
    
    createAccessibilityPanel() {
        const panel = document.createElement('div');
        panel.className = 'accessibility-panel';
        panel.innerHTML = `
            <button class="accessibility-toggle" aria-label="فتح لوحة إمكانية الوصول">
                <i class="fas fa-universal-access"></i>
            </button>
            <div class="accessibility-options">
                <h3>خيارات إمكانية الوصول</h3>
                <div class="accessibility-controls">
                    <button class="accessibility-btn" data-action="toggle-contrast">
                        <i class="fas fa-adjust"></i>
                        تباين عالي
                    </button>
                    <button class="accessibility-btn" data-action="toggle-large-text">
                        <i class="fas fa-font"></i>
                        نص كبير
                    </button>
                    <button class="accessibility-btn" data-action="toggle-motion">
                        <i class="fas fa-pause"></i>
                        تقليل الحركة
                    </button>
                    <button class="accessibility-btn" data-action="focus-outline">
                        <i class="fas fa-eye"></i>
                        إظهار التركيز
                    </button>
                    <button class="accessibility-btn" data-action="reset">
                        <i class="fas fa-undo"></i>
                        إعادة تعيين
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
        this.bindPanelEvents(panel);
    }
    
    bindPanelEvents(panel) {
        const toggle = panel.querySelector('.accessibility-toggle');
        const options = panel.querySelector('.accessibility-options');
        const buttons = panel.querySelectorAll('.accessibility-btn');
        
        toggle.addEventListener('click', () => {
            const isOpen = panel.classList.contains('open');
            panel.classList.toggle('open', !isOpen);
            toggle.setAttribute('aria-expanded', !isOpen);
        });
        
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const action = button.getAttribute('data-action');
                this.handleAccessibilityAction(action, button);
            });
        });
        
        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            if (!panel.contains(e.target)) {
                panel.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    handleAccessibilityAction(action, button) {
        switch (action) {
            case 'toggle-contrast':
                this.toggleHighContrast();
                button.classList.toggle('active', this.isHighContrast);
                break;
            case 'toggle-large-text':
                this.toggleLargeText();
                button.classList.toggle('active', this.isLargeText);
                break;
            case 'toggle-motion':
                this.toggleReducedMotion();
                button.classList.toggle('active', this.isReducedMotion);
                break;
            case 'focus-outline':
                this.toggleFocusVisible();
                button.classList.toggle('active', this.focusVisible);
                break;
            case 'reset':
                this.resetAccessibilitySettings();
                break;
        }
        
        globalEvents.emit('trackEvent', {
            eventName: 'accessibility_action',
            data: { action }
        });
    }
    
    toggleHighContrast() {
        this.isHighContrast = !this.isHighContrast;
        document.body.classList.toggle('high-contrast', this.isHighContrast);
        
        this.announceChange(this.isHighContrast ? 'تم تفعيل التباين العالي' : 'تم إلغاء التباين العالي');
    }
    
    toggleLargeText() {
        this.isLargeText = !this.isLargeText;
        document.body.classList.toggle('large-text', this.isLargeText);
        
        this.announceChange(this.isLargeText ? 'تم تفعيل النص الكبير' : 'تم إلغاء النص الكبير');
    }
    
    toggleReducedMotion() {
        this.isReducedMotion = !this.isReducedMotion;
        document.body.classList.toggle('reduce-motion', this.isReducedMotion);
        
        this.announceChange(this.isReducedMotion ? 'تم تقليل الحركة' : 'تم إلغاء تقليل الحركة');
    }
    
    toggleFocusVisible() {
        this.focusVisible = !this.focusVisible;
        document.body.classList.toggle('focus-visible', this.focusVisible);
        
        this.announceChange(this.focusVisible ? 'تم إظهار مؤشر التركيز' : 'تم إخفاء مؤشر التركيز');
    }
    
    resetAccessibilitySettings() {
        this.isHighContrast = false;
        this.isLargeText = false;
        this.isReducedMotion = false;
        this.focusVisible = true;
        
        document.body.classList.remove('high-contrast', 'large-text', 'reduce-motion');
        document.body.classList.add('focus-visible');
        
        // Reset button states
        document.querySelectorAll('.accessibility-btn').forEach(button => {
            button.classList.remove('active');
        });
        
        this.announceChange('تم إعادة تعيين جميع إعدادات إمكانية الوصول');
    }
    
    announceChange(message) {
        const liveRegion = document.getElementById('live-region-polite');
        if (liveRegion) {
            liveRegion.textContent = message;
            
            // Clear after announcement
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }
    
    openDropdown(dropdown) {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        dropdown.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
        menu.style.display = 'block';
    }
    
    closeDropdown(dropdown) {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        dropdown.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
        menu.style.display = 'none';
    }
}

// ===== ADVANCED COOKIE MANAGER =====
class CookieManager {
    constructor() {
        this.consent = {
            necessary: true,
            analytics: false,
            marketing: false,
            preferences: false
        };
        this.banner = null;
        this.isConsentGiven = false;
    }
    
    init() {
        this.loadConsent();
        this.createConsentBanner();
        this.bindEvents();
    }
    
    loadConsent() {
        const savedConsent = Utils.storage.get('cookie-consent');
        if (savedConsent) {
            this.consent = { ...this.consent, ...savedConsent };
            this.isConsentGiven = true;
            this.applyConsent();
        }
    }
    
    createConsentBanner() {
        if (this.isConsentGiven) return;
        
        this.banner = document.createElement('div');
        this.banner.className = 'cookie-banner';
        this.banner.innerHTML = `
            <div class="cookie-content">
                <div class="cookie-text">
                    <h4>نحن نستخدم ملفات تعريف الارتباط</h4>
                    <p>نستخدم ملفات تعريف الارتباط لتحسين تجربتك وتحليل استخدام الموقع. يمكنك اختيار أنواع ملفات تعريف الارتباط التي تريد السماح بها.</p>
                </div>
                <div class="cookie-actions">
                    <button class="btn btn-primary" data-action="accept-all">قبول الكل</button>
                    <button class="btn btn-secondary" data-action="customize">تخصيص</button>
                    <button class="btn btn-outline" data-action="reject">رفض</button>
                </div>
            </div>
            <div class="cookie-settings" style="display: none;">
                <h4>إعدادات ملفات تعريف الارتباط</h4>
                <div class="cookie-categories">
                    <div class="cookie-category">
                        <label class="cookie-toggle">
                            <input type="checkbox" checked disabled>
                            <span class="toggle-slider"></span>
                            <div class="category-info">
                                <strong>ضرورية</strong>
                                <p>مطلوبة لعمل الموقع بشكل صحيح</p>
                            </div>
                        </label>
                    </div>
                    <div class="cookie-category">
                        <label class="cookie-toggle">
                            <input type="checkbox" data-category="analytics">
                            <span class="toggle-slider"></span>
                            <div class="category-info">
                                <strong>تحليلية</strong>
                                <p>تساعدنا في فهم كيفية استخدام الموقع</p>
                            </div>
                        </label>
                    </div>
                    <div class="cookie-category">
                        <label class="cookie-toggle">
                            <input type="checkbox" data-category="marketing">
                            <span class="toggle-slider"></span>
                            <div class="category-info">
                                <strong>تسويقية</strong>
                                <p>تستخدم لعرض إعلانات مخصصة</p>
                            </div>
                        </label>
                    </div>
                    <div class="cookie-category">
                        <label class="cookie-toggle">
                            <input type="checkbox" data-category="preferences">
                            <span class="toggle-slider"></span>
                            <div class="category-info">
                                <strong>تفضيلات</strong>
                                <p>تحفظ إعداداتك وتفضيلاتك</p>
                            </div>
                        </label>
                    </div>
                </div>
                <div class="cookie-actions">
                    <button class="btn btn-primary" data-action="save-preferences">حفظ التفضيلات</button>
                    <button class="btn btn-outline" data-action="back">رجوع</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.banner);
    }
    
    bindEvents() {
        if (!this.banner) return;
        
        this.banner.addEventListener('click', (e) => {
            const action = e.target.getAttribute('data-action');
            if (action) {
                this.handleAction(action);
            }
        });
    }
    
    handleAction(action) {
        switch (action) {
            case 'accept-all':
                this.acceptAll();
                break;
            case 'reject':
                this.rejectAll();
                break;
            case 'customize':
                this.showCustomization();
                break;
            case 'save-preferences':
                this.savePreferences();
                break;
            case 'back':
                this.hideCustomization();
                break;
        }
    }
    
    acceptAll() {
        this.consent = {
            necessary: true,
            analytics: true,
            marketing: true,
            preferences: true
        };
        
        this.saveConsent();
        this.hideBanner();
        this.applyConsent();
        
        globalEvents.emit('trackEvent', {
            eventName: 'cookie_consent',
            data: { action: 'accept_all' }
        });
    }
    
    rejectAll() {
        this.consent = {
            necessary: true,
            analytics: false,
            marketing: false,
            preferences: false
        };
        
        this.saveConsent();
        this.hideBanner();
        this.applyConsent();
        
        globalEvents.emit('trackEvent', {
            eventName: 'cookie_consent',
            data: { action: 'reject_all' }
        });
    }
    
    showCustomization() {
        const content = this.banner.querySelector('.cookie-content');
        const settings = this.banner.querySelector('.cookie-settings');
        
        content.style.display = 'none';
        settings.style.display = 'block';
        
        // Set current preferences
        Object.keys(this.consent).forEach(category => {
            const checkbox = settings.querySelector(`[data-category="${category}"]`);
            if (checkbox) {
                checkbox.checked = this.consent[category];
            }
        });
    }
    
    hideCustomization() {
        const content = this.banner.querySelector('.cookie-content');
        const settings = this.banner.querySelector('.cookie-settings');
        
        content.style.display = 'block';
        settings.style.display = 'none';
    }
    
    savePreferences() {
        const settings = this.banner.querySelector('.cookie-settings');
        
        Object.keys(this.consent).forEach(category => {
            const checkbox = settings.querySelector(`[data-category="${category}"]`);
            if (checkbox) {
                this.consent[category] = checkbox.checked;
            }
        });
        
        this.saveConsent();
        this.hideBanner();
        this.applyConsent();
        
        globalEvents.emit('trackEvent', {
            eventName: 'cookie_consent',
            data: { action: 'save_preferences', consent: this.consent }
        });
    }
    
    saveConsent() {
        Utils.storage.set('cookie-consent', this.consent);
        this.isConsentGiven = true;
    }
    
    hideBanner() {
        if (this.banner) {
            this.banner.style.display = 'none';
        }
    }
    
    applyConsent() {
        // Apply consent settings
        if (this.consent.analytics) {
            this.enableAnalytics();
        } else {
            this.disableAnalytics();
        }
        
        if (this.consent.marketing) {
            this.enableMarketing();
        } else {
            this.disableMarketing();
        }
        
        if (this.consent.preferences) {
            this.enablePreferences();
        } else {
            this.disablePreferences();
        }
    }
    
    enableAnalytics() {
        // Enable analytics tracking
        CONFIG.features.analytics = true;
        console.log('Analytics enabled');
    }
    
    disableAnalytics() {
        // Disable analytics tracking
        CONFIG.features.analytics = false;
        console.log('Analytics disabled');
    }
    
    enableMarketing() {
        // Enable marketing cookies
        console.log('Marketing cookies enabled');
    }
    
    disableMarketing() {
        // Disable marketing cookies
        console.log('Marketing cookies disabled');
    }
    
    enablePreferences() {
        // Enable preferences cookies
        console.log('Preferences cookies enabled');
    }
    
    disablePreferences() {
        // Disable preferences cookies
        console.log('Preferences cookies disabled');
    }
    
    getConsent() {
        return this.consent;
    }
    
    hasConsent(category) {
        return this.consent[category] || false;
    }
    
    updateConsent(category, value) {
        this.consent[category] = value;
        this.saveConsent();
        this.applyConsent();
    }
}

// ===== ADVANCED ERROR HANDLER =====
class ErrorHandler {
    constructor() {
        this.errors = [];
        this.maxErrors = 50;
        this.isEnabled = true;
    }
    
    init() {
        this.bindErrorEvents();
        this.setupErrorReporting();
    }
    
    bindErrorEvents() {
        // JavaScript errors
        window.addEventListener('error', (event) => {
            this.handleError({
                type: 'javascript',
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error,
                timestamp: Date.now()
            });
        });
        
        // Promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError({
                type: 'promise',
                message: event.reason?.message || 'Unhandled promise rejection',
                reason: event.reason,
                timestamp: Date.now()
            });
        });
        
        // Resource loading errors
        document.addEventListener('error', (event) => {
            if (event.target !== window) {
                this.handleError({
                    type: 'resource',
                    message: `Failed to load ${event.target.tagName}: ${event.target.src || event.target.href}`,
                    element: event.target.tagName,
                    source: event.target.src || event.target.href,
                    timestamp: Date.now()
                });
            }
        }, true);
    }
    
    setupErrorReporting() {
        // Report errors periodically
        setInterval(() => {
            if (this.errors.length > 0) {
                this.reportErrors();
            }
        }, 30000); // Every 30 seconds
        
        // Report errors before page unload
        window.addEventListener('beforeunload', () => {
            if (this.errors.length > 0) {
                this.reportErrors(true);
            }
        });
    }
    
    handleError(errorInfo) {
        if (!this.isEnabled) return;
        
        // Add to errors array
        this.errors.push(errorInfo);
        
        // Limit array size
        if (this.errors.length > this.maxErrors) {
            this.errors.shift();
        }
        
        // Log to console in development
        if (process?.env?.NODE_ENV === 'development') {
            console.error('Error captured:', errorInfo);
        }
        
        // Show user notification for critical errors
        if (this.isCriticalError(errorInfo)) {
            this.showErrorNotification(errorInfo);
        }
        
        // Track error
        globalEvents.emit('trackEvent', {
            eventName: 'error_occurred',
            data: {
                type: errorInfo.type,
                message: errorInfo.message,
                filename: errorInfo.filename,
                userAgent: navigator.userAgent
            }
        });
    }
    
    isCriticalError(errorInfo) {
        const criticalPatterns = [
            /network/i,
            /fetch/i,
            /cors/i,
            /security/i,
            /permission/i
        ];
        
        return criticalPatterns.some(pattern => 
            pattern.test(errorInfo.message)
        );
    }
    
    showErrorNotification(errorInfo) {
        let message = 'حدث خطأ غير متوقع.';
        
        if (errorInfo.type === 'resource') {
            message = 'فشل في تحميل بعض الموارد. قد تتأثر بعض الميزات.';
        } else if (errorInfo.type === 'network') {
            message = 'مشكلة في الاتصال بالشبكة. يرجى التحقق من اتصالك بالإنترنت.';
        }
        
        globalEvents.emit('showNotification', {
            message,
            type: 'error',
            duration: 8000
        });
    }
    
    async reportErrors(isBeforeUnload = false) {
        if (this.errors.length === 0) return;
        
        const errorReport = {
            errors: [...this.errors],
            userAgent: navigator.userAgent,
            url: window.location.href,
            timestamp: Date.now(),
            sessionId: window.websiteApp?.getModule('analytics')?.sessionId
        };
        
        try {
            if (isBeforeUnload) {
                // Use sendBeacon for reliable delivery
                navigator.sendBeacon('/api/errors', JSON.stringify(errorReport));
            } else {
                // Use fetch for regular reporting
                await fetch('/api/errors', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(errorReport)
                });
            }
            
            // Clear reported errors
            this.errors = [];
            
        } catch (error) {
            console.warn('Failed to report errors:', error);
        }
    }
    
    getErrors() {
        return [...this.errors];
    }
    
    clearErrors() {
        this.errors = [];
    }
    
    enable() {
        this.isEnabled = true;
    }
    
    disable() {
        this.isEnabled = false;
    }
}

// ===== ADVANCED CACHE MANAGER =====
class CacheManager {
    constructor() {
        this.cache = new Map();
        this.maxSize = 100;
        this.defaultTTL = 5 * 60 * 1000; // 5 minutes
    }
    
    init() {
        this.setupPeriodicCleanup();
        this.bindEvents();
    }
    
    set(key, value, ttl = this.defaultTTL) {
        // Remove oldest entries if cache is full
        if (this.cache.size >= this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        
        const expiresAt = Date.now() + ttl;
        this.cache.set(key, {
            value,
            expiresAt,
            accessCount: 0,
            lastAccessed: Date.now()
        });
    }
    
    get(key) {
        const item = this.cache.get(key);
        
        if (!item) {
            return null;
        }
        
        // Check if expired
        if (Date.now() > item.expiresAt) {
            this.cache.delete(key);
            return null;
        }
        
        // Update access statistics
        item.accessCount++;
        item.lastAccessed = Date.now();
        
        return item.value;
    }
    
    has(key) {
        const item = this.cache.get(key);
        
        if (!item) {
            return false;
        }
        
        // Check if expired
        if (Date.now() > item.expiresAt) {
            this.cache.delete(key);
            return false;
        }
        
        return true;
    }
    
    delete(key) {
        return this.cache.delete(key);
    }
    
    clear() {
        this.cache.clear();
    }
    
    setupPeriodicCleanup() {
        // Clean expired entries every minute
        setInterval(() => {
            this.cleanup();
        }, 60000);
    }
    
    cleanup() {
        const now = Date.now();
        const keysToDelete = [];
        
        this.cache.forEach((item, key) => {
            if (now > item.expiresAt) {
                keysToDelete.push(key);
            }
        });
        
        keysToDelete.forEach(key => {
            this.cache.delete(key);
        });
        
        if (keysToDelete.length > 0) {
            console.log(`Cache cleanup: removed ${keysToDelete.length} expired entries`);
        }
    }
    
    bindEvents() {
        // Clear cache on page visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.cleanup();
            }
        });
        
        // Clear cache on memory pressure
        if ('memory' in performance) {
            setInterval(() => {
                const memoryInfo = performance.memory;
                const usageRatio = memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit;
                
                if (usageRatio > 0.8) {
                    this.clear();
                    console.log('Cache cleared due to memory pressure');
                }
            }, 30000);
        }
    }
    
    getStats() {
        const stats = {
            size: this.cache.size,
            maxSize: this.maxSize,
            entries: []
        };
        
        this.cache.forEach((item, key) => {
            stats.entries.push({
                key,
                accessCount: item.accessCount,
                lastAccessed: item.lastAccessed,
                expiresAt: item.expiresAt,
                isExpired: Date.now() > item.expiresAt
            });
        });
        
        return stats;
    }
    
    // Cache decorator for functions
    memoize(fn, keyGenerator = (...args) => JSON.stringify(args), ttl = this.defaultTTL) {
        return (...args) => {
            const key = `memoize:${fn.name}:${keyGenerator(...args)}`;
            
            if (this.has(key)) {
                return this.get(key);
            }
            
            const result = fn(...args);
            this.set(key, result, ttl);
            
            return result;
        };
    }
}

// ===== REGISTER ADDITIONAL MODULES =====
// Add the new modules to the main application
if (window.websiteApp) {
    const additionalModules = [
        { name: 'search', class: AdvancedSearchSystem, priority: 15 },
        { name: 'modal', class: AdvancedModalSystem, priority: 16 },
        { name: 'tooltip', class: AdvancedTooltipSystem, priority: 17 },
        { name: 'keyboard', class: KeyboardShortcutManager, priority: 18 },
        { name: 'accessibility', class: AccessibilityManager, priority: 19 },
        { name: 'cookies', class: CookieManager, priority: 20 },
        { name: 'errorHandler', class: ErrorHandler, priority: 21 },
        { name: 'cache', class: CacheManager, priority: 22 }
    ];
    
    // Extend the initialization method
    const originalInitializeModules = window.websiteApp.initializeModules;
    window.websiteApp.initializeModules = async function() {
        await originalInitializeModules.call(this);
        
        // Initialize additional modules
        for (const config of additionalModules) {
            try {
                const module = new config.class();
                this.modules.set(config.name, module);
                
                if (typeof module.init === 'function') {
                    await module.init();
                }
                
                console.log(`Additional module ${config.name} initialized`);
                
            } catch (error) {
                console.warn(`Failed to initialize additional module ${config.name}:`, error);
            }
        }
    };
}

// ===== ADDITIONAL UTILITY FUNCTIONS =====
Utils.extend = function(target, ...sources) {
    sources.forEach(source => {
        Object.keys(source).forEach(key => {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                target[key] = target[key] || {};
                Utils.extend(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        });
    });
    return target;
};

Utils.deepClone = function(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => Utils.deepClone(item));
    if (typeof obj === 'object') {
        const cloned = {};
        Object.keys(obj).forEach(key => {
            cloned[key] = Utils.deepClone(obj[key]);
        });
        return cloned;
    }
};

Utils.createUUID = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

Utils.sanitizeHTML = function(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
};

Utils.formatFileSize = function(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

Utils.getColorLuminance = function(hex) {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >>  8) & 0xff;
    const b = (rgb >>  0) & 0xff;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

Utils.isColorDark = function(hex) {
    return Utils.getColorLuminance(hex) < 128;
};

Utils.getContrastColor = function(hex) {
    return Utils.isColorDark(hex) ? '#ffffff' : '#000000';
};

Utils.interpolateColor = function(color1, color2, factor) {
    const rgb1 = parseInt(color1.slice(1), 16);
    const rgb2 = parseInt(color2.slice(1), 16);
    
    const r1 = (rgb1 >> 16) & 0xff;
    const g1 = (rgb1 >>  8) & 0xff;
    const b1 = (rgb1 >>  0) & 0xff;
    
    const r2 = (rgb2 >> 16) & 0xff;
    const g2 = (rgb2 >>  8) & 0xff;
    const b2 = (rgb2 >>  0) & 0xff;
    
    const r = Math.round(r1 + factor * (r2 - r1));
    const g = Math.round(g1 + factor * (g2 - g1));
    const b = Math.round(b1 + factor * (b2 - b1));
    
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

// ===== FINAL INITIALIZATION =====
console.log('Advanced JavaScript modules loaded successfully - Total size: 150KB+');

// Export additional classes for external use
if (typeof window !== 'undefined') {
    window.AdvancedSearchSystem = AdvancedSearchSystem;
    window.AdvancedModalSystem = AdvancedModalSystem;
    window.AdvancedTooltipSystem = AdvancedTooltipSystem;
    window.KeyboardShortcutManager = KeyboardShortcutManager;
    window.AccessibilityManager = AccessibilityManager;
    window.CookieManager = CookieManager;
    window.ErrorHandler = ErrorHandler;
    window.CacheManager = CacheManager;
}

// ===== END OF ADDITIONAL FEATURES =====

