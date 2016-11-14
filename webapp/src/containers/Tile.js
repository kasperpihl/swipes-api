import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { modal, workspace, main, overlay } from '../actions'
import * as actions from '../constants/ActionTypes'
import { bindAll } from '../classes/utils';


import SelectRow from '../components/services/SelectRow'
import Webview from '../components/workspace/Webview'
import DropzoneOverlay from '../components/workspace/DropzoneOverlay'
import SwipesLoader from '../components/swipes-ui/SwipesLoader'

import LocalTile from '../components/workspace/LocalTile'
import SwipesAppSDK from '../classes/sdk/swipes-sdk-tile'
import SwClientCom from '../classes/sdk/swipes-sdk-ipc'

const remote = nodeRequire('electron').remote;
const app = remote.app;
const path = nodeRequire('path');
const os = nodeRequire('os');
import PureRenderMixin from 'react-addons-pure-render-mixin';


class Tile extends Component {
  constructor(props) {
    super(props)
    this.state = {};
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

    bindAll(this, ['sendCommandToTile', 'onLoad', 'callDelegate','addListenersToCommunicator', 'onSelectedAccount', 'receivedCommand']);
  }
  componentDidMount(){
    this.callDelegate('tileDidLoad', this.props.id);
  }
  componentWillUnmount(){
    this.callDelegate('tileWillUnload', this.props.id);
  }
  callDelegate(name){
    const { delegate } = this.props;
    if(delegate && typeof delegate[name] === "function"){
      return delegate[name].apply(delegate, [this].concat(Array.prototype.slice.call(arguments, 1)));
    }
  }
  sendCommandToTile(command, data, callback){
    if(this.com){
      this.com.sendCommand(command, data, callback);
    }
  }
  onSelectedAccount(selectedAccount){
    this.props.selectAccount(this.props.tile.get('id'), selectedAccount.get('id'));
  }

  onLoad(sendFunction){
    const { tile, me, token } = this.props;
    const tileJS = tile.toJS();
    const initObj = {
      // Info object will be available in SDK from swipes.info
      info: {
        workflow: tileJS,
        userId: me.get('id')
      },
      token: this.props.token
    };

    // K_TODO || T_TODO : WARNING, This is a super hack hahaha
    if(this.slackToken){

      tileJS.selectedAccountId = this.selectedAccountId;
      initObj.info.slackToken = this.slackToken;
    }
    this.com = new SwClientCom(sendFunction, initObj);

    // Add the listeners for which commands to handle from the tile
    this.addListenersToCommunicator();
  }
  addListenersToCommunicator(){
    const { tile, sendNotification, startDraggingDot, saveData, loadModal, setOverlay } = this.props

    this.com.addListener('modal.load', (data, callback) => {
      loadModal(data.props, callback);
    });
    this.com.addListener('overlay.set', (data) => {
      setOverlay(data);
    });
    this.com.addListener('send.slackMessage', (data) => {
      this.callDelegate('sendSlackMessage', data.text);
    });
    this.com.addListener('openURL', (data) => {
      if(data.url){
        window.open(data.url, "_blank");
      }
    });

    this.com.addListener('notifications.send', (data) => {
      var notif = {
        title: tile.get('name'),
        message: data.message
      };
      if(data.title){
        notif.title += ": " + data.title;
      }
      if(!document.hasFocus()) {
        sendNotification(notif);
      }
    });

    this.com.addListeners(['dot.startDrag', 'share'], (data) => {
      console.log('start dragging data', data);
      startDraggingDot(this.props.tile.get('id'), data);
    })
  }
  receivedCommand(command){
    this.com.receivedCommand(command);
  }
  renderServiceSelector(tile){
    // Determine if the selected account is still a service.
    if(tile.get('required_services') && tile.get('required_services').size){
      // Find services from the required services
      const services = this.props.services.filter( (s) => (s.get('service_name') === tile.getIn(['required_services', 0])))
      // Hack to pass on the right slack token to the tile for file upload
      if(services.size && services.get(0).get('service_name') === 'slack'){
        this.selectedAccountId = services.get(0).get('id');
        this.slackToken = services.get(0).getIn(['authData', 'access_token']);
      }

      if(!services.size){
        return ( <SelectRow
          onSelectedAccount={this.onSelectedAccount}
          data={{
            services: services,
            title: tile.getIn(['required_services', 0]),
            service_name: tile.getIn(['required_services', 0])
          }}
        />);
      }



    }
    return null;
  }
  renderDropzoneOverlay(){
    const { draggingDot, tile } = this.props;

    if (draggingDot && draggingDot.get('draggingId') !== tile.get('id')) {
      return <DropzoneOverlay hover={(tile.get('id') === draggingDot.get('hoverTarget'))} title={"Share to: " + tile.get('name')}/>
    }
  }
  renderLocalTile(tile){
    return <LocalTile tile={tile} selectedAccountId={this.selectedAccountId} size={this.props.size} onLoad={this.onLoad} receivedCommand={this.receivedCommand} />
  }
  render() {
    let cardContent = <SwipesLoader size={120} center={true}/>;

    const tile = this.props.tile;
    if(tile){
      cardContent = this.renderServiceSelector(tile);
      if(!cardContent){
        //cardContent = this.renderWebview(tile);
        cardContent = this.renderLocalTile(tile);
      }
    }

    return (
      <div className="tile">
        {this.renderDropzoneOverlay()}
        {cardContent}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    draggingDot: state.getIn(['main', 'draggingDot']),
    tile: state.getIn(['workspace', 'tiles', ownProps.id]),
    token: state.getIn(['main', 'token']),
    services: state.getIn(['me', 'services']),
    me: state.get('me')
  }
}

const ConnectedTile = connect(mapStateToProps, {
  selectAccount: workspace.selectAccount,
  saveData: workspace.saveData,
  setOverlay: overlay.set,
  pushOverlay: overlay.push,
  loadModal: modal.load,
  sendNotification: main.sendNotification,
  startDraggingDot: main.startDraggingDot
})(Tile)
export default ConnectedTile
