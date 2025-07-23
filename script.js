// تأثيرات التحميل والتفاعل
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة المتغيرات
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const skillBars = document.querySelectorAll('.skill-progress');
    const contactForm = document.getElementById('contactForm');

    // تأثير شريط التنقل عند التمرير
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // قائمة الهامبرغر للهواتف المحمولة
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // تأثير تحريك الهامبرغر
        const spans = hamburger.querySelectorAll('span');
        spans.forEach((span, index) => {
            if (navMenu.classList.contains('active')) {
                if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                if (index === 1) span.style.opacity = '0';
                if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                span.style.transform = 'none';
                span.style.opacity = '1';
            }
        });
    });

    // إغلاق القائمة عند النقر على رابط
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            const spans = hamburger.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = 'none';
                span.style.opacity = '1';
            });
        });
    });

    // التمرير السلس للروابط
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // تحديث الرابط النشط في شريط التنقل
    function updateActiveLink() {
        const sections = document.querySelectorAll('section');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${id}"]`);

            if (scrollPos >= top && scrollPos < bottom) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);

    // تأثير ظهور العناصر عند التمرير
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // تحريك أشرطة المهارات
                if (entry.target.classList.contains('skill-item')) {
                    const skillBar = entry.target.querySelector('.skill-progress');
                    if (skillBar) {
                        const width = skillBar.getAttribute('data-width');
                        setTimeout(() => {
                            skillBar.style.width = width;
                        }, 300);
                    }
                }
            }
        });
    }, observerOptions);

    // مراقبة العناصر للتأثيرات
    const elementsToObserve = document.querySelectorAll('.about-card, .skill-item, .service-card, .project-card, .contact-item');
    elementsToObserve.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });

    // تأثير الكتابة المتحركة
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    // تشغيل تأثير الكتابة للعنوان الرئيسي
    const heroTitle = document.querySelector('.typing-text');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 150);
        }, 1000);
    }

    // تأثيرات الجسيمات المتحركة
    function createParticles() {
        const particlesContainer = document.querySelector('.hero-particles');
        if (!particlesContainer) return;

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 1}px;
                height: ${Math.random() * 4 + 1}px;
                background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.1});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${Math.random() * 10 + 10}s infinite linear;
            `;
            particlesContainer.appendChild(particle);
        }
    }

    createParticles();

    // معالجة نموذج التواصل
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // جمع بيانات النموذج
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // تأثير بصري للإرسال
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'جاري الإرسال...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            
            // محاكاة إرسال البيانات
            setTimeout(() => {
                // عرض رسالة نجاح
                showNotification('تم إرسال رسالتك بنجاح! سأتواصل معك قريباً.', 'success');
                
                // إعادة تعيين النموذج
                contactForm.reset();
                
                // إعادة تعيين الزر
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
            }, 2000);
        });
    }

    // دالة عرض الإشعارات
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#27ae60' : '#3498db'};
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            max-width: 300px;
            font-family: 'Tajawal', sans-serif;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // عرض الإشعار
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // إخفاء الإشعار
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 4000);
    }

    // تأثيرات إضافية للتفاعل
    
    // تأثير المؤشر المخصص
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: rgba(52, 152, 219, 0.5);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        display: none;
    `;
    document.body.appendChild(cursor);

    // تحديث موقع المؤشر المخصص
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
        cursor.style.display = 'block';
    });

    // تأثير تكبير المؤشر عند التمرير على العناصر التفاعلية
    const interactiveElements = document.querySelectorAll('a, button, .service-card, .project-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
            cursor.style.background = 'rgba(231, 76, 60, 0.5)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'rgba(52, 152, 219, 0.5)';
        });
    });

    // تأثير التمرير المتوازي (Parallax)
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-particles');
        
        parallaxElements.forEach(el => {
            const speed = 0.5;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // تأثير العد التصاعدي للأرقام
    function animateNumbers() {
        const numbers = document.querySelectorAll('.number-counter');
        numbers.forEach(number => {
            const target = parseInt(number.getAttribute('data-target'));
            const increment = target / 100;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                number.textContent = Math.floor(current);
            }, 20);
        });
    }

    // تشغيل العد عند ظهور العناصر
    const numberObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers();
                numberObserver.unobserve(entry.target);
            }
        });
    });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        numberObserver.observe(statsSection);
    }

    // تأثير تغيير لون شريط التنقل حسب القسم
    const sections = document.querySelectorAll('section');
    const sectionColors = {
        'home': 'rgba(255, 255, 255, 0.95)',
        'about': 'rgba(248, 249, 250, 0.95)',
        'services': 'rgba(255, 255, 255, 0.95)',
        'projects': 'rgba(248, 249, 250, 0.95)',
        'contact': 'rgba(255, 255, 255, 0.95)'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                const color = sectionColors[sectionId] || 'rgba(255, 255, 255, 0.95)';
                navbar.style.background = color;
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // تأثير تحريك الخلفية عند تحريك الماوس
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        const hero = document.querySelector('.hero');
        if (hero) {
            const moveX = (mouseX - 0.5) * 20;
            const moveY = (mouseY - 0.5) * 20;
            hero.style.backgroundPosition = `${50 + moveX}% ${50 + moveY}%`;
        }
    });

    // تأثير الكتابة المتحركة للنصوص
    function initTypewriterEffect() {
        const typewriterElements = document.querySelectorAll('.typewriter');
        
        typewriterElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            element.style.borderRight = '2px solid';
            
            let i = 0;
            const timer = setInterval(() => {
                element.textContent += text[i];
                i++;
                
                if (i >= text.length) {
                    clearInterval(timer);
                    setTimeout(() => {
                        element.style.borderRight = 'none';
                    }, 1000);
                }
            }, 100);
        });
    }

    // تشغيل تأثيرات إضافية
    setTimeout(initTypewriterEffect, 2000);

    // تأثير الموجات عند النقر
    document.addEventListener('click', (e) => {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(52, 152, 219, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            z-index: 1000;
        `;
        
        const size = 60;
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - size / 2) + 'px';
        ripple.style.top = (e.clientY - size / 2) + 'px';
        
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            document.body.removeChild(ripple);
        }, 600);
    });

    // إضافة CSS للتأثيرات
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .notification {
            font-size: 0.9rem;
            line-height: 1.4;
        }
        
        .custom-cursor {
            mix-blend-mode: difference;
        }
        
        @media (max-width: 768px) {
            .custom-cursor {
                display: none !important;
            }
        }
    `;
    document.head.appendChild(style);

    console.log('🚀 موقع محمد الهدوني تم تحميله بنجاح!');
});

