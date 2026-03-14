import React from "react";
import "./Landing.css";
import Sloth from "../assets/Sloth.png";
import Dance from "../assets/Dance.png";
import Stretch from "../assets/Stretch.png";
import Excercise from "../assets/Excercise.png";
import LogoHeader from "../assets/LogoHeader.png";
import Profile from "../assets/Profile.png";

type FeatureProps = {
  title: string;
  image: string;
  onClick?: () => void;
};

export default function Landing() {
  return (
    <div className="page">

      <div className="top-stripes"></div>

      <div className="profile-icon">
          <img src={Profile} alt="profile" />
      </div>

      <header className="header">

        <img
          src={LogoHeader}
          alt="header shape"
          className="header-shape"
        />

        <div className="header-content">
          <img src={Sloth} alt="sloth logo" className="header-sloth" />
          <h1>SlothMotion</h1>
        </div>

      </header>

      <div className="cards">

        <FeatureCard
          title="DANCE"
          image={Dance}
          onClick={() => alert("Dance clicked")}
        />

        <FeatureCard
          title="EXERCISE"
          image={Excercise}
          onClick={() => alert("Exercise clicked")}
        />

        <FeatureCard
          title="STRETCH"
          image={Stretch}
          onClick={() => alert("Stretch clicked")}
        />

      </div>

      <p className="tagline">
        Encouraging seniors to stay active with safe, personalized movement.
      </p>

    </div>
  );
}

function FeatureCard({ title, image, onClick }: FeatureProps) {
  return (
    <div className="card" onClick={onClick}>

      <div className="card-frame">

        <div className="card-inner">

          <div className="card-lines"></div>

          <h2>{title}</h2>

          <div className="card-lines bottom"></div>

          <div className="image">
            <img src={image} alt={`${title} icon`} />
          </div>


        </div>

      </div>

    </div>
  );
}