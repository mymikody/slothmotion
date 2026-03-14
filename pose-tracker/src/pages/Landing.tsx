import React from "react";
import "./Landing.css";
import Sloth from "../assets/Sloth.png";
import Dance from "../assets/Dance.png";
import Stretch from "../assets/Stretch.png";
import Excercise from "../assets/Excercise.png";
import LogoHeader from "../assets/LogoHeader.png";


export default function Landing() {
  return (
    <div className="page">
      <header className="header">
 
        <div className="logo">
        <img src={Sloth} alt="Sloth logo" />
        </div>

        <h1>SLOTHMOTION</h1>
      </header>

      <div className="cards">
        <FeatureCard title="DANCE" image={Dance} description="Fun gentle dancing" onClick={() => alert('Dance card clicked!')} />
        <FeatureCard title="EXERCISE" image={Excercise} description="Light strength training" />
        <FeatureCard title="STRETCH" image={Stretch} description="Simple flexibility moves" />
      </div>

      <p className="tagline">
        Encouraging seniors to stay active with safe, personalized movement.
      </p>
    </div>
  );
}

type FeatureProps = {
    title: string;
    image: string;
    description: string;
  };
  

function FeatureCard({ title, image, description, onClick}: FeatureProps & { onClick?: () => void }) {
    return (
      <div className="card" onClick={onClick}>
        <div className="card-inner">
          <h2>{title}</h2>
          <div className="image">
          <img src={image} alt={`${title} icon`} />
          </div>
        <p>{description}</p>
        </div>
      </div>
    );
  }