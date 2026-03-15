import logo from "../assets/sloth.png";
import { useState } from "react";
import "./ExerciseSelector.css";

import bohemianRhapsodyCover from "../assets/bohemianRhapsody.png";
import stayinAliveCover from "../assets/stayinAlive.jpg";
import dancingQueenCover from "../assets/dancingQueen.jpg";
import letItBeCover from "../assets/letItBe.jpg";
import superstitionCover from "../assets/superstition.jpg";

type ExerciseSelectorProps = {
  setPage: (page: string) => void;
};

const dances = [
  { name: "Bohemian Rhapsody", cover: bohemianRhapsodyCover },
  { name: "Stayin' Alive", cover: stayinAliveCover },
  { name: "Dancing Queen", cover: dancingQueenCover },
  { name: "Let It Be", cover: letItBeCover },
  { name: "Superstition", cover: superstitionCover },
];

export default function ExerciseSelector({ setPage }: ExerciseSelectorProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevDance = () => {
    setCurrentIndex((prev) => (prev - 1 + dances.length) % dances.length);
  };

  const nextDance = () => {
    setCurrentIndex((prev) => (prev + 1) % dances.length);
  };

  const handleDanceClick = () => {
    const selectedDance = dances[currentIndex];

    if (selectedDance.name === "Stayin' Alive") {
      setPage("demo");
    }
  };

  return (
    <div className="dance-page">
      <div className="header">
      <div
        className="logo-section"
        onClick={() => setPage("landing")}
        style={{ cursor: "pointer" }}
      >
        <img src={logo} className="logo" alt="SlothMotion logo" />
        <span className="brand">SlothMotion</span>
      </div>
      </div>

      <h1 className="title">Select an Exercise Routine</h1>

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
                onClick={() => {
                  if (position === 0) {
                    handleDanceClick();
                  }
                }}
              >
                <div className="card-frame">
                  <div className="card-inner">
                    <div className="album-border">
                      <img
                        src={dances[danceIndex].cover}
                        alt={dances[danceIndex].name}
                        className="cover"
                      />
                    </div>
                  </div>
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

        <span className="dance-name">{dances[currentIndex].name}</span>

        <button className="nav-button" onClick={nextDance}>
          ›
        </button>
      </div>
    </div>
  );
}