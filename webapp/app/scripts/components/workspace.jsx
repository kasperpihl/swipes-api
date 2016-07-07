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
    render() {
        return (
          <div id="actual-app" className="actual-app">
            {this.renderCards()}
          </div>
        );
    },
    renderVideo: function() {
      var videoBox = '';

      if (this.state.video) {
        videoBox = 'open'
      }

      if (this.state.video) {
        return (
          <div className={"video-box " + videoBox} onClick={this.onToggleVideo}>
            <iframe src="https://www.youtube.com/embed/vHACsg4QbMg?rel=0&amp&loop=1;showinfo=0" frameBorder="0" allowFullScreen></iframe>
          </div>
        )
      }
    },
    renderEmptyBackground(){
      return (
          <div className="empty-workspace-state">
            <p className="workspace-empty-text">
              <span className="strong">Welcome to your workspace</span> <br />
            </p>
            <img className="empty-workspace-illustration" src="styles/img/emptystate-workspace.svg" onClick={this.onToggleVideo} />
            <div className="play-button" onClick={this.onToggleVideo}></div>
              <p className="workspace-empty-text">
                Play the video to get started
              </p>
            {this.renderVideo()}
          </div>
        )
    },
    renderCards(){
      if (!this.state.workspace._columns.length) {
        return this.renderEmptyBackground();
      }

      return <Grid ref="grid" columns={this.state.workspace._columns} delegate={this} />;
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
    // ======================================================
    // Delegate methods from tiles, caching references
    // ======================================================
    tileDidLoad(tile, id){
      this._cachedTiles[id] = tile;
    },
    tileWillUnload(tile, id){
      delete this._cachedTiles[id];
    },

    // ======================================================
    // Delegate methods from grid
    // ======================================================
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

    onToggleVideo() {
      this.setState({'video': !this.state.video});
    },
    onCloseFullscreen(){
      this.refs.grid.onFullscreen();
    },
    componentDidMount(prevProps, prevState) {
      this._cachedTiles = {};
      eventActions.add('closeFullscreen', this.onCloseFullscreen);
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