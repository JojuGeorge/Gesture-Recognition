import * as handpose from "@tensorflow-models/handpose";

// Points for fingers
const fingerJoints = {
  thumb: [0, 1, 2, 3, 4],
  indexFinger: [0, 5, 6, 7, 8],
  middleFinger: [0, 9, 10, 11, 12],
  ringFinger: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20],
};

// Drawing function (predictions of hand, canvas)
export const drawHand = (
  predictions: handpose.AnnotatedPrediction[],
  ctx: CanvasRenderingContext2D | null | undefined
) => {
  // check if we have predictions
  if (predictions.length > 0) {
    // loop through each of the predictions
    predictions.forEach((prediction) => {
      // Grab landmarks
      const landmarks = prediction.landmarks;

      // Loop through landmarks and draw
      for (let i = 0; i < landmarks.length; i++) {
        // Get x
        const x = landmarks[i][0];
        // Get y
        const y = landmarks[i][1];

        // Start drawing on canvas
        ctx?.beginPath();
        ctx?.arc(x, y, 5, 0, 3 * Math.PI);

        // set line color
        ctx && (ctx.fillStyle = "red");
        ctx?.fill();
      }
    });
  }
};
