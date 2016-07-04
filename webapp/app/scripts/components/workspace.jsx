'use strict';
var React = require('react');
var Reflux = require('reflux');



var WorkspaceStore = require('../stores/WorkspaceStore');
var WorkspaceActions = require('../actions/WorkspaceActions');
var eventActions = require('../actions/EventActions');

// Including the cardstore only because of browserify
var CardStore = require('../stores/CardStore');
var WorkflowStore = require('../stores/WorkflowStore');
var cardActions = require('../actions/CardActions');
var topbarActions = require('../actions/TopbarActions');
var workflowActions = require('../actions/WorkflowActions');

var Grid = require('./resizeable-grid/grid');
var TileLoader = require('./tile_loader');

var Workspace = React.createClass({
    mixins: [WorkspaceStore.connect('workspace')],
    _dragDotHandler: null,
    getInitialState: function() {
      return {
        video: false
      }
    },
    openVideo: function() {
      this.setState({'video': !this.state.video});
    },
    renderVideo: function() {
      var videoBox = '';

      if (this.state.video) {
        videoBox = 'open'
      }

      if (this.state.video) {
        return (
          <div className={"video-box " + videoBox} onClick={this.openVideo}>
            <iframe src="https://www.youtube.com/embed/vHACsg4QbMg?rel=0&amp&loop=1;showinfo=0" frameBorder="0" allowFullScreen></iframe>
          </div>
        )
      }
    },
    renderCards(){
      if (this.state.workspace._columns.length < 1) {
        return (
          <div className="empty-workspace-state">
            <p className="workspace-empty-text">
              <span className="strong">Welcome to your workspace</span> <br />
            </p>
            <img className="empty-workspace-illustration" src="styles/img/emptystate-workspace.svg" onClick={this.openVideo} />
            <div className="play-button" onClick={this.openVideo}></div>
              <p className="workspace-empty-text">
                Play the video to get started
              </p>
            {this.renderVideo()}
          </div>
        )
      }

      return <Grid ref="grid" columns={this.state.workspace._columns} delegate={this} />;
    },
    tileDidLoad(tile, id){
      console.log('tile registerd', tile, id);
    },
    gridRenderRowForId(grid, id){
      return (
        <TileLoader
          key={id}
          delegate={this}
          data={{id: id}}
          dotDragBegin={this.dotDragBegin} />
      );
    },
    gridDidTransitionStep(grid, name, step){
      if(name === "fullscreen" && (step === "scalingUp" || step === "isFullscreen")){
        topbarActions.changeFullscreen(true);
      } else {
        topbarActions.changeFullscreen(false);
      }
    },
    gridRowPressedMenu(grid, id){
      workflowActions.removeWorkflow({id: id});
    },
    gridDidUpdate(grid, columns){
      console.log('grid update', columns);
    },
    gridRenderResizeOverlayForId(grid, id){
      var workflow = WorkflowStore.get(id);
      var title = workflow.name;
      var url = workflow.index_url;
      var splitURL = url.split('/').slice(0,-1).join('/');
      
      return (
        <div className="tile-resizing-overlay">
          <div className="tile-resizing-overlay__content">
            <div className="app-icon">
              <img src={splitURL + '/' + workflow.icon} />
            </div>
            <div className="app-title">{title}</div>
          </div>
        </div>
      )
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

            if (customEventData.fromCardId !== customEventData.toCardId) {
              eventActions.fire('share.ondrop', customEventData);
            }
          }

          $('.active-app').removeClass('draggingDot');
          $('.tile').not("#" + this._dotDragData.fromCardId).removeClass('draggingDot');
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
    onCloseFullscreen(){
      this.refs.grid.onFullscreen();
    },
    componentDidMount(prevProps, prevState) {
      eventActions.add('closeFullscreen', this.onCloseFullscreen);
      window.addEventListener('mouseup', this.onMouseUp);
      window.addEventListener('mousemove', this.onMouseMove);
      window.addEventListener('mousedown', this.onMouseDown);
      window.addEventListener("focus", this.onWindowFocus);
      window.addEventListener("blur", this.onWindowBlur);
    },
    componentWillUnmount() {
        window.removeEventListener('mouseup', this.onMouseUp);
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('mousedown', this.onMouseDown);
        window.removeEventListener("focus", this.onWindowFocus);
        window.removeEventListener("blur", this.onWindowBlur);
    },
    render() {
        return (
          <div id="actual-app" className="actual-app">
            {this.renderCards()}
          </div>
        );
    }
});

module.exports = Workspace;
