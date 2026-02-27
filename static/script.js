/* ============================================
   ROOT0EMIR 
   ============================================ */

// === Navbar scroll effect ===
const navbar = document.querySelector('.navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
}

// === Mobile menu toggle ===
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const spans = navToggle.querySelectorAll('span');
        if (navLinks.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });
    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        });
    });
}

// === Reveal on scroll ===
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// === Stat counter animation ===
const statNums = document.querySelectorAll('.stat-num[data-count]');
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-count'));
            let current = 0;
            const increment = target / 40;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                el.textContent = Math.floor(current) + '+';
            }, 40);
            statObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

statNums.forEach(el => statObserver.observe(el));

// === Skill bar animation ===
const skillBars = document.querySelectorAll('.skill-bar-fill[data-progress]');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const progress = el.getAttribute('data-progress');
            setTimeout(() => {
                el.style.width = progress + '%';
            }, 200);
            skillObserver.unobserve(el);
        }
    });
}, { threshold: 0.3 });

skillBars.forEach(el => skillObserver.observe(el));

// === Blog/Article Modal System ===
(function () {
    // Create modal overlay once
    const overlay = document.createElement('div');
    overlay.className = 'blog-modal-overlay';
    overlay.innerHTML = `
        <div class="blog-modal">
            <button class="blog-modal-close"><i class="fas fa-times"></i></button>
            <div class="blog-modal-tag"></div>
            <h2 class="blog-modal-title"></h2>
            <p class="blog-modal-desc"></p>
            <div class="blog-modal-body"></div>
        </div>
    `;
    document.body.appendChild(overlay);

    const modal = overlay.querySelector('.blog-modal');
    const closeBtn = overlay.querySelector('.blog-modal-close');
    const modalTag = overlay.querySelector('.blog-modal-tag');
    const modalTitle = overlay.querySelector('.blog-modal-title');
    const modalDesc = overlay.querySelector('.blog-modal-desc');
    const modalBody = overlay.querySelector('.blog-modal-body');

    function openModal(card) {
        const title = card.querySelector('.blog-card-header h3')?.textContent || '';
        const tag = card.querySelector('.tag')?.textContent || '';
        const desc = card.querySelector(':scope > p')?.textContent || '';
        const excerpt = card.querySelector('.blog-excerpt');
        const content = excerpt ? excerpt.innerHTML : '';

        modalTag.textContent = tag;
        modalTitle.textContent = title;
        modalDesc.textContent = desc;
        modalBody.innerHTML = content;

        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        modal.scrollTop = 0;
    }

    function closeModal() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Close on button click
    closeBtn.addEventListener('click', closeModal);

    // Close on overlay click (not modal itself)
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeModal();
        }
    });

    // Attach click to all blog cards
    document.querySelectorAll('.blog-card').forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(card);
        });
    });
})();

// === Particle Canvas Background ===
const canvas = document.getElementById('bg-particles');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 60;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.4 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(89, 148, 255, ${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(89, 148, 255, ${0.05 * (1 - dist / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(animate);
    }
    animate();
}

// === Typed text effect on hero ===
const typedEl = document.getElementById('typed-text');
if (typedEl) {
    const texts = [
        'cat /etc/security/hardening.conf',
        'systemctl status firewall',
        'nmap -sV --script vuln target',
        'tail -f /var/log/syslog',
        'iptables -L -n -v'
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentText = texts[textIndex];
        if (isDeleting) {
            typedEl.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedEl.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? 30 : 60;

        if (!isDeleting && charIndex === currentText.length) {
            delay = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            delay = 500;
        }

        setTimeout(typeEffect, delay);
    }
    typeEffect();
}
