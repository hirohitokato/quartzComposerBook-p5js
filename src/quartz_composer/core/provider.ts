export interface Provider {
  /**
   * Called from p5.draw() method every event loop. It is called before
   * draw() method declared in each Consumer instance.
   * @param elapsed elapsed time since the window is loaded. the unit is sec.
   */
  update(elapsed: number): void;
}
