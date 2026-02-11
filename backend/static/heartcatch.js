const game = document.getElementById("game");
const bar = document.getElementById("bar");
const success = document.getElementById("success");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");

let score = 0;
let running = true;

// ⏱️ GAME SETTINGS
const GAME_DURATION = 30; // seconds
let timeLeft = GAME_DURATION;

// 🎯 DIFFICULTY SETTINGS
let spawnInterval = 900;
let baseSpeed = 1.2;

// 🖼️ IMAGE
const IMAGE_SRC = "/static/assets/cooper.png";

// 🔊 SOUNDS
const popSoundSrc = "/static/sounds/pop.mp3";
const celebrateSoundSrc = "/static/sounds/celebrate.mp3";

// allow overlapping pop sounds
function playPop() {
  const s = new Audio(popSoundSrc);
  s.volume = 0.6;
  s.play().catch(() => {});
}

// single celebration sound
let celebratePlayed = false;
const celebrateSound = new Audio(celebrateSoundSrc);
celebrateSound.volume = 0.8;

// ----------------------------

function spawnCooper() {
  if (!running) return;

  const cooper = document.createElement("img");
  cooper.src = IMAGE_SRC;
  cooper.className = "cooper";

  const size = 44 + Math.random() * 20;
  cooper.style.width = size + "px";
  cooper.style.position = "absolute";
  cooper.style.userSelect = "none";
  cooper.style.pointerEvents = "auto";

  const x = Math.random() * (window.innerWidth - size);
  cooper.style.left = x + "px";
  cooper.style.bottom = "-80px";

  game.appendChild(cooper);

  const speed = baseSpeed + (GAME_DURATION - timeLeft) * 0.06;
  let y = -80;

  function move() {
    if (!running) return;

    y += speed;
    cooper.style.transform = `translateY(-${y}px)`;

    if (y > window.innerHeight + 100) {
      cooper.remove();
      return;
    }
    requestAnimationFrame(move);
  }

  move();

  const catchIt = (e) => {
    e.preventDefault();

    playPop();
    cooper.remove();

    score++;
    scoreEl.textContent = score;

    const progress =
      ((GAME_DURATION - timeLeft) / GAME_DURATION) * 100;
    bar.style.width = `${progress}%`;
  };

  cooper.addEventListener("touchstart", catchIt, { passive: true });
  cooper.addEventListener("mousedown", catchIt);
}

// ----------------------------
// SPAWN LOOP

let spawnLoop = setInterval(() => {
  if (!running) return;

  spawnCooper();

  if (spawnInterval > 350) {
    spawnInterval -= 20;
    clearInterval(spawnLoop);
    spawnLoop = setInterval(spawnCooper, spawnInterval);
  }
}, spawnInterval);

// ----------------------------
// TIMER

const timerLoop = setInterval(() => {
  if (!running) return;

  timeLeft--;
  timeEl.textContent = timeLeft;

  if (timeLeft <= 0) {
    endGame();
  }
}, 1000);

// ----------------------------

function endGame() {
  if (!running) return;
  running = false;

  clearInterval(spawnLoop);
  clearInterval(timerLoop);

  // play celebration sound ONCE
  if (!celebratePlayed) {
    celebratePlayed = true;
    celebrateSound.play().catch(() => {});
  }

  // Create confetti effect
  createConfetti();

  success.style.display = "flex";
  success.innerHTML = `
    <div>
      <div class="title">Amazing! 💖</div>
      <div class="emoji">🎉</div>
      <div class="score-text">
        You caught <strong style="color: #ff2e5e; font-size: 24px;">${score}</strong> Coopers ❤️
      </div>
      <div style="margin-top: 24px; font-size: 14px; color: #999;">
        Great job! 😊
      </div>
    </div>
  `;
}

// Confetti effect for game end
function createConfetti() {
  const colors = ['#ff2e5e', '#ff4d7d', '#ffc0cb', '#ff69b4', '#ff1493'];
  const confettiCount = 50;

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.top = '-10px';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.opacity = '0.8';
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    confetti.style.zIndex = '9999';
    confetti.style.pointerEvents = 'none';
    document.body.appendChild(confetti);

    const duration = 2000 + Math.random() * 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;

      if (progress < 1) {
        const y = progress * window.innerHeight * 1.2;
        const x = Math.sin(progress * 10) * 100;
        const rotation = progress * 360 * 3;
        
        confetti.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
        confetti.style.opacity = 0.8 * (1 - progress);
        
        requestAnimationFrame(animate);
      } else {
        confetti.remove();
      }
    };

    animate();
  }
}

// ----------------------------
// CLEANUP

window.addEventListener("resize", () => {
  document.querySelectorAll(".cooper").forEach(c => c.remove());
});