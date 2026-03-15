import Pencil from "../assets/Pencil.png";
import ProfilePic from "../assets/profilepic.png";

export default function ProfileCard() {
  return (
    <div className="profile-card">
      <div className="profile-left">
        <div className="avatar">
          <img src={ProfilePic} alt="Profile picture" />
        </div>
      </div>

      <div className="profile-right">
        <div className="profile-header">
          <div>
            <h2>Lily James</h2>
            <p>67, Medical condition: back injuries</p>
          </div>
          <img src={Pencil} alt="Edit logo" className="Edit" />
        </div>

        <div className="level-container">
          <div className="level">lvl. 25</div>
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
        </div>

        <div className="motions">
          <div className="motions-icon">⚑</div>
          <div>
            <h3>30</h3>
            <p>Motions done</p>
          </div>
        </div>
      </div>
    </div>
  );
}