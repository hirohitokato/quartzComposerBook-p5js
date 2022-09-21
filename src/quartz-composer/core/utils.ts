/**
 * Creates an array of pairs built out of two underlying arrays.
 * @param array1 The first array to zip.
 * @param array2 The second array to zip.
 * @returns A sequence of tuple pairs, where the elements of each pair
 *            are corresponding elements of array1 and array2.
 * @refer https://gist.github.com/dev-thalizao/affaac253be5b5305e0faec3b650ba27
 */
export function zip<S1, S2>(array1: Array<S1>, array2: Array<S2>): Array<[S1, S2]> {
  const length = Math.min(array1.length, array2.length);
  const zipped: Array<[S1, S2]> = [];

  for (let index = 0; index < length; index++) {
    zipped.push([array1[index]!, array2[index]!]);
  }

  return zipped;
}
