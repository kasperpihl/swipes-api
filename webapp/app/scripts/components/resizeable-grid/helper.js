// Helper function to make animation states more readable, "test".indexOf("hey", "there", "test") === true
String.prototype.isOneOf = function(){
  var args = Array.prototype.slice.call(arguments);
  return (args.indexOf(this.toString()) > -1);
};
var Helper = {
	calcScale: function(fromSize, toSize){
		return (toSize / fromSize);
	},
	findClosest(array, index, condition){
    var foundIndex = -1;
    var prevIndex = index - 1;
    var nextIndex = index + 1;

    var iterator = function(i){
      var obj = array[i];
      console.log('iterator', i, obj);
      if(typeof condition === "string" && obj[condition]){
        foundIndex = i;
      }
      else if(typeof condition === "function" && condition(obj, i)){
        foundIndex = i;
      }
      else return false;
      return true;
    }

    for(var i = prevIndex ; i >= 0 ; i--){
      if(iterator(i)) break;
    }
    if(foundIndex > -1){ return foundIndex; }
    
    for(i = nextIndex ; i < array.length ; i++){
      if(iterator(i)) break;
    }

    return foundIndex;
  }
};

module.exports = Helper;