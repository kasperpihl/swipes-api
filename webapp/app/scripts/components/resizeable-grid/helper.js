// Helper function to make animation states more readable, "test".indexOf("hey", "there", "test") === true
String.prototype.isOneOf = function(){
  var args = Array.prototype.slice.call(arguments);
  return (args.indexOf(this.toString()) > -1);
};
var Helper = {
	calcScale(fromSize, toSize){
		return (toSize / fromSize);
	},
  /*
    Find the item closest (or furthest) in an array that matches a condition
    Excludes index from the test
    Default starts looking from left, then right
    Options: index (required), rightFirst, leftOnly, rightOnly, returnIndex, furthest
   */
  findNeighbor(array, options, condition){
    if(!options || typeof options !== 'object'){
      options = {index: options};
    }

    if(typeof options.index !== 'number'){
      return new Error("findNeighbor: index required in options");
    }
    var index = options.index;
    var foundIndex = -1;
    var prevIndex = index - 1;
    var nextIndex = index + 1;
    var firstIndex = 0;
    var lastIndex = array.length - 1;
    var didRunIndex = false;
    console.log()
    
    var returnFunction = function(i){
      if(options.returnIndex || foundIndex === -1){
        return i;
      }
      return array[i];
    };
    var iterator = function(i){
      var obj = array[i];
      if(typeof condition === "string" && obj[condition]){
        foundIndex = i;
      }
      else if(typeof condition === "function" && condition(obj, i)){
        foundIndex = i;
      }
      else return false;
      return true;
    }
    var runIndex = function(){
      if(options.includeIndex && !didRunIndex){
        iterator(index);
        didRunIndex = true;
      }
    };

    var checkLeft = function(){
      runIndex();
      for(var i = prevIndex ; i >= 0 ; i--){
        if(iterator(i)) break;
      }
    };
    var checkRight = function(){
      runIndex();
      for(var i = nextIndex ; i < array.length ; i++){
        if(iterator(i)) break;
      }
    };

    if(options.furthest){
      checkLeft = function(){
        for(var i = firstIndex ; i < index ; i++){
          if(iterator(i)) break;
        }
        runIndex();
      };
      checkRight = function(){
        for(var i = lastIndex ; i > index ; i--){
          if(iterator(i)) break;
        }
        runIndex();
      };
    }
    
    if(options.rightFirst){
      checkRight();
      if(foundIndex > -1){ return returnFunction(foundIndex); }
    }
    
    if(!options.rightOnly){
      checkLeft();
      if(foundIndex > -1){ return returnFunction(foundIndex); }
    }

    if(!options.rightFirst && !options.leftOnly){
      checkRight();
    }

    return returnFunction(foundIndex);
  }
};

module.exports = Helper;