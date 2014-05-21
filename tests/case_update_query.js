
function CaseUpdateQuery( tableName, whereAttribute ){

	this.escapedTableName = '"' + tableName + '"';
	this.escapedWhereAttribute = '"' + whereAttribute + '"';

	this.objectCounter = 0;

	this.query = {};
	this.query.values = [];

	this.replacementCounter = 1;
	
	
	this.setStatements = {};
	
	this.whereStatement = 'WHERE (' + this.escapedWhereAttribute + ' IN(';
}

CaseUpdateQuery.prototype.addObjectUpdate = function( updates, whenValue ){
	this.query.values.push( whenValue );
	var whenCount = this.replacementCounter++;
	this.whereStatement += '$' + whenCount + ", ";
	this.objectCounter++;

	for ( var attribute in updates ){
		var value = updates [ attribute ];

		this.query.values.push( value );
		var thenCount = this.replacementCounter++;

		if ( !this.setStatements[ attribute ] )
			this.initializeSetStatementForAttribute( attribute );

		this.setStatements[ attribute ] += ' WHEN ('+ this.escapedTableName +'.' + this.escapedWhereAttribute + ' = $' + whenCount + ') THEN $' + thenCount;
	}
};

CaseUpdateQuery.prototype.initializeSetStatementForAttribute = function( attribute ){
	var setStatement = '"' + attribute + '" = CASE';
	this.setStatements[ attribute ] = setStatement;
};

CaseUpdateQuery.prototype.toQuery = function(){

	this.query.text = 'UPDATE ' + this.escapedTableName;
	
	// PREPARE SET STATEMENTS
	var totalSetStatementsString = " SET ";
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

module.exports = CaseUpdateQuery;