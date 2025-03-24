import { useRef, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl"; // Load WebGL backend

import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import "../styles/Dashboard.css";
import { drawHand } from "../util/utilities";

function Dashboard() {
  const webcamRef = useRef<Webcam | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const runHandPose = async () => {
    // Set the backend to WebGL (or CPU if WebGL is not available)
    // TensorFlow.js requires a backend (e.g., WebGL or CPU) to execute operations. You need to explicitly load the backend before using any TensorFlow.js functionality.
    await tf.setBackend("cpu");

    // loading model
    const handposeModel = await handpose.load();
    console.log("Handpose model loaded");

    // loop to detect the hands
    setInterval(() => {
      detectHand(handposeModel);
    }, 100);
  };

  const detectHand = async (handModel: handpose.HandPose) => {
    // check if data is available
    if (
      webcamRef.current &&
      webcamRef.current.video &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get video properties
      const video = webcamRef.current.video;
      const videoHeight = video.videoHeight;
      const videoWidth = video.videoWidth;

      // Set video properties
      webcamRef.current.video.height = videoHeight;
      webcamRef.current.video.width = videoWidth;

      // Set canvas properties
      if (canvasRef.current !== null) {
        canvasRef.current.height = videoHeight;
        canvasRef.current.width = videoWidth;
      }

      // Make hand detection
      const hand = await handModel.estimateHands(video);
      console.log(hand);

      // Draw mesh
      // get canvas 2d context
      const ctx = canvasRef.current?.getContext("2d");
      drawHand(hand, ctx); // passing hand predictions and canvas
    }
  };

  useEffect(() => {
    runHandPose();
  }, []);
  return (
    <div>
      <div>
        <Webcam className="webcam" ref={webcamRef} />
        <canvas className="canvas" ref={canvasRef} />
      </div>
    </div>
  );
}

export default Dashboard;
