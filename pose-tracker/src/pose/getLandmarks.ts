import type { PoseLandmarks, Landmark } from "./poseTypes"

export function getLandmark(
  landmarks: PoseLandmarks,
  index: number
): Landmark {
  return landmarks[index]
}