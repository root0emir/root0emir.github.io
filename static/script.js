/* ================================================
   ROOT0EMIR PORTFOLIO - ADVANCED MATRIX EFFECTS
   Interactive Animations & Visual Effects
   ================================================ */

// ================================================
// MATRIX RAIN EFFECT
// ================================================
class MatrixRain {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*()';
        this.fontSize = 14;
        this.drops = [];

        this.init();
        this.animate();

        window.addEventListener('resize', () => this.init());
    }

    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = Array(this.columns).fill(1);
    }

    draw() {
        // Fade effect
        this.ctx.fillStyle = 'rgba(3, 7, 18, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Green matrix text
        this.ctx.fillStyle = '#00ff41';
        this.ctx.font = `${this.fontSize}px 'JetBrains Mono', monospace`;

        for (let i = 0; i < this.drops.length; i++) {
            const char = this.chars[Math.floor(Math.random() * this.chars.length)];
            const x = i * this.fontSize;
            const y = this.drops[i] * this.fontSize;

            // Random brightness for depth effect
            const alpha = Math.random() * 0.5 + 0.5;
            this.ctx.fillStyle = `rgba(0, 255, 65, ${alpha})`;
            this.ctx.fillText(char, x, y);

            // Reset drop randomly
            if (y > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }
    }

    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// ================================================
// PARTICLE SYSTEM
// ================================================
class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.particleCount = 100;
        this.colors = ['#00ff41', '#00f0ff', '#ff00ff'];

        this.init();
        this.animate();

        window.addEventListener('resize', () => this.init());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
    }

    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.particles = [];

        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(new Particle(this));
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let particle of this.particles) {
            particle.update();
            particle.draw();
        }

        this.connectParticles();
        requestAnimationFrame(() => this.animate());
    }

    connectParticles() {
        const maxDistance = 120;

        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.3;
                    this.ctx.strokeStyle = `rgba(0, 255, 65, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
}

class Particle {
    constructor(system) {
        this.system = system;
        this.x = Math.random() * system.canvas.width;
        this.y = Math.random() * system.canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.color = system.colors[Math.floor(Math.random() * system.colors.length)];
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Mouse interaction
        if (this.system.mouse.x && this.system.mouse.y) {
            const dx = this.x - this.system.mouse.x;
            const dy = this.y - this.system.mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.system.mouse.radius) {
                const force = (this.system.mouse.radius - distance) / this.system.mouse.radius;
                this.x += dx * force * 0.02;
                this.y += dy * force * 0.02;
            }
        }

        // Wrap around edges
        if (this.x < 0) this.x = this.system.canvas.width;
        if (this.x > this.system.canvas.width) this.x = 0;
        if (this.y < 0) this.y = this.system.canvas.height;
        if (this.y > this.system.canvas.height) this.y = 0;
    }

    draw() {
        this.system.ctx.fillStyle = this.color;
        this.system.ctx.beginPath();
        this.system.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.system.ctx.fill();

        // Glow effect
        this.system.ctx.shadowBlur = 10;
        this.system.ctx.shadowColor = this.color;
    }
}

// ================================================
// TYPEWRITER EFFECT
// ================================================
class Typewriter {
    constructor(elementId, phrases, typeSpeed = 100, deleteSpeed = 50, pauseTime = 2000) {
        this.element = document.getElementById(elementId);
        if (!this.element) return;

        this.phrases = phrases;
        this.typeSpeed = typeSpeed;
        this.deleteSpeed = deleteSpeed;
        this.pauseTime = pauseTime;
        this.phraseIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;

        this.type();
    }

    type() {
        const currentPhrase = this.phrases[this.phraseIndex];

        if (this.isDeleting) {
            this.element.textContent = currentPhrase.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentPhrase.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let timeout = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

        if (!this.isDeleting && this.charIndex === currentPhrase.length) {
            timeout = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
            timeout = 500;
        }

        setTimeout(() => this.type(), timeout);
    }
}

// ================================================
// ANIMATED COUNTER
// ================================================
class AnimatedCounter {
    constructor(element, target, duration = 2000) {
        this.element = element;
        this.target = target;
        this.duration = duration;
        this.startTime = null;
        this.started = false;
    }

    start() {
        if (this.started) return;
        this.started = true;
        this.animate();
    }

    animate(timestamp) {
        if (!this.startTime) this.startTime = timestamp;

        const progress = Math.min((timestamp - this.startTime) / this.duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeOut * this.target);

        this.element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame((t) => this.animate(t));
        } else {
            this.element.textContent = this.target;
        }
    }
}

// ================================================
// SCROLL ANIMATIONS
// ================================================
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.init();
    }

    init() {
        // Animate cards on scroll
        const animatedElements = document.querySelectorAll(
            '.project-card, .skill-card, .tool-card, .tech-card, .social-card, .about-card'
        );

        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, this.observerOptions);

        animatedElements.forEach(el => observer.observe(el));

        // Animate skill bars
        const skillBars = document.querySelectorAll('.skill-progress');

        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progress = entry.target.dataset.progress;
                    entry.target.style.width = `${progress}%`;
                }
            });
        }, this.observerOptions);

        skillBars.forEach(bar => skillObserver.observe(bar));

        // Animate counters
        const counters = document.querySelectorAll('.stat-value[data-count]');

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.count);
                    const counter = new AnimatedCounter(entry.target, target);
                    requestAnimationFrame((t) => counter.animate(t));
                    counterObserver.unobserve(entry.target);
                }
            });
        }, this.observerOptions);

        counters.forEach(counter => counterObserver.observe(counter));
    }
}

// ================================================
// NAVIGATION
// ================================================
class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section');

        this.init();
    }

    init() {
        // Scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }

            this.updateActiveLink();
        });

        // Smooth scroll
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    updateActiveLink() {
        let current = '';

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    }
}

// ================================================
// LIGHTBOX
// ================================================
class Lightbox {
    constructor() {
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImg = document.getElementById('lightbox-img');
        this.screenshots = document.querySelectorAll('.project-screenshot');

        if (!this.lightbox) return;

        this.init();
    }

    init() {
        this.screenshots.forEach(screenshot => {
            screenshot.addEventListener('click', () => {
                const img = screenshot.querySelector('img');
                if (img) {
                    this.lightboxImg.src = img.src;
                    this.lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox || e.target.closest('.lightbox-close')) {
                this.close();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.close();
        });
    }

    close() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ================================================
// CONSOLE WELCOME MESSAGE
// ================================================
function consoleWelcome() {
    const styles = {
        header: 'color: #00ff41; font-family: monospace; font-size: 12px;',
        text: 'color: #00f0ff; font-family: monospace; font-size: 14px;',
        accent: 'color: #ff00ff; font-family: monospace; font-size: 12px; font-weight: bold;'
    };

    console.log('%c╔══════════════════════════════════════════════════════════╗', styles.header);
    console.log('%c║                                                          ║', styles.header);
    console.log('%c║   ██████╗  ██████╗  ██████╗ ████████╗ ██████╗            ║', styles.header);
    console.log('%c║   ██╔══██╗██╔═══██╗██╔═══██╗╚══██╔══╝██╔═████╗           ║', styles.header);
    console.log('%c║   ██████╔╝██║   ██║██║   ██║   ██║   ██║██╔██║           ║', styles.header);
    console.log('%c║   ██╔══██╗██║   ██║██║   ██║   ██║   ████╔╝██║           ║', styles.header);
    console.log('%c║   ██║  ██║╚██████╔╝╚██████╔╝   ██║   ╚██████╔╝           ║', styles.header);
    console.log('%c║   ╚═╝  ╚═╝ ╚═════╝  ╚═════╝    ╚═╝    ╚═════╝            ║', styles.header);
    console.log('%c║                                                          ║', styles.header);
    console.log('%c║   EMIR - CYBERSECURITY RESEARCHER                        ║', styles.header);
    console.log('%c║                                                          ║', styles.header);
    console.log('%c╚══════════════════════════════════════════════════════════╝', styles.header);
    console.log('%c> System Status: ONLINE', styles.text);
    console.log('%c> Access Level: GRANTED', styles.accent);
    console.log('%c> Welcome to the Digital Fortress', styles.text);
}

// ================================================
// GLITCH EFFECT ON HOVER
// ================================================
function initGlitchEffect() {
    const glitchElements = document.querySelectorAll('.title-line.accent');

    glitchElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            el.style.animation = 'glitch 0.3s infinite';
        });

        el.addEventListener('mouseleave', () => {
            el.style.animation = 'text-glow 2s ease-in-out infinite alternate';
        });
    });
}

// ================================================
// PARALLAX EFFECT
// ================================================
function initParallax() {
    const heroContent = document.querySelector('.hero-content');

    if (!heroContent) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroContent.style.opacity = 1 - (scrolled * 0.002);
    });
}

// ================================================
// MAGNETIC BUTTONS
// ================================================
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
}

// ================================================
// INITIALIZE EVERYTHING
// ================================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize effects
    new MatrixRain('matrix-bg');
    new ParticleSystem('particles');

    // Initialize typewriter
    new Typewriter('typed-text', [
        ' whoami',
        ' cat skills.txt',
        ' ls -la ./projects',
        ' ./security-scan.sh',
        ' neofetch'
    ], 100, 50, 2000);

    // Initialize scroll animations
    new ScrollAnimations();

    // Initialize navigation
    new Navigation();

    // Initialize lightbox
    new Lightbox();

    // Initialize other effects
    initGlitchEffect();
    initParallax();
    initMagneticButtons();

    // Console welcome
    consoleWelcome();

    // Add loaded class to body
    document.body.classList.add('loaded');
});

// Reduce motion for users who prefer it
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition-fast', '0s');
    document.documentElement.style.setProperty('--transition-normal', '0s');
    document.documentElement.style.setProperty('--transition-slow', '0s');
}
