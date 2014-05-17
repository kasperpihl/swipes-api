var _ = require('underscore');


function Queue( recurring ){
	this.options = {
		recurring:3
	};
	this.isRunningQueue = false;
	
	if ( recurring )
		this.set( "recurring" , recurring);
}
Queue.prototype.reset = function(){
	this.queue = [];
	this.iterator = -1;
  	this.doneCounter = 0;
  	this.calledDone= false;
  	this.iteratorCallback = false;
  	this.doneCallback = false;
}
Queue.prototype.push = function( object, isCollection ){
	if ( isCollection && _.isArray( object ) ){
		for ( var i = 0 ; i < object.length ; i++ )
			this.queue[ this.queue.length ] = object[ i ];
	}
	else this.queue[ this.queue.length ] = object;
};

Queue.prototype.set = function( name, value){
	if ( name == 'recurring' ){
		value = parseInt( value, 10 );
	}
	this.options[ name ] = value;
};
/* Called */
Queue.prototype.nextItem =  function(){
	this.iterator++;
	if ( this.iterator >= this.queue.length ){
      return;
    }
	if ( this.iteratorCallback ) 
		this.iteratorCallback( this.queue[ this.iterator ], this.iterator );
	else 
		this.next();
}
/* resets the queue - removes all the objct*/

Queue.prototype.checkDone = function(){
	if ( this.calledDone ) 
		return;
	if ( this.doneCounter == this.queue.length ){
		this.calledDone = true;
      	this.isRunningQueue = false;
      	if ( this.doneCallback ) 
      		this.doneCallback( true );
    }
    else this.nextItem();
}

Queue.prototype.next = function(){
	this.doneCounter++;
    this.checkDone();
};

Queue.prototype.run = function(iterator,done){
	if ( this.isRunningQueue ) 
		return done( false );
	this.isRunningQueue = true;
	if ( this.queue.length === 0 ) 
		return done( false );

	if ( _.isFunction( iterator ) ) 
		this.iteratorCallback = iterator;
	if ( _.isFunction( done ) ) 
		this.doneCallback = done;
  	
  	for ( var i = 0 ; i < this.options["recurring"] ; i++ ){
    	this.nextItem();
  	}
};
module.exports = Queue;