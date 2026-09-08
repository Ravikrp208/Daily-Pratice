/* ==========================================================================
   NEXUS // ANIMATED UI INTERACTIVE ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Clock Widget
    initClock();

    // 2. Particle Canvas System
    const particleEngine = initParticleCanvas();

    // 3. Audio Synthesizer Spectrum Canvas
    const audioEngine = initAudioCanvas();

    // 4. 3D Tilt Card Mechanics
    init3DTilt();

    // 5. Stat Counter Animations
    initCounterAnimations();

    // 6. SVG Chart Animation & Randomizer
    initSVGChart();

    // 7. Theme Selector Engine
    initThemeSelector();

    // 8. Control Triggers & Sliders
    initControlTriggers(particleEngine);

    // 9. Floating Dock Mechanics
    initDockNavigation();

    // 10. Command Palette Modal (Ctrl + K)
    initCommandPalette();

    // 11. Button Ripple Click Effect
    initRippleEffect();

    // Initial Welcome Toast Alert
    setTimeout(() => {
        showToast('NEXUS Engine Ready', 'Interactive 60FPS UI initialized successfully.', 'sparkles');
    }, 600);
});

/* --------------------------------------------------------------------------
   1. Real-Time Clock
   -------------------------------------------------------------------------- */
function initClock() {
    const clockEl = document.getElementById('liveClock');
    function updateClock() {
        const now = new Date();
        const hrs = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        const secs = String(now.getSeconds()).padStart(2, '0');
        if (clockEl) {
            clockEl.textContent = `${hrs}:${mins}:${secs}`;
        }
    }
    updateClock();
    setInterval(updateClock, 1000);
}

/* --------------------------------------------------------------------------
   2. Particle Physics Canvas Background
   -------------------------------------------------------------------------- */
function initParticleCanvas() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let particles = [];
    const particleCount = Math.floor(Math.min(width, height) / 14);
    let mouse = { x: null, y: null, radius: 150 };
    let enabled = true;

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 1.2;
            this.vy = (Math.random() - 0.5) * 1.2;
            this.radius = Math.random() * 2 + 1;
            this.baseAlpha = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Mouse repulsion / attraction
            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    let force = (mouse.radius - dist) / mouse.radius;
                    this.x -= (dx / dist) * force * 3;
                    this.y -= (dy / dist) * force * 3;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--primary').trim() || '#00f3ff';
            ctx.globalAlpha = this.baseAlpha;
            ctx.fill();
        }
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    createParticles();

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        createParticles();
    });

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    function animate() {
        ctx.clearRect(0, 0, width, height);

        if (enabled) {
            const primaryColor = getComputedStyle(document.body).getPropertyValue('--primary').trim() || '#00f3ff';

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                // Connect nearby particles
                for (let j = i + 1; j < particles.length; j++) {
                    let dx = particles[i].x - particles[j].x;
                    let dy = particles[i].y - particles[j].y;
                    let dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 110) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = primaryColor;
                        ctx.globalAlpha = (1 - dist / 110) * 0.25;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();

    return {
        toggle: (state) => { enabled = state; }
    };
}

/* --------------------------------------------------------------------------
   3. Audio Synthesizer Spectrum Canvas
   -------------------------------------------------------------------------- */
function initAudioCanvas() {
    const canvas = document.getElementById('audioCanvas');
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');

    let width = canvas.parentElement.clientWidth;
    let height = canvas.parentElement.clientHeight;
    canvas.width = width;
    canvas.height = height;

    let isPlaying = true;
    let speed = 1.5;
    let waveBars = 20;
    let step = 0;

    const playBtn = document.getElementById('audioToggleBtn');
    const playIcon = document.getElementById('playIcon');
    const speedSlider = document.getElementById('speedSlider');
    const waveSlider = document.getElementById('waveSlider');

    if (speedSlider) {
        speedSlider.addEventListener('input', (e) => speed = parseFloat(e.target.value));
    }
    if (waveSlider) {
        waveSlider.addEventListener('input', (e) => waveBars = parseInt(e.target.value));
    }

    if (playBtn) {
        playBtn.addEventListener('click', () => {
            isPlaying = !isPlaying;
            if (playIcon) {
                playIcon.setAttribute('data-lucide', isPlaying ? 'pause' : 'play');
                lucide.createIcons();
            }
            showToast('Spectrum Audio', isPlaying ? 'Spectrum visualizer resumed.' : 'Spectrum visualizer paused.', 'activity');
        });
    }

    window.addEventListener('resize', () => {
        if (canvas.parentElement) {
            width = canvas.width = canvas.parentElement.clientWidth;
            height = canvas.height = canvas.parentElement.clientHeight;
        }
    });

    function drawSpectrum() {
        ctx.clearRect(0, 0, width, height);

        const primaryColor = getComputedStyle(document.body).getPropertyValue('--primary').trim() || '#00f3ff';
        const secondaryColor = getComputedStyle(document.body).getPropertyValue('--secondary').trim() || '#8000ff';

        if (isPlaying) {
            step += 0.04 * speed;
        }

        // Draw EQ Bars
        const barWidth = (width / waveBars) - 6;
        for (let i = 0; i < waveBars; i++) {
            let amplitude = isPlaying 
                ? (Math.sin(step + i * 0.4) * 0.4 + Math.cos(step * 0.8 + i * 0.3) * 0.4 + 0.5) * (height * 0.7)
                : 12;

            let x = i * (barWidth + 6) + 3;
            let y = height - amplitude;

            let gradient = ctx.createLinearGradient(0, height, 0, y);
            gradient.addColorStop(0, primaryColor);
            gradient.addColorStop(1, secondaryColor);

            ctx.fillStyle = gradient;
            ctx.shadowBlur = 12;
            ctx.shadowColor = primaryColor;
            ctx.fillRect(x, y, barWidth, amplitude);
            ctx.shadowBlur = 0;
        }

        // Draw Sine Overlay Curve
        ctx.beginPath();
        for (let x = 0; x < width; x += 5) {
            let y = height / 2 + Math.sin(x * 0.02 + step * 1.5) * 24 * (isPlaying ? 1 : 0.2);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        requestAnimationFrame(drawSpectrum);
    }

    drawSpectrum();

    return {
        togglePlay: () => {
            if (playBtn) playBtn.click();
        }
    };
}

/* --------------------------------------------------------------------------
   4. 3D Tilt Cards
   -------------------------------------------------------------------------- */
function init3DTilt() {
    let tiltEnabled = true;
    const cards = document.querySelectorAll('.tilt-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (!tiltEnabled) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
        });
    });

    const tiltToggle = document.getElementById('toggleTilt');
    if (tiltToggle) {
        tiltToggle.addEventListener('change', (e) => {
            tiltEnabled = e.target.checked;
            if (!tiltEnabled) {
                cards.forEach(card => card.style.transform = 'none');
            }
        });
    }
}

/* --------------------------------------------------------------------------
   5. Stat Counter Animations
   -------------------------------------------------------------------------- */
function initCounterAnimations() {
    const numbers = document.querySelectorAll('.stat-number');

    numbers.forEach(num => {
        const target = parseFloat(num.getAttribute('data-target'));
        const decimals = parseInt(num.getAttribute('data-decimals') || '0');
        const duration = 1500;
        const startTime = performance.now();

        function updateNumber(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Cubic ease-out
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = (target * easeProgress).toFixed(decimals);

            num.textContent = currentValue;

            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        }

        requestAnimationFrame(updateNumber);
    });
}

/* --------------------------------------------------------------------------
   6. SVG Animated Chart & Points
   -------------------------------------------------------------------------- */
function initSVGChart() {
    const chartPath = document.getElementById('chartPath');
    const chartArea = document.getElementById('chartArea');
    const chartPointsContainer = document.getElementById('chartPoints');
    const refreshBtn = document.getElementById('randomizeChartBtn');

    const chartPathsPresets = [
        "M0,140 Q100,20 200,100 T400,60 T500,120",
        "M0,80 Q100,160 200,40 T400,120 T500,30",
        "M0,160 Q100,60 200,130 T400,30 T500,90",
        "M0,100 Q100,30 200,150 T400,80 T500,40"
    ];

    const chartAreasPresets = [
        "M0,200 L0,140 Q100,20 200,100 T400,60 T500,120 L500,200 Z",
        "M0,200 L0,80 Q100,160 200,40 T400,120 T500,30 L500,200 Z",
        "M0,200 L0,160 Q100,60 200,130 T400,30 T500,90 L500,200 Z",
        "M0,200 L0,100 Q100,30 200,150 T400,80 T500,40 L500,200 Z"
    ];

    let currentIdx = 0;

    function updateChart() {
        currentIdx = (currentIdx + 1) % chartPathsPresets.length;
        if (chartPath) {
            chartPath.setAttribute('d', chartPathsPresets[currentIdx]);
        }
        if (chartArea) {
            chartArea.setAttribute('d', chartAreasPresets[currentIdx]);
        }
        showToast('Chart Updated', 'Live SVG vector curve morphing triggered.', 'line-chart');
    }

    if (refreshBtn) {
        refreshBtn.addEventListener('click', updateChart);
    }
}

/* --------------------------------------------------------------------------
   7. Theme Selector Engine
   -------------------------------------------------------------------------- */
function initThemeSelector() {
    const themeBtns = document.querySelectorAll('.theme-btn');

    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.getAttribute('data-set-theme');
            document.body.setAttribute('data-theme', theme);

            themeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            showToast('Theme Changed', `Switched theme palette to ${theme.toUpperCase()}`, 'palette');
        });
    });
}

/* --------------------------------------------------------------------------
   8. Control Triggers & Sliders
   -------------------------------------------------------------------------- */
function initControlTriggers(particleEngine) {
    const toggleParticles = document.getElementById('toggleParticles');
    const toggleOrbs = document.getElementById('toggleOrbs');
    const glowSlider = document.getElementById('glowSlider');
    const glowVal = document.getElementById('glowVal');

    if (toggleParticles && particleEngine) {
        toggleParticles.addEventListener('change', (e) => {
            particleEngine.toggle(e.target.checked);
        });
    }

    if (toggleOrbs) {
        toggleOrbs.addEventListener('change', (e) => {
            const orbs = document.querySelectorAll('.glow-orb');
            orbs.forEach(orb => orb.style.opacity = e.target.checked ? '0.6' : '0');
        });
    }

    if (glowSlider && glowVal) {
        glowSlider.addEventListener('input', (e) => {
            const val = e.target.value;
            glowVal.textContent = `${val}%`;
            document.documentElement.style.setProperty('--glass-blur', `${val * 0.25}px`);
        });
    }

    // Trigger Notification Btn
    const triggerNotifBtn = document.getElementById('triggerNotificationBtn');
    if (triggerNotifBtn) {
        triggerNotifBtn.addEventListener('click', () => {
            showToast('Live Alert Triggered', 'Dynamic toast system executed at 60 FPS.', 'bell');
        });
    }

    // Explore Btn
    const exploreBtn = document.getElementById('exploreBtn');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            const visualizerSec = document.getElementById('visualizer');
            if (visualizerSec) visualizerSec.scrollIntoView({ behavior: 'smooth' });
        });
    }
}

/* --------------------------------------------------------------------------
   9. Floating Dock Navigation
   -------------------------------------------------------------------------- */
function initDockNavigation() {
    const dockItems = document.querySelectorAll('.dock-item');

    dockItems.forEach(item => {
        item.addEventListener('click', () => {
            dockItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const id = item.id;
            if (id === 'dockHome') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (id === 'dockAudio') {
                const el = document.getElementById('visualizer');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            } else if (id === 'dockAnalytics') {
                const el = document.getElementById('analytics');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            } else if (id === 'dockSearch') {
                openCommandPalette();
            } else if (id === 'dockToast') {
                showToast('Dock Action', 'Floating dock item triggered notification.', 'bell-ring');
            }
        });
    });
}

/* --------------------------------------------------------------------------
   10. Command Palette Modal (Ctrl + K)
   -------------------------------------------------------------------------- */
function openCommandPalette() {
    const modal = document.getElementById('commandModal');
    const input = document.getElementById('commandInput');
    if (modal) {
        modal.classList.add('open');
        if (input) input.focus();
    }
}

function closeCommandPalette() {
    const modal = document.getElementById('commandModal');
    if (modal) {
        modal.classList.remove('open');
    }
}

function initCommandPalette() {
    const cmdBtn = document.getElementById('cmdBtn');
    const modal = document.getElementById('commandModal');
    const input = document.getElementById('commandInput');
    const list = document.getElementById('commandList');

    if (cmdBtn) {
        cmdBtn.addEventListener('click', openCommandPalette);
    }

    window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (modal.classList.contains('open')) closeCommandPalette();
            else openCommandPalette();
        }
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeCommandPalette();
        }
    });

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeCommandPalette();
        });
    }

    if (input && list) {
        input.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const items = list.querySelectorAll('.command-item');
            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(query) ? 'flex' : 'none';
            });
        });
    }

    const commandItems = document.querySelectorAll('.command-item');
    commandItems.forEach(item => {
        item.addEventListener('click', () => {
            const action = item.getAttribute('data-action');
            if (action === 'theme-cyber') {
                document.querySelector('[data-set-theme="cyber"]').click();
            } else if (action === 'theme-aurora') {
                document.querySelector('[data-set-theme="aurora"]').click();
            } else if (action === 'audio-toggle') {
                document.getElementById('audioToggleBtn').click();
            } else if (action === 'refresh-chart') {
                document.getElementById('randomizeChartBtn').click();
            } else if (action === 'toast-alert') {
                showToast('Command Executed', 'Action selected via Ctrl+K Palette.', 'check-circle-2');
            }
            closeCommandPalette();
        });
    });
}

/* --------------------------------------------------------------------------
   11. Notification Toast Engine
   -------------------------------------------------------------------------- */
function showToast(title, message, iconName = 'bell') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <i data-lucide="${iconName}"></i>
        <div>
            <strong style="display:block; font-size: 0.9rem;">${title}</strong>
            <span style="font-size: 0.8rem; color: var(--text-muted);">${message}</span>
        </div>
    `;

    container.appendChild(toast);
    lucide.createIcons();

    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

/* --------------------------------------------------------------------------
   12. Ripple Effect on Buttons
   -------------------------------------------------------------------------- */
function initRippleEffect() {
    const triggers = document.querySelectorAll('.ripple-trigger, .btn');

    triggers.forEach(btn => {
        btn.addEventListener('click', function (e) {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            btn.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });
}
