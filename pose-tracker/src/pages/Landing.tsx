import React, { useState } from "react";
import "./Landing.css";

import Sloth from "../assets/Sloth.png";
import Profile from "../assets/Profile.png";
import Dance from "../assets/Dance.png";
import Stretch from "../assets/Stretch.png";
import Excercise from "../assets/Excercise.png";
import LogoHeader from "../assets/LogoHeader.png";

const injuryOptions = [
  "Back pain",
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
    const popupShown = sessionStorage.getItem("injuryPopupShown");

    setSelectedCard(card);

    if (!popupShown) {
      setShowInjuryPopup(true);
      return;
    }

    goToCard(card);
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

  const handlePopupDone = async () => {
    sessionStorage.setItem("injuryPopupShown", "true");
    sessionStorage.setItem(
      "selectedConditions",
      JSON.stringify(selectedConditions)
    );

    setShowInjuryPopup(false);

    /*
      Later you can save to your database here too.
      Example:
      await saveConditionsToDatabase(selectedConditions);
    */

    if (selectedCard) {
      goToCard(selectedCard);
    }
  };

  const handlePopupClose = () => {
    sessionStorage.setItem("injuryPopupShown", "true");
    setShowInjuryPopup(false);

    if (selectedCard) {
      goToCard(selectedCard);
    }
  };

  return (
    <div className="page">
      <div className="top-stripes"></div>

      <div className="profile-icon">
        <img src={Profile} alt="profile" />
      </div>

      <header className="header">
        <img src={LogoHeader} alt="header" className="header-shape" />

        <div className="header-content">
          <img src={Sloth} alt="sloth" className="header-sloth" />
          <h1>SlothMotion</h1>
        </div>
      </header>

      <section className="cards">
        <div className="card" onClick={() => handleCardClick("dance")}>
          <div className="card-frame">
            <div className="card-inner">
              <div className="card-lines"></div>
              <h2>DANCE</h2>
              <div className="card-lines bottom"></div>
              <div className="image">
                <img src={Dance} alt="Dance" />
              </div>
            </div>
          </div>
        </div>

        <div className="card" onClick={() => handleCardClick("exercise")}>
          <div className="card-frame">
            <div className="card-inner">
              <div className="card-lines"></div>
              <h2>EXERCISE</h2>
              <div className="card-lines bottom"></div>
              <div className="image">
                <img src={Excercise} alt="Exercise" />
              </div>
            </div>
          </div>
        </div>

        <div className="card" onClick={() => handleCardClick("stretch")}>
          <div className="card-frame">
            <div className="card-inner">
              <div className="card-lines"></div>
              <h2>STRETCH</h2>
              <div className="card-lines bottom"></div>
              <div className="image">
                <img src={Stretch} alt="Stretch" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <p className="tagline">
        Encouraging seniors to stay active with safe, personalized movement.
      </p>

      {showInjuryPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <button className="popup-close" onClick={handlePopupClose}>
              ✕
            </button>

            <h2 className="popup-title">
              Any injuries or medical conditions?
            </h2>

            <div className="popup-search">
              <input type="text" placeholder="Search condition ..." />
              <span className="popup-search-icon">⌕</span>
            </div>

            <div className="popup-tags">
              {injuryOptions.map((condition) => {
                const isSelected = selectedConditions.includes(condition);

                return (
                  <button
                    key={condition}
                    type="button"
                    className={isSelected ? "active-tag" : ""}
                    onClick={() => handleConditionToggle(condition)}
                  >
                    {condition}
                  </button>
                );
              })}
            </div>

            <button className="popup-done" onClick={handlePopupDone}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}