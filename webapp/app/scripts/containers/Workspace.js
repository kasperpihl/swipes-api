import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import * as actions from '../constants/ActionTypes'
import { workspace, main } from '../actions'

import EmptyBackground from '../components/workspace/EmptyBackground'
import ResizeOverlay from '../components/workspace/ResizeOverlay'

import Tile from './Tile'
import Grid from '../components/resizeable-grid/grid'

class Workspace extends Component {
  constructor(props) {
    super(props)
    this._cachedTiles = {};
    _.bindAll(this, 'gridRenderRowForId', 'gridDidTransitionStep', 'gridRowPressedMenu', 'gridDidUpdate', 'gridRenderResizeOverlayForId', 'tileDidLoad', 'tileWillUnload', 'sendToTile', 'sendToAllTiles', 'onWindowFocus', 'onWindowBlur', 'onMouseMove', 'onMouseUp')

  }
  onMouseUp(e){
    if(this.props.draggingDot){
      this.props.stopDraggingDot();
    }
  }
  onMouseMove(e){
    if(this.props.draggingDot){
      this.props.dragDot(e.clientX, e.clientY)
    }
  }
  onWindowFocus(e) {
    this.sendToAllTiles('window.focus');
  }
  onWindowBlur(e) {
    this.sendToAllTiles('window.blur');
  }

  sendToAllTiles(command, data, callback){
    const returnObj = {};
    for( let key in this._cachedTiles ){
      this.sendToTile(key, command, data, (res) => {
        returnObj[key] = res || null;
        if(_.size(returnObj) === _.size(this._cachedTiles) && callback){
          callback(returnObj);
        }
      });
    }
  }
  sendToTile(id, command, data, callback){
    const tile = this._cachedTiles[id];
    if(tile){
      tile.sendCommandToTile(command, data, callback);
    }
  }


  // ======================================================
  // Delegate methods from grid
  // ======================================================

  gridRenderRowForId(grid, id){
    return (
      <Tile
        key={id}
        delegate={this}
        data={{id: id}} />
    );
  }
  gridDidTransitionStep(grid, name, step){
    if(name === "fullscreen" && (step === "scalingUp" || step === "isFullscreen")){
      if(!this.props.fullscreen){
        this.props.toggleFullscreen();
      }
    }
  }
  gridRowPressedMenu(grid, id){
    this.props.removeTile({id: id});
  }
  gridDidUpdate(grid, columns){
    this.props.updateColumns(columns);
  }
  gridRenderResizeOverlayForId(grid, id){
    var tile = this.props.tiles[id];
    var title = tile.name;
    var url = this.props.baseUrl + tile.manifest_id + '/' + tile.icon;
    return <ResizeOverlay imageUrl={url} title={title} />
  }

  // ======================================================
  // Delegate methods from tiles, caching references
  // ======================================================
  tileDidLoad(tile, id){
    this._cachedTiles[id] = tile;
  }
  tileWillUnload(tile, id){
    delete this._cachedTiles[id];
  }

  render() {
    let content = <EmptyBackground />;
    if (this.props.columns.length) {
      content = <Grid ref="grid" columns={this.props.columns} delegate={this} />
    }
    return (
      <div id="actual-app" className="actual-app">
        {content}
      </div>
    )
  }


  componentDidMount(){
    this._cachedTiles = {};
    window.addEventListener("focus", this.onWindowFocus);
    window.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("mouseup", this.onMouseUp);
    window.addEventListener("blur", this.onWindowBlur);
  }
  componentDidUpdate(){
    if(!this.props.fullscreen){
      this.refs.grid.closeFullscreen()
    }
  }
  componentWillUnmount(){
    window.removeEventListener("focus", this.onWindowFocus);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.addEventListener("mouseup", this.onMouseUp);
    window.removeEventListener("blur", this.onWindowBlur);
  }
}

function mapStateToProps(state) {
  return {
    baseUrl: state.main.tileBaseUrl,
    draggingDot: state.main.draggingDot,
    fullscreen: state.main.isFullscreen,
    tiles: state.workspace.tiles,

    columns: state.workspace.columns
  }
}

const ConnectedWorkspace = connect(mapStateToProps, {
  removeTile: workspace.removeTile,
  updateColumns: workspace.updateColumns,
  toggleFullscreen: main.toggleFullscreen,
  dragDot: main.dragDot,
  stopDraggingDot: main.stopDraggingDot
})(Workspace)
export default ConnectedWorkspace