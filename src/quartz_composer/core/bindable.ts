/**
 * Tが同じ型のBindableOutputと接続可能な値保持のための型。
 * BindableOutputの値と同じ値になる
 */
export class BindableInput<T> {
  protected _value: T | undefined;

  constructor(defaultValue: T | undefined = undefined) {
    // バインドしていない場合のデフォルト値を指定する
    this._value = defaultValue;
  }

  get value(): T {
    return this._value!;
  }

  set value(value: T) {
    this._value = value;
  }
}

/**
 * Tが同じ型のBindableInputと接続可能な、値を保持するための型。
 * `value`プロパティに設定することによりBindableInputに値を流す
 */
export class BindableOutput<T> {
  protected _value: T | undefined;
  protected inputs: BindableInput<T>[];

  constructor(initialValue: T | undefined = undefined) {
    this._value = initialValue;
    this.inputs = [];
  }

  get value(): T {
    return this._value!;
  }

  set value(value: T) {
    this._value = value;
    this.inputs.forEach((input) => {
      input.value = value;
    });
  }

  bind(input: BindableInput<T>): void {
    this.inputs.push(input);
    if (typeof this._value !== "undefined") {
      input.value = this._value;
    }
  }
}
