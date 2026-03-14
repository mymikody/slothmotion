import ProfileCard from "./ProfileCard";
import StatsSection from "./StatsSection";
import "./ProfilePage.css";
import Sloth from "../assets/Sloth.png";

export default function ProfilePage() {
  return (
    <div className="profile-page">

      {/* Top Navigation */}
      <div className="top-bar">
        <div className="logo-area">
          <img src={Sloth} alt="Sloth logo" className="logo" />
          <h2>SlothMotion</h2>
        </div>

        <div className="back-arrow">←</div>
      </div>

      {/* Profile Card */}
      <ProfileCard />

      {/* Stats + Badges */}
      <StatsSection />

    </div>
  );
}