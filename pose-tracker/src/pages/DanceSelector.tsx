import logo from "../assets/sloth.png"
import { useState } from "react";
import "./DanceSelector.css";

const dances = ["RASPUTIN", "MOONWALK", "CHA-CHA"];

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
          {dances.map((_, index) => {
            const position = getPosition(index);

            let className = "card hidden";
            if (position === 0) className = "card center";
            else if (position === -1) className = "card left";
            else if (position === 1) className = "card right";

            return <div key={index} className={className} />;
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