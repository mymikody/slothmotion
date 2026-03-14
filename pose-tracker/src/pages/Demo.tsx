import { useEffect, useRef, useState } from "react";
import type { PoseLandmarks } from "../pose/poseTypes";
import { FilesetResolver, PoseLandmarker, DrawingUtils } from "@mediapipe/tasks-vision";
import { getFeedback } from "../pose/feedback";

export default function Demo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [feedback, setFeedback] = useState("Waiting for camera");
  const [landmarks, setLandmarks] = useState<PoseLandmarks>([]);

  function drawLandmarks(currentLandmarks: PoseLandmarks) {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!currentLandmarks || currentLandmarks.length === 0) return;

    const drawingUtils = new DrawingUtils(ctx);
    drawingUtils.drawLandmarks(currentLandmarks, { radius: 4 });
    drawingUtils.drawConnectors(currentLandmarks, PoseLandmarker.POSE_CONNECTIONS);
  }

  useEffect(() => {
    let isMounted = true;

    async function init() {
      const video = videoRef.current;
      if (!video) return;

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      video.srcObject = stream;
      await video.play();

      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task",
        },
        runningMode: "VIDEO",
        numPoses: 1,
      });

      if (!isMounted) return;

      poseLandmarkerRef.current = poseLandmarker;
      setFeedback("Camera ready, starting pose detection...");
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

      poseLandmarkerRef.current?.close();
    };
  }, []);

  useEffect(() => {
    function detectFrame() {
      const video = videoRef.current;
      const poseLandmarker = poseLandmarkerRef.current;

      if (!video || !poseLandmarker || video.readyState < 2) {
        animationFrameRef.current = requestAnimationFrame(detectFrame);
        return;
      }

      const nowMs = performance.now();
      const result = poseLandmarker.detectForVideo(video, nowMs);

      const currentLandmarks = result.landmarks?.[0] ?? [];

      setLandmarks(currentLandmarks);
      drawLandmarks(currentLandmarks);

      // ===== DEBUG + FEEDBACK SYSTEM =====

      if (currentLandmarks && currentLandmarks.length > 0) {
        console.log("Landmarks detected:", currentLandmarks.length);

        try {
          const nextFeedback = getFeedback(currentLandmarks);
          console.log("Feedback returned:", nextFeedback);

          setFeedback(nextFeedback);
        } catch (err) {
          console.error("Feedback error:", err);
          setFeedback("Error evaluating pose");
        }
      } else {
        setFeedback("No person detected");
      }

      animationFrameRef.current = requestAnimationFrame(detectFrame);
    }

    animationFrameRef.current = requestAnimationFrame(detectFrame);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Pose Detection Demo</h2>
      <p>{feedback}</p>

      <div style={{ position: "relative", width: "640px", height: "480px" }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          width="640"
          height="480"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            border: "1px solid #ccc",
          }}
        />

        <canvas
          ref={canvasRef}
          width="640"
          height="480"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
          }}
        />
      </div>

      <p>Detected landmarks: {landmarks.length}</p>
    </div>
  );
}