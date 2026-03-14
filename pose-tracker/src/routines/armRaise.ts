import type { PoseLandmarks, Landmark } from "../pose/poseTypes"
import { LANDMARK_INDEX } from "../pose/poseTypes"

function createEmptyPose(): PoseLandmarks {
  return Array.from({ length: 33 }, (): Landmark => ({
    x: 0,
    y: 0,
    z: 0,
    visibility: 1
  }))
}

export const armRaiseReference: PoseLandmarks = (() => {
  const pose = createEmptyPose()

  // shoulders
  pose[LANDMARK_INDEX.LEFT_SHOULDER] = { x: 0.4, y: 0.5, z: 0, visibility: 1 }
  pose[LANDMARK_INDEX.RIGHT_SHOULDER] = { x: 0.6, y: 0.5, z: 0, visibility: 1 }

  // elbows (raised)
  pose[LANDMARK_INDEX.LEFT_ELBOW] = { x: 0.35, y: 0.35, z: 0, visibility: 1 }
  pose[LANDMARK_INDEX.RIGHT_ELBOW] = { x: 0.65, y: 0.35, z: 0, visibility: 1 }

  // wrists (overhead)
  pose[LANDMARK_INDEX.LEFT_WRIST] = { x: 0.35, y: 0.2, z: 0, visibility: 1 }
  pose[LANDMARK_INDEX.RIGHT_WRIST] = { x: 0.65, y: 0.2, z: 0, visibility: 1 }

  // hips (used for normalization)
  pose[LANDMARK_INDEX.LEFT_HIP] = { x: 0.45, y: 0.75, z: 0, visibility: 1 }
  pose[LANDMARK_INDEX.RIGHT_HIP] = { x: 0.55, y: 0.75, z: 0, visibility: 1 }

  return pose
})()