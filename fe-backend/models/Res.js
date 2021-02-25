class QueryResponse {
  constructor(isSuccess, responseMessage, payload) {
    this.isSuccess = isSuccess;
    this.responseMessage = responseMessage;
    this.payload = payload;
  }
}

module.exports = QueryResponse;
