/**
 * starnutoditopo/typescript-cubic-spline
 *
 * https://github.com/starnutoditopo/typescript-cubic-spline
 *
 * A cubic spline guesses the value of y for any x value on a curve.
 * This is helpful, for example, for smoothing line graphs.
 *
 * This project is a typescript implementation of Morgan Herlocker's cubic-spline,
 * which, in turn, is a slight modification of Ivan Kuckir's cubic spline implementation.
 */
export class Spline {
  xs: number[];
  ys: number[];
  ks: Float64Array;

  constructor(xs: number[], ys: number[]) {
    if (xs.length !== ys.length) {
      throw Error("Input arrays must be of same size.");
    }

    if (
      xs.every((e, i) => {
        if (i) return e > xs[i - 1]!!;
        else return true;
      }) === false
    ) {
      throw Error("xs must increase monotonically.");
    }

    this.xs = xs;
    this.ys = ys;
    this.ks = this.getNaturalKs(new Float64Array(this.xs.length));
  }

  getNaturalKs(ks: Float64Array) {
    const n = this.xs.length - 1;
    const A = zerosMat(n + 1, n + 2);

    for (
      let i = 1;
      i < n;
      i++ // rows
    ) {
      A[i]![i - 1] = 1 / (this.xs[i]! - this.xs[i - 1]!);
      A[i]![i] = 2 * (1 / (this.xs[i]! - this.xs[i - 1]!) + 1 / (this.xs[i + 1]! - this.xs[i]!));
      A[i]![i + 1] = 1 / (this.xs[i + 1]! - this.xs[i]!);
      A[i]![n + 1] =
        3 *
        ((this.ys[i]! - this.ys[i - 1]!) /
          ((this.xs[i]! - this.xs[i - 1]!) * (this.xs[i]! - this.xs[i - 1]!)) +
          (this.ys[i + 1]! - this.ys[i]!) /
            ((this.xs[i + 1]! - this.xs[i]!) * (this.xs[i + 1]! - this.xs[i]!)));
    }

    A[0]![0] = 2 / (this.xs[1]! - this.xs[0]!);
    A[0]![1] = 1 / (this.xs[1]! - this.xs[0]!);
    A[0]![n + 1] =
      (3 * (this.ys[1]! - this.ys[0]!)) /
      ((this.xs[1]! - this.xs[0]!) * (this.xs[1]! - this.xs[0]!));

    A[n]![n - 1] = 1 / (this.xs[n]! - this.xs[n - 1]!);
    A[n]![n] = 2 / (this.xs[n]! - this.xs[n - 1]!);
    A[n]![n + 1] =
      (3 * (this.ys[n]! - this.ys[n - 1]!)) /
      ((this.xs[n]! - this.xs[n - 1]!) * (this.xs[n]! - this.xs[n - 1]!));

    return solve(A, ks);
  }

  /**
   * inspired by https://stackoverflow.com/a/40850313/4417327
   */
  getIndexBefore(target: number): number {
    let low = 0;
    let high = this.xs.length;
    let mid = 0;
    while (low < high) {
      mid = Math.floor((low + high) / 2);
      if (this.xs[mid]! < target && mid !== low) {
        low = mid;
      } else if (this.xs[mid]! >= target && mid !== high) {
        high = mid;
      } else {
        high = low;
      }
    }
    return low + 1;
  }

  at(x: number): number {
    if (x <= this.xs[0]!) {
      return this.ys[0]!;
    }

    if (x >= this.xs[this.xs.length - 1]!) {
      return this.ys[this.ys.length - 1]!;
    }

    let i = this.getIndexBefore(x);
    const t = (x - this.xs[i - 1]!) / (this.xs[i]! - this.xs[i - 1]!);
    const a = this.ks[i - 1]! * (this.xs[i]! - this.xs[i - 1]!) - (this.ys[i]! - this.ys[i - 1]!);
    const b = -this.ks[i]! * (this.xs[i]! - this.xs[i - 1]!) + (this.ys[i]! - this.ys[i - 1]!);
    const q = (1 - t) * this.ys[i - 1]! + t * this.ys[i]! + t * (1 - t) * (a * (1 - t) + b * t);
    // console.log(`${x}),${q}`);
    return q;
  }
}

function solve(A: Float64Array[], ks: Float64Array): Float64Array {
  const m = A.length;
  let h = 0;
  let k = 0;
  while (h < m && k <= m) {
    let i_max = 0;
    let max = -Infinity;
    for (let i = h; i < m; i++) {
      const v = Math.abs(A[i]![k]!);
      if (v > max) {
        i_max = i;
        max = v;
      }
    }

    if (A[i_max]![k]! === 0) {
      k++;
    } else {
      swapRows(A, h, i_max);
      for (let i = h + 1; i < m; i++) {
        const f = A[i]![k]! / A[h]![k]!;
        A[i]![k] = 0;
        for (let j = k + 1; j <= m; j++) A[i]![j]! -= A[h]![j]! * f;
      }
      h++;
      k++;
    }
  }

  for (
    let i = m - 1;
    i >= 0;
    i-- // rows = columns
  ) {
    var v = 0;
    if (A[i]![i]!) {
      v = A[i]![m]! / A[i]![i]!;
    }
    ks[i] = v;
    for (
      let j = i - 1;
      j >= 0;
      j-- // rows
    ) {
      A[j]![m] -= A[j]![i]! * v;
      A[j]![i] = 0;
    }
  }
  return ks;
}

function zerosMat(r: number, c: number) {
  const A = [];
  for (let i = 0; i < r; i++) A.push(new Float64Array(c));
  return A;
}

function swapRows(m: Float64Array[], k: number, l: number) {
  let p = m[k]!!;
  m[k]!! = m[l]!!;
  m[l]!! = p;
}
