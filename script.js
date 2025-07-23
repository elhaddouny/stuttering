/*
===========================================
ملف JavaScript الشامل لموقع محمد الهدوني
خبير تسيير المقاولات - آسفي، المغرب
===========================================

هذا الملف يحتوي على جميع الوظائف والسكريبتات اللازمة
لجعل موقع محمد الهدوني تفاعلياً وديناميكياً ومبتكراً.

الأقسام الرئيسية:
1.  الإعدادات العامة والمتغيرات
2.  دوال المساعدة (Helpers)
3.  التحميل المسبق (Preloader)
4.  شريط التنقل (Navigation)
5.  القسم الرئيسي (Hero Section)
6.  قسم من أنا (About Section)
7.  قسم الخبرات (Experience Section)
8.  قسم الخدمات (Services Section)
9.  قسم الأعمال (Portfolio Section)
10. قسم آراء العملاء (Testimonials Section)
11. قسم المدونة (Blog Section)
12. قسم التواصل (Contact Section)
13. التذييل (Footer)
14. تأثيرات التمرير (Scroll Effects)
15. تأثيرات الحركة (Motion Effects)
16. الوضع المظلم (Dark Mode)
17. دعم اللغات (Localization)
18. الوصولية (Accessibility)
19. تحسينات الأداء (Performance)
20. تهيئة التطبيق (App Initialization)
*/

// ===========================================
// 1. الإعدادات العامة والمتغيرات
// ===========================================

const AppConfig = {
    // إعدادات عامة
    appName: "موقع محمد الهدوني",
    appVersion: "2.0.0",
    author: "مانوس",
    contactEmail: "contact@mohamedhadouni.com",

    // إعدادات الأداء
    debounceDelay: 250, // تأخير لتقليل استدعاء الدوال
    throttleDelay: 500, // تأخير لتنظيم استدعاء الدوال
    lazyLoadOffset: 200, // مسافة بدء التحميل الكسول

    // إعدادات الرسوم المتحركة
    animationDuration: 500, // مدة الرسوم المتحركة الافتراضية
    scrollAnimationOffset: 100, // مسافة بدء الرسوم المتحركة عند التمرير

    // إعدادات الوضع المظلم
    darkModeEnabled: true,
    darkModeLocalStorageKey: "darkMode",

    // إعدادات اللغات
    localizationEnabled: true,
    defaultLanguage: "ar",
    languages: ["ar", "en", "fr"],
    localizationLocalStorageKey: "language",

    // إعدادات الوصولية
    accessibilityFeatures: {
        reduceMotion: false,
        highContrast: false,
        fontSizeAdjustment: true,
    },

    // إعدادات واجهة برمجة التطبيقات (API)
    apiEndpoints: {
        contactForm: "/api/contact",
        newsletter: "/api/newsletter",
        blogPosts: "/api/posts",
    },

    // إعدادات أخرى
    debugMode: false, // وضع التصحيح
};

// ===========================================
// 2. دوال المساعدة (Helpers)
// ===========================================

const Helpers = {
    // تحديد العناصر
    select: (selector, parent = document) => parent.querySelector(selector),
    selectAll: (selector, parent = document) => parent.querySelectorAll(selector),

    // إضافة وإزالة الفئات
    addClass: (el, className) => el.classList.add(className),
    removeClass: (el, className) => el.classList.remove(className),
    toggleClass: (el, className) => el.classList.toggle(className),
    hasClass: (el, className) => el.classList.contains(className),

    // إضافة مستمعي الأحداث
    on: (el, event, handler, options = {}) => el.addEventListener(event, handler, options),
    off: (el, event, handler) => el.removeEventListener(event, handler),
    once: (el, event, handler) => el.addEventListener(event, handler, { once: true }),

    // توليد أرقام عشوائية
    random: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,

    // تأخير التنفيذ
    debounce: (func, delay = AppConfig.debounceDelay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    },

    throttle: (func, delay = AppConfig.throttleDelay) => {
        let lastCall = 0;
        return (...args) => {
            const now = new Date().getTime();
            if (now - lastCall < delay) return;
            lastCall = now;
            return func.apply(this, args);
        };
    },

    // التحقق من وجود العنصر في المنظر
    isInViewport: (el) => {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // التحقق من وجود العنصر في المنظر جزئياً
    isPartiallyInViewport: (el, offset = AppConfig.lazyLoadOffset) => {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        return rect.top < windowHeight + offset && rect.bottom >= -offset;
    },

    // الحصول على قيمة خاصية CSS
    getCssProperty: (el, prop) => window.getComputedStyle(el).getPropertyValue(prop),

    // تعيين خاصية CSS
    setCssProperty: (el, prop, value) => el.style.setProperty(prop, value),

    // إنشاء عنصر
    createElement: (tag, attributes = {}, children = []) => {
        const el = document.createElement(tag);
        for (const key in attributes) {
            el.setAttribute(key, attributes[key]);
        }
        children.forEach(child => {
            if (typeof child === "string") {
                el.appendChild(document.createTextNode(child));
            } else {
                el.appendChild(child);
            }
        });
        return el;
    },

    // تسجيل الرسائل في وضع التصحيح
    log: (...args) => {
        if (AppConfig.debugMode) {
            console.log("[Manus Debug]", ...args);
        }
    },

    // إرسال طلبات الشبكة
    fetchApi: async (endpoint, options = {}) => {
        try {
            const response = await fetch(endpoint, {
                headers: {
                    "Content-Type": "application/json",
                    ...options.headers,
                },
                ...options,
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("API Fetch Error:", error);
            return null;
        }
    },
};

// ===========================================
// 3. التحميل المسبق (Preloader)
// ===========================================

const Preloader = {
    init() {
        this.preloader = Helpers.select(".preloader");
        if (!this.preloader) return;

        this.progressBar = Helpers.select(".progress-bar");
        this.progressText = Helpers.select(".preloader-text");

        Helpers.on(window, "load", () => this.hide());

        // محاكاة التحميل
        this.simulateLoading();
    },

    simulateLoading() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Helpers.random(5, 15);
            if (progress > 100) progress = 100;

            if (this.progressBar) {
                this.progressBar.style.width = `${progress}%`;
            }
            if (this.progressText) {
                this.progressText.textContent = `جاري التحميل... ${progress}%`;
            }

            if (progress === 100) {
                clearInterval(interval);
            }
        }, 300);
    },

    hide() {
        if (!this.preloader) return;

        setTimeout(() => {
            Helpers.addClass(this.preloader, "hidden");
            document.body.style.overflow = "auto";
        }, AppConfig.animationDuration);
    },
};

// ===========================================
// 4. شريط التنقل (Navigation)
// ===========================================

const Navigation = {
    init() {
        this.navbar = Helpers.select(".navbar");
        this.navLinks = Helpers.selectAll(".nav-link");
        this.hamburger = Helpers.select(".hamburger");
        this.navMenu = Helpers.select(".nav-menu");

        if (!this.navbar) return;

        this.handleScroll();
        this.handleActiveLink();
        this.handleMobileMenu();

        Helpers.on(window, "scroll", Helpers.throttle(() => {
            this.handleScroll();
            this.handleActiveLink();
        }, 100));
    },

    handleScroll() {
        if (window.scrollY > 50) {
            Helpers.addClass(this.navbar, "scrolled");
        } else {
            Helpers.removeClass(this.navbar, "scrolled");
        }
    },

    handleActiveLink() {
        let currentSection = "";
        const sections = Helpers.selectAll("section[id]");

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute("id");
            }
        });

        this.navLinks.forEach(link => {
            Helpers.removeClass(link, "active");
            if (link.getAttribute("href").substring(1) === currentSection) {
                Helpers.addClass(link, "active");
            }
        });
    },

    handleMobileMenu() {
        if (!this.hamburger || !this.navMenu) return;

        Helpers.on(this.hamburger, "click", () => {
            Helpers.toggleClass(this.hamburger, "active");
            Helpers.toggleClass(this.navMenu, "active");
        });

        // إغلاق القائمة عند النقر على رابط
        this.navLinks.forEach(link => {
            Helpers.on(link, "click", () => {
                if (Helpers.hasClass(this.hamburger, "active")) {
                    Helpers.removeClass(this.hamburger, "active");
                    Helpers.removeClass(this.navMenu, "active");
                }
            });
        });
    },
};

// ===========================================
// 5. القسم الرئيسي (Hero Section)
// ===========================================

const HeroSection = {
    init() {
        this.typingText = Helpers.select(".typing-text");
        this.statsNumbers = Helpers.selectAll(".stat-number");

        if (this.typingText) {
            this.initTypingEffect();
        }

        if (this.statsNumbers.length > 0) {
            this.initCounterEffect();
        }
    },

    initTypingEffect() {
        const words = ["مطور ويب", "خبير تسيير مقاولات", "مبدع ومبتكر"];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        const type = () => {
            const currentWord = words[wordIndex];
            const currentChars = isDeleting
                ? currentWord.substring(0, charIndex - 1)
                : currentWord.substring(0, charIndex + 1);

            this.typingText.textContent = currentChars;

            if (!isDeleting && charIndex < currentWord.length) {
                charIndex++;
                setTimeout(type, 150);
            } else if (isDeleting && charIndex > 0) {
                charIndex--;
                setTimeout(type, 100);
            } else {
                isDeleting = !isDeleting;
                if (!isDeleting) {
                    wordIndex = (wordIndex + 1) % words.length;
                }
                setTimeout(type, 1200);
            }
        };

        type();
    },

    initCounterEffect() {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = +el.getAttribute("data-target");
                    this.animateCount(el, target);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        this.statsNumbers.forEach(stat => observer.observe(stat));
    },

    animateCount(el, target) {
        let current = 0;
        const duration = 2000;
        const stepTime = Math.abs(Math.floor(duration / target));

        const timer = setInterval(() => {
            current += 1;
            el.textContent = current;
            if (current === target) {
                clearInterval(timer);
            }
        }, stepTime);
    },
};

// ===========================================
// 6. قسم من أنا (About Section)
// ===========================================

const AboutSection = {
    init() {
        this.skillProgressBars = Helpers.selectAll(".skill-progress");

        if (this.skillProgressBars.length > 0) {
            this.initSkillBars();
        }
    },

    initSkillBars() {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const width = el.getAttribute("data-width");
                    el.style.width = width;
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        this.skillProgressBars.forEach(bar => observer.observe(bar));
    },
};

// ===========================================
// 7. قسم الخبرات (Experience Section)
// ===========================================

const ExperienceSection = {
    init() {
        this.timelineItems = Helpers.selectAll(".timeline-item");

        if (this.timelineItems.length > 0) {
            this.initTimelineAnimation();
        }
    },

    initTimelineAnimation() {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    setTimeout(() => {
                        Helpers.addClass(el, "visible");
                    }, index * 200);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.2 });

        this.timelineItems.forEach(item => observer.observe(item));
    },
};

// ===========================================
// 8. قسم الأعمال (Portfolio Section)
// ===========================================

const PortfolioSection = {
    init() {
        this.filterBtns = Helpers.selectAll(".filter-btn");
        this.portfolioItems = Helpers.selectAll(".portfolio-item");

        if (this.filterBtns.length > 0) {
            this.initFilters();
        }
    },

    initFilters() {
        Helpers.on(Helpers.select(".portfolio-filters"), "click", (e) => {
            const target = e.target;
            if (!Helpers.hasClass(target, "filter-btn")) return;

            this.filterBtns.forEach(btn => Helpers.removeClass(btn, "active"));
            Helpers.addClass(target, "active");

            const filter = target.getAttribute("data-filter");
            this.filterItems(filter);
        });
    },

    filterItems(filter) {
        this.portfolioItems.forEach(item => {
            const category = item.getAttribute("data-category");
            const shouldShow = filter === "all" || category === filter;

            if (shouldShow) {
                Helpers.removeClass(item, "hidden");
            } else {
                Helpers.addClass(item, "hidden");
            }
        });
    },
};

// ===========================================
// 9. قسم آراء العملاء (Testimonials Section)
// ===========================================

const TestimonialsSection = {
    init() {
        this.slider = Helpers.select(".testimonials-slider");
        if (!this.slider) return;

        this.items = Helpers.selectAll(".testimonial-item");
        this.prevBtn = Helpers.select(".testimonials-navigation .prev-btn");
        this.nextBtn = Helpers.select(".testimonials-navigation .next-btn");
        this.dotsContainer = Helpers.select(".testimonials-dots");

        this.currentIndex = 0;
        this.totalItems = this.items.length;

        this.createDots();
        this.updateSlider();

        Helpers.on(this.prevBtn, "click", () => this.prev());
        Helpers.on(this.nextBtn, "click", () => this.next());

        // 자동 슬라이드
        setInterval(() => this.next(), 5000);
    },

    createDots() {
        for (let i = 0; i < this.totalItems; i++) {
            const dot = Helpers.createElement("div", { class: "dot", "data-index": i });
            Helpers.on(dot, "click", () => {
                this.currentIndex = i;
                this.updateSlider();
            });
            this.dotsContainer.appendChild(dot);
        }
    },

    updateSlider() {
        this.items.forEach((item, index) => {
            if (index === this.currentIndex) {
                Helpers.addClass(item, "active");
            } else {
                Helpers.removeClass(item, "active");
            }
        });

        const dots = Helpers.selectAll(".dot");
        dots.forEach((dot, index) => {
            if (index === this.currentIndex) {
                Helpers.addClass(dot, "active");
            } else {
                Helpers.removeClass(dot, "active");
            }
        });
    },

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.totalItems) % this.totalItems;
        this.updateSlider();
    },

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.totalItems;
        this.updateSlider();
    },
};

// ===========================================
// 10. قسم التواصل (Contact Section)
// ===========================================

const ContactSection = {
    init() {
        this.form = Helpers.select("#contact-form");
        if (!this.form) return;

        Helpers.on(this.form, "submit", (e) => this.handleSubmit(e));
    },

    async handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());

        // التحقق من صحة البيانات
        if (!this.validateForm(data)) return;

        const submitBtn = Helpers.select("#submit-btn");
        Helpers.addClass(submitBtn, "loading");

        try {
            const response = await Helpers.fetchApi(AppConfig.apiEndpoints.contactForm, {
                method: "POST",
                body: JSON.stringify(data),
            });

            if (response && response.success) {
                this.showSuccessMessage();
                this.form.reset();
            } else {
                this.showErrorMessage();
            }
        } catch (error) {
            this.showErrorMessage();
        } finally {
            Helpers.removeClass(submitBtn, "loading");
        }
    },

    validateForm(data) {
        // يمكنك إضافة منطق التحقق من صحة البيانات هنا
        return true;
    },

    showSuccessMessage() {
        // يمكنك إضافة رسالة نجاح هنا
        alert("تم إرسال رسالتك بنجاح!");
    },

    showErrorMessage() {
        // يمكنك إضافة رسالة خطأ هنا
        alert("حدث خطأ ما، يرجى المحاولة مرة أخرى.");
    },
};

// ===========================================
// 11. تأثيرات التمرير (Scroll Effects)
// ===========================================

const ScrollEffects = {
    init() {
        this.animatedElements = Helpers.selectAll("[data-animation]");
        this.backToTopBtn = Helpers.select(".back-to-top");
        this.progressIndicator = Helpers.select(".progress-indicator .progress-bar");

        this.initScrollAnimations();
        this.initBackToTop();
        this.initProgressIndicator();

        Helpers.on(window, "scroll", Helpers.throttle(() => {
            this.initScrollAnimations();
            this.initBackToTop();
            this.initProgressIndicator();
        }, 100));
    },

    initScrollAnimations() {
        this.animatedElements.forEach(el => {
            if (Helpers.isPartiallyInViewport(el, AppConfig.scrollAnimationOffset)) {
                const animation = el.getAttribute("data-animation");
                Helpers.addClass(el, animation);
            }
        });
    },

    initBackToTop() {
        if (window.scrollY > 300) {
            Helpers.addClass(this.backToTopBtn, "visible");
        } else {
            Helpers.removeClass(this.backToTopBtn, "visible");
        }

        Helpers.on(this.backToTopBtn, "click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    },

    initProgressIndicator() {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollTop = window.scrollY;
        const progress = (scrollTop / scrollHeight) * 100;
        this.progressIndicator.style.width = `${progress}%`;
    },
};

// ===========================================
// 12. الوضع المظلم (Dark Mode)
// ===========================================

const DarkMode = {
    init() {
        if (!AppConfig.darkModeEnabled) return;

        this.themeBtn = Helpers.select(".theme-btn");
        if (!this.themeBtn) return;

        this.currentTheme = localStorage.getItem(AppConfig.darkModeLocalStorageKey) || "light";
        this.applyTheme();

        Helpers.on(this.themeBtn, "click", () => this.toggleTheme());
    },

    toggleTheme() {
        this.currentTheme = this.currentTheme === "light" ? "dark" : "light";
        this.applyTheme();
        localStorage.setItem(AppConfig.darkModeLocalStorageKey, this.currentTheme);
    },

    applyTheme() {
        document.documentElement.setAttribute("data-theme", this.currentTheme);
    },
};

// ===========================================
// 13. دعم اللغات (Localization)
// ===========================================

const Localization = {
    init() {
        if (!AppConfig.localizationEnabled) return;

        this.langBtns = Helpers.selectAll(".lang-btn");
        if (this.langBtns.length === 0) return;

        this.currentLang = localStorage.getItem(AppConfig.localizationLocalStorageKey) || AppConfig.defaultLanguage;
        this.loadLanguageData();

        this.langBtns.forEach(btn => {
            Helpers.on(btn, "click", () => {
                const lang = btn.getAttribute("data-lang");
                this.changeLanguage(lang);
            });
        });
    },

    async loadLanguageData() {
        try {
            const response = await fetch(`languages/${this.currentLang}.json`);
            this.translations = await response.json();
            this.translatePage();
            this.updateLangButtons();
        } catch (error) {
            console.error("Error loading language file:", error);
        }
    },

    changeLanguage(lang) {
        if (this.currentLang === lang) return;
        this.currentLang = lang;
        localStorage.setItem(AppConfig.localizationLocalStorageKey, this.currentLang);
        this.loadLanguageData();
    },

    translatePage() {
        const elements = Helpers.selectAll("[data-translate]");
        elements.forEach(el => {
            const key = el.getAttribute("data-translate");
            if (this.translations[key]) {
                el.innerHTML = this.translations[key];
            }
        });
    },

    updateLangButtons() {
        this.langBtns.forEach(btn => {
            if (btn.getAttribute("data-lang") === this.currentLang) {
                Helpers.addClass(btn, "active");
            } else {
                Helpers.removeClass(btn, "active");
            }
        });
    },
};

// ===========================================
// 14. تهيئة التطبيق (App Initialization)
// ===========================================

const App = {
    init() {
        Helpers.on(document, "DOMContentLoaded", () => {
            Preloader.init();
            Navigation.init();
            HeroSection.init();
            AboutSection.init();
            ExperienceSection.init();
            PortfolioSection.init();
            TestimonialsSection.init();
            ContactSection.init();
            ScrollEffects.init();
            DarkMode.init();
            Localization.init();

            Helpers.log(`%c${AppConfig.appName} v${AppConfig.appVersion} initialized successfully!`, "color: #27ae60; font-weight: bold;");
        });
    },
};

// بدء تشغيل التطبيق
App.init();

/*
===========================================
نهاية ملف JavaScript الشامل
===========================================

هذا الملف يحتوي على جميع الوظائف والسكريبتات اللازمة
لجعل موقع محمد الهدوني تفاعلياً وديناميكياً ومبتكراً.
تم تصميمه ليكون شاملاً ومتقدماً ومحسناً للأداء
مع التركيز على تجربة المستخدم والاستجابة والوصولية
*/




// ===========================================
// 15. نظام إدارة الحالة (State Management)
// ===========================================

const StateManager = {
    state: {
        user: {
            name: "",
            email: "",
            preferences: {
                theme: "light",
                language: "ar",
                notifications: true,
            },
        },
        ui: {
            isLoading: false,
            currentPage: "home",
            modalOpen: false,
            sidebarOpen: false,
        },
        data: {
            posts: [],
            testimonials: [],
            projects: [],
            services: [],
        },
        performance: {
            loadTime: 0,
            renderTime: 0,
            interactionCount: 0,
        },
    },

    // المستمعون للتغييرات
    listeners: {},

    // تحديث الحالة
    setState(path, value) {
        const keys = path.split(".");
        let current = this.state;

        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }

        const oldValue = current[keys[keys.length - 1]];
        current[keys[keys.length - 1]] = value;

        // إشعار المستمعين
        this.notifyListeners(path, value, oldValue);
    },

    // الحصول على قيمة من الحالة
    getState(path) {
        const keys = path.split(".");
        let current = this.state;

        for (const key of keys) {
            current = current[key];
            if (current === undefined) return null;
        }

        return current;
    },

    // إضافة مستمع للتغييرات
    subscribe(path, callback) {
        if (!this.listeners[path]) {
            this.listeners[path] = [];
        }
        this.listeners[path].push(callback);

        // إرجاع دالة لإلغاء الاشتراك
        return () => {
            const index = this.listeners[path].indexOf(callback);
            if (index > -1) {
                this.listeners[path].splice(index, 1);
            }
        };
    },

    // إشعار المستمعين
    notifyListeners(path, newValue, oldValue) {
        if (this.listeners[path]) {
            this.listeners[path].forEach(callback => {
                callback(newValue, oldValue, path);
            });
        }
    },

    // حفظ الحالة في التخزين المحلي
    saveToLocalStorage(key = "appState") {
        try {
            localStorage.setItem(key, JSON.stringify(this.state));
        } catch (error) {
            console.error("Error saving state to localStorage:", error);
        }
    },

    // تحميل الحالة من التخزين المحلي
    loadFromLocalStorage(key = "appState") {
        try {
            const savedState = localStorage.getItem(key);
            if (savedState) {
                this.state = { ...this.state, ...JSON.parse(savedState) };
            }
        } catch (error) {
            console.error("Error loading state from localStorage:", error);
        }
    },
};

// ===========================================
// 16. نظام الإشعارات (Notifications System)
// ===========================================

const NotificationSystem = {
    container: null,
    notifications: [],
    maxNotifications: 5,

    init() {
        this.createContainer();
    },

    createContainer() {
        this.container = Helpers.createElement("div", {
            class: "notification-container",
            style: `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
                pointer-events: none;
            `,
        });
        document.body.appendChild(this.container);
    },

    show(message, type = "info", duration = 5000) {
        const notification = this.createNotification(message, type, duration);
        this.notifications.push(notification);

        // إزالة الإشعارات الزائدة
        if (this.notifications.length > this.maxNotifications) {
            const oldest = this.notifications.shift();
            this.remove(oldest);
        }

        this.container.appendChild(notification.element);

        // تأثير الظهور
        setTimeout(() => {
            notification.element.style.transform = "translateX(0)";
            notification.element.style.opacity = "1";
        }, 100);

        // الإزالة التلقائية
        if (duration > 0) {
            setTimeout(() => {
                this.remove(notification);
            }, duration);
        }

        return notification;
    },

    createNotification(message, type, duration) {
        const colors = {
            success: "#27ae60",
            error: "#e74c3c",
            warning: "#f39c12",
            info: "#3498db",
        };

        const element = Helpers.createElement("div", {
            class: `notification notification-${type}`,
            style: `
                background: ${colors[type] || colors.info};
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                transform: translateX(100%);
                opacity: 0;
                transition: all 0.3s ease;
                pointer-events: auto;
                cursor: pointer;
                max-width: 300px;
                word-wrap: break-word;
            `,
        });

        element.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span>${this.getIcon(type)}</span>
                <span>${message}</span>
                <button style="
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    font-size: 18px;
                    margin-left: auto;
                ">&times;</button>
            </div>
        `;

        const notification = { element, type, message, duration };

        // إضافة مستمع للإغلاق
        const closeBtn = element.querySelector("button");
        Helpers.on(closeBtn, "click", () => this.remove(notification));

        return notification;
    },

    getIcon(type) {
        const icons = {
            success: "✓",
            error: "✗",
            warning: "⚠",
            info: "ℹ",
        };
        return icons[type] || icons.info;
    },

    remove(notification) {
        if (!notification || !notification.element) return;

        notification.element.style.transform = "translateX(100%)";
        notification.element.style.opacity = "0";

        setTimeout(() => {
            if (notification.element.parentNode) {
                notification.element.parentNode.removeChild(notification.element);
            }
            const index = this.notifications.indexOf(notification);
            if (index > -1) {
                this.notifications.splice(index, 1);
            }
        }, 300);
    },

    success(message, duration) {
        return this.show(message, "success", duration);
    },

    error(message, duration) {
        return this.show(message, "error", duration);
    },

    warning(message, duration) {
        return this.show(message, "warning", duration);
    },

    info(message, duration) {
        return this.show(message, "info", duration);
    },
};

// ===========================================
// 17. نظام النوافذ المنبثقة (Modal System)
// ===========================================

const ModalSystem = {
    modals: new Map(),
    activeModal: null,
    backdrop: null,

    init() {
        this.createBackdrop();
        this.bindEvents();
    },

    createBackdrop() {
        this.backdrop = Helpers.createElement("div", {
            class: "modal-backdrop",
            style: `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 9998;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                backdrop-filter: blur(5px);
            `,
        });
        document.body.appendChild(this.backdrop);
    },

    bindEvents() {
        Helpers.on(this.backdrop, "click", () => this.close());
        Helpers.on(document, "keydown", (e) => {
            if (e.key === "Escape" && this.activeModal) {
                this.close();
            }
        });
    },

    create(id, options = {}) {
        const modal = {
            id,
            title: options.title || "",
            content: options.content || "",
            size: options.size || "medium",
            closable: options.closable !== false,
            onOpen: options.onOpen || null,
            onClose: options.onClose || null,
            element: null,
        };

        modal.element = this.createModalElement(modal);
        this.modals.set(id, modal);
        document.body.appendChild(modal.element);

        return modal;
    },

    createModalElement(modal) {
        const sizes = {
            small: "400px",
            medium: "600px",
            large: "800px",
            xlarge: "1000px",
        };

        const element = Helpers.createElement("div", {
            class: `modal modal-${modal.size}`,
            id: `modal-${modal.id}`,
            style: `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.8);
                width: 90%;
                max-width: ${sizes[modal.size] || sizes.medium};
                max-height: 90vh;
                background: white;
                border-radius: 12px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                z-index: 9999;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            `,
        });

        element.innerHTML = `
            <div class="modal-header" style="
                padding: 20px;
                border-bottom: 1px solid #eee;
                display: flex;
                align-items: center;
                justify-content: space-between;
            ">
                <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600;">${modal.title}</h3>
                ${modal.closable ? `
                    <button class="modal-close" style="
                        background: none;
                        border: none;
                        font-size: 24px;
                        cursor: pointer;
                        color: #999;
                        padding: 0;
                        width: 30px;
                        height: 30px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 50%;
                        transition: all 0.2s ease;
                    ">&times;</button>
                ` : ""}
            </div>
            <div class="modal-body" style="
                padding: 20px;
                flex: 1;
                overflow-y: auto;
            ">
                ${modal.content}
            </div>
        `;

        if (modal.closable) {
            const closeBtn = element.querySelector(".modal-close");
            Helpers.on(closeBtn, "click", () => this.close(modal.id));
        }

        return element;
    },

    open(id) {
        const modal = this.modals.get(id);
        if (!modal) return;

        if (this.activeModal) {
            this.close();
        }

        this.activeModal = modal;
        document.body.style.overflow = "hidden";

        // إظهار الخلفية
        this.backdrop.style.opacity = "1";
        this.backdrop.style.visibility = "visible";

        // إظهار النافذة
        modal.element.style.opacity = "1";
        modal.element.style.visibility = "visible";
        modal.element.style.transform = "translate(-50%, -50%) scale(1)";

        // استدعاء دالة الفتح
        if (modal.onOpen) {
            modal.onOpen(modal);
        }

        StateManager.setState("ui.modalOpen", true);
    },

    close(id = null) {
        const modal = id ? this.modals.get(id) : this.activeModal;
        if (!modal) return;

        // إخفاء النافذة
        modal.element.style.opacity = "0";
        modal.element.style.visibility = "hidden";
        modal.element.style.transform = "translate(-50%, -50%) scale(0.8)";

        // إخفاء الخلفية
        this.backdrop.style.opacity = "0";
        this.backdrop.style.visibility = "hidden";

        document.body.style.overflow = "";
        this.activeModal = null;

        // استدعاء دالة الإغلاق
        if (modal.onClose) {
            modal.onClose(modal);
        }

        StateManager.setState("ui.modalOpen", false);
    },

    update(id, options = {}) {
        const modal = this.modals.get(id);
        if (!modal) return;

        if (options.title !== undefined) {
            modal.title = options.title;
            const titleEl = modal.element.querySelector(".modal-header h3");
            if (titleEl) titleEl.textContent = options.title;
        }

        if (options.content !== undefined) {
            modal.content = options.content;
            const bodyEl = modal.element.querySelector(".modal-body");
            if (bodyEl) bodyEl.innerHTML = options.content;
        }
    },

    destroy(id) {
        const modal = this.modals.get(id);
        if (!modal) return;

        if (this.activeModal === modal) {
            this.close();
        }

        if (modal.element.parentNode) {
            modal.element.parentNode.removeChild(modal.element);
        }

        this.modals.delete(id);
    },
};

// ===========================================
// 18. نظام التحميل الكسول (Lazy Loading)
// ===========================================

const LazyLoader = {
    observer: null,
    images: [],
    videos: [],

    init() {
        this.images = Helpers.selectAll("img[data-src]");
        this.videos = Helpers.selectAll("video[data-src]");

        if ("IntersectionObserver" in window) {
            this.createObserver();
            this.observeElements();
        } else {
            // Fallback للمتصفحات القديمة
            this.loadAllElements();
        }
    },

    createObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadElement(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: `${AppConfig.lazyLoadOffset}px`,
        });
    },

    observeElements() {
        [...this.images, ...this.videos].forEach(el => {
            this.observer.observe(el);
        });
    },

    loadElement(el) {
        const src = el.getAttribute("data-src");
        if (!src) return;

        if (el.tagName === "IMG") {
            this.loadImage(el, src);
        } else if (el.tagName === "VIDEO") {
            this.loadVideo(el, src);
        }
    },

    loadImage(img, src) {
        const tempImg = new Image();
        tempImg.onload = () => {
            img.src = src;
            img.removeAttribute("data-src");
            Helpers.addClass(img, "loaded");
        };
        tempImg.onerror = () => {
            Helpers.addClass(img, "error");
        };
        tempImg.src = src;
    },

    loadVideo(video, src) {
        video.src = src;
        video.removeAttribute("data-src");
        Helpers.addClass(video, "loaded");
    },

    loadAllElements() {
        [...this.images, ...this.videos].forEach(el => {
            this.loadElement(el);
        });
    },
};

// ===========================================
// 19. نظام التخزين المؤقت (Caching System)
// ===========================================

const CacheManager = {
    cache: new Map(),
    maxSize: 50, // الحد الأقصى لعدد العناصر في الذاكرة المؤقتة
    ttl: 5 * 60 * 1000, // مدة البقاء (5 دقائق)

    set(key, value, customTtl = null) {
        const ttl = customTtl || this.ttl;
        const item = {
            value,
            timestamp: Date.now(),
            ttl,
        };

        // إزالة العناصر المنتهية الصلاحية
        this.cleanup();

        // إزالة أقدم عنصر إذا تم الوصول للحد الأقصى
        if (this.cache.size >= this.maxSize) {
            const oldestKey = this.cache.keys().next().value;
            this.cache.delete(oldestKey);
        }

        this.cache.set(key, item);
    },

    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;

        // التحقق من انتهاء الصلاحية
        if (Date.now() - item.timestamp > item.ttl) {
            this.cache.delete(key);
            return null;
        }

        return item.value;
    },

    has(key) {
        return this.get(key) !== null;
    },

    delete(key) {
        return this.cache.delete(key);
    },

    clear() {
        this.cache.clear();
    },

    cleanup() {
        const now = Date.now();
        for (const [key, item] of this.cache.entries()) {
            if (now - item.timestamp > item.ttl) {
                this.cache.delete(key);
            }
        }
    },

    // تخزين مؤقت للطلبات
    async fetchWithCache(url, options = {}) {
        const cacheKey = `fetch_${url}_${JSON.stringify(options)}`;
        
        // التحقق من وجود البيانات في الذاكرة المؤقتة
        if (this.has(cacheKey)) {
            return this.get(cacheKey);
        }

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            
            // حفظ البيانات في الذاكرة المؤقتة
            this.set(cacheKey, data);
            
            return data;
        } catch (error) {
            console.error("Fetch error:", error);
            return null;
        }
    },
};

// ===========================================
// 20. نظام التحليلات (Analytics System)
// ===========================================

const Analytics = {
    events: [],
    sessionId: null,
    startTime: null,

    init() {
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        this.trackPageView();
        this.bindEvents();
    },

    generateSessionId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    track(eventName, properties = {}) {
        const event = {
            name: eventName,
            properties: {
                ...properties,
                timestamp: Date.now(),
                sessionId: this.sessionId,
                url: window.location.href,
                userAgent: navigator.userAgent,
            },
        };

        this.events.push(event);
        this.sendEvent(event);

        Helpers.log("Analytics event tracked:", event);
    },

    trackPageView() {
        this.track("page_view", {
            title: document.title,
            referrer: document.referrer,
        });
    },

    trackClick(element, label = null) {
        this.track("click", {
            element: element.tagName,
            label: label || element.textContent.trim(),
            className: element.className,
        });
    },

    trackFormSubmit(formId, formData = {}) {
        this.track("form_submit", {
            formId,
            formData,
        });
    },

    trackScroll(percentage) {
        this.track("scroll", {
            percentage: Math.round(percentage),
        });
    },

    trackTimeOnPage() {
        const timeSpent = Date.now() - this.startTime;
        this.track("time_on_page", {
            timeSpent: Math.round(timeSpent / 1000), // بالثواني
        });
    },

    bindEvents() {
        // تتبع النقرات
        Helpers.on(document, "click", (e) => {
            if (e.target.matches("a, button, .trackable")) {
                this.trackClick(e.target);
            }
        });

        // تتبع التمرير
        let scrollThresholds = [25, 50, 75, 100];
        let trackedScrolls = new Set();

        Helpers.on(window, "scroll", Helpers.throttle(() => {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            
            scrollThresholds.forEach(threshold => {
                if (scrollPercent >= threshold && !trackedScrolls.has(threshold)) {
                    trackedScrolls.add(threshold);
                    this.trackScroll(threshold);
                }
            });
        }, 1000));

        // تتبع الوقت المقضي عند مغادرة الصفحة
        Helpers.on(window, "beforeunload", () => {
            this.trackTimeOnPage();
        });

        // تتبع الأخطاء
        Helpers.on(window, "error", (e) => {
            this.track("javascript_error", {
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno,
            });
        });
    },

    async sendEvent(event) {
        // يمكنك إرسال الأحداث إلى خدمة التحليلات هنا
        // مثل Google Analytics أو خدمة مخصصة
        if (AppConfig.debugMode) {
            console.log("Sending analytics event:", event);
        }
    },

    getSessionData() {
        return {
            sessionId: this.sessionId,
            startTime: this.startTime,
            events: this.events,
            userAgent: navigator.userAgent,
            language: navigator.language,
            screen: {
                width: screen.width,
                height: screen.height,
            },
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight,
            },
        };
    },
};

// ===========================================
// 21. نظام البحث (Search System)
// ===========================================

const SearchSystem = {
    searchInput: null,
    searchResults: null,
    searchData: [],
    currentQuery: "",
    isSearching: false,

    init() {
        this.searchInput = Helpers.select("#search-input");
        this.searchResults = Helpers.select("#search-results");

        if (!this.searchInput) return;

        this.loadSearchData();
        this.bindEvents();
    },

    async loadSearchData() {
        // تحميل بيانات البحث من مصادر مختلفة
        try {
            const [posts, services, projects] = await Promise.all([
                this.loadPosts(),
                this.loadServices(),
                this.loadProjects(),
            ]);

            this.searchData = [
                ...posts.map(item => ({ ...item, type: "post" })),
                ...services.map(item => ({ ...item, type: "service" })),
                ...projects.map(item => ({ ...item, type: "project" })),
            ];

            Helpers.log("Search data loaded:", this.searchData.length, "items");
        } catch (error) {
            console.error("Error loading search data:", error);
        }
    },

    async loadPosts() {
        // محاكاة تحميل المقالات
        return [
            { title: "كيفية إدارة المشاريع بفعالية", content: "محتوى المقال...", url: "/blog/project-management" },
            { title: "أساسيات تسيير المقاولات", content: "محتوى المقال...", url: "/blog/business-management" },
            { title: "التخطيط الاستراتيجي للمؤسسات", content: "محتوى المقال...", url: "/blog/strategic-planning" },
        ];
    },

    async loadServices() {
        // محاكاة تحميل الخدمات
        return [
            { title: "استشارات إدارية", content: "خدمات الاستشارات الإدارية...", url: "/services/consulting" },
            { title: "تطوير الأعمال", content: "خدمات تطوير الأعمال...", url: "/services/business-development" },
            { title: "التدريب المهني", content: "برامج التدريب المهني...", url: "/services/training" },
        ];
    },

    async loadProjects() {
        // محاكاة تحميل المشاريع
        return [
            { title: "مشروع إدارة المخازن", content: "نظام إدارة المخازن...", url: "/projects/warehouse-management" },
            { title: "تطبيق إدارة الموظفين", content: "تطبيق لإدارة الموظفين...", url: "/projects/employee-management" },
            { title: "منصة التجارة الإلكترونية", content: "منصة للتجارة الإلكترونية...", url: "/projects/ecommerce-platform" },
        ];
    },

    bindEvents() {
        // البحث أثناء الكتابة
        Helpers.on(this.searchInput, "input", Helpers.debounce((e) => {
            this.handleSearch(e.target.value);
        }, 300));

        // إخفاء النتائج عند النقر خارجها
        Helpers.on(document, "click", (e) => {
            if (!this.searchInput.contains(e.target) && !this.searchResults.contains(e.target)) {
                this.hideResults();
            }
        });

        // التنقل بالكيبورد
        Helpers.on(this.searchInput, "keydown", (e) => {
            this.handleKeyNavigation(e);
        });
    },

    async handleSearch(query) {
        this.currentQuery = query.trim();

        if (this.currentQuery.length < 2) {
            this.hideResults();
            return;
        }

        this.isSearching = true;
        this.showLoadingState();

        // محاكاة تأخير البحث
        await new Promise(resolve => setTimeout(resolve, 200));

        const results = this.performSearch(this.currentQuery);
        this.displayResults(results);

        this.isSearching = false;

        // تتبع البحث
        Analytics.track("search", {
            query: this.currentQuery,
            resultsCount: results.length,
        });
    },

    performSearch(query) {
        const searchTerms = query.toLowerCase().split(" ");
        
        return this.searchData.filter(item => {
            const searchableText = `${item.title} ${item.content}`.toLowerCase();
            return searchTerms.every(term => searchableText.includes(term));
        }).slice(0, 10); // الحد الأقصى 10 نتائج
    },

    displayResults(results) {
        if (results.length === 0) {
            this.searchResults.innerHTML = `
                <div class="search-no-results">
                    <p>لم يتم العثور على نتائج لـ "${this.currentQuery}"</p>
                </div>
            `;
        } else {
            this.searchResults.innerHTML = results.map(result => `
                <div class="search-result-item" data-url="${result.url}">
                    <div class="result-type">${this.getTypeLabel(result.type)}</div>
                    <h4 class="result-title">${this.highlightQuery(result.title)}</h4>
                    <p class="result-content">${this.highlightQuery(this.truncateText(result.content, 100))}</p>
                </div>
            `).join("");

            // إضافة مستمعي النقر
            Helpers.selectAll(".search-result-item", this.searchResults).forEach(item => {
                Helpers.on(item, "click", () => {
                    const url = item.getAttribute("data-url");
                    window.location.href = url;
                });
            });
        }

        this.showResults();
    },

    showLoadingState() {
        this.searchResults.innerHTML = `
            <div class="search-loading">
                <div class="loading-spinner"></div>
                <p>جاري البحث...</p>
            </div>
        `;
        this.showResults();
    },

    showResults() {
        this.searchResults.style.display = "block";
    },

    hideResults() {
        this.searchResults.style.display = "none";
    },

    getTypeLabel(type) {
        const labels = {
            post: "مقال",
            service: "خدمة",
            project: "مشروع",
        };
        return labels[type] || type;
    },

    highlightQuery(text) {
        if (!this.currentQuery) return text;
        
        const regex = new RegExp(`(${this.currentQuery})`, "gi");
        return text.replace(regex, "<mark>$1</mark>");
    },

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + "...";
    },

    handleKeyNavigation(e) {
        const items = Helpers.selectAll(".search-result-item", this.searchResults);
        if (items.length === 0) return;

        let currentIndex = -1;
        items.forEach((item, index) => {
            if (Helpers.hasClass(item, "selected")) {
                currentIndex = index;
            }
        });

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                currentIndex = (currentIndex + 1) % items.length;
                break;
            case "ArrowUp":
                e.preventDefault();
                currentIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
                break;
            case "Enter":
                e.preventDefault();
                if (currentIndex >= 0) {
                    items[currentIndex].click();
                }
                return;
            case "Escape":
                this.hideResults();
                this.searchInput.blur();
                return;
            default:
                return;
        }

        // تحديث التحديد
        items.forEach((item, index) => {
            if (index === currentIndex) {
                Helpers.addClass(item, "selected");
            } else {
                Helpers.removeClass(item, "selected");
            }
        });
    },
};

// ===========================================
// 22. نظام التعليقات (Comments System)
// ===========================================

const CommentsSystem = {
    comments: [],
    currentPostId: null,

    init(postId) {
        this.currentPostId = postId;
        this.loadComments();
        this.bindEvents();
    },

    async loadComments() {
        try {
            // محاكاة تحميل التعليقات من API
            const response = await Helpers.fetchApi(`/api/comments/${this.currentPostId}`);
            this.comments = response?.comments || [];
            this.renderComments();
        } catch (error) {
            console.error("Error loading comments:", error);
        }
    },

    renderComments() {
        const container = Helpers.select("#comments-container");
        if (!container) return;

        if (this.comments.length === 0) {
            container.innerHTML = `
                <div class="no-comments">
                    <p>لا توجد تعليقات بعد. كن أول من يعلق!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.comments.map(comment => this.renderComment(comment)).join("");
    },

    renderComment(comment) {
        return `
            <div class="comment" data-id="${comment.id}">
                <div class="comment-avatar">
                    <img src="${comment.author.avatar || '/images/default-avatar.png'}" alt="${comment.author.name}">
                </div>
                <div class="comment-content">
                    <div class="comment-header">
                        <h4 class="comment-author">${comment.author.name}</h4>
                        <span class="comment-date">${this.formatDate(comment.createdAt)}</span>
                    </div>
                    <div class="comment-text">${comment.content}</div>
                    <div class="comment-actions">
                        <button class="comment-like ${comment.liked ? 'liked' : ''}" data-id="${comment.id}">
                            <i class="icon-heart"></i>
                            <span>${comment.likes}</span>
                        </button>
                        <button class="comment-reply" data-id="${comment.id}">
                            <i class="icon-reply"></i>
                            رد
                        </button>
                    </div>
                    ${comment.replies && comment.replies.length > 0 ? `
                        <div class="comment-replies">
                            ${comment.replies.map(reply => this.renderComment(reply)).join("")}
                        </div>
                    ` : ""}
                </div>
            </div>
        `;
    },

    bindEvents() {
        const form = Helpers.select("#comment-form");
        if (form) {
            Helpers.on(form, "submit", (e) => this.handleSubmit(e));
        }

        // مستمعي الأحداث للتعليقات
        Helpers.on(document, "click", (e) => {
            if (e.target.matches(".comment-like")) {
                this.handleLike(e.target);
            } else if (e.target.matches(".comment-reply")) {
                this.handleReply(e.target);
            }
        });
    },

    async handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const content = formData.get("content");

        if (!content.trim()) {
            NotificationSystem.warning("يرجى كتابة تعليق");
            return;
        }

        try {
            const response = await Helpers.fetchApi("/api/comments", {
                method: "POST",
                body: JSON.stringify({
                    postId: this.currentPostId,
                    content: content.trim(),
                }),
            });

            if (response?.success) {
                NotificationSystem.success("تم إضافة تعليقك بنجاح");
                e.target.reset();
                this.loadComments(); // إعادة تحميل التعليقات
            } else {
                NotificationSystem.error("حدث خطأ في إضافة التعليق");
            }
        } catch (error) {
            NotificationSystem.error("حدث خطأ في إضافة التعليق");
        }
    },

    async handleLike(button) {
        const commentId = button.getAttribute("data-id");
        const isLiked = Helpers.hasClass(button, "liked");

        try {
            const response = await Helpers.fetchApi(`/api/comments/${commentId}/like`, {
                method: isLiked ? "DELETE" : "POST",
            });

            if (response?.success) {
                const countSpan = button.querySelector("span");
                let count = parseInt(countSpan.textContent);

                if (isLiked) {
                    Helpers.removeClass(button, "liked");
                    count--;
                } else {
                    Helpers.addClass(button, "liked");
                    count++;
                }

                countSpan.textContent = count;
            }
        } catch (error) {
            console.error("Error liking comment:", error);
        }
    },

    handleReply(button) {
        const commentId = button.getAttribute("data-id");
        // يمكنك إضافة منطق الرد هنا
        console.log("Reply to comment:", commentId);
    },

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            return "أمس";
        } else if (diffDays < 7) {
            return `منذ ${diffDays} أيام`;
        } else {
            return date.toLocaleDateString("ar-SA");
        }
    },
};

// ===========================================
// 23. نظام المشاركة الاجتماعية (Social Sharing)
// ===========================================

const SocialSharing = {
    init() {
        this.bindEvents();
    },

    bindEvents() {
        Helpers.on(document, "click", (e) => {
            if (e.target.matches(".share-btn")) {
                e.preventDefault();
                const platform = e.target.getAttribute("data-platform");
                const url = e.target.getAttribute("data-url") || window.location.href;
                const title = e.target.getAttribute("data-title") || document.title;
                const description = e.target.getAttribute("data-description") || "";

                this.share(platform, url, title, description);
            }
        });
    },

    share(platform, url, title, description) {
        const encodedUrl = encodeURIComponent(url);
        const encodedTitle = encodeURIComponent(title);
        const encodedDescription = encodeURIComponent(description);

        const shareUrls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
            telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
            email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
        };

        const shareUrl = shareUrls[platform];
        if (!shareUrl) {
            console.error("Unsupported platform:", platform);
            return;
        }

        if (platform === "email") {
            window.location.href = shareUrl;
        } else {
            this.openPopup(shareUrl, platform);
        }

        // تتبع المشاركة
        Analytics.track("social_share", {
            platform,
            url,
            title,
        });
    },

    openPopup(url, platform) {
        const width = 600;
        const height = 400;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;

        window.open(
            url,
            `share-${platform}`,
            `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
        );
    },

    // نسخ الرابط إلى الحافظة
    async copyToClipboard(url = window.location.href) {
        try {
            await navigator.clipboard.writeText(url);
            NotificationSystem.success("تم نسخ الرابط إلى الحافظة");
        } catch (error) {
            // Fallback للمتصفحات القديمة
            const textArea = document.createElement("textarea");
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            NotificationSystem.success("تم نسخ الرابط إلى الحافظة");
        }

        Analytics.track("link_copy", { url });
    },
};

// ===========================================
// 24. نظام الطباعة (Print System)
// ===========================================

const PrintSystem = {
    init() {
        this.bindEvents();
    },

    bindEvents() {
        Helpers.on(document, "click", (e) => {
            if (e.target.matches(".print-btn")) {
                e.preventDefault();
                const target = e.target.getAttribute("data-target");
                this.print(target);
            }
        });
    },

    print(selector = null) {
        if (selector) {
            this.printElement(selector);
        } else {
            window.print();
        }

        Analytics.track("print", {
            selector: selector || "full_page",
        });
    },

    printElement(selector) {
        const element = Helpers.select(selector);
        if (!element) {
            console.error("Print element not found:", selector);
            return;
        }

        const printWindow = window.open("", "_blank");
        const styles = this.getStyles();

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>طباعة - ${document.title}</title>
                <meta charset="utf-8">
                <style>
                    ${styles}
                    @media print {
                        body { margin: 0; padding: 20px; }
                        .no-print { display: none !important; }
                    }
                </style>
            </head>
            <body>
                ${element.outerHTML}
            </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();

        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    },

    getStyles() {
        let styles = "";
        const styleSheets = document.styleSheets;

        for (let i = 0; i < styleSheets.length; i++) {
            try {
                const rules = styleSheets[i].cssRules || styleSheets[i].rules;
                for (let j = 0; j < rules.length; j++) {
                    styles += rules[j].cssText + "\n";
                }
            } catch (e) {
                // تجاهل الأخطاء (CORS issues)
            }
        }

        return styles;
    },
};

// ===========================================
// 25. تحديث التطبيق وإضافة المزيد من الوظائف
// ===========================================

// تحديث كائن التطبيق الرئيسي
const AppExtended = {
    ...App,

    init() {
        Helpers.on(document, "DOMContentLoaded", () => {
            // تهيئة الأنظمة الأساسية
            Preloader.init();
            Navigation.init();
            HeroSection.init();
            AboutSection.init();
            ExperienceSection.init();
            PortfolioSection.init();
            TestimonialsSection.init();
            ContactSection.init();
            ScrollEffects.init();
            DarkMode.init();
            Localization.init();

            // تهيئة الأنظمة المتقدمة
            StateManager.loadFromLocalStorage();
            NotificationSystem.init();
            ModalSystem.init();
            LazyLoader.init();
            Analytics.init();
            SearchSystem.init();
            SocialSharing.init();
            PrintSystem.init();

            // حفظ الحالة دورياً
            setInterval(() => {
                StateManager.saveToLocalStorage();
            }, 30000); // كل 30 ثانية

            // تنظيف الذاكرة المؤقتة دورياً
            setInterval(() => {
                CacheManager.cleanup();
            }, 60000); // كل دقيقة

            Helpers.log(`%c${AppConfig.appName} v${AppConfig.appVersion} - Extended Version initialized successfully!`, "color: #27ae60; font-weight: bold; font-size: 14px;");
            
            // إشعار بالتحميل الناجح
            setTimeout(() => {
                NotificationSystem.success("مرحباً بك في موقع محمد الهدوني! 🎉");
            }, 2000);
        });
    },
};

// استبدال التطبيق الأساسي بالنسخة المحسنة
Object.assign(App, AppExtended);

// ===========================================
// 26. دوال إضافية ومساعدة متقدمة
// ===========================================

// دالة لإنشاء عناصر تفاعلية متقدمة
const UIComponents = {
    createTooltip(element, text, position = "top") {
        const tooltip = Helpers.createElement("div", {
            class: `tooltip tooltip-${position}`,
            style: `
                position: absolute;
                background: #333;
                color: white;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 12px;
                white-space: nowrap;
                z-index: 10000;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
            `,
        });
        tooltip.textContent = text;

        document.body.appendChild(tooltip);

        const showTooltip = () => {
            const rect = element.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();

            let top, left;

            switch (position) {
                case "top":
                    top = rect.top - tooltipRect.height - 5;
                    left = rect.left + (rect.width - tooltipRect.width) / 2;
                    break;
                case "bottom":
                    top = rect.bottom + 5;
                    left = rect.left + (rect.width - tooltipRect.width) / 2;
                    break;
                case "left":
                    top = rect.top + (rect.height - tooltipRect.height) / 2;
                    left = rect.left - tooltipRect.width - 5;
                    break;
                case "right":
                    top = rect.top + (rect.height - tooltipRect.height) / 2;
                    left = rect.right + 5;
                    break;
            }

            tooltip.style.top = `${top}px`;
            tooltip.style.left = `${left}px`;
            tooltip.style.opacity = "1";
        };

        const hideTooltip = () => {
            tooltip.style.opacity = "0";
        };

        Helpers.on(element, "mouseenter", showTooltip);
        Helpers.on(element, "mouseleave", hideTooltip);

        return {
            destroy: () => {
                Helpers.off(element, "mouseenter", showTooltip);
                Helpers.off(element, "mouseleave", hideTooltip);
                if (tooltip.parentNode) {
                    tooltip.parentNode.removeChild(tooltip);
                }
            },
        };
    },

    createProgressBar(container, options = {}) {
        const {
            value = 0,
            max = 100,
            animated = true,
            showLabel = true,
            color = "#3498db",
        } = options;

        const progressBar = Helpers.createElement("div", {
            class: "progress-bar-container",
            style: `
                width: 100%;
                height: 20px;
                background: #f0f0f0;
                border-radius: 10px;
                overflow: hidden;
                position: relative;
            `,
        });

        const progressFill = Helpers.createElement("div", {
            class: "progress-fill",
            style: `
                height: 100%;
                background: ${color};
                width: 0%;
                transition: ${animated ? "width 0.3s ease" : "none"};
                border-radius: 10px;
            `,
        });

        const progressLabel = Helpers.createElement("div", {
            class: "progress-label",
            style: `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 12px;
                font-weight: bold;
                color: #333;
            `,
        });

        progressBar.appendChild(progressFill);
        if (showLabel) {
            progressBar.appendChild(progressLabel);
        }
        container.appendChild(progressBar);

        const updateProgress = (newValue) => {
            const percentage = Math.min(Math.max((newValue / max) * 100, 0), 100);
            progressFill.style.width = `${percentage}%`;
            if (showLabel) {
                progressLabel.textContent = `${Math.round(percentage)}%`;
            }
        };

        updateProgress(value);

        return {
            update: updateProgress,
            setValue: (newValue) => updateProgress(newValue),
            setMax: (newMax) => {
                max = newMax;
                updateProgress(value);
            },
            destroy: () => {
                if (progressBar.parentNode) {
                    progressBar.parentNode.removeChild(progressBar);
                }
            },
        };
    },

    createAccordion(container, items) {
        const accordion = Helpers.createElement("div", {
            class: "accordion",
        });

        items.forEach((item, index) => {
            const accordionItem = Helpers.createElement("div", {
                class: "accordion-item",
                style: `
                    border: 1px solid #ddd;
                    margin-bottom: 5px;
                    border-radius: 5px;
                    overflow: hidden;
                `,
            });

            const header = Helpers.createElement("div", {
                class: "accordion-header",
                style: `
                    padding: 15px;
                    background: #f8f9fa;
                    cursor: pointer;
                    user-select: none;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                `,
            });

            const title = Helpers.createElement("span", {}, [item.title]);
            const icon = Helpers.createElement("span", {
                class: "accordion-icon",
                style: "transition: transform 0.3s ease;",
            }, ["▼"]);

            header.appendChild(title);
            header.appendChild(icon);

            const content = Helpers.createElement("div", {
                class: "accordion-content",
                style: `
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.3s ease;
                `,
            });

            const contentInner = Helpers.createElement("div", {
                style: "padding: 15px;",
            });
            contentInner.innerHTML = item.content;
            content.appendChild(contentInner);

            Helpers.on(header, "click", () => {
                const isOpen = content.style.maxHeight !== "0px" && content.style.maxHeight !== "";

                if (isOpen) {
                    content.style.maxHeight = "0px";
                    icon.style.transform = "rotate(0deg)";
                } else {
                    content.style.maxHeight = content.scrollHeight + "px";
                    icon.style.transform = "rotate(180deg)";
                }
            });

            accordionItem.appendChild(header);
            accordionItem.appendChild(content);
            accordion.appendChild(accordionItem);
        });

        container.appendChild(accordion);

        return accordion;
    },
};

// ===========================================
// 27. نظام الأداء والتحسين (Performance System)
// ===========================================

const PerformanceMonitor = {
    metrics: {
        loadTime: 0,
        renderTime: 0,
        memoryUsage: 0,
        networkRequests: 0,
        errors: 0,
    },

    init() {
        this.measureLoadTime();
        this.measureRenderTime();
        this.monitorMemoryUsage();
        this.monitorNetworkRequests();
        this.monitorErrors();
        
        // تقرير دوري عن الأداء
        setInterval(() => {
            this.reportMetrics();
        }, 60000); // كل دقيقة
    },

    measureLoadTime() {
        if (performance.timing) {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            this.metrics.loadTime = loadTime;
            StateManager.setState("performance.loadTime", loadTime);
        }
    },

    measureRenderTime() {
        if (performance.now) {
            const renderStart = performance.now();
            requestAnimationFrame(() => {
                const renderTime = performance.now() - renderStart;
                this.metrics.renderTime = renderTime;
                StateManager.setState("performance.renderTime", renderTime);
            });
        }
    },

    monitorMemoryUsage() {
        if (performance.memory) {
            setInterval(() => {
                const memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024; // MB
                this.metrics.memoryUsage = memoryUsage;
                StateManager.setState("performance.memoryUsage", memoryUsage);
            }, 10000); // كل 10 ثوان
        }
    },

    monitorNetworkRequests() {
        // مراقبة طلبات الشبكة
        const originalFetch = window.fetch;
        window.fetch = (...args) => {
            this.metrics.networkRequests++;
            return originalFetch.apply(this, args);
        };
    },

    monitorErrors() {
        Helpers.on(window, "error", () => {
            this.metrics.errors++;
        });

        Helpers.on(window, "unhandledrejection", () => {
            this.metrics.errors++;
        });
    },

    reportMetrics() {
        if (AppConfig.debugMode) {
            console.table(this.metrics);
        }

        // إرسال المقاييس إلى خدمة التحليلات
        Analytics.track("performance_metrics", this.metrics);
    },

    // تحسين الأداء
    optimizeImages() {
        const images = Helpers.selectAll("img");
        images.forEach(img => {
            if (!img.hasAttribute("loading")) {
                img.setAttribute("loading", "lazy");
            }
        });
    },

    preloadCriticalResources() {
        const criticalResources = [
            "/css/critical.css",
            "/js/critical.js",
            "/fonts/main-font.woff2",
        ];

        criticalResources.forEach(resource => {
            const link = Helpers.createElement("link", {
                rel: "preload",
                href: resource,
                as: this.getResourceType(resource),
            });
            document.head.appendChild(link);
        });
    },

    getResourceType(url) {
        if (url.endsWith(".css")) return "style";
        if (url.endsWith(".js")) return "script";
        if (url.match(/\.(woff|woff2|ttf|otf)$/)) return "font";
        if (url.match(/\.(jpg|jpeg|png|webp|svg)$/)) return "image";
        return "fetch";
    },
};

// تشغيل مراقب الأداء
PerformanceMonitor.init();

/*
===========================================
نهاية الملف الموسع
===========================================

هذا الإصدار الموسع من ملف JavaScript يحتوي على:
- أنظمة إدارة الحالة المتقدمة
- نظام الإشعارات التفاعلي
- نظام النوافذ المنبثقة
- التحميل الكسول للموارد
- نظام التخزين المؤقت الذكي
- تحليلات مفصلة للاستخدام
- نظام البحث المتقدم
- نظام التعليقات التفاعلي
- المشاركة الاجتماعية
- نظام الطباعة
- مكونات واجهة المستخدم المتقدمة
- مراقبة الأداء والتحسين

تم تصميم هذا الملف ليكون شاملاً ومتقدماً
مع التركيز على الأداء وتجربة المستخدم المتميزة
*/

