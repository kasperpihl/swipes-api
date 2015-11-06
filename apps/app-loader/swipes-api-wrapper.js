var SwipesController = (function() {
	function SwipesController() {
		console.log("initializing swipes controller");
	}
	SwipesController.prototype.test = function() {
		console.log("testing haha");
	};

	return SwipesController;

})();
window.swipes = new SwipesController();
console.log("loading swipes wrapper");