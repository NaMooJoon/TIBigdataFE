export class QueryResponse {
  isSuccess: boolean;
  responseMessage: string;
  payload: {};
  constructor(isSuccess: boolean, responseMessage: string, payload: {}) {
    this.isSuccess = isSuccess;
    this.responseMessage = responseMessage;
    this.payload = payload;
  }
}
