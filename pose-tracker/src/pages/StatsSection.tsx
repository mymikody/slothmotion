export default function StatsSection() {
    return (
      <div className="stats-container">
  
        <div className="streak-card">
          <p>Streak</p>
          <h1>10</h1>
        </div>
  
        <div className="score-card">
          <p>Best Score</p>
          <h1>84</h1>
        </div>
  
        <div className="badges">
  
          <div className="badge pink"></div>
          <div className="badge purple"></div>
          <div className="badge red"></div>
  
          <div className="badge green"></div>
          <div className="badge yellow"></div>
          <div className="badge lightgreen"></div>
  
        </div>
  
      </div>
    );
  }