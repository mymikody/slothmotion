import { useEffect } from "react";

export default function Demo() {

  useEffect(() => {
    async function setupCamera() {
      const video = document.getElementById("webcam") as HTMLVideoElement;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true
      });

      video.srcObject = stream;
    }

    setupCamera();
  }, []);

  return (
    <div>
      <h2>Pose Detection Demo</h2>
      <video id="webcam" autoPlay playsInline width="640"></video>
    </div>
  );
}