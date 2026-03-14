import BestScore from "../assets/BestScore.png";
import Streak from "../assets/StreakDays.png";
import Pink from "../assets/PinkBadge.png";
import GreenBadge from "../assets/GreenBadge.png";
import PurpleBadge from "../assets/PurpleBadge.png";
import OrangeBadge from "../assets/OrangeBadge.png";


export default function StatsSection() {
    return (
      <div className="stats-container">
        <img src={Streak} alt="Streak logo" className="Streak" />

        <img src={BestScore} alt="BestScore logo" className="BestScore" />


        <div className="badges">
        <img src={Pink} alt="Pink badge" className="Pink" />
        <img src={GreenBadge} alt="Green" className="Green" />
        <img src={PurpleBadge} alt="purple" className="Purple" />
        <img src={OrangeBadge} alt="orange" className="Orange" />
        <img src={PurpleBadge} alt="purple" className="Purple" />
        <img src={GreenBadge} alt="Green" className="Green" />

        </div>
  
      </div>
    );
  }