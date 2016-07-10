import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import * as actions from '../constants/ActionTypes'
import { workspace } from '../actions'

import EmptyBackground from '../components/workspace/EmptyBackground'
import ResizeOverlay from '../components/workspace/ResizeOverlay'

import Tile from './Tile'
import Grid from '../components/resizeable-grid/grid'

class Workspace extends Component {
  constructor(props) {
    super(props)
    this._cachedTiles = {};
    _.bindAll(this, 'gridRenderRowForId', 'gridDidTransitionStep', 'gridRowPressedMenu', 'gridDidUpdate', 'gridRenderResizeOverlayForId', 'tileDidLoad', 'tileWillUnload')
  }
  componentDidMount(){
    this._cachedTiles = {};
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
      //topbarActions.changeFullscreen(true);
    } else {
      //topbarActions.changeFullscreen(false);
    }
  }
  gridRowPressedMenu(grid, id){
    this.props.removeTile({id: id});
  }
  gridDidUpdate(grid, columns){
    console.log('grid update', columns);
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
    console.log('loading a tile', id);
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
}

function mapStateToProps(state) {
  return {
    baseUrl: state.main.tileBaseUrl,
    fullscreen: state.main.isFullscreen,
    tiles: state.workspace.tiles,
    columns: state.workspace.columns
  }
}

const ConnectedWorkspace = connect(mapStateToProps, {
  removeTile: workspace.removeTile
})(Workspace)
export default ConnectedWorkspace