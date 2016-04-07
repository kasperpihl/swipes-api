'use strict';
var React = require('react');
var Reflux = require('reflux');

var DragDropContext = require('react-dnd').DragDropContext;
var HTML5Backend = require('react-dnd-html5-backend');

var WorkspaceStore = require('../stores/WorkspaceStore');
var WorkspaceActions = require('../actions/WorkspaceActions');
var eventActions = require('../actions/EventActions');

var CardLoader = require('./card_loader');
var Card = require('material-ui/lib/card/card');

var Workspace = React.createClass({
    mixins: [WorkspaceStore.connect('workspace')],
    _dragDotHandler: null,
    renderCards(){
        return _.map(this.state.workspace, function(card, i) {
            return (
                <CardLoader
                  key={card.id}
                  data={card}
                  dotDragBegin={this.dotDragBegin}
                  onEnterLeaveDropOverlay={this.onEnterLeaveDropOverlay} />
            );
        }.bind(this));
    },
    runAdjustments() {
        this.bouncedAdjusting();
    },
    onEnterLeaveDropOverlay(cardId) {
      this._dropZoneId = cardId;
    },
    dotDragBegin(data, callback) {
        this._dotDragData = data;
        this.isDraggingDot = true;
        $('.active-app').addClass('draggingDot');

        if(callback){
            this.draggingCallback = callback;
        }
    },
    createDotDragHandler() {
      var handler = document.createElement('div');

      handler.setAttribute('class', 'dot-drag-handler');
      this._dragDotHandler = handler;
      document.body.appendChild(handler);
    },
    positionDotDragHandler(x, y) {
      this._dragDotHandler.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    },
    onWindowFocus(e) {
        eventActions.fire('window.focus', e);
    },
    onWindowBlur(e) {
        eventActions.fire('window.blur', e);
    },
    onMouseUp(e) {
        if(this.isDraggingDot){
          if (this._dropZoneId) {
            var customEventData = this._dotDragData;

            customEventData.toCardId = this._dropZoneId;
            eventActions.fire('share.ondrop', customEventData);
          }

          $('.active-app').removeClass('draggingDot');
          this._dragDotHandler.parentNode.removeChild(this._dragDotHandler);
          this._dragDotHandler = null;
        }

        eventActions.fire('window.onmouseup', e);

        this.isDraggingDot = false;
        this._dotDragData = null;
    },
    onMouseMove(e) {
        if (this.isDraggingDot) {
          if (!this._dragDotHandler) {
            this.createDotDragHandler();
          }

          // -25 to center the dot on the mouse cursor. With of the dot is 50
          this.positionDotDragHandler(e.clientX - 25, e.clientY - 25);
        }

        eventActions.fire('window.mousemove', e);
    },
    onMouseDown(e) {
        eventActions.fire('window.onmousedown', e);
    },
    componentDidMount(prevProps, prevState) {
        this.bouncedAdjusting = _.debounce(WorkspaceActions.adjustForScreenSize, 300);
        this.runAdjustments();
        window.addEventListener('mouseup', this.onMouseUp);
        window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('mousedown', this.onMouseDown);
        window.addEventListener("focus", this.onWindowFocus);
        window.addEventListener("blur", this.onWindowBlur);
        window.addEventListener("resize", this.runAdjustments);
    },
    componentDidUpdate(prevProps, prevState) {
        // K_TODO
        // you are making infinite loop with that one here.
        // It will call WorkspaceActions.adjustForScreenSize
        // which will trigger manualUpdate
        // and this code will be called again and again
        //this.runAdjustments();
    },
    componentWillUnmount() {
        window.removeEventListener('mouseup', this.onMouseUp);
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('mousedown', this.onMouseDown);
        window.removeEventListener("focus", this.onWindowFocus);
        window.removeEventListener("blur", this.onWindowBlur);
        window.removeEventListener("resize", this.runAdjustments);
    },
    render() {
        return (
            <div id="actual-app" className="actual-app">
                {this.renderCards()}
            </div>
        );
    }
});

module.exports = DragDropContext(HTML5Backend)(Workspace);
