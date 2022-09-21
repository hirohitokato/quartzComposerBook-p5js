type Subscriber<T> = (newValue: T) => void;

/**
 * Tが同じ型のBindableOutputと接続可能な値保持のための型。
 * `getValue()`が呼ばれることにより、接続されたBindableOutputから値を取得し返す
 */
export class BindableInput<T> {
  protected _value: T;
  private _boundOutput: BindableOutput<T> | undefined;

  constructor(defaultValue: T) {
    this._value = defaultValue;
  }

  /** update default value */
  setDefaultValue(value: T) {
    this._value = value;
  }

  getValue(atTime: number): T {
    return this._boundOutput?.getValue(atTime) ?? this._value;
  }

  bind(output: BindableOutput<T>): BindableInput<T> {
    this._boundOutput = output;
    return this;
  }
}

/**
 * Tが同じ型のBindableInputと接続可能な、値を保持するための型。
 * `value`プロパティに設定することによりBindableInputに値を流す
 */
export class BindableOutput<T> {
  onRequestedValue: ((atTime: number) => T) | undefined;
  protected _initialValue: T;

  constructor(initialValue: T) {
    this._initialValue = initialValue;
  }

  getValue(atTime: number): T {
    if (this.onRequestedValue === undefined) {
      return this._initialValue;
    }
    return this.onRequestedValue(atTime);
  }

  updateInitialValue(value: T) {
    this._initialValue = value;
  }
}
