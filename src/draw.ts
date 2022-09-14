import p5 from "p5";
import { consumers, gradient_background, providers, volvox } from "./setup";

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

  providers.forEach((p, i, _) => {
    p.update(elapsedTime);
  });

  consumers.forEach((c, i, _) => {
    c.draw();
  });
};
