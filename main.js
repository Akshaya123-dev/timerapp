// Timer durations in seconds
const TIMER_MODES = {
    pomodoro: 25 * 60,
    "short-break": 5 * 60,
    "long-break": 15 * 60,
};

let currentMode = "pomodoro";
let timerDuration = TIMER_MODES[currentMode];
let timer = null;
let timeRemaining = timerDuration;
let isRunning = false;

const timerDisplay = document.getElementById("timer");
const modeButtonsTop = document.querySelectorAll(".top-mode-buttons .mode");
const modeButtonsBottom = document.querySelectorAll(".bottom-mode-buttons .mode");
const startButton = document.getElementById("start");
const pauseButton = document.getElementById("pause");
const stopButton = document.getElementById("stop");
const resetButton = document.getElementById("reset");
const alarmAudio = document.getElementById("alarm-audio");

// Format seconds to hh:mm:ss
function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return (
        (hrs > 0 ? String(hrs).padStart(2, "0") + ":" : "") +
        String(mins).padStart(2, "0") +
        ":" +
        String(secs).padStart(2, "0")
    );
}

// Update timer display
function updateDisplay() {
    timerDisplay.textContent = formatTime(timeRemaining);
}

// Switch mode
function switchMode(mode) {
    if (isRunning) {
        stopTimer();
    }
    currentMode = mode;
    timerDuration = TIMER_MODES[mode];
    timeRemaining = timerDuration;
    updateDisplay();
    updateModeButtons();
    updateControlButtons();
}

// Update mode buttons active state
function updateModeButtons() {
    modeButtonsTop.forEach((btn) => {
        btn.classList.toggle("active", btn.id === currentMode);
    });
    modeButtonsBottom.forEach((btn) => {
        btn.classList.toggle("active", btn.id === currentMode + "-bottom");
    });
}

// Update control buttons state
function updateControlButtons() {
    startButton.disabled = isRunning;
    pauseButton.disabled = !isRunning;
    stopButton.disabled = !isRunning && timeRemaining === timerDuration;
    resetButton.disabled = timeRemaining === timerDuration;
}

// Timer tick function
function timerTick() {
    if (timeRemaining > 0) {
        timeRemaining--;
        updateDisplay();
    } else {
        stopTimer();
        alarmAudio.play();
        alert("Time's up!");
    }
}

// Start timer
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        timer = setInterval(timerTick, 1000);
        updateControlButtons();
    }
}

// Pause timer
function pauseTimer() {
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
        updateControlButtons();
    }
}

// Stop timer
function stopTimer() {
    clearInterval(timer);
    isRunning = false;
    timeRemaining = timerDuration;
    updateDisplay();
    updateControlButtons();
}

// Reset timer
function resetTimer() {
    stopTimer();
    timeRemaining = timerDuration;
    updateDisplay();
    updateControlButtons();
}

// Event listeners for top mode buttons
modeButtonsTop.forEach((btn) => {
    btn.addEventListener("click", () => switchMode(btn.id));
});

// Event listeners for bottom mode buttons
modeButtonsBottom.forEach((btn) => {
    btn.addEventListener("click", () => {
        const modeId = btn.id.replace("-bottom", "");
        switchMode(modeId);
    });
});

startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
stopButton.addEventListener("click", stopTimer);
resetButton.addEventListener("click", resetTimer);

// Initialize display and buttons
updateDisplay();
updateModeButtons();
updateControlButtons();
