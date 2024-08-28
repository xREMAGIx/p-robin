type ErrorParams = {
  status: string;
  errorCode: string;
  title: string;
  detail?: string;
  messageCode: string;
};

export class ApiError extends Error {
  status: string;
  errorCode: string;
  title: string;
  detail?: string;
  messageCode: string;

  constructor({ status, errorCode, title, detail, messageCode }: ErrorParams) {
    super("");
    this.status = status;
    this.errorCode = errorCode;
    this.title = title;
    this.detail = detail;
    this.messageCode = messageCode;
  }
}
