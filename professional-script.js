/**
 * Professional JavaScript for Mohamed Hadouni's Website
 * Modern, clean, and professional functionality
 */

// ===== PROFESSIONAL WEBSITE FUNCTIONALITY =====

class ProfessionalWebsite {
    constructor() {
        this.init();
        this.bindEvents();
        this.setupIntersectionObserver();
        this.setupScrollEffects();
    }

    // Initialize the website
    init() {
        this.hideLoader();
        this.updateNavOnScroll();
        this.animateStats();
        this.animateSkills();
        this.setupPortfolioFilters();
        this.setupContactForm();
        this.setupBackToTop();
        this.setupThemeToggle();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
    }

    // Hide loading screen after page load
    hideLoader() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const loader = document.getElementById('loadingScreen');
                if (loader) {
                    loader.classList.add('hidden');
                    setTimeout(() => {
                        loader.style.display = 'none';
                    }, 600);
                }
            }, 1000);
        });
    }

    // Update navigation on scroll
    updateNavOnScroll() {
        const navbar = document.getElementById('navbar');
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;

            // Add scrolled class to navbar
            if (scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Update active navigation link
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-section') === current) {
                    link.classList.add('active');
                }
            });
        });
    }

    // Animate statistics counters
    animateStats() {
        const stats = document.querySelectorAll('.stat-number');
        let animated = false;

        const animateCounter = (element) => {
            const target = parseInt(element.getAttribute('data-count'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                element.textContent = Math.floor(current);
            }, 16);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    stats.forEach(stat => animateCounter(stat));
                    animated = true;
                }
            });
        });

        const heroSection = document.getElementById('home');
        if (heroSection) {
            observer.observe(heroSection);
        }
    }

    // Animate skill bars
    animateSkills() {
        const skillBars = document.querySelectorAll('.skill-progress');
        let skillsAnimated = false;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !skillsAnimated) {
                    skillBars.forEach(bar => {
                        const width = bar.getAttribute('data-width');
                        setTimeout(() => {
                            bar.style.width = width + '%';
                        }, 500);
                    });
                    skillsAnimated = true;
                }
            });
        });

        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            observer.observe(aboutSection);
        }
    }

    // Setup portfolio filters
    setupPortfolioFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const portfolioItems = document.querySelectorAll('.portfolio-item');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');

                // Update active filter button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter portfolio items
                portfolioItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    
                    if (filter === 'all' || category === filter) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 100);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // Setup contact form
    setupContactForm() {
        const form = document.getElementById('contactForm');
        
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Get form data
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                
                // Validate form
                if (this.validateForm(data)) {
                    this.submitForm(data);
                }
            });
        }
    }

    // Validate contact form
    validateForm(data) {
        const { name, email, subject, message } = data;
        
        if (!name || !email || !subject || !message) {
            this.showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
            return false;
        }
        
        if (!this.isValidEmail(email)) {
            this.showNotification('يرجى إدخال بريد إلكتروني صحيح', 'error');
            return false;
        }
        
        return true;
    }

    // Check if email is valid
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Submit contact form
    submitForm(data) {
        // Show loading state
        const submitBtn = document.querySelector('#contactForm button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>جاري الإرسال...</span>';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual form submission logic)
        setTimeout(() => {
            this.showNotification('تم إرسال رسالتك بنجاح! سأتواصل معك قريباً.', 'success');
            document.getElementById('contactForm').reset();
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 350px;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }

    // Setup back to top button
    setupBackToTop() {
        const backToTopBtn = document.getElementById('backToTop');
        
        if (backToTopBtn) {
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 500) {
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }
            });

            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    // Setup theme toggle
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const body = document.body;
        
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            body.classList.add(savedTheme);
            this.updateThemeIcon(savedTheme === 'dark-theme');
        }

        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const isDark = body.classList.toggle('dark-theme');
                localStorage.setItem('theme', isDark ? 'dark-theme' : '');
                this.updateThemeIcon(isDark);
            });
        }
    }

    // Update theme toggle icon
    updateThemeIcon(isDark) {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    // Setup mobile menu
    setupMobileMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.getElementById('navMenu');

        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', () => {
                menuToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Close menu when clicking on nav links
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    menuToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    menuToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        }
    }

    // Setup smooth scrolling for navigation links
    setupSmoothScrolling() {
        const navLinks = document.querySelectorAll('.nav-link');
        const heroButtons = document.querySelectorAll('[data-action]');

        // Navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('data-section');
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Hero action buttons
        heroButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const action = button.getAttribute('data-action');
                const targetSection = document.getElementById(action);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Setup intersection observer for animations
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll('.service-card, .detail-card, .portfolio-item, .contact-card');
        animateElements.forEach(el => observer.observe(el));
    }

    // Setup scroll effects
    setupScrollEffects() {
        // Parallax effect for hero section
        const heroSection = document.getElementById('home');
        
        if (heroSection) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                
                // Apply subtle parallax effect
                if (scrolled < window.innerHeight) {
                    heroSection.style.transform = `translateY(${rate}px)`;
                }
            });
        }
    }

    // Bind additional events
    bindEvents() {
        // Handle portfolio item clicks
        const portfolioLinks = document.querySelectorAll('.portfolio-link');
        portfolioLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = link.getAttribute('data-action');
                
                if (action === 'view') {
                    this.showNotification('معاينة المشروع - قريباً!', 'info');
                } else if (action === 'details') {
                    this.showNotification('تفاصيل المشروع - قريباً!', 'info');
                }
            });
        });

        // Handle service card interactions
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = card.classList.contains('featured') ? 'scale(1.05)' : 'translateY(0) scale(1)';
            });
        });

        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close mobile menu if open
                const menuToggle = document.getElementById('menuToggle');
                const navMenu = document.getElementById('navMenu');
                
                if (menuToggle && navMenu) {
                    menuToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            }
        });

        // Handle form input focus effects
        const formInputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
        formInputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
        });
    }
}

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProfessionalWebsite();
});

// Add CSS for animations
const animationStyles = `
    .animate-in {
        animation: slideInUp 0.6s ease-out forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .form-group.focused label {
        color: var(--primary-blue);
        transform: translateY(-2px);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-content i {
        font-size: 1.2rem;
    }
`;

// Inject animation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProfessionalWebsite;
}

// ===== END OF PROFESSIONAL JAVASCRIPT =====

