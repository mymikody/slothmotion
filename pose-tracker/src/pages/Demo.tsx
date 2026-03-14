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
  const instructorVideoRef = useRef<HTMLVideoElement | null>(null);

  const [feedback, setFeedback] = useState("Waiting for camera");
  const [progress, setProgress] = useState(0);
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

      drawLandmarks(currentLandmarks);

      if (currentLandmarks && currentLandmarks.length > 0) {
        try {
          const nextFeedback = getFeedback(currentLandmarks);
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

  useEffect(() => {
    const instructorVideo = instructorVideoRef.current;
    if (!instructorVideo) return;

    const updateProgress = () => {
      if (!instructorVideo.duration || Number.isNaN(instructorVideo.duration)) {
        setProgress(0);
        return;
      }

      const nextProgress =
        (instructorVideo.currentTime / instructorVideo.duration) * 100;
      setProgress(nextProgress);
    };

    const resetProgress = () => {
      setProgress(0);
    };

    instructorVideo.addEventListener("timeupdate", updateProgress);
    instructorVideo.addEventListener("loadedmetadata", updateProgress);
    instructorVideo.addEventListener("ended", resetProgress);

    return () => {
      instructorVideo.removeEventListener("timeupdate", updateProgress);
      instructorVideo.removeEventListener("loadedmetadata", updateProgress);
      instructorVideo.removeEventListener("ended", resetProgress);
    };
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        overflow: "hidden",
        background: "#F6F1E7",
        padding: "12px 20px",
        fontFamily: "sans-serif",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          maxWidth: "1200px",
          width: "100%",
          margin: "0 auto 10px auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <button
          style={{
            background: "transparent",
            border: "none",
            fontSize: "28px",
            cursor: "pointer",
            color: "#1B1B1B",
          }}
        >
          ←
        </button>

        <h1
          style={{
            margin: 0,
            fontSize: "clamp(28px, 4vw, 42px)",
            fontWeight: 800,
            color: "#111",
          }}
        >
          SlothMotion
        </h1>

        <div style={{ width: "40px" }} />
      </div>

      {/* Green frame */}
      <div
        style={{
          maxWidth: "1200px",
          width: "100%",
          margin: "0 auto",
          background: "#2F5D47",
          borderRadius: "18px",
          padding: "12px",
          position: "relative",
          flex: 1,
          minHeight: 0,
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: "10px",
            overflow: "hidden",
            background: "#D8D0C2",
          }}
        >
          {/* Progress bar */}
          <div
            style={{
              position: "absolute",
              top: "16px",
              left: "24px",
              right: "24px",
              zIndex: 2,
              height: "16px",
              background: "#F3F0EA",
              borderRadius: "999px",
              border: "1px solid #7B7B7B",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "#A8E2D0",
                borderRadius: "999px",
                transition: "width 0.1s linear",
              }}
            />
          </div>

          <video
            ref={instructorVideoRef}
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
            }}
          />

          <div
            style={{
              position: "absolute",
              right: "16px",
              bottom: "16px",
              width: "24%",
              maxWidth: "280px",
              aspectRatio: "4 / 3",
              background: "#000",
              borderRadius: "4px",
              overflow: "hidden",
              transform: "scaleX(-1)",
            }}
          >
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
              }}
            />

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

      {/* Feedback */}
      <div
        style={{
          maxWidth: "1200px",
          width: "100%",
          margin: "10px auto 0 auto",
          display: "flex",
          alignItems: "center",
          position: "relative",
        }}
      >
        <img
          src={slothImg}
          alt="Sloth coach"
          style={{
            position: "absolute",
            left: "20px",
            bottom: "-28px", // moved slightly up
            width: "240px",
            height: "240px",
            objectFit: "contain",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            marginLeft: "210px",
            background: "#F3F0EA",
            borderRadius: "24px",
            padding: "14px 22px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            color: "#2F5D47",
            fontSize: "clamp(18px, 2.2vw, 24px)",
            fontWeight: 800,
            maxWidth: "700px",
          }}
        >
          {feedback}
        </div>
      </div>
    </div>
  );
}