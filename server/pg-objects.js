exports.insert = function(obj) {
  var keys = Object.keys(obj)
    , values = []
    , numerals = []   // This will hold the placeholders. I.e. `$1,$2,$3`
    ;


  var keyString = "";
  keys.forEach(function(key) { keyString += '"' + key + '",'; values.push(obj[key]); });
  if(keyString.length > 0)
    keyString = keyString.slice(0,-1);
  for (var i = 1; i <= values.length; i++) {
    numerals.push('$' + i);
  }
  return {fields: keyString, params: numerals.toString(), values: values};

};



exports.update = function(obj) {
  var keys = Object.keys(obj)
    , values = []
    , numerals = []
    ;

  keys.forEach(function(key) { values.push(obj[key]); });

  for (var i = 1; i <= keys.length; i++) {
    numerals.push(keys[i - 1] + '=$' + i);
  }

  return {fields: numerals.toString(), values: values};
};

exports.prepare = function(obj){
  var keys = Object.keys(obj)
    , values = []
    , insertParams = []   // This will hold the placeholders. I.e. `$1,$2,$3`
    , insertFieldsString = ""
    , updateFields = [];

  keys.forEach( function( key ) { 
    insertFieldsString += '"' + key + '",';
    values.push( obj[ key ] ); 
  });
  if ( insertFieldsString.length > 0 )
    insertFieldsString = insertFieldsString.slice(0,-1);
  
  for ( var i = 1 ; i <= values.length ; i++ ) {
    insertParams.push( '$' + i );
    updateFields.push( keys[ i - 1 ] + '=$' + i );
  }
  return { insertFields: insertFieldsString, insertParams: insertParams.toString(), updateFields: updateFields.toString() , values: values };
}