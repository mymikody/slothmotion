import { useEffect, useState } from "react";
import { getFeedback } from "../pose/feedback";
import type { PoseLandmarks } from "../pose/poseTypes";

export default function PoseCamera({
  landmarks,
  currentTime,
}: {
  landmarks: PoseLandmarks | null;
  currentTime: number;
}) {
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!landmarks) return;

    const newFeedback = getFeedback(landmarks, currentTime);
    setFeedback(newFeedback);
  }, [landmarks, currentTime]);

  return (
    <div>
      <p>{feedback}</p>
    </div>
  );
}