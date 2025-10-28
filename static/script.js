// Matrix Background Effect
const canvas = document.getElementById('matrix-bg');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Matrix characters
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
const fontSize = 14;
const columns = canvas.width / fontSize;

// Array to store drop positions
const drops = [];
for (let i = 0; i < columns; i++) {
    drops[i] = 1;
}

// Draw the matrix effect
function drawMatrix() {
    // Semi-transparent black to create fade effect
    ctx.fillStyle = 'rgba(5, 8, 20, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00ff41';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reset drop to top after reaching bottom
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

// Run the animation
setInterval(drawMatrix, 35);

// Resize canvas on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add typing effect to terminal prompt
const typedText = document.querySelector('.typed-text');
if (typedText) {
    const text = ' whoami';
    let index = 0;
    
    function typeWriter() {
        if (index < text.length) {
            typedText.textContent = text.substring(0, index + 1);
            index++;
            setTimeout(typeWriter, 150);
        } else {
            setTimeout(() => {
                index = 0;
                typeWriter();
            }, 3000);
        }
    }
    
    typeWriter();
}

// Add intersection observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.skill-card, .tool-card, .tech-card, .social-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Add glitch effect on hover to main title
const glitchElement = document.querySelector('.glitch');
if (glitchElement) {
    glitchElement.addEventListener('mouseenter', () => {
        glitchElement.style.animationDuration = '0.3s';
    });
    
    glitchElement.addEventListener('mouseleave', () => {
        glitchElement.style.animationDuration = '2s';
    });
}

// Console welcome message
console.log('%c┌─────────────────────────────────────────┐', 'color: #00ff41');
console.log('%c│   root0emir@cyrethium:~$               │', 'color: #00ff41');
console.log('%c│   Welcome to the Digital Fortress      │', 'color: #00ff41');
console.log('%c│   System Status: ONLINE ✓              │', 'color: #00ff41');
console.log('%c└─────────────────────────────────────────┘', 'color: #00ff41');
console.log('%cAccess Level: GRANTED', 'color: #00d9ff; font-size: 16px; font-weight: bold;');
