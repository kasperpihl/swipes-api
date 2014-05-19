
function CaseUpdateQuery(tableName, whereAttribute){
	this.tableName = tableName;
	this.escapedTableName = '"' + tableName + '"';

	this.query = {};
	this.query.text = 'UPDATE ' + this.escapedTableName;
	this.query.values = [];

	this.whereAttribute = whereAttribute;
	this.escapedWhereAttribute = '"' + whereAttribute + '"';

	this.whereStatement = 'WHERE ("'+whereAttribute + '" IN(';
	this.setStatements = {};


	this.replacementCounter = 1;
}

CaseUpdateQuery.prototype.addObjectUpdate = function( updates, whenValue ){
	this.query.values.push( whenValue );
	var whenCount = this.replacementCounter++;
	this.whereStatement += '$' + whenCount + ", ";

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
	var totalSetStatementsString = "SET ";
	for ( var attribute in this.setStatements ){
		var setStatement = this.setStatements[ attribute ];
		setStatement += ' ELSE "' + attribute + '" END';
		totalSetStatementsString += setStatement + ", ";
	}
	totalSetStatementsString = totalSetStatementsString.slice(0,-2);

	this.query.text += " " + totalSetStatementsString;

	this.whereStatement = this.whereStatement.slice(0,-2);
	this.whereStatement += "))";
	
	this.query.text += " " + this.whereStatement;

	//console.log(this.query);
	return this.query;
}

module.exports = CaseUpdateQuery;