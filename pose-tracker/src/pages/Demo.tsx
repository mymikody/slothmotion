import { useEffect, useRef, useState } from "react";
import type { PoseLandmarks } from "../pose/poseTypes";
import {
  FilesetResolver,
  PoseLandmarker,
  DrawingUtils,
} from "@mediapipe/tasks-vision";
import { getFeedback } from "../pose/feedback";
import slothImg from "../assets/Dance.png";

import BestScore from "../assets/BestScore.png";
import Streak from "../assets/StreakDays.png";
import Pink from "../assets/PinkBadge.png";
import GreenBadge from "../assets/GreenBadge.png";
import PurpleBadge from "../assets/PurpleBadge.png";
import OrangeBadge from "../assets/OrangeBadge.png";

export default function Demo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const instructorVideoRef = useRef<HTMLVideoElement | null>(null);

  const [feedback, setFeedback] = useState("Waiting for camera");
  const [progress, setProgress] = useState(0);
  const [showStatsPopup, setShowStatsPopup] = useState(false);


  // --- feedback smoothing refs ---
  // currently displayed feedback
  const displayedFeedbackRef = useRef("Waiting for camera");
  // candidate feedback that we're waiting to confirm
  const pendingFeedbackRef = useRef("Waiting for camera");
  // when the candidate feedback first appeared
  const pendingSinceRef = useRef<number>(performance.now());

  const instructorVideoSrc = "../videos/stretch_routine.mp4";
  const FEEDBACK_HOLD_MS = 300;

  function drawLandmarks(currentLandmarks: PoseLandmarks) {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!currentLandmarks || currentLandmarks.length === 0) return;

    const drawingUtils = new DrawingUtils(ctx);
    drawingUtils.drawLandmarks(currentLandmarks, { radius: 4 });
    drawingUtils.drawConnectors(
      currentLandmarks,
      PoseLandmarker.POSE_CONNECTIONS
    );
  }

  function finishDemo() {
    const instructorVideo = instructorVideoRef.current;

    if (instructorVideo) {
      instructorVideo.pause();
    }

    setProgress(100);
    setFeedback("Great job! Session complete.");
    setShowStatsPopup(true);
  }

  // helper to avoid flickery feedback changes
  function updateSmoothedFeedback(nextFeedback: string) {
    const now = performance.now();

    // if same as what is already displayed, reset pending state
    if (nextFeedback === displayedFeedbackRef.current) {
      pendingFeedbackRef.current = nextFeedback;
      pendingSinceRef.current = now;
      return;
    }

    // if this is a new candidate message, start timing it
    if (nextFeedback !== pendingFeedbackRef.current) {
      pendingFeedbackRef.current = nextFeedback;
      pendingSinceRef.current = now;
      return;
    }

    // if candidate has stayed stable long enough, show it
    if (now - pendingSinceRef.current >= FEEDBACK_HOLD_MS) {
      displayedFeedbackRef.current = nextFeedback;
      setFeedback(nextFeedback);
    }
  }

  useEffect(() => {
    let isMounted = true;
    let stream: MediaStream | null = null;

    async function init() {
      const video = videoRef.current;
      const instructorVideo = instructorVideoRef.current;

      if (!video || !instructorVideo) return;

      stream = await navigator.mediaDevices.getUserMedia({ video: true });

      video.srcObject = stream;
      await video.play();

      instructorVideo.currentTime = 0;
      await instructorVideo.play();

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

      if (!isMounted) {
        poseLandmarker.close();
        return;
      }

      poseLandmarkerRef.current = poseLandmarker;

      displayedFeedbackRef.current = "Camera ready, starting pose detection...";
      pendingFeedbackRef.current = "Camera ready, starting pose detection...";
      pendingSinceRef.current = performance.now();
      setFeedback("Camera ready, starting pose detection...");
    }

    init().catch((err) => {
      console.error("Error initializing pose landmarker:", err);
      displayedFeedbackRef.current = "Error initializing pose landmarker";
      pendingFeedbackRef.current = "Error initializing pose landmarker";
      pendingSinceRef.current = performance.now();
      setFeedback("Error initializing pose landmarker");
    });

    return () => {
      isMounted = false;

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      poseLandmarkerRef.current?.close();

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    function detectFrame() {
      const video = videoRef.current;
      const instructorVideo = instructorVideoRef.current;
      const poseLandmarker = poseLandmarkerRef.current;

      if (
        !video ||
        !poseLandmarker ||
        video.readyState < 2 ||
        showStatsPopup
      ) {
        animationFrameRef.current = requestAnimationFrame(detectFrame);
        return;
      }

      const nowMs = performance.now();
      const result = poseLandmarker.detectForVideo(video, nowMs);
      const currentLandmarks = result.landmarks?.[0] ?? [];

      drawLandmarks(currentLandmarks);

      if (currentLandmarks.length > 0) {
        try {
          const currentTime = instructorVideo?.currentTime ?? 0;
          const nextFeedback = getFeedback(currentLandmarks, currentTime);

          // use smoothed feedback update instead of immediate setFeedback
          updateSmoothedFeedback(nextFeedback);
        } catch (err) {
          console.error("Feedback error:", err);
          updateSmoothedFeedback("Error evaluating pose");
        }
      } else {
        updateSmoothedFeedback("No person detected");
      }

      animationFrameRef.current = requestAnimationFrame(detectFrame);
    }

    animationFrameRef.current = requestAnimationFrame(detectFrame);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [showStatsPopup]);

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

    const handleEnded = () => {
      finishDemo();
    };

    instructorVideo.addEventListener("timeupdate", updateProgress);
    instructorVideo.addEventListener("loadedmetadata", updateProgress);
    instructorVideo.addEventListener("ended", handleEnded);

    return () => {
      instructorVideo.removeEventListener("timeupdate", updateProgress);
      instructorVideo.removeEventListener("loadedmetadata", updateProgress);
      instructorVideo.removeEventListener("ended", handleEnded);
    };
  }, []);

  const handleCloseStatsPopup = () => {
    setShowStatsPopup(false);
    window.location.href = "/ProfilePage";
  };

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

        <button
          onClick={finishDemo}
          style={{
            background: "#587D67",
            border: "none",
            borderRadius: "999px",
            color: "#fff",
            fontSize: "14px",
            fontWeight: 700,
            padding: "10px 16px",
            cursor: "pointer",
          }}
        >
          Skip
        </button>
      </div>

      {/* Main frame */}
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

          {/* Instructor video */}
          <video
            ref={instructorVideoRef}
            src={instructorVideoSrc}
            autoPlay
            muted
            playsInline
            controls={false}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          {/* Webcam preview */}
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

      {/* Feedback bubble */}
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
            bottom: "-28px",
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

      {showStatsPopup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(80, 76, 68, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 20,
          }}
        >
          <div
            style={{
              position: "relative",
              width: "min(86vw, 1100px)",
              minHeight: "560px",
              background: "#f3eee2",
              borderRadius: "24px",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.18)",
              padding: "5px 56px 40px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <button
              className="popup-close"
              onClick={handleCloseStatsPopup}
              style={{
                position: "absolute",
                top: "28px",
                right: "28px",
                width: "52px",
                height: "52px",
                border: "none",
                background: "transparent",
                fontSize: "34px",
                cursor: "pointer",
                color: "#000",
                lineHeight: 1,
              }}
            >
              ✕
            </button>

            <h2
              style={{
                margin: "90px 0 20px",
                fontSize: "clamp(2rem, 3vw, 3rem)",
                color: "#000",
                textAlign: "center",
              }}
            >
              Session Complete!
            </h2>

            <p
              style={{
                margin: "0 0 32px",
                fontSize: "clamp(1.2rem, 2vw, 1.6rem)",
                color: "#000",
                textAlign: "center",
                fontWeight: 700,
              }}
            >
              Here are your stats
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                gap: "24px",
                marginBottom: "36px",
              }}
            >
              <img
                src={Streak}
                alt="Streak logo"
                style={{
                  width: "min(34vw, 280px)",
                  objectFit: "contain",
                }}
              />

              <img
                src={BestScore}
                alt="BestScore logo"
                style={{
                  width: "min(34vw, 280px)",
                  objectFit: "contain",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                justifyContent: "center",
                marginBottom: "90px",
              }}
            >
              <img
                src={Pink}
                alt="Pink badge"
                style={{ width: "88px", height: "88px", objectFit: "contain" }}
              />
              <img
                src={GreenBadge}
                alt="Green"
                style={{ width: "88px", height: "88px", objectFit: "contain" }}
              />
              <img
                src={PurpleBadge}
                alt="purple"
                style={{ width: "88px", height: "88px", objectFit: "contain" }}
              />
              <img
                src={OrangeBadge}
                alt="orange"
                style={{ width: "88px", height: "88px", objectFit: "contain" }}
              />
              <img
                src={PurpleBadge}
                alt="purple"
                style={{ width: "88px", height: "88px", objectFit: "contain" }}
              />
              <img
                src={GreenBadge}
                alt="Green"
                style={{ width: "88px", height: "88px", objectFit: "contain" }}
              />
            </div>

            <button
              onClick={handleCloseStatsPopup}
              style={{
                marginTop: "auto",
                minWidth: "220px",
                height: "72px",
                border: "none",
                borderRadius: "999px",
                background: "#587d67",
                color: "#fff",
                fontFamily: "inherit",
                fontSize: "1.8rem",
                cursor: "pointer",
                boxShadow: "0 4px 0 rgba(0, 0, 0, 0.12)",
              }}
            >
              View Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}