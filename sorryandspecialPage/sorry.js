document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const backButton = document.getElementById('backButton');

    // --- Back Button Logic ---
    if (backButton) {
        backButton.addEventListener('click', () => {
            // Navigate back to the homepage
            window.location.href = '../homepage/homepage.html';
        });
    }

    // --- Cute Background Animation (Same as memories.js) ---
    const canvas = document.getElementById('cuteCanvas');
    if (!canvas) {
        console.error("Canvas element #cuteCanvas not found for sorry.js!");
        return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error("Failed to get 2D context for sorry.js!");
        return;
    }
    let particlesArray = [];
    
    const particleColors = [
        'rgba(240, 166, 202, 0.7)', // brand-accent-pink from Tailwind config
        'rgba(190, 149, 196, 0.7)', // A lilac/purple
        'rgba(224, 216, 245, 0.6)'  // A light lavender/white
    ];
    const numberOfParticles = 60; 

    const brandBgStart = '#231942'; 
    const brandBgEnd = '#5e548e';

    function setupCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, brandBgStart);
        gradient.addColorStop(1, brandBgEnd);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
            this.baseAlpha = parseFloat(color.split(',')[3]) || 0.7; 
            this.currentAlpha = this.baseAlpha * (0.3 + Math.random() * 0.7); 
            this.alphaChange = 0.002 + Math.random() * 0.003;
            this.fadingIn = Math.random() > 0.5;
            this.angle = Math.random() * Math.PI * 2; 
            this.rotationSpeed = (Math.random() - 0.5) * 0.01;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2, false);
            
            const particleGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
            let colorStart = this.color.replace(/[\d\.]+(?=\))/, (this.currentAlpha * 1.2).toFixed(2));
            let colorMid = this.color.replace(/[\d\.]+(?=\))/, this.currentAlpha.toFixed(2));
            let colorEnd = this.color.replace(/[\d\.]+(?=\))/, '0');

            particleGradient.addColorStop(0, colorStart);
            particleGradient.addColorStop(0.8, colorMid);
            particleGradient.addColorStop(1, colorEnd);
            ctx.fillStyle = particleGradient;
            
            ctx.fill();
            ctx.restore();
        }

        update() {
            if (this.x + this.size > canvas.width || this.x - this.size < 0) this.directionX = -this.directionX;
            if (this.y + this.size > canvas.height || this.y - this.size < 0) this.directionY = -this.directionY;
            
            this.x += this.directionX;
            this.y += this.directionY;
            this.angle += this.rotationSpeed;

            if (this.fadingIn) {
                this.currentAlpha += this.alphaChange;
                if (this.currentAlpha >= this.baseAlpha) {
                    this.currentAlpha = this.baseAlpha;
                    this.fadingIn = false;
                }
            } else {
                this.currentAlpha -= this.alphaChange;
                if (this.currentAlpha <= 0.1) {
                    this.currentAlpha = 0.1;
                    this.fadingIn = true;
                }
            }
        }
    }

    function initParticles() {
        particlesArray = [];
        const particleSizeMin = 7; 
        const particleSizeMax = 14;
        const speedFactor = 0.12;

        for (let i = 0; i < numberOfParticles; i++) {
            let size = Math.random() * (particleSizeMax - particleSizeMin) + particleSizeMin;
            let x = Math.random() * (canvas.width - size * 2) + size;
            let y = Math.random() * (canvas.height - size * 2) + size;
            let directionX = (Math.random() * 2 - 1) * speedFactor;
            let directionY = (Math.random() * 2 - 1) * speedFactor;
            let color = particleColors[Math.floor(Math.random() * particleColors.length)];
            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    function animateParticles() {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, brandBgStart);
        gradient.addColorStop(1, brandBgEnd);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update(); 
            particlesArray[i].draw();   
        }
        requestAnimationFrame(animateParticles);
    }
    
    setupCanvas(); 
    initParticles();
    animateParticles(); 

    window.addEventListener('resize', () => {
        setupCanvas(); 
        initParticles(); 
    });
});
