/**
 * MIT License
 *
 * Copyright (c) 2010-2012 Tween.js authors.
 * Easing equations Copyright (c) 2001 Robert Penner http://robertpenner.com/easing/
 * p5.tween Copyright (c) 2020 Nick
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
export const Easings = {
  linear: (t: number) => t,
  quadraticIn: (t: number) => t * t,
  quadraticOut: (t: number) => t * (2 - t),
  quadraticInOut: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  cubicIn: (t: number) => t * t * t,
  cubicOut: (t: number) => --t * t * t + 1,
  cubicInOut: (t: number) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
  quarticIn: (t: number) => t * t * t * t,
  quarticOut: (t: number) => 1 - --t * t * t * t,
  quarticInOut: (t: number) => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t),
  quinticIn: (t: number) => t * t * t * t * t,
  quinticOut: (t: number) => 1 + --t * t * t * t * t,
  quinticInOut: (t: number) => (t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t),
  elasticIn: (t: number) => (0.04 - 0.04 / t) * Math.sin(25 * t) + 1,
  elasticOut: (t: number) => ((0.04 * t) / --t) * Math.sin(25 * t),
  elasticInOut: (t: number) =>
    (t -= 0.5) < 0
      ? (0.02 + 0.01 / t) * Math.sin(50 * t)
      : (0.02 - 0.01 / t) * Math.sin(50 * t) + 1,
  sinIn: (t: number) => 1 + Math.sin((Math.PI / 2) * t - Math.PI / 2),
  sinOut: (t: number) => Math.sin((Math.PI / 2) * t),
  sinInOut: (t: number) => (1 + Math.sin(Math.PI * t - Math.PI / 2)) / 2,
  exponentialIn: (t: number) => (t === 0 ? 0 : Math.pow(1024, t - 1)),
  exponentialOut: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  exponentialInOut: (t: number) => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    if ((t *= 2) < 1) return 0.5 * Math.pow(1024, t - 1);
    return 0.5 * (-Math.pow(2, -10 * (t - 1)) + 2);
  },
  sinusoidalIn: (t: number) => 1 - Math.cos((t * Math.PI) / 2),
  sinusoidalOut: (t: number) => Math.sin((t * Math.PI) / 2),
  sinusoidalInOut: (t: number) => 0.5 * (1 - Math.cos(Math.PI * t)),
};
