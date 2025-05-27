import type {
  BaseResult,
  FbtContentItem,
  IFbtErrorListener,
  NestedFbtContentItems,
} from './Types.ts';

export default class FbtResultBase implements BaseResult {
  _contents: NestedFbtContentItems;
  _stringValue: string | null;
  _isSerializing: boolean;
  _errorListener: IFbtErrorListener | null;

  constructor(
    contents: NestedFbtContentItems,
    errorListener?: IFbtErrorListener | null,
  ) {
    this._contents = contents;
    this._errorListener = errorListener || null;
    this._isSerializing = false;
    this._stringValue = null;
  }

  flattenToArray(): ReadonlyArray<FbtContentItem> {
    return FbtResultBase.flattenToArray(this._contents);
  }

  getContents(): NestedFbtContentItems {
    return this._contents;
  }

  toString(): string {
    // Prevent risk of infinite recursions if the error listener or nested contents toString()
    // reenters this method on the same instance
    if (this._isSerializing) {
      return '<<Reentering fbt.toString() is forbidden>>';
    }
    this._isSerializing = true;
    try {
      return this._toString();
    } finally {
      this._isSerializing = false;
    }
  }

  _toString(): string {
    if (this._stringValue != null) {
      return this._stringValue;
    }
    let stringValue = '';
    for (const content of this.flattenToArray()) {
      if (typeof content === 'string' || content instanceof FbtResultBase) {
        stringValue += content.toString();
      } else {
        this._errorListener?.onStringSerializationError?.(content);
      }
    }
    this._stringValue = stringValue;
    return stringValue;
  }

  toJSON(): string {
    return this.toString();
  }

  static flattenToArray(
    contents: NestedFbtContentItems,
  ): ReadonlyArray<FbtContentItem> {
    if (contents.length === 1 && typeof contents[0] === 'string') {
      return contents as ReadonlyArray<FbtContentItem>;
    }

    const result: Array<FbtContentItem> = [];
    for (const content of contents) {
      if (Array.isArray(content)) {
        result.push(...FbtResultBase.flattenToArray(content));
      } else if (content instanceof FbtResultBase) {
        result.push(...content.flattenToArray());
      } else {
        result.push(content as FbtContentItem);
      }
    }
    return result;
  }
}
