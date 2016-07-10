'use strict';
var React = require('react');
var Reflux = require('reflux');

var WorkspaceStore = require('../stores/WorkspaceStore');
var eventActions = require('../actions/EventActions');

var WorkflowStore = require('../stores/WorkflowStore');
var topbarActions = require('../actions/TopbarActions');
var workflowActions = require('../actions/WorkflowActions');

var Grid = require('./resizeable-grid/grid');
var TileLoader = require('./tile_loader');

var Workspace = React.createClass({
    mixins: [WorkspaceStore.connect('workspace')],
    _dragDotHandler: null,
    getInitialState() {
      return {
        video: false
      }
    },
    sendToAllTiles(command, data, callback){
      var keys = _.keys(this._cachedTiles);
      var returnObj = {};
      var run = function(key){
        this.sendToTile(key, command, data, (res) => {
          returnObj[key] = res || null;
          if(_.size(returnObj) === keys.length && callback){
            callback(returnObj);
          }
        });
      }.bind(this);
      for(var i = 0 ; i < keys.length ; i++){
        run(keys[i]);
      }
    },
    sendToTile(id, command, data, callback){
      var tile = this._cachedTiles[id];
      if(tile){
        tile.sendCommandToTile(command, data, callback);
      }
    },
    

    
    
    onEnterLeaveDropOverlay(cardId) {
      this._dropZoneId = cardId;
    },
    dotDragBegin(data, callback) {
        this._dotDragData = data;
        this.isDraggingDot = true;
        $('.active-app').addClass('draggingDot');
        $('.tile').not("#tile-" + this._dotDragData.fromCardId).addClass('draggingDot');

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
      this.sendToAllTiles('window.focus');
    },
    onWindowBlur(e) {
      this.sendToAllTiles('window.blur');
    },
    onMouseUp(e) {
      if(this.isDraggingDot){

        $('.active-app').removeClass('draggingDot');
        $('.tile').not("#" + this._dotDragData.fromCardId).removeClass('draggingDot');
        this._dragDotHandler.parentNode.removeChild(this._dragDotHandler);
        this._dragDotHandler = null;
      }

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
    },
    componentDidMount(prevProps, prevState) {
      this._cachedTiles = {};
      window.addEventListener('mouseup', this.onMouseUp);
      window.addEventListener('mousemove', this.onMouseMove);
      window.addEventListener("focus", this.onWindowFocus);
      window.addEventListener("blur", this.onWindowBlur);
    },
    componentWillUnmount() {
      window.removeEventListener('mouseup', this.onMouseUp);
      window.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener("focus", this.onWindowFocus);
      window.removeEventListener("blur", this.onWindowBlur);
    }
});

module.exports = Workspace;