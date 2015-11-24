var background = {};

background.validators = {
	messages: function(data){
		let ts = parseFloat(new Date().getTime() / 1000).toFixed(3) + randomNumber(3);
		data.ts = ts;

		return data;
	}
};

background.afterHandlers = {

};
background.beforeHandlers = {

};

background.searchHandler = (string, callback) => {

};
background.autoCompleteHandler = (string, callback) => {

};

module.exports = background;