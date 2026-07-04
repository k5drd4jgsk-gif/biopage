import { useEffect, useRef, useState } from "react";
import "./flip-clock.css";

function getCST(): { hours: string; minutes: string; seconds: string } {
  const now = new Date();
  const cst = new Date(now.toLocaleString("en-US", { timeZone: "America/Chicago" }));
  const h = cst.getHours().toString().padStart(2, "0");
  const m = cst.getMinutes().toString().padStart(2, "0");
  const s = cst.getSeconds().toString().padStart(2, "0");
  return { hours: h, minutes: m, seconds: s };
}

interface FlipCardProps {
  digit: string;
  prevDigit: string;
}

function FlipCard({ digit, prevDigit }: FlipCardProps) {
  const [flipping, setFlipping] = useState(false);
  const prevRef = useRef(prevDigit);

  useEffect(() => {
    if (digit !== prevRef.current) {
      setFlipping(true);
      const t = setTimeout(() => {
        setFlipping(false);
        prevRef.current = digit;
      }, 400);
      return () => clearTimeout(t);
    }
  }, [digit]);

  return (
    <div className="flip-card">
      <div className="flip-card-top">{digit}</div>
      <div className="flip-card-bottom">{digit}</div>
      {flipping && (
        <>
          <div className="flip-card-back-top">{prevRef.current}</div>
          <div className="flip-card-back-bottom flip-animate">{digit}</div>
        </>
      )}
    </div>
  );
}

function DigitPair({ value }: { value: string }) {
  const d0 = value[0];
  const d1 = value[1];
  const prev0Ref = useRef(d0);
  const prev1Ref = useRef(d1);

  const prev0 = prev0Ref.current;
  const prev1 = prev1Ref.current;

  useEffect(() => {
    prev0Ref.current = d0;
    prev1Ref.current = d1;
  });

  return (
    <div className="digit-pair">
      <FlipCard digit={d0} prevDigit={prev0} />
      <FlipCard digit={d1} prevDigit={prev1} />
    </div>
  );
}

export default function App() {
  const [time, setTime] = useState(getCST());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getCST());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page">
      <div className="notification-bar">
        <span className="bar-label">CST</span>
        <div className="clock">
          <DigitPair value={time.hours} />
          <span className="colon">:</span>
          <DigitPair value={time.minutes} />
          <span className="colon">:</span>
          <DigitPair value={time.seconds} />
        </div>
      </div>
      <div className="content">
        <p>Your app content goes here.</p>
      </div>
    </div>
  );
}
