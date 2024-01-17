import * as crypto from "node:crypto";

const generateRandomId = (base: number) => {
  return parseInt(crypto.randomBytes(6).toString("hex"), 16)
    .toString(base)
    .slice(0, 7);
};

export class ServerError extends Error {
  baseErrorType = "";
  errorType = "ServerError";

  get name() {
    if (!this.baseErrorType) {
      return this.errorType;
    }
    return [this.baseErrorType, this.errorType].join(".");
  }

  get message() {
    return this._title ? `${this._title}: ${this._message}` : this._message;
  }

  getFriendlyError() {
    return {
      name: this.name,
      title: this._title,
      message: this._message,
      status: this.status,
      meta: this.meta,
      uniqueId: this.uniqueId,
    };
  }

  _title: string;
  _message: string;
  uniqueId: string;
  status: number;
  meta: Record<string, unknown>;

  constructor(
    meta: { message: string; title?: string } & Record<string, unknown>
  ) {
    super();
    this.uniqueId = generateRandomId(36);
    this.meta = meta;

    this._title = meta.title ?? "";
    this._message = meta.message;
    this.status = 500;
  }
}
