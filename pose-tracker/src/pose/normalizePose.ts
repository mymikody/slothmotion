import type { PoseLandmarks } from "./poseTypes"
import { LANDMARK_INDEX } from "./poseTypes"

function distance(a: any, b: any) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}

export function normalizePose(landmarks: PoseLandmarks) {
  const leftHip = landmarks[LANDMARK_INDEX.LEFT_HIP]
  const rightHip = landmarks[LANDMARK_INDEX.RIGHT_HIP]

  const hipCenter = {
    x: (leftHip.x + rightHip.x) / 2,
    y: (leftHip.y + rightHip.y) / 2
  }

  const leftShoulder = landmarks[LANDMARK_INDEX.LEFT_SHOULDER]
  const rightShoulder = landmarks[LANDMARK_INDEX.RIGHT_SHOULDER]

  const shoulderWidth = distance(leftShoulder, rightShoulder)

  return landmarks.map((lm) => ({
    ...lm,
    x: (lm.x - hipCenter.x) / shoulderWidth,
    y: (lm.y - hipCenter.y) / shoulderWidth
  }))
}