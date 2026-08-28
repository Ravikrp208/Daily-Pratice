// ZenFlow - Application Logic

// ==========================================
// 1. STATE & GLOBAL VARIABLES
// ==========================================
let state = {
    mood: 'focus', // 'focus', 'calm', 'energy', 'rest'
    timer: {
        mode: 'focus', // 'focus', 'short', 'long'
        duration: 25 * 60, // in seconds
        timeLeft: 25 * 60,
        isRunning: false,
        intervalId: null
    },
    breath: {
        isActive: false,
        stage: 'ready', // 'ready', 'inhale', 'hold1', 'exhale', 'hold2'
        duration: 4, // 4 seconds per phase (Box Breathing)
        timeLeft: 4,
        intervalId: null,
        cyclesCompleted: 0
    },
    stats: {
        focusMinutes: 0,
        breathMinutes: 0,
        focusGoal: 120, // 120 minutes
        breathGoal: 10 // 10 minutes
    },
    synth: {
        masterOn: false,
        rainOn: false,
        droneOn: false,
        binauralOn: false,
        rainVol: 0.5,
        droneVol: 0.4,
        binauralVol: 0.3
    }
};

// Web Audio API Global Variables
let audioCtx = null;
let masterGain = null;
let rainNode = null, rainGain = null;
let droneOsc1 = null, droneOsc2 = null, droneFilter = null, droneLfo = null, droneLfoGain = null, droneGain = null;
let binOscL = null, binOscR = null, binMerger = null, binGain = null;
let analyser = null;
let visualizerAnimationId = null;

// ==========================================
// 2. ZEN QUOTES DATA
// ==========================================
const zenQuotes = [
    { text: "The present moment is filled with joy and happiness. If you are attentive, you will see it.", author: "Thich Nhat Hanh" },
    { text: "Quiet the mind and the soul will speak.", author: "Ma Jaya Sati Bhagavati" },
    { text: "Nature does not hurry, yet everything is accomplished.", author: "Lao Tzu" },
    { text: "Mindfulness isn't difficult, we just need to remember to do it.", author: "Sharon Salzberg" },
    { text: "Be here now.", author: "Ram Dass" },
    { text: "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.", author: "Buddha" },
    { text: "The feeling that any task is a nuisance will soon disappear if it is done with mindfulness.", author: "Nyanaponika Thera" },
    { text: "He who holds back rising anger like a rolling chariot, him I call a real driver.", author: "Dhammapada" },
    { text: "To understand everything is to forgive everything.", author: "Gautama Buddha" },
    { text: "With every breath, I release anxiety and welcome peace.", author: "Zen Mantra" },
    { text: "Act without expectation.", author: "Lao Tzu" },
    { text: "The best way to capture moments is to pay attention. This is mindfulness.", author: "Jon Kabat-Zinn" },
    { text: "Life is a dance between making it happen and letting it happen.", author: "Arianna Huffington" }
];

// ==========================================
// 3. INITIALIZATION & SETUP
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();
    
    // Load state from local storage if exists
    loadStateFromLocalStorage();

    // Start Clock
    updateClock();
    setInterval(updateClock, 1000);

    // Initialize Event Listeners
    initEventListeners();

    // Set Default Mood Themes
    setMood(state.mood);

    // Render Quests/Todos
    renderTodos();

    // Render Stats
    updateStatsUI();

    // Load Random Quote
    fetchNewQuote();

    // Setup Canvas Visualizer
    setupCanvas();
});

// ==========================================
// 4. EVENT LISTENERS
// ==========================================
function initEventListeners() {
    // Pomodoro Controls
    document.getElementById('btn-timer-toggle').addEventListener('click', toggleTimer);
    document.getElementById('btn-timer-reset').addEventListener('click', resetTimer);
    document.getElementById('btn-timer-skip').addEventListener('click', skipTimer);

    // Breathing Control
    document.getElementById('btn-breath-toggle').addEventListener('click', toggleBreathing);

    // Audio Master Control
    document.getElementById('btn-audio-master').addEventListener('click', toggleMasterAudio);

    // Quest / Todo Form
    document.getElementById('todo-form').addEventListener('submit', (e) => {
        e.preventDefault();
        addTodo();
    });
}

// ==========================================
// 5. CLOCK & MOOD MANAGER
// ==========================================
function updateClock() {
    const now = new Date();
    
    // Time format: HH:MM:SS
    const hrs = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('live-time').textContent = `${hrs}:${mins}:${secs}`;
    
    // Date format: Aug 28, 2026
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    document.getElementById('live-date').textContent = now.toLocaleDateString('en-US', options);
}

function setMood(mood) {
    state.mood = mood;
    saveStateToLocalStorage();

    // Reset mood button classes
    const buttons = document.querySelectorAll('.mood-btn');
    buttons.forEach(btn => {
        btn.className = 'mood-btn px-3 py-1.5 text-xs font-semibold rounded-xl transition-all duration-300 text-slate-400 hover:text-slate-200';
    });

    const activeBtn = document.getElementById(`mood-${mood}`);
    const glow1 = document.getElementById('bg-glow-1');
    const glow2 = document.getElementById('bg-glow-2');
    const logoIcon = document.getElementById('logo-icon');

    if (!activeBtn) return;

    // Mood styles adjustments
    if (mood === 'focus') {
        activeBtn.className = 'mood-btn px-3 py-1.5 text-xs font-semibold rounded-xl transition-all duration-300 bg-purple-600/20 text-purple-300 border border-purple-500/30';
        glow1.className = 'absolute top-[-25%] left-[-15%] w-[60vw] h-[60vw] rounded-full bg-purple-900/10 blur-[150px] animate-blob-1 pointer-events-none transition-all duration-1000';
        glow2.className = 'absolute bottom-[-20%] right-[-15%] w-[60vw] h-[60vw] rounded-full bg-cyan-900/10 blur-[150px] animate-blob-2 pointer-events-none transition-all duration-1000';
        logoIcon.className = 'w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/15 transform transition-transform duration-500 hover:rotate-6';
    } else if (mood === 'calm') {
        activeBtn.className = 'mood-btn px-3 py-1.5 text-xs font-semibold rounded-xl transition-all duration-300 bg-teal-600/20 text-teal-300 border border-teal-500/30';
        glow1.className = 'absolute top-[-25%] left-[-15%] w-[60vw] h-[60vw] rounded-full bg-teal-950/15 blur-[150px] animate-blob-1 pointer-events-none transition-all duration-1000';
        glow2.className = 'absolute bottom-[-20%] right-[-15%] w-[60vw] h-[60vw] rounded-full bg-emerald-950/15 blur-[150px] animate-blob-2 pointer-events-none transition-all duration-1000';
        logoIcon.className = 'w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/15 transform transition-transform duration-500 hover:rotate-6';
    } else if (mood === 'energy') {
        activeBtn.className = 'mood-btn px-3 py-1.5 text-xs font-semibold rounded-xl transition-all duration-300 bg-amber-600/20 text-amber-300 border border-amber-500/30';
        glow1.className = 'absolute top-[-25%] left-[-15%] w-[60vw] h-[60vw] rounded-full bg-amber-950/10 blur-[150px] animate-blob-1 pointer-events-none transition-all duration-1000';
        glow2.className = 'absolute bottom-[-20%] right-[-15%] w-[60vw] h-[60vw] rounded-full bg-rose-950/10 blur-[150px] animate-blob-2 pointer-events-none transition-all duration-1000';
        logoIcon.className = 'w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center shadow-lg shadow-amber-500/15 transform transition-transform duration-500 hover:rotate-6';
    } else if (mood === 'rest') {
        activeBtn.className = 'mood-btn px-3 py-1.5 text-xs font-semibold rounded-xl transition-all duration-300 bg-cyan-600/20 text-cyan-300 border border-cyan-500/30';
        glow1.className = 'absolute top-[-25%] left-[-15%] w-[60vw] h-[60vw] rounded-full bg-cyan-950/10 blur-[150px] animate-blob-1 pointer-events-none transition-all duration-1000';
        glow2.className = 'absolute bottom-[-20%] right-[-15%] w-[60vw] h-[60vw] rounded-full bg-blue-950/10 blur-[150px] animate-blob-2 pointer-events-none transition-all duration-1000';
        logoIcon.className = 'w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/15 transform transition-transform duration-500 hover:rotate-6';
    }
}

// ==========================================
// 6. POMODORO TIMER ENGINE
// ==========================================
function switchTimerMode(mode) {
    if (state.timer.isRunning) {
        clearInterval(state.timer.intervalId);
        state.timer.isRunning = false;
    }

    state.timer.mode = mode;
    
    // Set duration based on mode
    if (mode === 'focus') {
        state.timer.duration = 25 * 60;
        document.getElementById('timer-status-text').textContent = 'Get Ready';
        document.getElementById('timer-status-text').className = 'text-[10px] uppercase font-semibold text-purple-400 tracking-widest mt-1';
        setTimerUIModeStyles('pomo');
    } else if (mode === 'short') {
        state.timer.duration = 5 * 60;
        document.getElementById('timer-status-text').textContent = 'Take a Breath';
        document.getElementById('timer-status-text').className = 'text-[10px] uppercase font-semibold text-cyan-400 tracking-widest mt-1';
        setTimerUIModeStyles('short');
    } else if (mode === 'long') {
        state.timer.duration = 15 * 60;
        document.getElementById('timer-status-text').textContent = 'Unwind Fully';
        document.getElementById('timer-status-text').className = 'text-[10px] uppercase font-semibold text-blue-400 tracking-widest mt-1';
        setTimerUIModeStyles('long');
    }

    state.timer.timeLeft = state.timer.duration;
    updateTimerUI();
}

function setTimerUIModeStyles(activeId) {
    const ids = ['pomo', 'short', 'long'];
    ids.forEach(id => {
        const btn = document.getElementById(`mode-${id}`);
        if (!btn) return;
        if (id === activeId) {
            btn.className = 'px-2.5 py-1 text-[9px] font-bold rounded-lg bg-purple-600/35 text-purple-300 border border-purple-500/20 transition-all';
        } else {
            btn.className = 'px-2.5 py-1 text-[9px] font-bold rounded-lg text-slate-400 hover:text-white transition-all';
        }
    });
}

function toggleTimer() {
    const playIcon = document.getElementById('btn-timer-icon');
    const btnText = document.getElementById('btn-timer-text');

    if (state.timer.isRunning) {
        // Pause timer
        clearInterval(state.timer.intervalId);
        state.timer.isRunning = false;
        playIcon.setAttribute('data-lucide', 'play');
        playIcon.className = 'w-4 h-4 fill-white';
        btnText.textContent = 'Resume';
        lucide.createIcons();
    } else {
        // Start timer
        state.timer.isRunning = true;
        playIcon.setAttribute('data-lucide', 'pause');
        playIcon.className = 'w-4 h-4 fill-white';
        btnText.textContent = 'Pause';
        lucide.createIcons();

        document.getElementById('timer-status-text').textContent = state.timer.mode === 'focus' ? 'Focusing...' : 'Breathing...';

        state.timer.intervalId = setInterval(() => {
            state.timer.timeLeft--;
            updateTimerUI();

            if (state.timer.timeLeft <= 0) {
                // Timer finished!
                clearInterval(state.timer.intervalId);
                state.timer.isRunning = false;
                playIcon.setAttribute('data-lucide', 'play');
                btnText.textContent = 'Start';
                lucide.createIcons();
                
                triggerTimerCompletion();
            }
        }, 1000);
    }
}

function resetTimer() {
    if (state.timer.isRunning) {
        clearInterval(state.timer.intervalId);
        state.timer.isRunning = false;
    }
    
    state.timer.timeLeft = state.timer.duration;
    
    const playIcon = document.getElementById('btn-timer-icon');
    const btnText = document.getElementById('btn-timer-text');
    playIcon.setAttribute('data-lucide', 'play');
    playIcon.className = 'w-4 h-4 fill-white';
    btnText.textContent = 'Start';
    lucide.createIcons();

    document.getElementById('timer-status-text').textContent = state.timer.mode === 'focus' ? 'Get Ready' : 'Take a Breath';
    
    updateTimerUI();
}

function skipTimer() {
    if (state.timer.isRunning) {
        clearInterval(state.timer.intervalId);
        state.timer.isRunning = false;
    }
    
    // Auto switch to next mode
    if (state.timer.mode === 'focus') {
        switchTimerMode('short');
    } else {
        switchTimerMode('focus');
    }
}

function updateTimerUI() {
    const mins = Math.floor(state.timer.timeLeft / 60);
    const secs = state.timer.timeLeft % 60;
    
    // Update numeric text
    document.getElementById('timer-display').textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    // Update circular progress ring
    const ratio = state.timer.timeLeft / state.timer.duration;
    const offset = 264 * (1 - ratio);
    document.getElementById('timer-progress').setAttribute('stroke-dashoffset', offset);
    
    const progressGlow = document.getElementById('timer-progress-glow');
    if (progressGlow) {
        progressGlow.setAttribute('stroke-dashoffset', offset);
    }
}

function triggerTimerCompletion() {
    // Play sound notification
    const bell = document.getElementById('sound-bell');
    if (bell) {
        bell.volume = 0.5;
        bell.play().catch(e => console.log("Audio play deferred until interaction."));
    }

    // Custom browser audio beep if file fails
    playNotificationBeep();

    if (state.timer.mode === 'focus') {
        const addedMins = Math.round(state.timer.duration / 60);
        state.stats.focusMinutes += addedMins;
        
        // Show success alert in UI
        showFloatAlert(`Focus session complete! +${addedMins} mins logged.`);
        
        // Switch to short break
        switchTimerMode('short');
    } else {
        showFloatAlert("Break finished. Time to focus!");
        switchTimerMode('focus');
    }

    updateStatsUI();
    saveStateToLocalStorage();
}

function playNotificationBeep() {
    try {
        const ctx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime); // High resonant note (A5)
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
        
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 1.2);
    } catch(e) {
        console.error("Synthesizer alert failed to play: ", e);
    }
}

// ==========================================
// 7. BOX BREATHING ENGINE
// ==========================================
function toggleBreathing() {
    const btnText = document.getElementById('btn-breath-text');
    const btnIcon = document.getElementById('btn-breath-icon');
    const bubble = document.getElementById('breath-bubble');
    const outerRing = document.getElementById('breath-ring-outer');

    if (state.breath.isActive) {
        // Pause breathing session
        clearInterval(state.breath.intervalId);
        state.breath.isActive = false;
        state.breath.stage = 'ready';
        
        btnText.textContent = 'Begin Breathing Session';
        btnIcon.setAttribute('data-lucide', 'play-circle');
        lucide.createIcons();

        document.getElementById('breath-action').textContent = 'Start';
        document.getElementById('breath-timer').textContent = '--';
        document.getElementById('breath-instruction').textContent = 'Relax your body and sync your breath with the expanding and contracting orb.';
        
        // Reset scale animations
        bubble.className = 'w-28 h-28 rounded-full bg-gradient-to-tr from-cyan-500/90 to-indigo-600/90 flex flex-col items-center justify-center shadow-lg shadow-cyan-500/10 transition-all duration-[1000ms] ease-in-out transform scale-100';
        if (outerRing) outerRing.classList.remove('breathing-pulse-outer');
    } else {
        // Start breathing session
        state.breath.isActive = true;
        state.breath.stage = 'inhale';
        state.breath.timeLeft = state.breath.duration;

        btnText.textContent = 'Stop Breathing Session';
        btnIcon.setAttribute('data-lucide', 'stop-circle');
        lucide.createIcons();

        if (outerRing) outerRing.classList.add('breathing-pulse-outer');

        runBreathingCycle();
        state.breath.intervalId = setInterval(() => {
            state.breath.timeLeft--;
            document.getElementById('breath-timer').textContent = state.breath.timeLeft;

            if (state.breath.timeLeft <= 0) {
                // Transition to next stage of box breathing
                switch(state.breath.stage) {
                    case 'inhale':
                        state.breath.stage = 'hold1';
                        break;
                    case 'hold1':
                        state.breath.stage = 'exhale';
                        break;
                    case 'exhale':
                        state.breath.stage = 'hold2';
                        break;
                    case 'hold2':
                        state.breath.stage = 'inhale';
                        state.breath.cyclesCompleted++;
                        document.getElementById('breath-count').textContent = `Cycle: ${state.breath.cyclesCompleted}`;
                        
                        // Every cycle is 16 seconds. Add minutes spent every 4 cycles (approx 1 min)
                        if (state.breath.cyclesCompleted % 4 === 0) {
                            state.stats.breathMinutes += 1;
                            updateStatsUI();
                            saveStateToLocalStorage();
                        }
                        break;
                }
                state.breath.timeLeft = state.breath.duration;
                runBreathingCycle();
            }
        }, 1000);
    }
}

function runBreathingCycle() {
    const bubble = document.getElementById('breath-bubble');
    const actionText = document.getElementById('breath-action');
    const timerText = document.getElementById('breath-timer');
    const instructionText = document.getElementById('breath-instruction');

    timerText.textContent = state.breath.timeLeft;

    switch(state.breath.stage) {
        case 'inhale':
            actionText.textContent = 'Inhale';
            actionText.className = 'text-xs font-bold font-display text-cyan-300 tracking-widest uppercase';
            instructionText.textContent = 'Breathe in slowly through your nose, filling your lungs.';
            
            // Expand bubble
            bubble.className = 'w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex flex-col items-center justify-center shadow-lg shadow-cyan-500/25 transition-all duration-[4000ms] ease-in-out transform scale-[1.65]';
            break;
            
        case 'hold1':
            actionText.textContent = 'Hold';
            actionText.className = 'text-xs font-bold font-display text-amber-300 tracking-widest uppercase';
            instructionText.textContent = 'Suspend your breath, keeping your body fully relaxed.';
            
            // Remain expanded
            bubble.className = 'w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex flex-col items-center justify-center shadow-lg shadow-cyan-500/25 transition-all duration-[4000ms] ease-in-out transform scale-[1.65]';
            break;
            
        case 'exhale':
            actionText.textContent = 'Exhale';
            actionText.className = 'text-xs font-bold font-display text-purple-300 tracking-widest uppercase';
            instructionText.textContent = 'Release your breath gently through your mouth.';
            
            // Contract bubble
            bubble.className = 'w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex flex-col items-center justify-center shadow-lg shadow-cyan-500/10 transition-all duration-[4000ms] ease-in-out transform scale-[0.85]';
            break;
            
        case 'hold2':
            actionText.textContent = 'Hold';
            actionText.className = 'text-xs font-bold font-display text-amber-300 tracking-widest uppercase';
            instructionText.textContent = 'Keep your lungs empty before the next breath.';
            
            // Remain contracted
            bubble.className = 'w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex flex-col items-center justify-center shadow-lg shadow-cyan-500/10 transition-all duration-[4000ms] ease-in-out transform scale-[0.85]';
            break;
    }
}

// ==========================================
// 8. SYNTHESIZER MIXER ENGINE (WEB AUDIO API)
// ==========================================
function initAudio() {
    if (audioCtx) return;

    // Create browser audio context
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create master gain
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.8, audioCtx.currentTime);

    // Create Analyser for Canvas
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    
    // Connect master chain
    masterGain.connect(analyser);
    analyser.connect(audioCtx.destination);
    
    // Setup Synth channels
    setupRainChannel();
    setupDroneChannel();
    setupBinauralChannel();
}

// CHANNEL 1: BROWN NOISE (Torrential rain simulator)
function setupRainChannel() {
    // Generate pre-loaded brown noise buffer
    const bufferSize = 2 * audioCtx.sampleRate;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Brown noise filtration formula
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Compensate for output loss
    }
    
    rainNode = audioCtx.createBufferSource();
    rainNode.buffer = noiseBuffer;
    rainNode.loop = true;
    
    // Rain lowpass filter to make it sound wetter
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, audioCtx.currentTime);
    
    rainGain = audioCtx.createGain();
    // Use saved state volume
    rainGain.gain.setValueAtTime(state.synth.rainVol * 0.1, audioCtx.currentTime); // Scaled down as brown noise is loud
    
    rainNode.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(masterGain);
    
    rainNode.start(0);
}

// CHANNEL 2: COSMIC DRONE (Detuned subtractive oscillators)
function setupDroneChannel() {
    droneOsc1 = audioCtx.createOscillator();
    droneOsc2 = audioCtx.createOscillator();
    droneFilter = audioCtx.createBiquadFilter();
    droneLfo = audioCtx.createOscillator();
    droneLfoGain = audioCtx.createGain();
    droneGain = audioCtx.createGain();
    
    // Detuned rich oscillators (fifth interval chord A1 = 55Hz, E2 = 82.41Hz)
    droneOsc1.type = 'sawtooth';
    droneOsc1.frequency.setValueAtTime(55, audioCtx.currentTime);
    
    droneOsc2.type = 'triangle';
    droneOsc2.frequency.setValueAtTime(82.41, audioCtx.currentTime);
    
    // Resonant lowpass filter
    droneFilter.type = 'lowpass';
    droneFilter.frequency.setValueAtTime(250, audioCtx.currentTime);
    droneFilter.Q.setValueAtTime(6, audioCtx.currentTime);
    
    // Slow sweeping LFO modulate filter frequency
    droneLfo.type = 'sine';
    droneLfo.frequency.setValueAtTime(0.06, audioCtx.currentTime); // ~16 seconds per sweep
    droneLfoGain.gain.setValueAtTime(140, audioCtx.currentTime);  // Modulate range ±140Hz
    
    droneGain.gain.setValueAtTime(state.synth.droneVol * 0.15, audioCtx.currentTime);
    
    // Connect modulations
    droneOsc1.connect(droneFilter);
    droneOsc2.connect(droneFilter);
    droneLfo.connect(droneLfoGain);
    droneLfoGain.connect(droneFilter.frequency);
    
    droneFilter.connect(droneGain);
    droneGain.connect(masterGain);
    
    // Start oscillators
    droneOsc1.start(0);
    droneOsc2.start(0);
    droneLfo.start(0);
}

// CHANNEL 3: BINAURAL BEATS (Left channel 100Hz, Right channel 106Hz = Theta 6Hz difference)
function setupBinauralChannel() {
    binOscL = audioCtx.createOscillator();
    binOscR = audioCtx.createOscillator();
    binMerger = audioCtx.createChannelMerger(2);
    binGain = audioCtx.createGain();
    
    binOscL.type = 'sine';
    binOscL.frequency.setValueAtTime(100, audioCtx.currentTime); // 100Hz Sine Left
    
    binOscR.type = 'sine';
    binOscR.frequency.setValueAtTime(106, audioCtx.currentTime); // 106Hz Sine Right
    
    binGain.gain.setValueAtTime(state.synth.binauralVol * 0.08, audioCtx.currentTime); // Soft binaural mix
    
    // Split into Left (0) and Right (1) channels of merger node
    binOscL.connect(binMerger, 0, 0);
    binOscR.connect(binMerger, 0, 1);
    
    binMerger.connect(binGain);
    binGain.connect(masterGain);
    
    binOscL.start(0);
    binOscR.start(0);
}

function toggleMasterAudio() {
    const btn = document.getElementById('btn-audio-master');
    const icon = document.getElementById('master-vol-icon');
    const text = document.getElementById('master-vol-text');

    if (!audioCtx) {
        initAudio();
    }

    if (state.synth.masterOn) {
        // Mute Master output
        audioCtx.suspend();
        state.synth.masterOn = false;
        
        btn.className = 'flex items-center gap-2 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-xl bg-red-500/15 border border-red-500/20 text-red-400 hover:bg-red-500/25 transition-all shadow-inner';
        icon.setAttribute('data-lucide', 'volume-x');
        text.textContent = 'Power Off';
        lucide.createIcons();
        
        cancelAnimationFrame(visualizerAnimationId);
    } else {
        // Unmute Master output
        audioCtx.resume();
        state.synth.masterOn = true;
        
        btn.className = 'flex items-center gap-2 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-xl bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/25 transition-all shadow-inner';
        icon.setAttribute('data-lucide', 'volume-2');
        text.textContent = 'Power Live';
        lucide.createIcons();

        // Trigger individual channels if they are marked active
        syncSynthChannelsWithUI();
        
        // Start Canvas drawing loop
        drawVisualizer();
    }
}

function syncSynthChannelsWithUI() {
    toggleSynthChannelVisuals('rain', state.synth.rainOn);
    toggleSynthChannelVisuals('drone', state.synth.droneOn);
    toggleSynthChannelVisuals('binaural', state.synth.binauralOn);
    
    // Set actual Web Audio volume gains based on state
    if (rainGain) rainGain.gain.setValueAtTime(state.synth.rainOn ? (state.synth.rainVol * 0.1) : 0, audioCtx.currentTime);
    if (droneGain) droneGain.gain.setValueAtTime(state.synth.droneOn ? (state.synth.droneVol * 0.15) : 0, audioCtx.currentTime);
    if (binGain) binGain.gain.setValueAtTime(state.synth.binauralOn ? (state.synth.binauralVol * 0.08) : 0, audioCtx.currentTime);
}

function toggleSynthChannel(channel) {
    if (!audioCtx || !state.synth.masterOn) {
        showFloatAlert("Turn ON the 'Synthesizer Off' Master Switch first!");
        return;
    }

    if (channel === 'rain') {
        state.synth.rainOn = !state.synth.rainOn;
        rainGain.gain.setValueAtTime(state.synth.rainOn ? (state.synth.rainVol * 0.1) : 0, audioCtx.currentTime);
        toggleSynthChannelVisuals('rain', state.synth.rainOn);
    } else if (channel === 'drone') {
        state.synth.droneOn = !state.synth.droneOn;
        droneGain.gain.setValueAtTime(state.synth.droneOn ? (state.synth.droneVol * 0.15) : 0, audioCtx.currentTime);
        toggleSynthChannelVisuals('drone', state.synth.droneOn);
    } else if (channel === 'binaural') {
        state.synth.binauralOn = !state.synth.binauralOn;
        binGain.gain.setValueAtTime(state.synth.binauralOn ? (state.synth.binauralVol * 0.08) : 0, audioCtx.currentTime);
        toggleSynthChannelVisuals('binaural', state.synth.binauralOn);
    }
    
    saveStateToLocalStorage();
}

function toggleSynthChannelVisuals(channel, isOn) {
    const checkNode = document.getElementById(`check-${channel}`);
    const ledNode = document.getElementById(`led-${channel}`);
    
    if (checkNode) {
        checkNode.checked = isOn;
    }
    if (ledNode) {
        if (isOn) {
            ledNode.className = 'w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] transition-all duration-300';
        } else {
            ledNode.className = 'w-1.5 h-1.5 rounded-full bg-slate-700 transition-all duration-300';
        }
    }
}

function adjustSynthVolume(channel, percentVal) {
    const decVal = percentVal / 100;
    document.getElementById(`vol-txt-${channel}`).textContent = `${percentVal}%`;
    
    if (channel === 'rain') {
        state.synth.rainVol = decVal;
        if (rainGain && state.synth.rainOn && state.synth.masterOn) {
            rainGain.gain.linearRampToValueAtTime(decVal * 0.1, audioCtx.currentTime + 0.1);
        }
    } else if (channel === 'drone') {
        state.synth.droneVol = decVal;
        if (droneGain && state.synth.droneOn && state.synth.masterOn) {
            droneGain.gain.linearRampToValueAtTime(decVal * 0.15, audioCtx.currentTime + 0.1);
        }
    } else if (channel === 'binaural') {
        state.synth.binauralVol = decVal;
        if (binGain && state.synth.binauralOn && state.synth.masterOn) {
            binGain.gain.linearRampToValueAtTime(decVal * 0.08, audioCtx.currentTime + 0.1);
        }
    }
    
    saveStateToLocalStorage();
}

// ==========================================
// 9. CANVAS SPECTRUM VISUALIZER
// ==========================================
let canvas, ctx;

function setupCanvas() {
    canvas = document.getElementById('audio-canvas');
    ctx = canvas.getContext('2d');
    resizeCanvas();
    
    // Clear display initially with placeholder wave
    drawIdleWave();
    
    window.addEventListener('resize', resizeCanvas);
}

function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * (window.devicePixelRatio || 1);
    canvas.height = rect.height * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
}

function drawIdleWave() {
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);
    
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.15)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    
    for (let x = 0; x < w; x++) {
        const y = h / 2 + Math.sin(x * 0.04) * 2;
        ctx.lineTo(x, y);
    }
    ctx.stroke();
}

function drawVisualizer() {
    if (!state.synth.masterOn || !analyser) return;

    visualizerAnimationId = requestAnimationFrame(drawVisualizer);

    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);

    ctx.clearRect(0, 0, w, h);
    
    // Get colors depending on state mood
    let accent1 = 'rgba(168, 85, 247, 0.6)'; // default purple focus
    let accent2 = 'rgba(6, 182, 212, 0.3)';  // default cyan
    if (state.mood === 'calm') {
        accent1 = 'rgba(20, 184, 166, 0.6)'; // teal
        accent2 = 'rgba(16, 185, 129, 0.3)'; // emerald
    } else if (state.mood === 'energy') {
        accent1 = 'rgba(245, 158, 11, 0.6)'; // amber
        accent2 = 'rgba(244, 63, 94, 0.3)';  // rose
    } else if (state.mood === 'rest') {
        accent1 = 'rgba(6, 182, 212, 0.6)';  // cyan
        accent2 = 'rgba(59, 130, 246, 0.3)'; // blue
    }

    ctx.lineWidth = 2;
    ctx.strokeStyle = accent1;
    ctx.beginPath();

    const sliceWidth = w / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * h) / 2;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }

        x += sliceWidth;
    }

    ctx.lineTo(w, h / 2);
    ctx.stroke();

    // Draw secondary soft mirror wave behind
    ctx.lineWidth = 1;
    ctx.strokeStyle = accent2;
    ctx.beginPath();
    x = 0;
    for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * h) / 2 + Math.sin(i * 0.2) * 1.5;
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
        x += sliceWidth;
    }
    ctx.stroke();
}

// ==========================================
// 10. FOCUS QUESTS (TODO MANAGER)
// ==========================================
let todos = [];

function addTodo() {
    const input = document.getElementById('todo-input');
    const text = input.value.trim();
    if (!text) return;

    const newTodo = {
        id: Date.now().toString(),
        text: text,
        completed: false
    };

    todos.push(newTodo);
    input.value = '';
    
    saveTodosToLocalStorage();
    renderTodos();
}

function toggleTodo(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            todo.completed = !todo.completed;
            if (todo.completed) {
                // Completed sound or alert
                showFloatAlert(`Quest Complete: "${todo.text}"`);
            }
        }
        return todo;
    });
    
    saveTodosToLocalStorage();
    renderTodos();
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodosToLocalStorage();
    renderTodos();
}

function renderTodos() {
    const todoList = document.getElementById('todo-list');
    const emptyState = document.getElementById('empty-todo-state');
    const summary = document.getElementById('tasks-summary');

    todoList.innerHTML = '';
    
    const activeTodos = todos.filter(t => !t.completed);
    const completedTodos = todos.filter(t => t.completed);
    const total = todos.length;
    const completedCount = completedTodos.length;
    
    summary.textContent = `${completedCount} of ${total} done`;

    if (total === 0) {
        todoList.appendChild(emptyState);
        emptyState.style.display = 'flex';
        return;
    } else {
        emptyState.style.display = 'none';
    }

    // Sort to show uncompleted ones at top
    const sortedTodos = [...activeTodos, ...completedTodos];

    sortedTodos.forEach(todo => {
        const item = document.createElement('div');
        item.className = `todo-item flex items-center justify-between bg-white/5 border border-white/5 px-4 py-3 rounded-xl hover:bg-white/10 hover:border-white/10 ${todo.completed ? 'completed' : ''}`;
        item.setAttribute('data-id', todo.id);

        item.innerHTML = `
            <div class="flex items-center gap-3 flex-grow">
                <button onclick="toggleTodo('${todo.id}')" class="w-5 h-5 rounded-md border flex items-center justify-center transition-all ${todo.completed ? 'bg-purple-600 border-purple-500 text-white' : 'border-white/20 hover:border-purple-500/50'}" title="Toggle quest status">
                    ${todo.completed ? '<i data-lucide="check" class="w-3.5 h-3.5"></i>' : ''}
                </button>
                <span class="text-sm select-none truncate max-w-[200px] md:max-w-[280px]">${todo.text}</span>
            </div>
            <button onclick="deleteTodo('${todo.id}')" class="text-slate-500 hover:text-red-400 p-1 transition-colors" title="Delete quest">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
        `;

        todoList.appendChild(item);
    });

    lucide.createIcons();
}

// ==========================================
// 11. MIND ANALYTICS (STATS MANAGER)
// ==========================================
function updateStatsUI() {
    // Focus Minutes Stats Ring calculation
    document.getElementById('stat-focus-min').textContent = state.stats.focusMinutes;
    
    // Focus ring calculation
    // Max 120 mins. SVG circle radius=40, circumference = 251.2
    const focusRatio = Math.min(state.stats.focusMinutes / state.stats.focusGoal, 1);
    const focusOffset = 251.2 * (1 - focusRatio);
    document.getElementById('stat-ring-focus').setAttribute('stroke-dashoffset', focusOffset);
    document.getElementById('stat-focus-percent').textContent = `${Math.round(focusRatio * 100)}%`;

    // Breathing ring calculation
    // Max 10 mins. SVG circle radius=32, circumference = 201
    const breathRatio = Math.min(state.stats.breathMinutes / state.stats.breathGoal, 1);
    const breathOffset = 201 * (1 - breathRatio);
    document.getElementById('stat-ring-breath').setAttribute('stroke-dashoffset', breathOffset);
    document.getElementById('stat-breath-percent').textContent = `${Math.round(breathRatio * 100)}%`;
}

// ==========================================
// 12. ZEN QUOTES ENGINE
// ==========================================
function fetchNewQuote() {
    const qText = document.getElementById('quote-text');
    const qAuth = document.getElementById('quote-author');

    qText.style.opacity = 0;
    qAuth.style.opacity = 0;

    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * zenQuotes.length);
        const quote = zenQuotes[randomIndex];

        qText.textContent = `"${quote.text}"`;
        qAuth.textContent = `— ${quote.author}`;

        qText.style.opacity = 1;
        qAuth.style.opacity = 1;
    }, 450);
}

// ==========================================
// 13. DATA PERSISTENCE & UTILITIES
// ==========================================
function saveStateToLocalStorage() {
    localStorage.setItem('zenflow_state', JSON.stringify({
        mood: state.mood,
        stats: state.stats,
        synth: {
            rainOn: state.synth.rainOn,
            droneOn: state.synth.droneOn,
            binauralOn: state.synth.binauralOn,
            rainVol: state.synth.rainVol,
            droneVol: state.synth.droneVol,
            binauralVol: state.synth.binauralVol
        }
    }));
}

function loadStateFromLocalStorage() {
    const saved = localStorage.getItem('zenflow_state');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            state.mood = data.mood || 'focus';
            if (data.stats) state.stats = data.stats;
            if (data.synth) {
                // Initialize toggles as off initially so the user starts fresh and browser doesn't block audio
                state.synth.rainOn = data.synth.rainOn || false;
                state.synth.droneOn = data.synth.droneOn || false;
                state.synth.binauralOn = data.synth.binauralOn || false;
                
                // Volume sliders
                if (data.synth.rainVol !== undefined) state.synth.rainVol = data.synth.rainVol;
                if (data.synth.droneVol !== undefined) state.synth.droneVol = data.synth.droneVol;
                if (data.synth.binauralVol !== undefined) state.synth.binauralVol = data.synth.binauralVol;

                // Sync UI Volume sliders
                document.getElementById('slider-rain').value = Math.round(state.synth.rainVol * 100);
                document.getElementById('vol-txt-rain').textContent = `${Math.round(state.synth.rainVol * 100)}%`;
                
                document.getElementById('slider-drone').value = Math.round(state.synth.droneVol * 100);
                document.getElementById('vol-txt-drone').textContent = `${Math.round(state.synth.droneVol * 100)}%`;
                
                document.getElementById('slider-binaural').value = Math.round(state.synth.binauralVol * 100);
                document.getElementById('vol-txt-binaural').textContent = `${Math.round(state.synth.binauralVol * 100)}%`;
            }
        } catch(e) {
            console.error("Local storage state load error: ", e);
        }
    }

    const savedTodos = localStorage.getItem('zenflow_todos');
    if (savedTodos) {
        try {
            todos = JSON.parse(savedTodos);
        } catch(e) {
            console.error("Local storage todos load error: ", e);
        }
    }
}

function saveTodosToLocalStorage() {
    localStorage.setItem('zenflow_todos', JSON.stringify(todos));
}

// Custom Floating UI notifications
function showFloatAlert(msg) {
    const alertBox = document.createElement('div');
    alertBox.className = 'fixed bottom-6 right-6 bg-purple-900/90 border border-purple-500/40 text-slate-100 px-5 py-3 rounded-xl shadow-2xl backdrop-blur-md z-50 text-xs font-semibold tracking-wide flex items-center gap-2 animate-bounce-subtle transform transition-all duration-300 translate-y-10 opacity-0';
    alertBox.innerHTML = `
        <i data-lucide="bell-ring" class="w-4 h-4 text-purple-300"></i>
        <span>${msg}</span>
    `;
    
    document.body.appendChild(alertBox);
    lucide.createIcons();

    // Trigger Slide-up
    setTimeout(() => {
        alertBox.className = alertBox.className.replace('translate-y-10 opacity-0', 'translate-y-0 opacity-100');
    }, 50);

    // Self destroy after 4 seconds
    setTimeout(() => {
        alertBox.className = alertBox.className.replace('translate-y-0 opacity-100', 'translate-y-10 opacity-0');
        setTimeout(() => {
            alertBox.remove();
        }, 300);
    }, 4000);
}
