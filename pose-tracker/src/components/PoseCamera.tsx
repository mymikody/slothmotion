import { useEffect, useState } from "react";
import { getFeedback } from "../pose/feedback";
import type { PoseLandmarks } from "../pose/poseTypes";

export default function PoseCamera({ landmarks }: { landmarks: PoseLandmarks | null }) {
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!landmarks) return;

    const newFeedback = getFeedback(landmarks);
    setFeedback(newFeedback);
  }, [landmarks]);

  return (
    <div>
      {/* your canvas/video goes here */}
      <p>{feedback}</p>
    </div>
  );
}