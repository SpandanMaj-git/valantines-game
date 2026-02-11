function App() {
  const [step, setStep] = React.useState(0);
  const [storyMessage, setStoryMessage] = React.useState("");
  const [reactionMessage, setReactionMessage] = React.useState("");
  const [noPos, setNoPos] = React.useState(null);
  const [celebrate, setCelebrate] = React.useState(false);
  const [showSurprise, setShowSurprise] = React.useState(false);

  const containerRef = React.useRef(null);
  const noBtnRef = React.useRef(null);

  // 🎉 celebration sound
  const celebrationSound = React.useRef(
    new Audio("/static/assets/celebration.mp3")
  );

  const next = async () => {
    const nextStep = step + 1;
    const res = await fetch(`/api/next/${nextStep}`);
    const data = await res.json();
    setStoryMessage(data.message);
    setReactionMessage("");
    setStep(nextStep);
  };

  const dodgeNo = () => {
    const btn = noBtnRef.current;
    if (!btn) return;

    // Get viewport dimensions
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const btnWidth = btn.offsetWidth;
    const btnHeight = btn.offsetHeight;
    
    const SAFE = 20;

    // Calculate safe boundaries
    const maxLeft = vw - btnWidth - SAFE;
    const maxTop = vh - btnHeight - SAFE;

    // Random position within safe boundaries
    const newLeft = SAFE + Math.random() * (maxLeft - SAFE * 2);
    const newTop = SAFE + Math.random() * (maxTop - SAFE * 2);

    setNoPos({
      left: newLeft,
      top: newTop,
    });

    const reactions = [
      "Nice try 😌",
      "Still trying? :p",
      "Where you running to 🙄",
      "Almost!!",
      "Nope! 🏃‍♂️",
      "Keep trying xD",
      "Not today babygurll"
    ];
    
    setReactionMessage((prev) => {
      const currentIndex = reactions.indexOf(prev);
      return reactions[(currentIndex + 1) % reactions.length] || reactions[0];
    });
  };

  const handleYes = () => {
    setReactionMessage("");
    setCelebrate(true);

    // 🔊 play celebration sound
    const sound = celebrationSound.current;
    sound.currentTime = 0;
    sound.volume = 0.8;
    sound.play().catch(() => {});

    // Create confetti effect
    createConfetti();

    // show surprise button after short moment
    setTimeout(() => {
      setShowSurprise(true);
    }, 1500);
  };

  const createConfetti = () => {
    const colors = ['#ff0000', '#cc0000', '#990000', '#ff3333', '#ff6666'];
    const confettiCount = 60;

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.top = '-10px';
      confetti.style.width = '12px';
      confetti.style.height = '12px';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.opacity = '0.9';
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
      confetti.style.zIndex = '9999';
      confetti.style.pointerEvents = 'none';
      confetti.style.boxShadow = '0 0 10px rgba(255, 0, 0, 0.5)';
      document.body.appendChild(confetti);

      const duration = 2500 + Math.random() * 2000;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / duration;

        if (progress < 1) {
          const y = progress * window.innerHeight * 1.3;
          const x = Math.sin(progress * 12) * 120;
          const rotation = progress * 360 * 4;
          
          confetti.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
          confetti.style.opacity = 0.9 * (1 - progress);
          
          requestAnimationFrame(animate);
        } else {
          confetti.remove();
        }
      };

      animate();
    }
  };

  const text =
    celebrate
      ? "LET'S GOOOO! 💖"
      : reactionMessage ||
        storyMessage ||
        "I wanted to do something special for you";

  return (
    <>
      <div className={`content ${celebrate ? 'celebration-mode' : ''}`} ref={containerRef}>
        <div className="top-heart">💖</div>
        
        <h1>For You</h1>

        <div className="message">
          <div className="message-text">{text}</div>
        </div>

        {celebrate && (
          <div className="celebration-emoji-container">
            <span className="celebration-emoji">💖</span>
            <span className="celebration-emoji">🫦</span>
            <span className="celebration-emoji">😍</span>
            <span className="celebration-emoji">🍑</span>
            <span className="celebration-emoji">🍆</span>
          </div>
        )}

        {step < 6 && (
          <div className="button-container">
            <button className="primary" onClick={next}>
              Continue
            </button>
          </div>
        )}

        {step === 6 && !celebrate && (
          <div className="button-container">
            <button className="primary" onClick={handleYes}>
              Yes, always ❤️
            </button>

            <button
              ref={noBtnRef}
              className="secondary"
              onMouseEnter={dodgeNo}
              onTouchStart={dodgeNo}
              style={noPos ? {
                position: 'fixed',
                left: `${noPos.left}px`,
                top: `${noPos.top}px`,
                transition: 'left 0.35s cubic-bezier(0.4, 0, 0.2, 1), top 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
              } : {}}
            >
              No
            </button>
          </div>
        )}
      </div>

      {/* SURPRISE BUTTON */}
      {showSurprise && (
        <button
          className="surprise-btn"
          onClick={() => {
            sessionStorage.setItem("playMusic", "true");
            window.location.href = "/love-letter";
          }}
        >
          Tap here for a surprise 💖
        </button>
      )}
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);