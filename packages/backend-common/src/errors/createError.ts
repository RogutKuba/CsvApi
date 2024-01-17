import { ServerError } from "./serverError";

interface ErrorTypeParams<Metadata extends Record<string, unknown>> {
  name: string;
  status: number;
  messageData: {
    message: string;
    title?: string;
    meta?: Metadata;
  };
}

export function createError(baseOptions: { name: string; title?: string }) {
  const self = {
    createError: <Metadata extends Record<string, unknown>>(
      options: ErrorTypeParams<Metadata>
    ) => {
      const ErrorClass = class extends ServerError {
        static get errorName() {
          return `${baseOptions.name}.${options.name}`;
        }

        title: string = options.messageData.title || baseOptions.title || "";
        meta: Metadata;
        status = options.status;
        baseErrorType: string = baseOptions.name;
        errorType: string = options.name;

        constructor(meta?: Metadata) {
          super({
            message: options.messageData.message,
            title: options.messageData.title,
            ...meta,
          });
          this.meta = meta || ({} as Metadata);
        }
      };

      return ErrorClass;
    },
  };

  return self;
}
