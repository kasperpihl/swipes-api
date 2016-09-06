import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import * as actions from '../constants/ActionTypes'
import { workspace, main } from '../actions'
import { size, bindAll } from '../classes/utils'
import '../components/workspace/workspace.scss'

import EmptyBackground from '../components/workspace/EmptyBackground'
import ResizeOverlay from '../components/workspace/ResizeOverlay'
import SwipesLoader from '../components/swipes-ui/SwipesLoader'

import Tile from './Tile'
import Grid from '../components/resizeable-grid/grid'
import PureRenderMixin from 'react-addons-pure-render-mixin';

class Workspace extends Component {
  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this._cachedTiles = {};
    bindAll(this, ['gridRenderRowForId', 'gridDidTransitionStep', 'gridRowPressedMenu', 'gridRowPressedRemove', 'gridDidUpdate', 'gridRenderResizeOverlayForId', 'tileDidLoad', 'tileWillUnload', 'sendToTile', 'sendToAllTiles', 'onWindowFocus', 'onWindowBlur', 'onMouseMove', 'onMouseUp'])
  }
  generateShareUrl(shortUrl){
    return window.location.origin + '/s/' + shortUrl;
  }
  onMouseUp(e){
    if(this.props.draggingDot){
      e.preventDefault()
      const { draggingDot } = this.props;
      const { id } = this.refs.grid.positionForPageXY(e.pageX, e.pageY) || {};
      if(id && id !== draggingDot.draggingId){
        /*if(draggingDot.data.shortUrl){
          var shareUrl = this.generateShareUrl(draggingDot.data.shortUrl);
          this.sendToTile(id, 'share.receivedData', { shareUrl });
          this.props.stopDraggingDot()
          return;
        }*/
        console.log('generating from', draggingDot.data)
        this.props.generateShareUrl(draggingDot.data).then( (res) => {
          console.log('res from share url', res);
          if(res.ok){
            var shareUrl = this.generateShareUrl(res.short_url);
            var shareData = {
              shareUrl,
            }
            if(res.meta && res.meta.title){
              shareData.title = res.meta.title;
            }
            this.sendToTile(id, 'share.receivedData', shareData);
          }
          this.props.stopDraggingDot()
        }).catch((e) => {
          console.log('catch catch');
        })
      }
      else{
        this.props.stopDraggingDot()
      }
    }
  }
  onMouseMove(e){
    const { draggingDot, dragDot } = this.props;

    if(draggingDot){
      e.preventDefault()
      let { id: hoverTarget } = this.refs.grid.positionForPageXY(e.pageX, e.pageY) || {}; // Checking if a row is currently hovered
      if(hoverTarget !== draggingDot.hoverTarget){
        dragDot(hoverTarget);
      }
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
        if(size(returnObj) === size(this._cachedTiles) && callback){
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
  gridRowPressedRemove(grid, id){
    this.props.removeTile({id: id});
  }
  gridRowPressedMenu(grid, id){
    this.sendToTile(id, 'menu.pressed');
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
    if(!this.props.hasLoaded){
      return <SwipesLoader size={120} text="Opening Swipes" center={true} />;
    }
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
    window.addEventListener('click', this.onClick);
    window.addEventListener("focus", this.onWindowFocus);
    window.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("mouseup", this.onMouseUp);
    window.addEventListener("blur", this.onWindowBlur);
  }
  componentDidUpdate(){
    if(!this.props.fullscreen && this.refs.grid){
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
    hasLoaded: state.main.hasLoaded,
    columns: state.workspace.columns
  }
}

const ConnectedWorkspace = connect(mapStateToProps, {
  removeTile: workspace.removeTile,
  updateColumns: workspace.updateColumns,
  generateShareUrl: workspace.generateShareUrl,
  toggleFullscreen: main.toggleFullscreen,
  dragDot: main.dragDot,
  stopDraggingDot: main.stopDraggingDot
})(Workspace)
export default ConnectedWorkspace
