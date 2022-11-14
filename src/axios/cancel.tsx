export class Cancel {
  message: string;
  constructor(message: string) {
    this.message = message;
  }
}

export function isCancel(error: any) {
  return error instanceof Cancel;
}
export class CancelToken {
  public resolve: any;
  source() {
    return {
      cancel: (message: string) => {
        this.resolve(new Cancel(message));
      },
      token: new Promise((resolve) => {
        this.resolve = resolve;
      }),
    };
  }
}
