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
    const container = containerRef.current;
    const btn = noBtnRef.current;
    if (!container || !btn) return;

    const c = container.getBoundingClientRect();
    const b = btn.getBoundingClientRect();
    const SAFE = 16;

    const maxLeft = c.width - b.width - SAFE;
    const maxTop = c.height - b.height - SAFE;

    setNoPos({
      left: Math.random() * maxLeft,
      top: Math.random() * maxTop,
    });

    setReactionMessage((prev) =>
      prev === ""
        ? "Nice try 😌"
        : prev === "Nice try 😌"
        ? "Still trying?"
        : "Yeah… not happening 😏"
    );
  };

  const handleYes = () => {
    setReactionMessage("");
    setCelebrate(true);

    // 🔊 play celebration sound
    const sound = celebrationSound.current;
    sound.currentTime = 0;
    sound.volume = 0.8;
    sound.play().catch(() => {});

    // show surprise button after short moment
    setTimeout(() => {
      setShowSurprise(true);
    }, 1200);
  };

  const text =
    celebrate
      ? "LET’S GOOOO 💖💖💖"
      : reactionMessage ||
        storyMessage ||
        "I wanted to do something a little special for you.";

  return (
    <>
      {/* MAIN CARD */}
      <div className="card" ref={containerRef}>
        <h1>For You ❤️</h1>

        <p
          style={{
            fontSize: celebrate ? "22px" : "16px",
            transition: "all 0.3s ease",
          }}
        >
          {text}
        </p>

        {celebrate && (
          <div style={{ fontSize: "28px", marginTop: "12px" }}>
            💖✨😍💖✨
          </div>
        )}

        {step < 6 && (
          <button className="primary" onClick={next}>
            Continue
          </button>
        )}

        {step === 6 && !celebrate && (
          <div style={{ marginTop: "28px", position: "relative" }}>
            <button className="primary" onClick={handleYes}>
              Yes, always ❤️
            </button>

            <button
              ref={noBtnRef}
              className="secondary"
              onMouseEnter={dodgeNo}
              onTouchStart={dodgeNo}
              style={{
                marginLeft: "12px",
                ...(noPos && {
                  position: "absolute",
                  left: `${noPos.left}px`,
                  top: `${noPos.top}px`,
                  transition: "left 0.25s ease, top 0.25s ease",
                }),
              }}
            >
              No
            </button>
          </div>
        )}
      </div>

      {/* SURPRISE BUTTON — SCREEN EDGE */}
      {showSurprise && (
        <button
          onClick={() => {
            // Prime audio permission before redirect
          const primeAudio = new Audio();
          primeAudio.play().catch(() => {});

          // Set flag
          sessionStorage.setItem("playMusic", "true");

          window.location.href = "/love-letter";

          }}
          style={{
            position: "fixed",
            bottom: "14px",
            right: "14px",
            padding: "10px 14px",
            fontSize: "14px",
            color: "#ffd6dc",
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.35)",
            borderRadius: "999px",
            backdropFilter: "blur(6px)",
            cursor: "pointer",
            zIndex: 9999,

            opacity: 0,
            transform: "translateY(12px)",
            animation: "fadeSlideIn 0.6s ease forwards",
          }}
        >
          Tap here for a surprise 💖
        </button>
      )}

      {/* Animation */}
      <style>{`
        @keyframes fadeSlideIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
