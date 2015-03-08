var Parse = require('parse').Parse;
var _ = require('underscore');
function ParseQueries( user ){
	if ( _.isString( user ) ){
		var User = Parse.Object.extend( "_User" );
		user = new User({ objectId: user });
	}
	this.user = user;
};

ParseQueries.prototype.queriesForUpdating = function( lastUpdate , nowTime ){
	var tagQuery = this.queryForClass( "Tag" ),
		taskQuery = this.queryForClass( "ToDo" );
	
	if ( lastUpdate ){
		tagQuery.greaterThan( 'updatedAt' , lastUpdate );
		taskQuery.greaterThan( 'updatedAt' , lastUpdate );
	}
	else {
		tagQuery.notEqualTo( 'deleted' , true );
		taskQuery.notEqualTo( 'deleted' , true );
	}
	
	if ( nowTime ) {
		tagQuery.lessThanOrEqualTo( 'updatedAt' , nowTime );
		taskQuery.lessThanOrEqualTo( 'updatedAt' , nowTime );
	}
	
	return [ tagQuery , taskQuery ];
};

ParseQueries.prototype.queryForClass = function( className ){
	
	var query = new Parse.Query( className );
	if ( this.user )
		query.equalTo( 'owner', this.user );
	
	return query;
};
ParseQueries.prototype.queriesForNotFound = function( batch ){
	var ids = {};
	/* run through batches and collect tempIds/objectIds for both Tag and ToDo */
	for ( var i in batch ){
		
		var obj = batch[i];
		var className = obj.className;
		
		if ( !ids[ className ] ) 
			ids[ className ] = { "tempIds" : [] , "objectIds" : [] };

		if ( obj.id ) 
			ids[ className ][ "objectIds" ].push( obj.id );
		else if ( obj.get( 'tempId' ) ) 
			ids[ className ][ "tempIds" ].push( obj.get( 'tempId' ) );

	}
	var queries = [];

	for ( var className in ids ){
		
		if( !( className == "Tag" || className == "ToDo" ) ) 
			continue;
		
		var localQueries = [];
		
		if ( ids[ className ][ "tempIds" ].length > 0 ){
			
			var tempIdQuery = this.queryForClass( className );
			tempIdQuery.containedIn( "tempId" , ids[ className ][ "tempIds" ] );
			localQueries.push( tempIdQuery );
		}

		if ( ids[ className ][ "objectIds" ].length > 0 ){
			var objectIdQuery = this.queryForClass( className );
			objectIdQuery.containedIn( "objectId" , ids[ className ][ "objectIds" ] );
			localQueries.push( objectIdQuery );
		}

		if ( localQueries.length > 0 ){
			
			if ( localQueries.length == 1 )
				queries.push( localQueries[ 0 ] );
			else{
				
				queries.push( Parse.Query.or( localQueries[ 0 ] , localQueries[ 1 ] ) );
			}
			
		}
	}

	return queries;
}
ParseQueries.prototype.queriesForDuplications = function( tempIds ){

	var queries = [];
	var tagTempIds = tempIds[ "Tag" ];
	var chunkSize = 200;

	if ( tagTempIds && tagTempIds.length > 0 ){
		
		for ( var i = 0,  j = tagTempIds.length;    i < j;   i += chunkSize   ) {
			
			var chunk = tagTempIds.slice( i , i + chunkSize );
			var tagQuery = this.queryForClass( "Tag" );
			tagQuery.containedIn( 'tempId' , chunk );
      		queries.push( tagQuery );
    	}
	}

	var taskTempIds = tempIds[ 'ToDo' ];
	if ( taskTempIds && taskTempIds.length > 0 ){
		
		for ( var i = 0,  j = taskTempIds.length; 	 i < j;    i += chunkSize  ) {
			
			var chunk = taskTempIds.slice( i , i + chunkSize );
			var taskQuery = this.queryForClass( "ToDo" );
			taskQuery.containedIn( 'tempId' , chunk );
			queries.push( taskQuery );
    	}
		
	}
	
	return queries;
};

/* Running a query unlimited with skips if limit of object is reached
  callback (result,error)
*/
ParseQueries.prototype.runQueriesToTheEnd = function( queries, callback ){
  
  if ( !queries || queries.length == 0 ) 
    return callback(false,"No queries to run");
  
  var stopped;
  var resultObj = {};
  var i = 0;
  var self = this; 
  var internalCallback = function( result , error , query ){
    
    i++;
    
    if ( error && !stopped ){
      
      callback( false , error , queries);
      stopped = true;
    }
    else if ( result ){
      if(resultObj[query.className])
      	resultObj[query.className] = resultObj[query.className].concat(result);
      else
      	resultObj[ query.className ] = result;
    }

    if ( i == queries.length && !stopped ) 
      callback( resultObj , false , queries );
    else{

      self.runQueryToTheEnd( queries[ i ], internalCallback );
    }

  }
  self.runQueryToTheEnd( queries[ i ], internalCallback);

}
ParseQueries.prototype.runQueryToTheEnd = function(query,callback,deltaResult,deltaSkip){
  var self = this;
  if ( !deltaResult ) 
    deltaResult = [];
  if ( !deltaSkip ) 
    deltaSkip = 0;
  
  if ( deltaSkip ) 
    query.skip( parseInt( deltaSkip , 10 ) );
  
  query.limit(1000);
  
  query.find( {
    success : function( result ){

      var runAgain = false;
      if ( result && result.length > 0 ){

        deltaResult = deltaResult.concat(result);
        if ( result.length == 1000 && deltaSkip < 1000 ) 
          runAgain = true;

      }

      if ( runAgain ){ 
        
        deltaSkip = deltaSkip + 1000;
        self.runQueryToTheEnd( query , callback , deltaResult , deltaSkip );
      }
      else 
        callback( deltaResult , false , query );

    },
    error : function( error ){
      callback( deltaResult , error , query );
    }, 
    useMasterKey:true

  });
};


module.exports = ParseQueries;