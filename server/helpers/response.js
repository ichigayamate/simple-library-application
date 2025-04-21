class ResponseEntity {
  constructor(data, status = 200, message = "Success") {
    this.status = status;
    this.message = message;
    this.data = data;
  }

  generateResponse(res) {
    const responseEntity = new ResponseEntity(this.data, this.status, this.message);
    res.status(this.status).json(responseEntity);
  }
}

module.exports = ResponseEntity;