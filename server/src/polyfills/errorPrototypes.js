Error.prototype.info = function(obj) {
  this.errorInfo = obj;
  return this;
};

Error.prototype.toClient = function(showingMessage) {
  this.showToClient = showingMessage || this.message;
  return this;
};

Error.prototype.code = function(num) {
  if (typeof num !== 'number') {
    console.warn('Error.code expects a number');
  } else {
    this.errorCode = num;
  }
  return this;
};
