export class ValidationError extends Error {
  constructor(message) {
    super();
    this.message = message;
    this.status_code = 400;
  }
}

export class InternalServerError extends Error {
  constructor(message) {
    super();
    this.message = message;
    this.status_code = 500;
  }
}
