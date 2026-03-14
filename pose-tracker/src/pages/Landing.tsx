import React, { useState } from "react";
import "./Landing.css";

import Sloth from "../assets/Sloth.png";
import Profile from "../assets/Profile.png";
import Dance from "../assets/Dance.png";
import Stretch from "../assets/Stretch.png";
import Excercise from "../assets/Excercise.png";
import LogoHeader from "../assets/LogoHeader.png";

const injuryOptions = [
  "Knee pain",
  "Lower back pain",
  "Hip pain",
  "Arthritis",
  "Shoulder pain",
  "Balance Issues",
  "Limited Mobility",
  "Ankle Pain",
  "Neck Stiffness",
  "None",
];

export default function Landing() {
  const [showInjuryPopup, setShowInjuryPopup] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  const goToCard = (card: string) => {
    if (card === "dance") {
      window.location.href = "/DanceSelector";
    }

    if (card === "exercise") {
      window.location.href = "/ExerciseSelector";
    }

    if (card === "stretch") {
      window.location.href = "/StretchSelector";
    }
  };

  const handleCardClick = (card: string) => {
    setSelectedCard(card);
    setShowInjuryPopup(true);
  };

  const handleConditionToggle = (condition: string) => {
    setSelectedConditions((prev) => {
      if (condition === "None") {
        return ["None"];
      }

      const withoutNone = prev.filter((item) => item !== "None");

      if (withoutNone.includes(condition)) {
        return withoutNone.filter((item) => item !== condition);
      }

      return [...withoutNone, condition];
    });
  };

  const handlePopupDone = () => {
    sessionStorage.setItem(
      "selectedConditions",
      JSON.stringify(selectedConditions)
    );

    setShowInjuryPopup(false);

    if (selectedCard) {
      goToCard(selectedCard);
    }
  };

  const handlePopupClose = () => {
    setShowInjuryPopup(false);

    if (selectedCard) {
      goToCard(selectedCard);
    }
  };

  return (
    <div className="landing-page">
      <div className="landing-top-stripes"></div>

      <div className="landing-profile-icon">
        <img src={Profile} alt="profile" />
      </div>

      <header className="landing-header">
        <img
          src={LogoHeader}
          alt="header"
          className="landing-header-shape"
        />

        <div className="landing-header-content">
          <img src={Sloth} alt="sloth" className="landing-header-sloth" />
          <h1 className="landing-title">SlothMotion</h1>
        </div>
      </header>

      <section className="landing-cards">

        <div
          className="landing-card"
          onClick={() => handleCardClick("dance")}
        >
          <div className="landing-card-frame">
            <div className="landing-card-inner">
              <div className="landing-card-lines"></div>
              <h2>DANCE</h2>
              <div className="landing-card-lines bottom"></div>
              <div className="landing-image">
                <img src={Dance} alt="Dance" />
              </div>
            </div>
          </div>
        </div>

        <div
          className="landing-card"
          onClick={() => handleCardClick("exercise")}
        >
          <div className="landing-card-frame">
            <div className="landing-card-inner">
              <div className="landing-card-lines"></div>
              <h2>EXERCISE</h2>
              <div className="landing-card-lines bottom"></div>
              <div className="landing-image">
                <img src={Excercise} alt="Exercise" />
              </div>
            </div>
          </div>
        </div>

        <div
          className="landing-card"
          onClick={() => handleCardClick("stretch")}
        >
          <div className="landing-card-frame">
            <div className="landing-card-inner">
              <div className="landing-card-lines"></div>
              <h2>STRETCH</h2>
              <div className="landing-card-lines bottom"></div>
              <div className="landing-image">
                <img src={Stretch} alt="Stretch" />
              </div>
            </div>
          </div>
        </div>

      </section>

      <p className="landing-tagline">
        Encouraging seniors to stay active with safe, personalized movement.
      </p>

      {showInjuryPopup && (
        <div className="landing-popup-overlay">
          <div className="landing-popup">

            <button
              className="landing-popup-close"
              onClick={handlePopupClose}
            >
              ✕
            </button>

            <h2 className="landing-popup-title">
              Any injuries or medical conditions?
            </h2>

            <div className="landing-popup-search">
              <input type="text" placeholder="Search condition ..." />
              <span className="landing-popup-search-icon">⌕</span>
            </div>

            <div className="landing-popup-tags">
              {injuryOptions.map((condition) => {
                const isSelected = selectedConditions.includes(condition);

                return (
                  <button
                    key={condition}
                    type="button"
                    className={isSelected ? "landing-active-tag" : ""}
                    onClick={() => handleConditionToggle(condition)}
                  >
                    {condition}
                  </button>
                );
              })}
            </div>

            <button
              className="landing-popup-done"
              onClick={handlePopupDone}
            >
              Done
            </button>

          </div>
        </div>
      )}
    </div>
  );
}