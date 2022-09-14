// See also: https://rollupjs.org/

import copy from 'rollup-plugin-copy'

const banner = `/**
 * This is a p5.js sketch made with p5js-template-petr-plus.
 *
 * @license CC0-1.0
 */
`;

const config = {
  input: "tsc-out/main.js",
  output: {
    file: "dist/script.js",
    format: "iife",
    banner,
    globals: { p5: "p5" },
    interop: "default",
  },
  external: ["p5"],
  plugins: [
    copy({
      targets: [
        { src: 'src/assets', dest: 'dist/' }
      ],
      verbose: true,
    })
  ]
};

export default config;
