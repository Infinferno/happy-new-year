/* =======================
   SCROLL REVEAL
======================= */
const reveals = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    },
    { threshold: 0.25 }
);

reveals.forEach(el => revealObserver.observe(el));

/* =======================
   FIREWORKS FINALE
======================= */
const fwCanvas = document.getElementById("fireworksCanvas");
const fwCtx = fwCanvas.getContext("2d");

function resizeFW() {
    fwCanvas.width = innerWidth;
    fwCanvas.height = innerHeight;
}
resizeFW();
addEventListener("resize", resizeFW);

let rockets = [];
let particles = [];
let fireworksActive = false;

class Rocket {
    constructor() {
        this.x = Math.random() * fwCanvas.width;
        this.y = fwCanvas.height;
        this.targetY = fwCanvas.height * (0.25 + Math.random() * 0.2);
        this.speed = 6 + Math.random() * 2;
    }
    update() {
        this.y -= this.speed;
        if (this.y <= this.targetY) {
            explode(this.x, this.y);
            return true;
        }
        return false;
    }
    draw() {
        fwCtx.fillStyle = "white";
        fwCtx.fillRect(this.x, this.y, 2, 10);
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 6;
        this.vy = (Math.random() - 0.5) * 6;
        this.life = 80;
        this.color = color;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
    }
    draw() {
        fwCtx.globalAlpha = this.life / 80;
        fwCtx.fillStyle = this.color;
        fwCtx.beginPath();
        fwCtx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        fwCtx.fill();
        fwCtx.globalAlpha = 1;
    }
}

function explode(x, y) {
    const colors = ["#ffd700", "#ff69b4", "#ffb6c1"];
    for (let i = 0; i < 70; i++) {
        particles.push(new Particle(x, y, colors[Math.floor(Math.random() * colors.length)]));
    }
}

function fireworksLoop() {
    fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);

    if (fireworksActive && Math.random() < 0.05) {
        rockets.push(new Rocket());
    }

    rockets = rockets.filter(r => !r.update());
    rockets.forEach(r => r.draw());

    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    requestAnimationFrame(fireworksLoop);
}
fireworksLoop();

/* Activate fireworks at final scene */
const finalScene = document.querySelector(".final");
new IntersectionObserver(
    entries => {
        if (entries[0].isIntersecting) fireworksActive = true;
    },
    { threshold: 0.4 }
).observe(finalScene);

/* =======================
   iOS-SAFE BACKGROUND MUSIC
======================= */

const bgMusic = document.getElementById("bgMusic");
const unlock = document.getElementById("audioUnlock");

unlock.addEventListener("click", () => {
    bgMusic.volume = 0;
    bgMusic.play().then(() => {
        let vol = 0;
        const fadeIn = setInterval(() => {
            if (vol < 0.5) {
                vol += 0.02;
                bgMusic.volume = vol;
            } else {
                clearInterval(fadeIn);
            }
        }, 200);
    });

    unlock.style.opacity = "0";
    setTimeout(() => unlock.remove(), 600);
});
