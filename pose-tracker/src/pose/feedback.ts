import type { PoseLandmarks } from "./poseTypes";
import { LANDMARK_INDEX } from "./poseTypes";
import { stretchRoutine } from "../routines/stretchRoutines";

function getCurrentStep(currentTime: number) {
  return (
    stretchRoutine.find(
      (step) => currentTime >= step.start && currentTime < step.end
    ) ?? stretchRoutine[stretchRoutine.length - 1]
  );
}

function isVisible(value?: number) {
  return (value ?? 0) > 0.4;
}

export function getFeedback(
  landmarks: PoseLandmarks,
  currentTime: number
): string {
  const step = getCurrentStep(currentTime);

  const nose = landmarks[LANDMARK_INDEX.NOSE];
  const leftShoulder = landmarks[LANDMARK_INDEX.LEFT_SHOULDER];
  const rightShoulder = landmarks[LANDMARK_INDEX.RIGHT_SHOULDER];
  const leftWrist = landmarks[LANDMARK_INDEX.LEFT_WRIST];
  const rightWrist = landmarks[LANDMARK_INDEX.RIGHT_WRIST];
  const leftHip = landmarks[LANDMARK_INDEX.LEFT_HIP];
  const rightHip = landmarks[LANDMARK_INDEX.RIGHT_HIP];

  if (
    !nose ||
    !leftShoulder ||
    !rightShoulder ||
    !leftWrist ||
    !rightWrist ||
    !leftHip ||
    !rightHip
  ) {
    return "Keep going!";
  }

  const shouldersVisible =
    isVisible(leftShoulder.visibility) && isVisible(rightShoulder.visibility);

  const wristsVisible =
    isVisible(leftWrist.visibility) && isVisible(rightWrist.visibility);

  if (!shouldersVisible) {
    return "Please move into the camera view";
  }

  const shoulderCenterX = (leftShoulder.x + rightShoulder.x) / 2;
  const hipCenterX = (leftHip.x + rightHip.x) / 2;

  const rightArmRaised = rightWrist.y < rightShoulder.y - 0.05;
  const leftArmRaised = leftWrist.y < leftShoulder.y - 0.05;

  const torsoHeightRight = rightHip.y - rightShoulder.y;
  const torsoHeightLeft = leftHip.y - leftShoulder.y;

  const rightArmAtChest =
    rightWrist.y > rightShoulder.y - torsoHeightRight * 0.15 &&
    rightWrist.y < rightShoulder.y + torsoHeightRight * 0.75;

  const leftArmAtChest =
    leftWrist.y > leftShoulder.y - torsoHeightLeft * 0.15 &&
    leftWrist.y < leftShoulder.y + torsoHeightLeft * 0.75;

  const bothArmsAtChest = rightArmAtChest && leftArmAtChest;

  const leaningRight =
    hipCenterX - shoulderCenterX > 0.03 || hipCenterX - nose.x > 0.04;

  const leaningLeft =
    shoulderCenterX - hipCenterX > 0.03 || nose.x - hipCenterX > 0.04;

  const noseOffsetFromShoulders = nose.x - shoulderCenterX;

  const twistingRight = noseOffsetFromShoulders < -0.02;
  const twistingLeft = noseOffsetFromShoulders > 0.02;

  if (step.label === "Neutral") {
    return "Keep going!";
  }

  if (step.label === "Right side stretch") {
    if (!leaningRight) {
      return "Lean gently to your right";
    }
    return "Great job!";
  }

  if (step.label === "Left side stretch") {
    if (!leaningLeft) {
      return "Lean gently to your left";
    }
    return "Great job!";
  }

  if (step.label === "Right twist") {
    if (!wristsVisible) {
      return "Bring both arms to chest level";
    }
    if (!bothArmsAtChest) {
      return "Bring both arms to chest level";
    }
    if (!twistingRight) {
      return "Twist gently to your right";
    }
    return "Great job!";
  }

  if (step.label === "Left twist") {
    if (!wristsVisible) {
      return "Bring both arms to chest level";
    }
    if (!bothArmsAtChest) {
      return "Bring both arms to chest level";
    }
    if (!twistingLeft) {
      return "Twist gently to your left";
    }
    return "Great job!";
  }

  if (step.label === "Right arm raise") {
    if (!rightArmRaised) {
      return "Raise your right arm higher";
    }
    return "Great job!";
  }

  if (step.label === "Left arm raise") {
    if (!leftArmRaised) {
      return "Raise your left arm higher";
    }
    return "Great job!";
  }

  return "Keep going!";
}