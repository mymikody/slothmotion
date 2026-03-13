import type { PoseLandmarks } from "./poseTypes";
import { LANDMARK_INDEX } from "./poseTypes";
import { calculateAngle } from "./calculateAngle";

export function getFeedback(landmarks: PoseLandmarks): string {
  const leftShoulder = landmarks[LANDMARK_INDEX.LEFT_SHOULDER];
  const rightShoulder = landmarks[LANDMARK_INDEX.RIGHT_SHOULDER];
  const leftElbow = landmarks[LANDMARK_INDEX.LEFT_ELBOW];
  const rightElbow = landmarks[LANDMARK_INDEX.RIGHT_ELBOW];
  const leftWrist = landmarks[LANDMARK_INDEX.LEFT_WRIST];
  const rightWrist = landmarks[LANDMARK_INDEX.RIGHT_WRIST];
  const leftHip = landmarks[LANDMARK_INDEX.LEFT_HIP];
  const rightHip = landmarks[LANDMARK_INDEX.RIGHT_HIP];

  // Optional arm angles
  const leftArmAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
  const rightArmAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);

  // Riase hands: wrists above shoulders
  const leftWristAboveShoulder = leftWrist.y < leftShoulder.y;
  const rightWristAboveShoulder = rightWrist.y < rightShoulder.y;

  // Stand straight: torso roughly upright
  const torsoUpright = Math.abs(leftShoulder.y - leftHip.y - (rightShoulder.y - rightHip.y)) < 0.1;

  if (!leftWristAboveShoulder || !rightWristAboveShoulder) {
    return "Raise your arms higher";
  }

  if (!torsoUpright) {
    return "Keep your back straight";
  }

  return "Great job!";
}