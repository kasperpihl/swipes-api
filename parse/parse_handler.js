var Parse = require('parse').Parse;
var _ = require('underscore');
var ParseBatcher = require('./parse_batcher.js');
var Queue = require('../utilities/queue.js');
var ParseQueries = require('./parse_queries.js');

function ParseHandler( logger ){
  this.logger = logger;

};

ParseHandler.prototype.sync = function( body , userId , callback ){

  if( body.objects && !_.isObject( body.objects ) ) 
    return callback( false , errorReturn( 'Objects must be object or array' ) ); 
  var User = Parse.Object.extend( "_User" );
  var user = new User( { "objectId" : userId } );
  var batcher = new ParseBatcher( body.objects , user );
  var queryUtility = new ParseQueries( user );
  var queue = new Queue( recurring );

  var runningError;
  var lastUpdate = ( body.lastUpdate ) ? new Date( body.lastUpdate ) : false;
  
  var deletedObjects = [];
  var recurring = 3;
  var self = this;
  /* Run and check for duplicates with tempId */
  function checkForDuplicates( batch ){
    
    var queries = queryUtility.queriesForDuplications( batcher.getNewObjects() );

    if ( !queries || queries.length == 0 ) 
      return saveAll();
    
    queue.reset();
    queue.push( queries , true );
    queue.run( function( query ){

      runQueryToTheEnd( query , function( result , error ){
         
        if( result && result.length > 0 ){
          
          self.logger.log( result[ 0 ].className + ' found ' + result.length + ' duplicates' );
          batcher.updateDuplicates( result );
        }
        else if ( error ) 
          runningError = error;
        
        queue.next();
      
      });
      },function( finished ){
        self.logger.time( 'finalized duplicates' );

        if ( runningError ) 
          return callback( false , runningError );
        else saveAll();

    });
  };


  function saveAll(){
  
    var batches = batcher.makeBatches();
    self.logger.time("prepared " + batches.length + " batches ");

    if( !batches || batches.length == 0 ) 
      return fetchAll();

    queue.reset();
    queue.push( batches , true );

    queue.run( function( batch ){
      saveBatch( batch , queue );
    },function( finished ){

      if ( runningError ) 
        return callback( false , runningError );
      else fetchAll();
    
    });
  };


  function saveBatch( batch , queue ){
    self.logger.log( 'saving batch with length: ' + batch.length );

    Parse.Object.saveAll( batch , { 
      success : function( result ){
        
        self.logger.log( 'completed batch with length ' + result.length);
        queue.next();
      
      },
      error : function( error ){
        // TODO: Handle error on batches here
        handleSaveError( batch , queue , error);
      }, 
      useMasterKey:true
    });
  };


  function handleSaveError(batch,queue,error){
    self.logger.log('Error from save ' + JSON.stringify( error ),true);
    /*
      If object not found or a time out
      Check for deletedobjects and duplicates
    */
    if(   error.code == 101 || 
          error.code == 124 ||
          error.code == 100 || 
          ( error.code == 142 && error.message == "Unauthorized Save" ) ){

      var queries = queryUtility.queriesForNotFound( batch );
      
      runQueriesToTheEnd( queries , function( result , error ){
        if ( result ){

          var deletedAndUpdatedBatch = batcher.findDeletedObjectsAndDuplicates( batch , result );
          
          self.logger.log("deleted objects: " + deletedAndUpdatedBatch.deleted.length);
          
          if ( deletedAndUpdatedBatch.deleted.length > 0 ) 
            deletedObjects = deletedObjects.concat( deletedAndUpdatedBatch.deleted );
          
          saveBatch( deletedAndUpdatedBatch.batch , queue );

        }
        else{

          runningError = error;
          queue.next();
        
        }
      });
    }
    else{
      runningError = error;
      queue.next();
    }
  };



  function fetchAll(){

    self.logger.time( 'finished saving' );
    queue.reset();
    
    var resultObjects = {};
    var updateTime = new Date();

    var queries = queryUtility.queriesForUpdating( lastUpdate , updateTime );
    queue.push( queries , true );
    
    var biggestTimeStamp;
    self.logger.log( '' + queries.length + " queries prepared" );

    queue.run( function( query ){
      runQueryToTheEnd( query , function( result , error , query ){
        
        if ( !error && result && result.length > 0 ){
          for ( var i in result ){
            if ( !biggestTimeStamp || result[ i ].updatedAt.getTime() > biggestTimeStamp.getTime() ) 
              biggestTimeStamp = result[ i ].updatedAt;
            scrapeChanges( result[ i ] , lastUpdate );
          }

          var index = query.className;
          self.logger.log("" + index + " resulted with " + result.length + " objects");
          
          resultObjects[ index ] = result;        

        }
        else if ( error ) 
            runningError = error;
  
        queue.next();
  
      });
    },function( finished ){
      self.logger.time( 'queue finished' );
      if ( runningError ) 
        return callback( false , runningError );
      if ( biggestTimeStamp ) 
        resultObjects.updateTime = biggestTimeStamp.toISOString();
      
      if ( deletedObjects.length > 0 ){
        
        for ( var i in deletedObjects ){
          
          var deletedObj = deletedObjects[ i ];
          
          if ( !resultObjects[ deletedObj.parseClassName ] ) 
            resultObjects[ deletedObj.parseClassName ] = [];

          resultObjects[ deletedObj.parseClassName ].push( deletedObj );
        }
        
      }

      resultObjects.serverTime = new Date().toISOString();
      callback( resultObjects , false );

    });
  };

  // Get started!
  checkForDuplicates();
};


function scrapeChanges( object , lastUpdateTime ){
  
  var attributes = object.attributes;
  var updateTime = new Date();

  object.set( 'parseClassName' , object.className );
  
  var deleteAttributes = [ "owner" , "ACL" , "lastSave" ]
  for( var i in deleteAttributes ){
    var attr = deleteAttributes[ i ];
    if ( attributes[ attr ] )
      delete attributes[ attr ];
  }

  if ( !attributes[ 'attributeChanges' ] ) 
    return;
  
  if ( !lastUpdateTime ) 
    return delete attributes['attributeChanges'];
  
  var changes = object.get('attributeChanges');
  
  if ( !changes ) 
    changes = {};
  
  if ( attributes ){
    
    for ( var attribute in attributes ){
      
      var lastChange = changes[ attribute ];
      
      if ( ( attribute == "deleted" && attributes[ attribute ] ) || attribute == "tempId" || attribute == "parseClassName" ) 
        continue;
      
      if( !lastChange || lastChange <= lastUpdateTime ) 
        delete attributes[ attribute ];

    }

  }

};

/* Running a query unlimited with skips if limit of object is reached
  callback (result,error)
*/
function runQueriesToTheEnd( queries, callback ){
  
  if ( !queries || queries.length == 0 ) 
    return callback(false,errorReturn("No queries to run"));
  
  var stopped;
  var resultObj = {};
  var i = 0;
  
  var internalCallback = function( result , error , query ){
    
    i++;
    
    if ( error && !stopped ){
      
      callback( false , error , queries);
      stopped = true;
    }
    else if ( result ){
      
      resultObj[ query.className ] = result;
    }

    if ( i == queries.length && !stopped ) 
      callback( resultObj , false , queries );
    else{

      runQueryToTheEnd( queries[ i ], internalCallback );
    }

  }
  runQueryToTheEnd( queries[ i ], internalCallback);

}
function runQueryToTheEnd(query,callback,deltaResult,deltaSkip){
  
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
        runQueryToTheEnd( query , callback , deltaResult , deltaSkip );
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



ParseHandler.prototype.trial = function(userId, callback){
  Parse.Cloud.useMasterKey();
  
  var trialQuery = new Parse.Query('Trial')
  trialQuery.equalTo( 'user' , new Parse.User( { objectId : userId } ) );

  var userQuery = new Parse.Query( Parse.User );

  userQuery.equalTo( 'objectId' , userId );
  /*userQuery.find({success:function(users){
    callback(users,false);
  },error:function(error){ callback(false, error); }});*/
  
  runQueriesToTheEnd( [ trialQuery , userQuery ], function( result , error ){
    if ( error )
      callback( false , error );
    else{
      
      if(result['Trial'] && result['Trial'].length > 0){

        callback(false, errorReturn('Already received trial'));
      }
      else if ( result[ "_User" ] && result[ "_User" ].length == 1 ){

        var user = result[ "_User" ][ 0 ];
        if ( user.get( 'userLevel' ) > 0 ) 
          return callback( false, errorReturn( 'Already upgraded' ) );
        
        var startDate = new Date();
        var noOfDays = 31;
        var endDate = new Date( startDate.getTime() + ( noOfDays * ( 1000 * 60 * 60 * 24) ) );
        
        user.set( 'userLevel' , 1 );
        
        var Trial = Parse.Object.extend( 'Trial' );
        
        var trial = new Trial();
        trial.set( 'startDate' , startDate );
        trial.set( 'endDate' , endDate );
        trial.set( 'user' , user );

        Parse.Object.saveAll( [ trial , user ], {
          success : function( list ){
            callback( { "code" : 200 , "message" : "successful trial" } );
          },
          error : function( list , error ){
            callback( false , error );
          }
        });
        
      }
      else {
        callback(false,errorReturn('User not found'));
      }
    }

    
  });
}


function errorReturn ( errorName , code ){

  if ( !code ) 
    code = 141;
  if ( !errorName ) 
    errorName = 'Server error';
  return { code : 141, message : errorName };
}


module.exports = ParseHandler;