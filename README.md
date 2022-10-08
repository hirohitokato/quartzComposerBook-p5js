# About

This is p5.js implementations of sample codes explained in [Quarts Composer Book](http://www.bnn.co.jp/books/3645/).

<img src="https://raw.githubusercontent.com/hirohitokato/myAssets/main/quartzComposerBook-p5js/volvox.gif" width="25%"><img src="https://raw.githubusercontent.com/hirohitokato/myAssets/main/quartzComposerBook-p5js/jellyfish.gif" width="25%"><img src="https://raw.githubusercontent.com/hirohitokato/myAssets/main/quartzComposerBook-p5js/trilobite.gif" width="25%"><img src="https://raw.githubusercontent.com/hirohitokato/myAssets/main/quartzComposerBook-p5js/nautilus.gif" width="25%"><img src="https://raw.githubusercontent.com/hirohitokato/myAssets/main/quartzComposerBook-p5js/fish.gif" width="25%"><img src="https://raw.githubusercontent.com/hirohitokato/myAssets/main/quartzComposerBook-p5js/nautilus.gif" width="25%"><img src="https://raw.githubusercontent.com/hirohitokato/myAssets/main/quartzComposerBook-p5js/numberCube.gif" width="25%">

You can write the following composition as follows:

```ts
```


## Setup

```sh
$ pnpm install # run `npm install -g pnpm` if you don't have pnpm
```

## Build and Run

```sh
$pnpm run build
```

If you use vscode, you can do it by selecting `Run Build Task ...`(`Ctrl/Cmd-Shift-B`).

Then, open `dist/index.html` via any browser. ([Live Server vscode plugin](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) may help you)

## Supported Patches

Supported patches are the following:

* [X] Sprite
* [X] Image
* [X] LFO(Wave generator)
* [X] Interpolation
* [X] Gradient
* [X] Patch Time
* [X] Math
* [X] Round
* [X] Random
* [X] 3D Transformation
* [X] Iterator
* [X] Iterator Variables
* [X] HSL Color
* [X] Image Texturing Properties
* [X] Cube
* [X] Replicate in Space X/Y/Z
* [X] Image with String
* [ ] Multiplexer
* [ ] etc.

## How to change the target composition

In `src/main.ts`, you can find the following code:

```typescript
import { Basic03 } from "./examples/basic03";

setTargetComposition(new Basic03());
```

change the argument(`Basic03`) as you like. Of course, you can create your own drawings with a similar way.

## Create a custom component

Create a class implemented `QuartzComposition` interface, and pass the instance to `setTargetComposition()`.

```ts
export class MyCustomComposition implements QuartzComposition {
  preload(p: p5) {
    // Load images ...
  }

  setup(p: p5, consumers: Consumer[]) {
    // Construct and bind patches.
    ...
    // After construction, push all consumers(without inside macro patches)
    // to the `consumers`.
  }
```

`preload()` and `setup()` work as same as p5js' same name function.

## Notes

* All assets are downloaded from [here](http://download.bnn.co.jp/download/qcb/).
* This repository uses [p5.js Templates(PETR+)](https://fal-works.github.io/p5js-templates/).

## Special thanks

* Mamoru Kano, the author of the book.
* [fal-works](https://www.fal-works.com)

<!-- # p5.js Template PETR+

*Other languages (wiki):* [[ ja ]](https://github.com/fal-works/p5js-template-petr-plus/wiki/Readme-ja)

## About

Template project for [p5.js](https://p5js.org/) sketches using [TypeScript](https://www.typescriptlang.org/) and other typical tools.

See also [other templates](https://fal-works.github.io/p5js-templates/).


## Differences from [Template PETR](https://github.com/fal-works/p5js-template-petr)

- Works on [p5.js instance mode](https://github.com/processing/p5.js/wiki/Global-and-instance-mode).
- Minifies the output code using [terser](https://terser.org/).
- In `index.html`,
    - `defer` attribute is added in `<script>` tags.
    - loads the minified edition of p5.js, which also disables the p5.js Friendly Error System. -->
