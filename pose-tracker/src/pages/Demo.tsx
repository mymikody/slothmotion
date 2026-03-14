import { useEffect, useRef, useState } from "react";
import type { PoseLandmarks } from "../pose/poseTypes";
import { FilesetResolver, PoseLandmarker, DrawingUtils } from "@mediapipe/tasks-vision";
import { getFeedback } from "../pose/feedback";
import slothImg from "../assets/Dance.png";

export default function Demo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [feedback, setFeedback] = useState("Waiting for camera");
  const [landmarks, setLandmarks] = useState<PoseLandmarks>([]);
  const instructorVideoSrc = "../videos/stretch_routine.mp4";

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
    <div
      style={{
        minHeight: "100vh",
        background: "#F6F1E7",
        padding: "24px",
        fontFamily: "sans-serif",
        boxSizing: "border-box",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto 18px auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Back arrow placeholder */}
        <button
          style={{
            background: "transparent",
            border: "none",
            fontSize: "32px",
            cursor: "pointer",
            color: "#1B1B1B",
            lineHeight: 1,
          }}
        >
          ←
        </button>

        <h1
          style={{
            margin: 0,
            fontSize: "42px",
            fontWeight: 800,
            color: "#111",
          }}
        >
          SlothMotion
        </h1>

        {/* Empty spacer so title stays centered */}
        <div style={{ width: "40px" }} />
      </div>

      {/* Main framed area */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          background: "#2F5D47",
          borderRadius: "18px",
          padding: "14px",
          position: "relative",
          boxSizing: "border-box",
        }}
      >
        {/* Instructor video area */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16 / 9",
            borderRadius: "10px",
            overflow: "hidden",
            background: "#D8D0C2",
          }}
        >
          {/* Progress bar overlay at top */}
          <div
            style={{
              position: "absolute",
              top: "16px",
              left: "24px",
              right: "24px",
              zIndex: 2,
              height: "18px",
              background: "#F3F0EA",
              borderRadius: "999px",
              border: "1px solid #7B7B7B",
              overflow: "hidden",
            }}
          >
            {/* Example progress fill */}
            <div
              style={{
                width: "22%",
                height: "100%",
                background: "#A8E2D0",
                borderRadius: "999px",
              }}
            />
          </div>

          {/* Main instructor video */}
          <video
            src={instructorVideoSrc}
            autoPlay
            loop
            muted
            playsInline
            controls={false}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />

          {/* User camera box */}
          <div
            style={{
              position: "absolute",
              right: "16px",
              bottom: "16px",
              width: "28%",
              maxWidth: "320px",
              aspectRatio: "4 / 3",
              background: "#000",
              borderRadius: "4px",
              overflow: "hidden",
              boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
            }}
          >
            {/* Webcam feed */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              width="640"
              height="480"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />

            {/* Landmark overlay on top of webcam */}
            <canvas
              ref={canvasRef}
              width="640"
              height="480"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>
      </div>

      {/* Feedback section under the framed area */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "18px auto 0 auto",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        {/* Sloth image placeholder - replace with your asset if you want */}
        <div
          style={{
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            background: "#E7D6B5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "42px",
            flexShrink: 0,
          }}
        >
          <img
            src={slothImg}
            alt="Sloth coach"
            style={{
              width: "90px",
              height: "90px",
              objectFit: "contain",
            }}
          />
        </div>

        {/* Feedback bubble */}
        <div
          style={{
            background: "#F3F0EA",
            borderRadius: "24px",
            padding: "18px 28px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            color: "#2F5D47",
            fontSize: "24px",
            fontWeight: 800,
            maxWidth: "700px",
          }}
        >
          {feedback}
        </div>
      </div>

      {/* Debug info - keep for now while developing */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "12px auto 0 auto",
          color: "#555",
          fontSize: "14px",
        }}
      >
        Detected landmarks: {landmarks.length}
      </div>
    </div>
  );
}