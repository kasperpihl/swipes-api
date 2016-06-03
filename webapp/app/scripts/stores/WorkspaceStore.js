var Reflux = require('reflux');
var WorkflowStore = require('./WorkflowStore');
var WorkspaceActions = require('../actions/WorkspaceActions');

// Moves and element to the end of the array
function arrayMoveToEnd(index, arr) {
	var element = arr[index];

	arr.splice(index, 1);
	arr.push(element);
}

var WorkspaceStore = Reflux.createStore({
	_zStack: [],
	_illuminatedCardId: null,
	listenables: [WorkspaceActions],
	localStorage: "WorkspaceStore3",
	sort: function(el){ return el.id },
	setIlluminatedCardId: function (value) {
		this._illuminatedCardId = value;
		this.manualTrigger();
	},
	getIlluminatedCardId: function () {
		return this._illuminatedCardId;
	},
	onWorkflowStore: function(workflows, workflow2){
		var self = this;

		// Hack to not run on first call, reflux stores send an empty array on initialize
		if(!this.hasGottenFirstLoad){
			this.hasGottenFirstLoad = true;
			return;
		}

		self._zStack = [];

		// Object indexed by the workflow_id to test if any has been removed from store.
		var testForRemovals = _.indexBy(this._dataById, function(el, index){ return index; });

		for(var i = 0 ; i < workflows.length ; i++){
			var workflow = workflows[i];
			var extraData = {
				parent_id: workflow.parent_id,
				index_url: workflow.index_url,
				icon: workflow.icon,
				icon_url: workflow.icon_url,
				external_url: workflow.external_url
			}
			// If the workflow is not found, insert a new record with the grid info.
			if(!this.get(workflow.id)){
				// K OR T_TODO: Make a better way to calculate x/y of new object!
				var insertObj = {
					id: workflow.id
				}

				this.set(workflow.id, Object.assign({}, insertObj, extraData), {trigger: false});
			}
			else{
				this.update(workflow.id, extraData, {trigger: false});
				// Mark this as being here
				delete testForRemovals[workflow.id];
			}
		}

		// If any keys are left in the removal object, unset them!
		var keysToRemove = _.keys(testForRemovals);

		if(keysToRemove.length){
			this.unset(keysToRemove, {trigger:false});
		}

		// Build the zStack
		_.each(_.sortBy(this.getAll(), function (card) {return card.z;}), function (card) {
			if (!card.hidden) {
				self._zStack.push(card.id);
			}
		})

		var lastCardId = self._zStack[self._zStack.length-1];

		if (lastCardId) {
			this.onSendCardToFront(lastCardId);
		} else {
			this.manualTrigger();
		}
	},
	onEnterLeaveDropOverlay: function (id, enter) {
		this.update(id, {hoverDropOverlay: enter});
	},
	onMoveCard:function(id, deltaCordinates){
		var obj = this.get(id);
		var x = obj.x + deltaCordinates.x;
		var y = obj.y + deltaCordinates.y;
		if(id){
			this.update(id, {x:x, y:y});
		}
	},
	onUpdateCardSize: function(id, obj){
		var newSize = {};
		var minWidth = 500;
		var minHeight = 400;
		if(obj.w){
			newSize.w = obj.w;
			if(newSize.w < minWidth){
				newSize.w = minWidth;
			}
		}
		if(obj.h){
			newSize.h = obj.h;
			if(newSize.h < minHeight){
				newSize.h = minHeight;
			}
		}
		if(obj.x){
			newSize.x = obj.x;
		}
		if(obj.y){
			newSize.y = obj.y;
		}
		if(id){
			this.update(id, newSize);
		}
	},
	onGridButton: function(){
		var i = 0;
		var el = document.getElementById('actual-app');
		var screenWidth = el.clientWidth;
		var screenHeight = el.clientHeight;
		var padding = 5;
		var filteredCards = _.filter(this.getAll(), function (card) {return card.hidden === false});
		var sortedCards = _.sortBy(filteredCards, function(el){ return el.x });
		var eachWidth = screenWidth / _.size(filteredCards);

		var hasSlack = false;
		var hasAsana = false;
		var firstIsSlack = false;
		if(sortedCards.length === 2){
			if(sortedCards[0].id && sortedCards[1].id){
				var firstCard = WorkflowStore.get(sortedCards[0].id);
				var secondCard = WorkflowStore.get(sortedCards[1].id);
				if(firstCard.manifest_id === "slack-dashboard" || secondCard.manifest_id === "slack-dashboard"){
					hasSlack = true;
					if(firstCard.manifest_id === "slack-dashboard"){
						firstIsSlack = true;
					}
				}
				if(firstCard.manifest_id === "asana-card" || secondCard.manifest_id === "asana-card"){
					hasAsana = true;
				}
			}


		}
		_.each(sortedCards, function(el){
			var newSize;
			if(hasAsana && hasSlack){
				var oneThird = screenWidth / 3;
				var twoThirds = screenWidth / 3 * 2;
				var slackSize = {
					x: padding,
					y: 0,
					w: twoThirds - 2*padding,
					h: screenHeight-2*padding
				};
				var asanaSize = {
					x: twoThirds + padding,
					y: 0,
					w: oneThird - 2*padding,
					h: screenHeight - 2*padding
				};
				newSize = asanaSize;
				if(i === 0 && firstIsSlack || i === 1 && !firstIsSlack){
					newSize = slackSize;
				}
			}
			else{
				newSize = {
					x: eachWidth*i + padding,
					y: 0,
					w: eachWidth - 2*padding,
					h: screenHeight-2*padding
				};
			}
			this.update(el.id, newSize, {trigger:false});
			i++;
		}.bind(this));
		this.manualTrigger();
	},
	onSendCardToFront: function(id){
		if(id){
			var cards = this.getAll();
			var index = this._zStack.indexOf(id);

			arrayMoveToEnd(index, this._zStack);

			for (var card of cards) {
					var focused = card.id === id ? true : false;

					card.focused = focused;
					card.z = this._zStack.indexOf(card.id);
			}

			this.onAdjustForScreenSize(cards);
		}
	},
	onShowHideCard: function(id) {
		var card = this.get(id);

		if (card.focused !== true) {
			if (card.hidden === true) {
				// Return the card to the stack
				this._zStack.push(card.id);
			}
			this.update(id, {hidden: false, focused: true}, {trigger:false});
			this.onSendCardToFront(id);
		} else {
			this._zStack.pop();
			this.update(id, {hidden: true, focused: false}, {trigger:false});

			if (this._zStack.length > 0) {
				this.update(this._zStack[this._zStack.length-1], {hidden: false, focused: true}, {trigger:false});
			}
		}

		this.manualTrigger();
	},
	onRemoveMaximize: function(id) {
		this.update(id, {maximized: false, oldX: 0, oldY: 0, oldW: 0, oldH: 0} );
	},
	onMaximize: function(id) {
		var card = this.get(id);
		var cardEl = document.getElementById(id);
		var newW = window.innerWidth - 10;
		var newH = document.getElementById("actual-app").clientHeight - 5;
		var oldSize = {
			w: cardEl.clientWidth,
			h: cardEl.clientHeight
		};
		var oldPos = {
			x: cardEl.offsetLeft,
			y: cardEl.offsetTop
		};

		var style = window.getComputedStyle(cardEl);
		var transitionStyle = style.getPropertyValue('transition');

		if (card.maximized) {
			// removing event listener
			cardEl.removeEventListener('transitionend', function() {});
			// adding styles for maximize transition
			cardEl.style.transition = transitionStyle + ', left .3s, top .3s, width .3s, height .3s';
			// hiding content while transition
			cardEl.childNodes[0].querySelector('.card-content').style.opacity = '0';
			cardEl.childNodes[0].querySelector('.card-content').style.visibility = 'hidden';
			cardEl.childNodes[0].querySelector('.card-content').style.transition = 'opacity .1s, visibility .0s .05s';

			// Setting new position and dimensions
			this.update(id, {x: card.oldX, y: card.oldY, w: card.oldW, h: card.oldH, maximized: false, oldX: 0, oldY: 0, oldW: 0, oldH: 0} );

			// Listening to transition end
			cardEl.addEventListener("transitionend", function(e) {

				// Checking if correct transition end (lots of transitions happening)
				if (e.propertyName === "left" || e.propertyName === "width" || e.propertyName === "top" || e.propertyName === "height") {
					// Reseting transitions for other events
					cardEl.style.transition = 'box-shadow 0.4s ease 0s, opacity 0.3s ease 0.15s';
					// Showing content again
					cardEl.childNodes[0].querySelector('.card-content').style.opacity = '1';
					cardEl.childNodes[0].querySelector('.card-content').style.visibility = 'visible';
					cardEl.childNodes[0].querySelector('.card-content').style.transition = 'opacity .2s .25s, visibility .0s .2s';
				}
			});
		} else {
			// Check if, follows the same logic
			cardEl.removeEventListener('transitionend', function() {});
			cardEl.style.transition = transitionStyle + ', left .3s, top .3s, width .3s, height .3s';
			cardEl.childNodes[0].querySelector('.card-content').style.opacity = '0';
			cardEl.childNodes[0].querySelector('.card-content').style.visibility = 'hidden';
			cardEl.childNodes[0].querySelector('.card-content').style.transition = 'opacity .1s, visibility .0s .05s';

			this.update(id, {x: 5, y: 5, w: newW, h: newH, maximized: true, oldX: oldPos.x, oldY: oldPos.y, oldW: oldSize.w, oldH: oldSize.h} );

			cardEl.addEventListener("transitionend", function(e) {
				if (e.propertyName === "left" || e.propertyName === "width" || e.propertyName === "top" || e.propertyName === "height") {
					cardEl.style.transition = 'box-shadow 0.4s ease 0s, opacity 0.3s ease 0.15s';
					cardEl.childNodes[0].querySelector('.card-content').style.opacity = '1';
					cardEl.childNodes[0].querySelector('.card-content').style.visibility = 'visible';
					cardEl.childNodes[0].querySelector('.card-content').style.transition = 'opacity .2s .25s, visibility .0s .2s';
				}
			});
		}
	},
	onResizeOnDrag: function(id) {
		var card = this.get(id);

		if (card.maximized) {
			this.update(id, {w: card.oldW, h: card.oldH, maximized: false, oldX: 0, oldY: 0, oldW: 0, oldH: 0} );
		}
	},
	onSetNotifications: function(id, number) {
		this.update(id, {notifications: number} );
	},
	onAdjustForScreenSize: function(cards){
		var minimumWidthOnScreen = 100;
		var minimumHeightOnScreen = 50;
		var paddingForAutoAdjusting = 5;
		var didUpdate = false;
		var counter = 0;
		var cards = cards || this.getAll();
		if(!document.getElementById("actual-app")){
			return;
		}
		var screenWidth = document.getElementById("actual-app").clientWidth;
        var screenHeight = document.getElementById("actual-app").clientHeight;
		_.each(_.sortBy(cards, function(el){return el.z; }), function(el){
			var x = el.x;
			var y = el.y;
			var w = el.w;
			var h = el.h;
			var newSize = {
				z: el.z,
				focused: el.focused
			};

			// if (el.maximized) {
			// 	console.log('yo');
			// 	this.update(el.id, {maximized: false, oldX: 0, oldY: 0, oldW: 0, oldH: 0} );
			// }

			// Check if something has been moved to the front
			// if(z != counter){
			// 	newSize.z = counter;
			// }

			// Only run these if screen size was forwarded
			if(screenWidth && screenHeight){
				// Check if offscreen to the right off the screen
				var minWidth = 500;
				var minHeight = 400;

				var underflowX = -x;
				var underflowY = -y;
				var overflowX = w - (screenWidth - x);
				var overflowY = h - (screenHeight - y);


				if(underflowX > 0){
					// newSize.w = w = Math.max(minWidth, w - underflowX - paddingForAutoAdjusting);
				}
				if(x < 0){
					newSize.x = x = paddingForAutoAdjusting;
				}


				if(underflowY > 0){
					// newSize.h = h = Math.max(minHeight, h - underflowY - paddingForAutoAdjusting);
				}
				if(y < 0){
					newSize.y = y = 0;
				}


				if(overflowX > 0){
					// newSize.w = w = Math.max(minWidth, (w - overflowX - paddingForAutoAdjusting) );
				}
				if((x + w) > screenWidth){
					newSize.x = Math.max(screenWidth - w - paddingForAutoAdjusting, paddingForAutoAdjusting);
				}

				// Check if offscreen in the bottom off the screen
				if(overflowY > 0){
					// newSize.h = h = Math.max(minHeight, (h - overflowY - paddingForAutoAdjusting) );
				}
				if((y + h) > screenHeight){
					newSize.y = Math.max(screenHeight - h, paddingForAutoAdjusting);
				}


				// Check if wider than the screen.
				if(w > (screenWidth - 2*paddingForAutoAdjusting)){
					newSize.w = (screenWidth - 2*paddingForAutoAdjusting);
				}
				// Check if higher than the current screen.
				if(h > (screenHeight - 2*paddingForAutoAdjusting)){
					newSize.h = (screenHeight - 2*paddingForAutoAdjusting);
				}
			}

			if(_.size(newSize) > 0 && el.id){
				this.update(el.id, newSize, {trigger: false});
				didUpdate = true;
			}
			counter++;
		}.bind(this));
		if(didUpdate){
			this.manualTrigger();
		}
	},
	init: function(){
		this.manualLoadData();
		this.listenTo(WorkflowStore, this.onWorkflowStore);
		this.bouncedGridPress = _.debounce(this.onGridButton, 50);
	},
	beforeSaveHandler:function(newObj, oldObj){
		if(!oldObj && newObj.id){
			newObj.z = this._zStack.length+1;
			newObj.x = 0;
			newObj.y = 0;
			newObj.w = 500;
			newObj.h = 400;
			newObj.hidden = false;
			newObj.maximized = false;
			newObj.oldX = 0;
			newObj.oldY = 0;
			newObj.oldW = 0;
			newObj.oldH = 0;
			newObj.notifications = 0;
			this.bouncedGridPress();
		}
		return newObj;
	},
});

module.exports = WorkspaceStore;
