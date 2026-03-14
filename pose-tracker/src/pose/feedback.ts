import type { PoseLandmarks } from "./poseTypes"
import { normalizePose } from "./normalizePose"
import { comparePose } from "./comparePose"
import { armRaiseReference } from "../routines/armRaise"

export function getFeedback(landmarks: PoseLandmarks): string {

  const live = normalizePose(landmarks)
  const reference = normalizePose(armRaiseReference)

  const errors = comparePose(live, reference)

  if (errors.leftWrist > 2.0 || errors.rightWrist > 2.0) {
    return "Raise your arms higher"
  }

//   if (errors.leftElbow > 2.0 || errors.rightElbow > 2.0) {
//     return "Straighten your arms"
//   }

  return "Great job!"
}