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

  success.style.display = "flex";
  success.innerHTML = `
    <div>
      <div style="font-size:24px;">Nice 😌</div>
      <div style="margin-top:10px; font-size:16px;">
        You caught <strong>${score}</strong> Coopers ❤️
      </div>
    </div>
  `;
}

// ----------------------------
// CLEANUP

window.addEventListener("resize", () => {
  document.querySelectorAll(".cooper").forEach(c => c.remove());
});
