document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const memoriesButton = document.getElementById('memoriesButton');
    const sorryButton = document.getElementById('sorryButton');
    const specialMessageButton = document.getElementById('specialMessageButton');
    const instructionMessage = document.getElementById('instructionMessage');
    const statusMessage = document.getElementById('statusMessage'); // For feedback

    const buttons = [memoriesButton, sorryButton, specialMessageButton];

    // --- State Management Keys ---
    const MEMORIES_UNLOCKED_KEY = 'memoriesPathUnlocked';
    const SORRY_UNLOCKED_KEY = 'sorryPathUnlocked';
    // Renamed for clarity, this key signifies the "Special Message" has been unlocked
    const SPECIAL_MESSAGE_UNLOCKED_KEY = 'specialMessagePathUnlocked'; 

    // --- Cute Background Animation (Code from your provided snippet - unchanged) ---
    const canvas = document.getElementById('cuteCanvas');
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    // Assuming these particle colors are from your Tailwind config or desired theme
    const particleColors = ['rgba(248, 194, 216, 0.6)', 'rgba(216, 180, 254, 0.6)', 'rgba(255, 255, 255, 0.5)']; 
    const numberOfParticles = 50; 

    function setupCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // If your canvas has a gradient background, it should be drawn here too
        // For example, if using brand-bg-start and brand-bg-end from a previous HTML config:
        // const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        // gradient.addColorStop(0, '#231942'); // Example color
        // gradient.addColorStop(1, '#5e548e'); // Example color
        // ctx.fillStyle = gradient;
        // ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
            this.baseAlpha = parseFloat(color.split(',')[3]) || 0.6; // Ensure a fallback alpha
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
            
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
            // Ensure alpha values are correctly applied in RGBA string
            let colorStart = this.color.replace(/[\d\.]+(?=\))/, (this.currentAlpha * 1.2).toFixed(2));
            let colorMid = this.color.replace(/[\d\.]+(?=\))/, this.currentAlpha.toFixed(2));
            let colorEnd = this.color.replace(/[\d\.]+(?=\))/, '0');

            gradient.addColorStop(0, colorStart);
            gradient.addColorStop(0.8, colorMid);
            gradient.addColorStop(1, colorEnd);
            ctx.fillStyle = gradient;
            
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
            // this.draw() will be called in animateParticles after clearing canvas
        }
    }

    function initParticles() {
        particlesArray = [];
        const particleSizeMin = 8; 
        const particleSizeMax = 15;
        const speedFactor = 0.15; 

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
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas first
        // Redraw canvas background if it's a gradient (see setupCanvas example)
        // If setupCanvas draws the gradient, you might call it here or part of its logic
        // For simplicity, if background is static CSS/HTML, just clearRect is fine.
        // If canvas itself has the gradient, it needs to be redrawn:
        // const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        // gradient.addColorStop(0, '#231942'); // Example color
        // gradient.addColorStop(1, '#5e548e'); // Example color
        // ctx.fillStyle = gradient;
        // ctx.fillRect(0, 0, canvas.width, canvas.height);


        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update(); // Update particle state
            particlesArray[i].draw();   // Then draw it
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

    // --- Button Logic (UPDATED) ---
    function updateButtonStates() {
        const memoriesUnlocked = localStorage.getItem(MEMORIES_UNLOCKED_KEY) === 'true';
        const sorryUnlocked = localStorage.getItem(SORRY_UNLOCKED_KEY) === 'true';
        const specialMessageUnlocked = localStorage.getItem(SPECIAL_MESSAGE_UNLOCKED_KEY) === 'true';

        // Default instruction class (assuming 'brand-accent-pink' is your primary instruction color)
        const instructionColorClass = "text-brand-accent-pink font-semibold mb-8 text-sm sm:text-base";
        const completionColorClass = "text-green-500 font-semibold mb-8 text-sm sm:text-base"; // For the final message

        if (specialMessageUnlocked) { 
            // All 3 steps completed, allow revisiting any button
            memoriesButton.disabled = false;
            sorryButton.disabled = false;
            specialMessageButton.disabled = false;
            instructionMessage.textContent = "NOWwwwwww uptooo youuu ❤️";
            instructionMessage.className = completionColorClass;
        } else if (sorryUnlocked) { 
            // Memories and Sorry are done, Special Message is next
            memoriesButton.disabled = true;
            sorryButton.disabled = true;
            specialMessageButton.disabled = false;
            instructionMessage.textContent = "Finally, wo wakttt aagayaaa h";
            instructionMessage.className = instructionColorClass;
        } else if (memoriesUnlocked) { 
            // Memories is done, Sorry is next
            memoriesButton.disabled = true;
            sorryButton.disabled = false;
            specialMessageButton.disabled = true;
            instructionMessage.textContent = "Welll,I am sorry cutuuuuuuu";
            instructionMessage.className = instructionColorClass;
        } else { 
            // Initial state, Memories is next
            memoriesButton.disabled = false;
            sorryButton.disabled = true;
            specialMessageButton.disabled = true;
            instructionMessage.textContent = "Pehle memories Ayuuu"; // Your custom first instruction
            instructionMessage.className = instructionColorClass;
        }

        // Logic for subtle pulse animation on the currently active button (optional)
        buttons.forEach(button => {
            button.style.animation = 'none'; // Reset animation for all
        });

        if (!specialMessageUnlocked) {
            if (!memoriesUnlocked) {
                if (!memoriesButton.disabled) memoriesButton.style.animation = 'subtleButtonPulse 2.5s infinite ease-in-out';
            } else if (!sorryUnlocked) {
                if (!sorryButton.disabled) sorryButton.style.animation = 'subtleButtonPulse 2.5s infinite ease-in-out';
            } else {
                if (!specialMessageButton.disabled) specialMessageButton.style.animation = 'subtleButtonPulse 2.5s infinite ease-in-out';
            }
        }
    }

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.disabled) {
                statusMessage.textContent = "Please follow the order, my love.";
                // Ensure statusMessage text color is visible (e.g., text-brand-accent-pink or similar)
                statusMessage.className = "mt-8 text-sm h-5 text-brand-accent-pink"; 
                setTimeout(() => {
                    statusMessage.textContent = "";
                    // Reset class if needed, or keep it if default is fine
                    statusMessage.className = "mt-8 text-sm h-5 text-content-box-text-secondary"; 
                }, 3000);
                return;
            }

            const step = parseInt(button.dataset.step);
            const targetPage = button.dataset.target;

            if (step === 1) {
                localStorage.setItem(MEMORIES_UNLOCKED_KEY, 'true');
            } else if (step === 2) {
                // Ensure memories was actually unlocked before unlocking sorry - good for robustness
                if (localStorage.getItem(MEMORIES_UNLOCKED_KEY) === 'true') {
                    localStorage.setItem(SORRY_UNLOCKED_KEY, 'true');
                } else {
                    // This case should ideally not happen if buttons disable correctly
                    statusMessage.textContent = "Areeeeeee,Memories pehle meri cutoooooo!";
                    statusMessage.className = "mt-8 text-sm h-5 text-brand-accent-pink";
                    setTimeout(() => {
                        statusMessage.textContent = "";
                        statusMessage.className = "mt-8 text-sm h-5 text-content-box-text-secondary";
                    }, 3000);
                    updateButtonStates(); // Re-evaluate button states
                    return;
                }
            } else if (step === 3) {
                // Ensure sorry was unlocked
                if (localStorage.getItem(SORRY_UNLOCKED_KEY) === 'true') {
                    localStorage.setItem(SPECIAL_MESSAGE_UNLOCKED_KEY, 'true'); // Use the new key
                } else {
                    statusMessage.textContent = "Madammm jiii,order pata hai na my cutu ko";
                     statusMessage.className = "mt-8 text-sm h-5 text-brand-accent-pink";
                    setTimeout(() => {
                        statusMessage.textContent = "";
                        statusMessage.className = "mt-8 text-sm h-5 text-content-box-text-secondary";
                    }, 3000);
                    updateButtonStates();
                    return;
                }
            }
            
            statusMessage.textContent = `Opening "${button.textContent.trim()}"...`;
            statusMessage.className = "mt-8 text-sm h-5 text-content-box-text-secondary"; // Default status color

            setTimeout(() => {
                window.location.href = targetPage;
            }, 700);
            
            // Update button states immediately after setting localStorage,
            // so if user comes back before redirect, state is correct.
            // The redirect will happen anyway.
            updateButtonStates(); 
        });
    });

    // Initial setup
    updateButtonStates();

    // For testing in browser console:
    // To reset progress: localStorage.removeItem(MEMORIES_UNLOCKED_KEY); localStorage.removeItem(SORRY_UNLOCKED_KEY); localStorage.removeItem(SPECIAL_MESSAGE_UNLOCKED_KEY); updateButtonStates();
    // To unlock memories: localStorage.setItem(MEMORIES_UNLOCKED_KEY, 'true'); updateButtonStates();
    // To unlock sorry: localStorage.setItem(MEMORIES_UNLOCKED_KEY, 'true'); localStorage.setItem(SORRY_UNLOCKED_KEY, 'true'); updateButtonStates();
});
