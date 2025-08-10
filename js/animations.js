// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -20px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            // Remove observer after animation triggers
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initParticleEffect();
    initHoverEffects();
    initCounterAnimations();
});

// Scroll-triggered animations
function initScrollAnimations() {
    const elementsToAnimate = document.querySelectorAll(
        '.section-title, .about-text, .skills-grid, .education-item, .experience-item, .project-card, .contact-intro, .skill-category, .contact-item'
    );
    
    elementsToAnimate.forEach((el, index) => {
        // Add stagger delay
        el.style.animationDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
    
    // Special handling for project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });
}

// Particle effect for hero background
function initParticleEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const particleCount = window.innerWidth > 768 ? 50 : 25;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(hero, i);
    }
}

function createParticle(container, index) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const size = Math.random() * 3 + 1;
    const left = Math.random() * 100;
    const animationDuration = Math.random() * 3 + 2;
    const delay = Math.random() * 2;
    
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(251, 191, 36, ${Math.random() * 0.5 + 0.2});
        border-radius: 50%;
        left: ${left}%;
        top: ${Math.random() * 100}%;
        animation: particleFloat ${animationDuration}s ease-in-out infinite;
        animation-delay: ${delay}s;
        pointer-events: none;
    `;
    
    container.appendChild(particle);
}

// Add particle animation CSS
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes particleFloat {
        0%, 100% { 
            transform: translateY(0px) translateX(0px);
            opacity: 1;
        }
        25% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.8;
        }
        50% { 
            transform: translateY(-40px) translateX(-10px);
            opacity: 0.6;
        }
        75% {
            transform: translateY(-20px) translateX(5px);
            opacity: 0.8;
        }
    }
`;
document.head.appendChild(particleStyle);

// Enhanced hover effects
function initHoverEffects() {
    // Project cards tilt effect
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
    
    // Skill tags wave effect
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach((tag, index) => {
        tag.addEventListener('mouseenter', function() {
            // Create wave effect through nearby tags
            skillTags.forEach((otherTag, otherIndex) => {
                const distance = Math.abs(index - otherIndex);
                if (distance <= 2) {
                    setTimeout(() => {
                        otherTag.style.transform = 'scale(1.1)';
                        setTimeout(() => {
                            otherTag.style.transform = 'scale(1)';
                        }, 150);
                    }, distance * 50);
                }
            });
        });
    });
}

// Counter animations for achievements
function initCounterAnimations() {
    const counters = [
        { element: '.hero-title', endValue: 89, suffix: '% accuracy', duration: 2000 },
        { element: '.experience-badge', endValue: 3, suffix: '+ Years', duration: 1500 }
    ];
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    });
    
    // Find elements with numbers to animate
    document.querySelectorAll('.experience-achievements li').forEach(li => {
        if (li.textContent.includes('%') || li.textContent.includes('hours')) {
            counterObserver.observe(li);
        }
    });
}

function animateCounter(element) {
    const text = element.textContent;
    const numbers = text.match(/\d+/g);
    
    if (numbers) {
        numbers.forEach(num => {
            const endValue = parseInt(num);
            animateNumber(element, 0, endValue, 2000, text);
        });
    }
}

function animateNumber(element, start, end, duration, originalText) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * easeOutQuart(progress));
        element.textContent = originalText.replace(/\d+/, current);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Easing function
function easeOutQuart(t) {
    return 1 - (--t) * t * t * t;
}

// Mouse trail effect
let mouseTrail = [];
const maxTrailLength = 10;

document.addEventListener('mousemove', function(e) {
    if (window.innerWidth > 768) { // Only on desktop
        mouseTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
        
        if (mouseTrail.length > maxTrailLength) {
            mouseTrail.shift();
        }
        
        updateMouseTrail();
    }
});

function updateMouseTrail() {
    // Remove old trail elements
    document.querySelectorAll('.mouse-trail').forEach(el => el.remove());
    
    mouseTrail.forEach((point, index) => {
        const trail = document.createElement('div');
        trail.className = 'mouse-trail';
        trail.style.cssText = `
            position: fixed;
            width: ${6 - index * 0.5}px;
            height: ${6 - index * 0.5}px;
            background: rgba(251, 191, 36, ${0.5 - index * 0.05});
            border-radius: 50%;
            left: ${point.x}px;
            top: ${point.y}px;
            pointer-events: none;
            z-index: 9999;
            transition: all 0.1s ease;
        `;
        
        document.body.appendChild(trail);
        
        // Remove after animation
        setTimeout(() => {
            if (trail.parentNode) {
                trail.parentNode.removeChild(trail);
            }
        }, 1000);
    });
}

// Scroll progress indicator
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(135deg, #2563eb 0%, #fbbf24 100%);
        z-index: 10001;
        transition: width 0.3s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', throttle(() => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    }, 50));
}

// Initialize scroll progress on load
window.addEventListener('load', initScrollProgress);

// Section reveal animations with custom timing
function initSectionReveal() {
    const sections = document.querySelectorAll('.section');
    
    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'sectionSlideUp 0.8s ease forwards';
                sectionObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        sectionObserver.observe(section);
    });
}

// Add section animation CSS
const sectionStyle = document.createElement('style');
sectionStyle.textContent = `
    @keyframes sectionSlideUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(sectionStyle);

// Initialize section reveal
window.addEventListener('load', initSectionReveal);

// Image lazy loading
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Dark mode toggle (bonus feature)
function initDarkMode() {
    const darkModeToggle = document.createElement('button');
    darkModeToggle.innerHTML = '🌙';
    darkModeToggle.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: none;
        background: rgba(37, 99, 235, 0.9);
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        z-index: 1000;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
    `;
    
    darkModeToggle.addEventListener('click', toggleDarkMode);
    document.body.appendChild(darkModeToggle);
    
    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        enableDarkMode();
        darkModeToggle.innerHTML = '☀️';
    }
}

function toggleDarkMode() {
    const darkModeToggle = document.querySelector('button[style*="bottom: 20px"]');
    
    if (document.body.classList.contains('dark-mode')) {
        disableDarkMode();
        darkModeToggle.innerHTML = '🌙';
    } else {
        enableDarkMode();
        darkModeToggle.innerHTML = '☀️';
    }
}

function enableDarkMode() {
    document.body.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'enabled');
}

function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', null);
}

// Performance monitoring
function initPerformanceMonitoring() {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const loadTime = performance.now();
            console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
            
            // Show performance info in console
            if (performance.getEntriesByType) {
                const resources = performance.getEntriesByType('resource');
                console.log(`Loaded ${resources.length} resources`);
            }
        }, 0);
    });
}

// Initialize performance monitoring
initPerformanceMonitoring();

// Smooth transitions between sections
function initSectionTransitions() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Add transition effect
                document.body.style.overflow = 'hidden';
                
                setTimeout(() => {
                    scrollToSection(targetId);
                    document.body.style.overflow = 'auto';
                }, 100);
            }
        });
    });
}

// Background pattern animation
function initBackgroundPattern() {
    const hero = document.querySelector('.hero');
    
    // Create animated background dots
    for (let i = 0; i < 20; i++) {
        const dot = document.createElement('div');
        dot.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(251, 191, 36, 0.3);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: twinkle ${2 + Math.random() * 3}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        hero.appendChild(dot);
    }
}

// Add twinkle animation
const twinkleStyle = document.createElement('style');
twinkleStyle.textContent = `
    @keyframes twinkle {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.5); }
    }
`;
document.head.appendChild(twinkleStyle);

// Initialize background pattern
window.addEventListener('load', initBackgroundPattern);

// Button ripple effect
function addRippleEffect() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .download-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Add ripple animation CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Initialize ripple effect
window.addEventListener('load', addRippleEffect);

// Text reveal animation
function initTextReveal() {
    const textElements = document.querySelectorAll('.hero-description, .about-text p');
    
    textElements.forEach(element => {
        const text = element.textContent;
        element.innerHTML = '';
        
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.cssText = `
                opacity: 0;
                animation: charReveal 0.05s ease forwards;
                animation-delay: ${index * 0.02}s;
            `;
            element.appendChild(span);
        });
    });
}

// Add character reveal animation
const charStyle = document.createElement('style');
charStyle.textContent = `
    @keyframes charReveal {
        to {
            opacity: 1;
        }
    }
`;
document.head.appendChild(charStyle);

// Magnetic button effect
function initMagneticButtons() {
    const magneticElements = document.querySelectorAll('.btn-primary, .btn-secondary');
    
    magneticElements.forEach(element => {
        element.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0, 0)';
        });
    });
}

// Initialize magnetic buttons
window.addEventListener('load', initMagneticButtons);

// Intersection observer for skill bars animation
function initSkillBars() {
    const skillCategories = document.querySelectorAll('.skill-category');
    
    skillCategories.forEach((category, index) => {
        category.style.animationDelay = `${index * 0.2}s`;
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'slideInFromLeft 0.8s ease forwards';
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(category);
    });
}

// Add slide in animation
const slideStyle = document.createElement('style');
slideStyle.textContent = `
    @keyframes slideInFromLeft {
        from {
            opacity: 0;
            transform: translateX(-50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(slideStyle);

// Initialize skill bars animation
window.addEventListener('load', initSkillBars);