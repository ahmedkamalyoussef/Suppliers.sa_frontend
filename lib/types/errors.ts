export interface ApiError {
  [key: string]: string[];
}

export class ValidationError extends Error {
  public errors: ApiError;

  constructor(message: string, errors: ApiError) {
    super(message);
    this.name = "ValidationError";
    this.errors = errors;
  }
}
