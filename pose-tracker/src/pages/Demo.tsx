import { useEffect, useRef, useState } from "react";
import type { PoseLandmarks } from "../pose/poseTypes";
import { FilesetResolver, PoseLandmarker, DrawingUtils } from "@mediapipe/tasks-vision";
// import { evaluatePose } from "../pose/poseEvaluator"; // thamadi - pose evaluation logic

export default function Demo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // canvas is to draw pose landmarks
  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null); // store MediaPipe model
  const animationFrameRef = useRef<number | null>(null); // store current frame

  const [feedback, setFeedback] = useState("Waiting for camera");
  const [landmarks, setLandmarks] = useState<PoseLandmarks>([]); // to store current detected landmarks (can remove)

  // draw points of joints on canvas
  function drawLandmarks(currentLandmarks: PoseLandmarks) {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if(!canvas || !ctx) {
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear previous drawings

    if (!currentLandmarks || currentLandmarks.length === 0) { // if no landmarks detected
      return;
    }

    const drawingUtils = new DrawingUtils(ctx);
    drawingUtils.drawLandmarks(currentLandmarks, {radius: 4});
    drawingUtils.drawConnectors(currentLandmarks, PoseLandmarker.POSE_CONNECTIONS);
  }
  
  // start camera and load model
  useEffect(() => {
    let isMounted = true; // to prevent state updates before async finishes

    // setup webcam camera
    async function init() {
      const video = videoRef.current;
      if (!video) {
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true
      });

      video.srcObject = stream;
      await video.play();

      const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");
      const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task",
        },
        runningMode: "VIDEO",
        numPoses: 1
      });

      if (!isMounted) {
        return;
      }

      poseLandmarkerRef.current = poseLandmarker;
      setFeedback("Camera ready, starting pose detection...");
      // detect pose here
    }

    init().catch((err) => {
      console.error("Error initializing pose landmarker:", err);
      setFeedback("Error initializing pose landmarker");
    });

    return () => {
      isMounted = false;
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      //cleanup
      poseLandmarkerRef.current?.close();
    };
  }, []);

  // this does pose detection on each video frame
  useEffect(() => {
    function detectFrame() {
      const video = videoRef.current;
      const poseLandmarker = poseLandmarkerRef.current;

      // if video or model not ready, skip this frame and try again on next animation frame
      if (!video || !poseLandmarker || video.readyState < 2) {
        animationFrameRef.current = requestAnimationFrame(detectFrame);
        return;
      }

      const nowMs = performance.now();
      const result = poseLandmarker.detectForVideo(video, nowMs);

      const currentLandmarks = result.landmarks?.[0] ?? []; // if no person detected, return empty array

      setLandmarks(currentLandmarks);
      drawLandmarks(currentLandmarks);

      // const nextFeedback = evaluatePose(currentLandmarks);
      // setFeedback(nextFeedback);

      animationFrameRef.current = requestAnimationFrame(detectFrame);
    }
    // start the loop
    animationFrameRef.current = requestAnimationFrame(detectFrame);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div style={{padding: "20px"}}>
      <h2>Pose Detection Demo</h2>
      <p>{feedback}</p>

      <div style={{ position: "relative", "width": "640px", "height": "480px" }}>
      <video ref={videoRef} autoPlay playsInline muted width="640" height="480" style={{position: "absolute", top: 0, left: 0, border: "1px solid #ccc"}}></video>
      <canvas ref={canvasRef} width="640" height="480" style={{position: "absolute", top: 0, left: 0, pointerEvents: "none"}}></canvas>
      </div>

      {/* debug: can remove this line */}
      <p>Detected landmarks: {landmarks.length}</p>
    </div>
  );
}