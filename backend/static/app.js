function App() {
  const [step, setStep] = React.useState(0);
  const [storyMessage, setStoryMessage] = React.useState("");
  const [reactionMessage, setReactionMessage] = React.useState("");
  const [noPos, setNoPos] = React.useState(null);

  const containerRef = React.useRef(null);
  const noBtnRef = React.useRef(null);

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

    const left =
      Math.random() * (maxLeft - SAFE) + SAFE;
    const top =
      Math.random() * (maxTop - SAFE) + SAFE;

    // First interaction: convert from inline to absolute
    if (!noPos) {
      setNoPos({
        left: btn.offsetLeft,
        top: btn.offsetTop,
      });
    } else {
      setNoPos({
        left: Math.max(SAFE, Math.min(left, maxLeft)),
        top: Math.max(SAFE, Math.min(top, maxTop)),
      });
    }

    setReactionMessage((prev) =>
      prev === ""
        ? "Nice try 😌"
        : prev === "Nice try 😌"
        ? "Still trying?"
        : "Yeah… not happening 😏"
    );
  };

  const text =
    reactionMessage ||
    storyMessage ||
    "I wanted to do something a little special for you.";

  return (
    <div className="card" ref={containerRef}>
      <h1>For You ❤️</h1>

      <p>{text}</p>

      {step < 6 && (
        <button className="primary" onClick={next}>
          Continue
        </button>
      )}

      {step === 6 && (
        <div style={{ marginTop: "28px", position: "relative" }}>
          <button
            className="primary"
            onClick={() => {
              window.location.href = "/play";
            }}
          >
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
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
