/** An interface type for consumer patch. */
export interface Consumer {
  /**
   * display order.
   * The bigger value of the layer property, the object is drawn forward.
   */
  layer: number;

  /**
   * Called from p5.draw() method every event loop.
   * @param atTime elapsed time since the window is loaded. the unit is sec.
   */
  draw(atTime: number): void;
}
