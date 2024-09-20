export class ApiResponse {
  statusCode: number;
  message: string;
  redirectUrl: string;

  constructor (statusCode: number, message: string, redirect: string) {
    this.statusCode = statusCode;
    this.message = message;
    this.redirectUrl = redirect;
  }
}

