Error.prototype.info = function(obj) {
  this.errorInfo = obj;
  return this;
}

Error.prototype.code = function(num) {
  if(typeof num !== 'number') {
    console.warn('Error.code expects a number');
  } else {
    this.errorCode = num;
  }
  return this;
}