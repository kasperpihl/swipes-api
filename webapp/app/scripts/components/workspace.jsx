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
    
    dotDragBegin(data, callback) {
        this._dotDragData = data;
        this.isDraggingDot = true;
        $('.active-app').addClass('draggingDot');
        $('.tile').not("#tile-" + this._dotDragData.fromCardId).addClass('draggingDot');

        if(callback){
            this.draggingCallback = callback;
        }
    },
    positionDotDragHandler(x, y) {
      this._dragDotHandler.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    },
    

    onMouseMove(e) {
        if (this.isDraggingDot) {

          // -25 to center the dot on the mouse cursor. With of the dot is 50
          this.positionDotDragHandler(e.clientX - 25, e.clientY - 25);
        }
    }
});

module.exports = Workspace;