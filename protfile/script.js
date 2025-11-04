// Enhanced JavaScript for Portfolio Website
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const header = document.querySelector('header');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const heroSubtitle = document.getElementById('rotating-profession');
    const ctaBtn = document.querySelector('.cta-btn');
    const hireBtns = document.querySelectorAll('.hire-btn');
    const aboutBtn = document.querySelector('.about-btn');
    const socialIcons = document.querySelectorAll('.social-icon');

    // Professions for typewriter effect
    const professions = [
        'Full-Stack Developer',
        'Frontend Engineer', 
        'Backend Developer',
        'UI/UX Enthusiast',
        'Problem Solver',
        'Tech Innovator'
    ];

    // Typewriter Effect
    let professionIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 150;

    function typeWriter() {
        if (!heroSubtitle) return;
        
        const currentProfession = professions[professionIndex];
        
        if (isDeleting) {
            heroSubtitle.innerHTML = "I'm a " + currentProfession.substring(0, charIndex - 1) + '<span class="cursor">|</span>';
            charIndex--;
            typingSpeed = 75;
        } else {
            heroSubtitle.innerHTML = "I'm a " + currentProfession.substring(0, charIndex + 1) + '<span class="cursor">|</span>';
            charIndex++;
            typingSpeed = 150;
        }

        if (!isDeleting && charIndex === currentProfession.length) {
            typingSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            professionIndex = (professionIndex + 1) % professions.length;
            typingSpeed = 500; // Pause before next word
        }

        setTimeout(typeWriter, typingSpeed);
    }

    // Mobile Menu Toggle
    function toggleMobileMenu() {
        hamburger?.classList.toggle('active');
        navMenu?.classList.toggle('active');
        document.body.style.overflow = navMenu?.classList.contains('active') ? 'hidden' : 'auto';
    }

    // Smooth Scroll Navigation
    function smoothScroll(event) {
        event.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId && targetId.startsWith('#')) {
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = header?.offsetHeight || 80;
                const offsetTop = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Close mobile menu
                if (navMenu?.classList.contains('active')) {
                    toggleMobileMenu();
                }

                // Update active state
                updateActiveNavLink(targetId);
            }
        }
    }

    // Update Active Navigation Link
    function updateActiveNavLink(activeId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === activeId) {
                link.classList.add('active');
            }
        });
    }

    // Scroll-based Header Effects
    function handleScroll() {
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
    }

    // Scroll-based Active Navigation
    function updateActiveNavFromScroll() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + (header?.offsetHeight || 80);

        let activeSection = null;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                activeSection = section;
            }
        });

        if (activeSection) {
            const id = '#' + activeSection.getAttribute('id');
            updateActiveNavLink(id);
            
            // Update URL hash
            if (history.pushState) {
                history.pushState(null, null, id);
            }
        } else if (scrollPosition < 100) {
            updateActiveNavLink('#home');
        }
    }

    // Throttled scroll listener
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveNavFromScroll, 50);
    });

    // Intersection Observer for Animations
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add stagger effect for multiple elements
                const siblings = entry.target.parentElement?.querySelectorAll('.animate-on-scroll');
                if (siblings && siblings.length > 1) {
                    siblings.forEach((sibling, index) => {
                        setTimeout(() => {
                            sibling.style.opacity = '1';
                            sibling.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Setup animations for elements
    function setupAnimations() {
        const animatedElements = document.querySelectorAll(
            '.hero-stats .stat, .about-highlights .highlight, .floating-card, .social-icon'
        );
        
        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            el.style.transitionDelay = `${index * 0.1}s`;
            
            animationObserver.observe(el);
        });
    }

    // Button Click Handlers
    function handleButtonClick(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);

        // Add button-specific actions here
        if (button.classList.contains('cta-btn') || button.textContent.includes('Hire')) {
            // Scroll to contact section or show contact modal
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                // Fallback: show alert or modal
                showNotification('Contact section coming soon!', 'info');
            }
        } else if (button.textContent.includes('Download CV')) {
            // Handle CV download
            downloadCV();
        }
    }

    // CV Download Function
    function downloadCV() {
        // For now, open CV in new tab (replace with actual PDF when available)
        const cvUrl = 'assets/Methush_Anjula_CV.pdf'; // Change to 'assets/Methush_Anjula_CV.pdf' when PDF is ready
        
        // Open CV in new tab
        window.open(cvUrl, '_blank');
        showNotification('CV opened in new tab! You can save it as PDF from there. 📄', 'success');
        
        // Uncomment below when you have an actual PDF file:
        /*
        const link = document.createElement('a');
        link.href = 'assets/Methush_Anjula_CV.pdf';
        link.download = 'Methush_Anjula_CV.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showNotification('CV download started! 📄', 'success');
        */
    }

    // Notification System
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'info' ? 'info-circle' : 'check-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add notification styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'info' ? 'var(--accent-primary)' : '#10b981',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            zIndex: '9999',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Keyboard Navigation
    function handleKeyboard(event) {
        // Close mobile menu on Escape
        if (event.key === 'Escape' && navMenu?.classList.contains('active')) {
            toggleMobileMenu();
        }
        
        // Navigate with arrow keys when menu is open
        if (navMenu?.classList.contains('active') && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
            event.preventDefault();
            const currentActive = document.querySelector('.nav-link:focus') || document.querySelector('.nav-link.active');
            const navLinksArray = Array.from(navLinks);
            const currentIndex = navLinksArray.indexOf(currentActive);
            
            let nextIndex;
            if (event.key === 'ArrowDown') {
                nextIndex = (currentIndex + 1) % navLinksArray.length;
            } else {
                nextIndex = currentIndex <= 0 ? navLinksArray.length - 1 : currentIndex - 1;
            }
            
            navLinksArray[nextIndex]?.focus();
        }
    }

    // Performance Optimized Scroll Handler
    let ticking = false;
    function optimizedScrollHandler() {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    }

    // Debounced Resize Handler
    let resizeTimeout;
    function handleResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Close mobile menu on resize to larger screen
            if (window.innerWidth >= 769 && navMenu?.classList.contains('active')) {
                toggleMobileMenu();
            }
        }, 250);
    }

    // Initialize Active Navigation from Hash
    function initializeActiveNav() {
        const hash = window.location.hash || '#home';
        updateActiveNavLink(hash);
        
        // Smooth scroll to section if hash exists
        if (hash !== '#home') {
            setTimeout(() => {
                const targetElement = document.querySelector(hash);
                if (targetElement) {
                    const headerHeight = header?.offsetHeight || 80;
                    window.scrollTo({
                        top: targetElement.offsetTop - headerHeight,
                        behavior: 'smooth'
                    });
                }
            }, 500);
        }
    }

    // Event Listeners
    hamburger?.addEventListener('click', toggleMobileMenu);
    navLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
        link.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                link.click();
            }
        });
    });

    // Button event listeners
    [ctaBtn, ...hireBtns, aboutBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', handleButtonClick);
        }
    });

    // Social icons hover effects
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.1)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Global event listeners
    window.addEventListener('scroll', optimizedScrollHandler);
    window.addEventListener('resize', handleResize);
    window.addEventListener('hashchange', initializeActiveNav);
    document.addEventListener('keydown', handleKeyboard);

    // Handle clicks outside mobile menu
    document.addEventListener('click', (event) => {
        if (navMenu?.classList.contains('active') && 
            !navMenu.contains(event.target) && 
            !hamburger?.contains(event.target)) {
            toggleMobileMenu();
        }
    });

    // 3D Parallax Effect for Hero Section
    function init3DParallax() {
        const homeSection = document.querySelector('.home');
        const homeContent = document.querySelector('.home-content');
        const imageContainer = document.querySelector('.image-container');
        const floatingCards = document.querySelectorAll('.floating-card');
        const stats = document.querySelectorAll('.stat');

        if (!homeSection || !homeContent) return;

        let rafId = null;
        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;

        // Smooth animation function
        function animate() {
            // Smooth interpolation
            currentX += (mouseX - currentX) * 0.1;
            currentY += (mouseY - currentY) * 0.1;

            // Apply parallax to home content
            const rotateX = (currentY / window.innerHeight - 0.5) * 10;
            const rotateY = (currentX / window.innerWidth - 0.5) * -10;

            homeContent.style.transform = `
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
            `;

            // Apply deeper parallax to image container
            if (imageContainer) {
                const imageRotateX = (currentY / window.innerHeight - 0.5) * 15;
                const imageRotateY = (currentX / window.innerWidth - 0.5) * -15;
                const imageTranslateZ = 30 + Math.abs(imageRotateY) * 2;

                imageContainer.style.transform = `
                    translateZ(${imageTranslateZ}px)
                    rotateX(${imageRotateX}deg)
                    rotateY(${imageRotateY}deg)
                `;
            }

            // Apply varying parallax to floating cards
            floatingCards.forEach((card, index) => {
                const depth = 40 + (index * 20);
                const cardRotateX = (currentY / window.innerHeight - 0.5) * (8 + index * 2);
                const cardRotateY = (currentX / window.innerWidth - 0.5) * -(8 + index * 2);

                card.style.transform = `
                    translateZ(${depth}px)
                    rotateX(${cardRotateX}deg)
                    rotateY(${cardRotateY}deg)
                `;
            });

            // Apply subtle parallax to stats
            stats.forEach((stat, index) => {
                const statDepth = 20 + (index * 5);
                const statRotateX = (currentY / window.innerHeight - 0.5) * 3;
                const statRotateY = (currentX / window.innerWidth - 0.5) * -3;

                stat.style.transform = `
                    translateZ(${statDepth}px)
                    rotateX(${statRotateX}deg)
                    rotateY(${statRotateY}deg)
                `;
            });

            rafId = requestAnimationFrame(animate);
        }

        // Mouse move handler
        function handleMouseMove(event) {
            const rect = homeSection.getBoundingClientRect();
            mouseX = event.clientX - rect.left;
            mouseY = event.clientY - rect.top;
        }

        // Mouse enter/leave handlers
        function handleMouseEnter() {
            if (!rafId) {
                rafId = requestAnimationFrame(animate);
            }
        }

        function handleMouseLeave() {
            // Reset to neutral position
            mouseX = window.innerWidth / 2;
            mouseY = window.innerHeight / 2;

            setTimeout(() => {
                if (rafId) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }

                // Smooth reset
                homeContent.style.transform = 'rotateX(0deg) rotateY(0deg)';

                if (imageContainer) {
                    imageContainer.style.transform = 'translateZ(30px) rotateX(0deg) rotateY(0deg)';
                }

                floatingCards.forEach((card, index) => {
                    const depth = 40 + (index * 20);
                    card.style.transform = `translateZ(${depth}px) rotateX(0deg) rotateY(0deg)`;
                });

                stats.forEach((stat, index) => {
                    const statDepth = 20 + (index * 5);
                    stat.style.transform = `translateZ(${statDepth}px) rotateX(0deg) rotateY(0deg)`;
                });
            }, 100);
        }

        // Touch support for mobile
        function handleTouchMove(event) {
            if (event.touches.length > 0) {
                const rect = homeSection.getBoundingClientRect();
                mouseX = event.touches[0].clientX - rect.left;
                mouseY = event.touches[0].clientY - rect.top;
            }
        }

        // Desktop/Tablet: Enable mouse parallax
        if (window.innerWidth >= 768) {
            homeSection.addEventListener('mousemove', handleMouseMove);
            homeSection.addEventListener('mouseenter', handleMouseEnter);
            homeSection.addEventListener('mouseleave', handleMouseLeave);

            // Touch events for tablets
            homeSection.addEventListener('touchmove', handleTouchMove);
            homeSection.addEventListener('touchstart', handleMouseEnter);
            homeSection.addEventListener('touchend', handleMouseLeave);

            // Initialize neutral position
            mouseX = window.innerWidth / 2;
            mouseY = window.innerHeight / 2;
        }
        // Mobile: Enable gyroscope parallax
        else if (window.innerWidth < 768) {
            initMobileGyroscope();
        }

        // Mobile Gyroscope 3D Parallax
        function initMobileGyroscope() {
            let gyroX = 0;
            let gyroY = 0;
            let currentGyroX = 0;
            let currentGyroY = 0;
            let gyroRafId = null;
            let isGyroActive = false;

            // Gyroscope animation loop
            function animateGyro() {
                // Smooth interpolation
                currentGyroX += (gyroX - currentGyroX) * 0.1;
                currentGyroY += (gyroY - currentGyroY) * 0.1;

                // Apply gyroscope parallax
                const rotateX = currentGyroY * 0.5; // Reduced intensity for mobile
                const rotateY = currentGyroX * -0.5;

                homeContent.style.transform = `
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                `;

                // Apply to image
                if (imageContainer) {
                    const imageRotateX = currentGyroY * 0.7;
                    const imageRotateY = currentGyroX * -0.7;
                    const imageTranslateZ = 30 + Math.abs(imageRotateY) * 2;

                    imageContainer.style.transform = `
                        translateZ(${imageTranslateZ}px)
                        rotateX(${imageRotateX}deg)
                        rotateY(${imageRotateY}deg)
                    `;
                }

                // Apply to stats
                stats.forEach((stat, index) => {
                    const statDepth = 20 + (index * 5);
                    const statRotateX = currentGyroY * 0.3;
                    const statRotateY = currentGyroX * -0.3;

                    stat.style.transform = `
                        translateZ(${statDepth}px)
                        rotateX(${statRotateX}deg)
                        rotateY(${statRotateY}deg)
                    `;
                });

                gyroRafId = requestAnimationFrame(animateGyro);
            }

            // Handle device orientation
            function handleOrientation(event) {
                if (!isGyroActive) {
                    isGyroActive = true;
                    gyroRafId = requestAnimationFrame(animateGyro);
                }

                // Get rotation values (beta = front-to-back, gamma = left-to-right)
                const beta = event.beta;  // -180 to 180 (front to back tilt)
                const gamma = event.gamma; // -90 to 90 (left to right tilt)

                // Normalize values to -20 to 20 range
                gyroX = Math.max(-20, Math.min(20, gamma));
                gyroY = Math.max(-20, Math.min(20, beta - 45)); // Subtract 45 to account for natural phone angle
            }

            // Request permission for iOS 13+
            function requestGyroPermission() {
                if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
                    // iOS 13+ requires permission
                    DeviceOrientationEvent.requestPermission()
                        .then(permissionState => {
                            if (permissionState === 'granted') {
                                window.addEventListener('deviceorientation', handleOrientation, true);
                                console.log('📱 Gyroscope 3D enabled for mobile!');
                            } else {
                                console.log('Gyroscope permission denied');
                            }
                        })
                        .catch(console.error);
                } else {
                    // Non-iOS or older iOS
                    window.addEventListener('deviceorientation', handleOrientation, true);
                    console.log('📱 Gyroscope 3D enabled for mobile!');
                }
            }

            // Auto-enable gyroscope when user interacts with the page
            let hasRequestedPermission = false;
            function enableGyroOnInteraction() {
                if (!hasRequestedPermission) {
                    hasRequestedPermission = true;
                    requestGyroPermission();
                    // Remove listeners after first interaction
                    homeSection.removeEventListener('touchstart', enableGyroOnInteraction);
                    homeSection.removeEventListener('click', enableGyroOnInteraction);
                }
            }

            // Wait for user interaction (required for iOS)
            homeSection.addEventListener('touchstart', enableGyroOnInteraction, { once: true });
            homeSection.addEventListener('click', enableGyroOnInteraction, { once: true });

            // Clean up on page unload
            window.addEventListener('beforeunload', () => {
                if (gyroRafId) {
                    cancelAnimationFrame(gyroRafId);
                }
                window.removeEventListener('deviceorientation', handleOrientation);
            });
        }
    }

    // Initialize everything
    function init() {
        // Start typewriter effect
        if (heroSubtitle) {
            typeWriter();
        }

        // Setup animations
        setupAnimations();

        // Initialize navigation
        initializeActiveNav();

        // Initial scroll check
        handleScroll();

        // Initialize 3D parallax effect
        init3DParallax();

        // Add loaded class for CSS animations
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 100);

        console.log('Portfolio website initialized successfully! 🚀');
        if (window.innerWidth >= 768) {
            console.log('🖱️ Desktop 3D Parallax: Mouse tracking enabled ✨');
        } else {
            console.log('📱 Mobile 3D Parallax: Gyroscope ready (tap to activate) ✨');
        }
    }

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            // Simple validation
            if (!data.name || !data.email || !data.subject || !data.message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }

            // Simulate form submission (replace with actual API call)
            console.log('Form submitted:', data);

            // Show success message
            showNotification('Thank you for your message! I will get back to you soon.', 'success');

            // Reset form
            this.reset();
        });
    }

    // Initialize the application
    init();

    // Add CSS for ripple effect and notifications
    const style = document.createElement('style');
    style.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        button {
            position: relative;
            overflow: hidden;
        }
        
        .loaded {
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        /* Focus styles for accessibility */
        .nav-link:focus-visible,
        .social-icon:focus-visible,
        .hire-btn:focus-visible,
        .cta-btn:focus-visible {
            outline: 2px solid var(--accent-primary);
            outline-offset: 2px;
        }
    `;
    document.head.appendChild(style);
});

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Page loaded in ${pageLoadTime}ms`);
        }, 0);
    });
}

// Error handling
window.addEventListener('error', (event) => {
    console.error('JavaScript Error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
});

// Service Worker Registration (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment if you have a service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}