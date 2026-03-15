import type { PoseLandmarks, Landmark } from "../pose/poseTypes";
import { LANDMARK_INDEX } from "../pose/poseTypes";

function createEmptyPose(): PoseLandmarks {
  return Array.from({ length: 33 }, (): Landmark => ({
    x: 0,
    y: 0,
    z: 0,
    visibility: 1,
  }));
}

function neutralPose(): PoseLandmarks {
  const pose = createEmptyPose();

  pose[LANDMARK_INDEX.LEFT_SHOULDER] = { x: 0.42, y: 0.5, z: 0, visibility: 1 };
  pose[LANDMARK_INDEX.RIGHT_SHOULDER] = { x: 0.58, y: 0.5, z: 0, visibility: 1 };

  pose[LANDMARK_INDEX.LEFT_ELBOW] = { x: 0.43, y: 0.66, z: 0, visibility: 1 };
  pose[LANDMARK_INDEX.RIGHT_ELBOW] = { x: 0.57, y: 0.66, z: 0, visibility: 1 };

  pose[LANDMARK_INDEX.LEFT_WRIST] = { x: 0.44, y: 0.84, z: 0, visibility: 1 };
  pose[LANDMARK_INDEX.RIGHT_WRIST] = { x: 0.56, y: 0.84, z: 0, visibility: 1 };

  pose[LANDMARK_INDEX.LEFT_HIP] = { x: 0.46, y: 0.76, z: 0, visibility: 1 };
  pose[LANDMARK_INDEX.RIGHT_HIP] = { x: 0.54, y: 0.76, z: 0, visibility: 1 };

  return pose;
}

function rightSideStretchPose(): PoseLandmarks {
  const pose = neutralPose();

  // body leaning to the user's right
  pose[LANDMARK_INDEX.NOSE] = { x: 0.56, y: 0.34, z: 0, visibility: 1 };
  pose[LANDMARK_INDEX.LEFT_SHOULDER] = { x: 0.45, y: 0.52, z: 0, visibility: 1 };
  pose[LANDMARK_INDEX.RIGHT_SHOULDER] = { x: 0.60, y: 0.47, z: 0, visibility: 1 };

  return pose;
}

function leftSideStretchPose(): PoseLandmarks {
  const pose = neutralPose();

  // body leaning to the user's left
  pose[LANDMARK_INDEX.NOSE] = { x: 0.44, y: 0.34, z: 0, visibility: 1 };
  pose[LANDMARK_INDEX.LEFT_SHOULDER] = { x: 0.40, y: 0.47, z: 0, visibility: 1 };
  pose[LANDMARK_INDEX.RIGHT_SHOULDER] = { x: 0.55, y: 0.52, z: 0, visibility: 1 };

  return pose;
}

function rightTwistPose(): PoseLandmarks {
  const pose = neutralPose();

  // both arms up-ish / forward-ish, torso rotated right
  pose[LANDMARK_INDEX.LEFT_ELBOW] = { x: 0.46, y: 0.42, z: 0, visibility: 1 };
  pose[LANDMARK_INDEX.RIGHT_ELBOW] = { x: 0.63, y: 0.43, z: 0, visibility: 1 };
  pose[LANDMARK_INDEX.LEFT_WRIST] = { x: 0.48, y: 0.34, z: 0, visibility: 1 };
  pose[LANDMARK_INDEX.RIGHT_WRIST] = { x: 0.70, y: 0.35, z: 0, visibility: 1 };

  pose[LANDMARK_INDEX.LEFT_SHOULDER] = { x: 0.45, y: 0.50, z: 0, visibility: 1 };
  pose[LANDMARK_INDEX.RIGHT_SHOULDER] = { x: 0.58, y: 0.52, z: 0, visibility: 1 };

  return pose;
}

function leftTwistPose(): PoseLandmarks {
  const pose = neutralPose();

  // both arms up-ish / forward-ish, torso rotated left
  pose[LANDMARK_INDEX.LEFT_ELBOW] = { x: 0.37, y: 0.43, z: 0, visibility: 1 };
  pose[LANDMARK_INDEX.RIGHT_ELBOW] = { x: 0.54, y: 0.42, z: 0, visibility: 1 };
  pose[LANDMARK_INDEX.LEFT_WRIST] = { x: 0.30, y: 0.35, z: 0, visibility: 1 };
  pose[LANDMARK_INDEX.RIGHT_WRIST] = { x: 0.52, y: 0.34, z: 0, visibility: 1 };

  pose[LANDMARK_INDEX.LEFT_SHOULDER] = { x: 0.42, y: 0.52, z: 0, visibility: 1 };
  pose[LANDMARK_INDEX.RIGHT_SHOULDER] = { x: 0.55, y: 0.50, z: 0, visibility: 1 };

  return pose;
}

function rightArmRaisePose(): PoseLandmarks {
  const pose = neutralPose();

  pose[LANDMARK_INDEX.RIGHT_ELBOW] = { x: 0.65, y: 0.35, z: 0, visibility: 1 };
  pose[LANDMARK_INDEX.RIGHT_WRIST] = { x: 0.65, y: 0.18, z: 0, visibility: 1 };

  return pose;
}

function leftArmRaisePose(): PoseLandmarks {
  const pose = neutralPose();

  pose[LANDMARK_INDEX.LEFT_ELBOW] = { x: 0.35, y: 0.35, z: 0, visibility: 1 };
  pose[LANDMARK_INDEX.LEFT_WRIST] = { x: 0.35, y: 0.18, z: 0, visibility: 1 };

  return pose;
}

export type RoutineStep = {
  start: number;
  end: number;
  label: string;
  reference: PoseLandmarks;
};

export const stretchRoutine: RoutineStep[] = [
  { start: 0, end: 4, label: "Neutral", reference: neutralPose() },

  { start: 4, end: 13, label: "Right side stretch", reference: rightSideStretchPose() },
  { start: 13, end: 14, label: "Neutral", reference: neutralPose() },

  { start: 14, end: 22, label: "Left side stretch", reference: leftSideStretchPose() },
  { start: 22, end: 28, label: "Neutral", reference: neutralPose() },

  { start: 28, end: 30, label: "Right twist", reference: rightTwistPose() },
  { start: 30, end: 32, label: "Left twist", reference: leftTwistPose() },
  { start: 32, end: 34, label: "Right twist", reference: rightTwistPose() },
  { start: 34, end: 36, label: "Left twist", reference: leftTwistPose() },
  { start: 36, end: 38, label: "Right twist", reference: rightTwistPose() },
  { start: 38, end: 40, label: "Left twist", reference: leftTwistPose() },
  { start: 40, end: 42, label: "Right twist", reference: rightTwistPose() },
  { start: 42, end: 44, label: "Left twist", reference: leftTwistPose() },
  { start: 44, end: 46, label: "Right twist", reference: rightTwistPose() },
  { start: 46, end: 48, label: "Left twist", reference: leftTwistPose() },

  { start: 48, end: 50, label: "Neutral", reference: neutralPose() },

  { start: 50, end: 53, label: "Right arm raise", reference: rightArmRaisePose() },
  { start: 53, end: 54, label: "Neutral", reference: neutralPose() },
  { start: 54, end: 56, label: "Left arm raise", reference: leftArmRaisePose() },
  { start: 56, end: 57, label: "Neutral", reference: neutralPose() },
  { start: 57, end: 59, label: "Right arm raise", reference: rightArmRaisePose() },
  { start: 59, end: 60, label: "Neutral", reference: neutralPose() },
  { start: 60, end: 62, label: "Left arm raise", reference: leftArmRaisePose() },
  { start: 62, end: 64, label: "Right arm raise", reference: rightArmRaisePose() },
  { start: 64, end: 66, label: "Left arm raise", reference: leftArmRaisePose() },
];