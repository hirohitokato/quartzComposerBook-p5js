import p5 from "p5";
import { BindableInput, BindableOutput } from "../core/bindable";
import { ImageData } from "../core/imageData";
import { Provider } from "../core/provider";

interface Obj {
  [prop: string]: any;
}

/**
 * This patch renders a string as an image using the specified font attributes
 * and text alignment mode.
 *
 * The "String" input defines the string to be rendered, and "Image Width" and
 * "Image Height" the dimensions of the image in which to render the string.
 * If those dimensions are null, the image will automatically be sized to fit
 * the entire string.
 * The name of the font to use is defined by the "Font Name" input as
 * a case-sensitive PostScript name (it can also be set from the patch's settings)
 * and its size is defined by the "Font Size" input. Font leading and kerning
 * can also be modified through the corresponding patch inputs.
 * All these dimensions are expressed in Quartz Composer coordinates system units
 * by default.
 *
 * This patch outputs the image containing the rendered string (in white over
 * a black background) and the recommended size at which it should be displayed
 * in the rendering destination for optimal visual quality (those values would
 * typically be passed to a Billboard or Sprite patch). It also returns
 * the number of visible text lines and visible text glyphs (this information
 * is useful in case the entire string does not fit in the image).
 *
 * Note that Image With String can run in mode where dimensions are specified
 * in pixels instead of units (use the patch's settings to switch to that mode).
 * This mode can be useful if you explicitely want to create an image with
 * given pixels dimensions.
 */
export class ImageWithString implements Provider {
  /** The text string to render */
  textString: BindableInput<string> = new BindableInput("Hello world!");
  /** The name of font to use to render the text */
  fontName: BindableInput<string> = new BindableInput("LucidaGrande");
  /** The size of the font glyphs */
  fontSize: BindableInput<number> = new BindableInput(0.1);
  /** The leading offset for the font glyphs */
  fontLeadingOffset: BindableInput<number> = new BindableInput(0);
  /** The kerning shift for the font glyphs */
  fontKerningOffset: BindableInput<number> = new BindableInput(0);
  /** The width of the image (set to 0 for automatic computation) */
  imageWidth: BindableInput<number> = new BindableInput(0);
  /** The heihgt of the image (set to 0 for automatic computation) */
  imageHeight: BindableInput<number> = new BindableInput(0);

  /** The resulting image */
  image: BindableOutput<ImageData>;
  /** The image width at which the image should be displayed */
  displayWidth: BindableOutput<number>;
  /** The image height at which the image should be displayed */
  displayHeight: BindableOutput<number>;
  /** The number of visible lines in the image */
  lineCount: BindableOutput<number>;
  /** The number of visible glyphs in the image */
  characterCount: BindableOutput<number>;

  private _cachedText: string;
  private _cachedImage: ImageData | undefined;

  constructor(private p: p5, private fonts: { [name: string]: p5.Font }) {
    this.image = new BindableOutput(null!);
    this.displayWidth = new BindableOutput(-1);
    this.displayHeight = new BindableOutput(-1);
    this.lineCount = new BindableOutput(-1);
    this.characterCount = new BindableOutput(-1);

    this.image.onRequestedValue = this._onRequestedImageData.bind(this);
    this.displayWidth.onRequestedValue = this._onRequestedDisplayWidth.bind(this);
    this.displayHeight.onRequestedValue = this._onRequestedDisplayHeight.bind(this);

    this._cachedText = this.textString.getValue(0);
  }

  private _onRequestedImageData(t: number): ImageData {
    const text = this.textString.getValue(t);
    if (text == this._cachedText && this._cachedImage) {
      return this._cachedImage;
    }
    const imageData = this._createImageData(t, text);

    return imageData;
  }

  private _onRequestedDisplayWidth(t: number): number {
    const text = this.textString.getValue(t);
    if (text == this._cachedText && this._cachedImage) {
      return this._cachedImage.image.width;
    }
    return -1;
  }

  private _onRequestedDisplayHeight(t: number): number {
    const text = this.textString.getValue(t);
    if (text == this._cachedText && this._cachedImage) {
      return this._cachedImage.image.height;
    }
    return -1;
  }

  private _createImageData(t: number, text: string): ImageData {
    const fontSize = this.fontSize.getValue(t) * this.p.height;
    const fontName = this.fontName.getValue(t);
    const font = this.fonts[fontName]!;

    // TODO: change the box size if displayWidth/Height is non-zero.
    let bbox: Obj = font.textBounds(text, 0, 0, fontSize);

    let offscreenCanvas = this.p.createGraphics(bbox.w, bbox.h);
    offscreenCanvas.background("rgba(100%,0%,100%,0.0)");

    offscreenCanvas.stroke(255, 255, 0);
    offscreenCanvas.textFont(font);
    offscreenCanvas.fill(255, 255, 255);
    offscreenCanvas.textAlign(this.p.CENTER);
    offscreenCanvas.textSize(fontSize);
    offscreenCanvas.text(text, bbox.w / 2, bbox.h);

    this.displayWidth.updateInitialValue(bbox.w);
    this.displayHeight.updateInitialValue(bbox.h);

    let imageData = new ImageData(this.p, offscreenCanvas);
    imageData.filePath = "(image from canvas)";

    this._cachedText = text;
    this._cachedImage = imageData;

    return imageData;
  }
}
