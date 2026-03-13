import type { Landmark } from "./poseTypes";

export function calculateAngle(a: Landmark, b: Landmark, c: Landmark): number {
  const ba = { x: a.x - b.x, y: a.y - b.y };
  const bc = { x: c.x - b.x, y: c.y - b.y };

  const dot = ba.x * bc.x + ba.y * bc.y;
  const magBA = Math.sqrt(ba.x * ba.x + ba.y * ba.y);
  const magBC = Math.sqrt(bc.x * bc.x + bc.y * bc.y);

  const cosTheta = dot / (magBA * magBC);
  const angleRad = Math.acos(Math.max(-1, Math.min(1, cosTheta)));
  return angleRad * (180 / Math.PI);
}