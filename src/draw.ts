import p5 from "p5";
import { consumers } from "./setup";

let startTime: number = -1;

/** This is a draw function. */
export const draw = (p: p5): void => {
  // Compute elapsed time in sec.
  let elapsedTime: number;
  if (startTime == -1) {
    startTime = new Date().getTime();
    elapsedTime = 0;
  } else {
    elapsedTime = (new Date().getTime() - startTime) / 1000;
  }

  p.background(0);

  consumers.forEach((c, i, _) => {
    c.draw(elapsedTime);
  });
};
