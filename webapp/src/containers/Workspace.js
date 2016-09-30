import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import * as actions from '../constants/ActionTypes'
import { workspace, main } from '../actions'
import { size, bindAll } from '../classes/utils'

import '../components/workspace/workspace.scss'

import EmptyBackground from '../components/workspace/EmptyBackground'
import ResizeOverlay from '../components/workspace/ResizeOverlay'
import SwipesLoader from '../components/swipes-ui/SwipesLoader'
import { SlackIcon } from '../components/icons'

import Tile from './Tile'
import Grid from '../components/resizeable-grid/grid'
import PureRenderMixin from 'react-addons-pure-render-mixin';

class Workspace extends Component {
  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this._cachedTiles = {};
    bindAll(this, ['tileDidLoad', 'tileWillUnload', 'sendToTile', 'sendToAllTiles', 'onWindowFocus', 'onWindowBlur', 'onMouseMove', 'onMouseUp'])
  }
  generateShareUrl(shortUrl){
    return window.location.origin + '/s/' + shortUrl;
  }
  onMouseUp(e){
    if(this.props.draggingDot){
      e.preventDefault()
      const { draggingDot } = this.props;
      const { id } = this.refs.grid.positionForPageXY(e.pageX, e.pageY) || {};
      if(id && id !== draggingDot.get('draggingId')){
        this.props.stopDraggingDot()
        this.props.generateShareUrl(draggingDot.get('data')).then( (res) => {
          console.log('res from share url', res);
          
          if(res.ok){
            var shareUrl = this.generateShareUrl(res.short_url);
            var shareData = {
              shareUrl
            }
            if(res.meta && res.meta.title){
              shareData.title = res.meta.title;
            }
            this.sendToTile(id, 'share.receivedData', shareData);
          }
         
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
      if(hoverTarget !== draggingDot.get('hoverTarget')){
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
  tileForceGridUpdate(){
    this.refs.grid.forceUpdate();
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
    const width = grid.pixelsWidthFromRow(id);
    const height = grid.pixelsHeightFromRow(id);
    return (
      <Tile
        key={id}
        size={{ width, height }}
        delegate={this}
        id={id}
      />
    );
  }
  gridOptionsForTopbar(grid, id){
    const { tiles, me } = this.props;
    var tile = tiles.get(id);

    var title = tile.get('name');
    const tileView = this._cachedTiles[id];
    if(tileView && tileView.state.titleFromCard){
      title = tileView.state.titleFromCard;
    }

    var show_name;
    if(tile.get('selectedAccountId')){
      
      me.get('services').forEach((service) => {
        if(service.get('service_name') === tile.getIn(['required_services', 0]) && tile.get('selectedAccountId') === service.get('id')){
          show_name = service.get('show_name');
        }
      })
    }
    if(tileView && tileView.state.subtitleFromCard){
      show_name = tileView.state.subtitleFromCard;
    }
    return { title: title, subtitle: show_name };
    
  }
  gridDidTransitionStep(grid, name, step){
    const { fullscreen, toggleFullscreen } = this.props;
    if(name === "fullscreen" && (step === "scalingUp" || step === "isFullscreen")){
      if(!fullscreen){
        toggleFullscreen();
      }
    }
  }
  gridRowPressedFullscreen(grid, id){
    var options = this.gridOptionsForTopbar(grid,id);
    this.props.setFullscreenTitle(options.title, options.subtitle);
  }
  gridRowPressedMenu(grid, id){
    this.sendToTile(id, 'menu.pressed');
  }
  gridDidUpdate(grid, columns){
    this.props.updateColumns(columns);
  }
  gridRenderResizeOverlayForId(grid, id){
    var tile = this.props.tiles.get(id);
    var title = tile.get('name');
    var SVG;
    if(tile.get('id') === 'slack'){
      SVG = SlackIcon;
    }
    return <ResizeOverlay svg={SVG} title={title} />
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
    if (this.props.columns.size) {
      content = <Grid ref="grid" columns={this.props.columns.toJS()} delegate={this} />
    }
    return (
      <div id="workspace" className="workspace">
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
  componentDidUpdate(prevProps){
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
    draggingDot: state.getIn(['main', 'draggingDot']),
    fullscreen: state.getIn(['main', 'isFullscreen']),
    me: state.get('me'),
    tiles: state.getIn(['workspace', 'tiles']),
    hasLoaded: state.getIn(['main', 'hasLoaded']),
    columns: state.getIn(['workspace', 'columns'])
  }
}

const ConnectedWorkspace = connect(mapStateToProps, {
  removeTile: workspace.removeTile,
  updateColumns: workspace.updateColumns,
  generateShareUrl: workspace.generateShareUrl,
  toggleFullscreen: main.toggleFullscreen,
  setFullscreenTitle: main.setFullscreenTitle,
  dragDot: main.dragDot,
  stopDraggingDot: main.stopDraggingDot
})(Workspace)
export default ConnectedWorkspace
