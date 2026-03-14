import type { PoseLandmarks } from "./poseTypes"
import { LANDMARK_INDEX } from "./poseTypes"

function jointError(a: any, b: any) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}

export function comparePose(
  live: PoseLandmarks,
  reference: PoseLandmarks
) {
  return {
    leftWrist: jointError(
      live[LANDMARK_INDEX.LEFT_WRIST],
      reference[LANDMARK_INDEX.LEFT_WRIST]
    ),

    rightWrist: jointError(
      live[LANDMARK_INDEX.RIGHT_WRIST],
      reference[LANDMARK_INDEX.RIGHT_WRIST]
    ),

    leftElbow: jointError(
      live[LANDMARK_INDEX.LEFT_ELBOW],
      reference[LANDMARK_INDEX.LEFT_ELBOW]
    ),

    rightElbow: jointError(
      live[LANDMARK_INDEX.RIGHT_ELBOW],
      reference[LANDMARK_INDEX.RIGHT_ELBOW]
    )
  }
}