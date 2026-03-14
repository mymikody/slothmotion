import logo from "../assets/sloth.png"
import { useState } from "react";
import "./DanceSelector.css";

const dances = ["RASPUTIN", "STATESIDE", "XXX"];

export default function DanceSelector() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevDance = () => {
    setCurrentIndex((prev) => (prev - 1 + dances.length) % dances.length);
  };

  const nextDance = () => {
    setCurrentIndex((prev) => (prev + 1) % dances.length);
  };

  const getPosition = (index: number) => {
    const total = dances.length;
    let diff = index - currentIndex;

    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    return diff;
  };

  return (
    
    <div className="dance-page">
      <div className="header">
        <div className="logo-section">
          <img src={logo} className="logo" />
          <span className="brand">SlothMotion</span>
        </div>
      </div>
      <h1 className="title">Select a Dance</h1>

      <div className="carousel-wrapper">
        <div className="carousel">
          {Array.from({ length: 7 }).map((_, renderIndex) => {
            const position = renderIndex - 3;

            const danceIndex =
              (currentIndex + position + dances.length * 10) % dances.length;

            let className = "card";
            if (position === 0) className += " center";
            else if (position < 0) className += " left";
            else className += " right";

            if (Math.abs(position) >= 3) className += " far";
            else if (Math.abs(position) === 2) className += " mid";
            else if (Math.abs(position) === 1) className += " near";

            return (
              <div
                key={renderIndex}
                className={className}
              >
                <div className="card-frame">
                  <div className="card-inner" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="controls">
        <button className="nav-button" onClick={prevDance}>
          ‹
        </button>

        <span className="dance-name">{dances[currentIndex]}</span>

        <button className="nav-button" onClick={nextDance}>
          ›
        </button>
      </div>
    </div>
  );
}