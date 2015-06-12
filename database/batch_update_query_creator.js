var _ = require('underscore');

function BatchUpdateQueryCreator( tableName, whereAttribute, staticSetMapping ){

	this.escapedTableName = '"' + tableName + '"';
	this.escapedWhereAttribute = '"' + whereAttribute + '"';


	this.objectCounter = 0;

	this.query = {};
	this.query.values = [];

	this.replacementCounter = 1;
	
	this.bannedAttributes = [];
	this.initialSetStatement = "SET ";
	if ( staticSetMapping ){
		for ( var attr in staticSetMapping ){
			value = staticSetMapping[ attr ];
			this.initialSetStatement += '"' + attr + '" = $' + this.replacementCounter++ + ", ";
			this.query.values.push( value );
			this.bannedAttributes.push( attr );
		}
	}
	
	this.setStatements = {};
	
	this.whereStatement = 'WHERE (' + this.escapedWhereAttribute + ' IN(';
}

BatchUpdateQueryCreator.prototype.addObjectUpdate = function( updates, whenValue ){
	this.query.values.push( whenValue );
	var whenCount = this.replacementCounter++;
	this.whereStatement += '$' + whenCount + ", ";
	this.objectCounter++;

	for ( var attribute in updates ){
		if( _.indexOf( this.bannedAttributes, attribute ) != -1 )
			continue;

		var value = updates [ attribute ];

		this.query.values.push( value );
		var thenCount = this.replacementCounter++;

		if ( !this.setStatements[ attribute ] )
			this.initializeSetStatementForAttribute( attribute );

		this.setStatements[ attribute ] += ' WHEN ('+ this.escapedTableName +'.' + this.escapedWhereAttribute + ' = $' + whenCount + ') THEN $' + thenCount;
	}
};

BatchUpdateQueryCreator.prototype.initializeSetStatementForAttribute = function( attribute ){
	var setStatement = '"' + attribute + '" = CASE';
	this.setStatements[ attribute ] = setStatement;
};

BatchUpdateQueryCreator.prototype.toQuery = function(){

	this.query.text = 'UPDATE ' + this.escapedTableName;
	
	// PREPARE SET STATEMENTS
	var totalSetStatementsString = this.initialSetStatement;
	for ( var attribute in this.setStatements ){

		var setStatement = this.setStatements[ attribute ];
		setStatement += ' ELSE "' + attribute + '" END';
		totalSetStatementsString += setStatement + ", ";

	}
	totalSetStatementsString = totalSetStatementsString.slice(0,-2);

	this.query.text += totalSetStatementsString;

	this.whereStatement = this.whereStatement.slice(0,-2);
	this.whereStatement += "))";
	
	this.query.text += " " + this.whereStatement;
	this.query.numberOfRows = this.objectCounter;

	return this.query;
}

module.exports = BatchUpdateQueryCreator;