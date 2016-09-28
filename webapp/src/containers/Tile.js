import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { modal, workspace, main } from '../actions'
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


class Tile extends Component {
  constructor(props) {
    super(props)
    this.state = {};
    bindAll(this, ['sendCommandToTile', 'onLoad', 'callDelegate','addListenersToCommunicator', 'onSelectedAccount', 'receivedCommand']);
  }
  componentDidMount(){
    this.callDelegate('tileDidLoad', this.props.data.id);
  }
  componentWillUnmount(){
    this.callDelegate('tileWillUnload', this.props.data.id);
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
    this.props.selectAccount(this.props.tile, selectedAccount.id);
  }

  onLoad(sendFunction){
    const { tile, me, token } = this.props;
    const initObj = {
      // Info object will be available in SDK from swipes.info
      info: {
        workflow: tile.toJS(),
        userId: me.get('id')
      },
      token: this.props.token
    };

    // K_TODO || T_TODO : WARNING, This is a super hack hahaha
    if(this.slackToken){
      initObj.info.slackToken = this.slackToken;
    }
    this.com = new SwClientCom(sendFunction, initObj);

    // Add the listeners for which commands to handle from the tile
    this.addListenersToCommunicator();
  }
  addListenersToCommunicator(){
    const { tile, sendNotification, startDraggingDot, saveData, loadModal } = this.props
    this.com.addListener('navigation.setTitle', (data) => {
      if (data) {
        this.setState({"titleFromCard": data});
        setTimeout(() => { 
          this.callDelegate('tileForceGridUpdate');
        }, 10)
        
      }
    });

    this.com.addListener('tile.saveData', (data) => {
      saveData(tile.get('id'), data);
    });

    this.com.addListener('modal.load', (data, callback) => {
      loadModal(data.modal, data.options, callback);
    });

    this.com.addListener('openURL', (data) => {
      if(data.url){
        window.open(data.url, "_blank");
      }
    });
    this.com.addListener('analytics.action', (data) => {
      var analyticsProps = {'Card': tile.manifest_id, 'Action': data.name};
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
      // Check if a the selected account exist
      const selectedAccount = services.find( (s) => (s.get('id') === tile.get('selectedAccountId')) )
      console.log(this.props.services, services);
      // Hack to pass on the right slack token to the tile for file upload
      if(selectedAccount && selectedAccount.get('service_name') === 'slack'){
        this.slackToken = selectedAccount.get(['authData', 'access_token']);
      }

      if(!selectedAccount){
        return ( <SelectRow
          onSelectedAccount={this.onSelectedAccount}
          data={{
            services: services.toJS(),
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
      return <DropzoneOverlay hover={(tile.id === draggingDot.get('hoverTarget'))} title={"Share to: " + tile.get('name')}/>
    }
  }
  renderWebview(tile){
    const url = this.props.baseUrl + tile.get('manifest_id') + '/' + tile.get('index') + '?id=' + tile.get('id');

    let preloadUrl = 'file://' + path.join(app.getAppPath(), 'preload/tile-preload.js');
    if (os.platform() === 'win32') {
      console.log('windows');
      preloadUrl = path.resolve('preload/tile-preload.js')
    }

    return <Webview onLoad={this.onLoad} receivedCommand={this.receivedCommand} preloadUrl={preloadUrl} url={url} />;
  }
  renderLocalTile(tile){
    return <LocalTile tile={tile} size={this.props.size} onLoad={this.onLoad} receivedCommand={this.receivedCommand} />
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
    baseUrl: state.getIn(['main', 'tileBaseUrl']),
    tile: state.getIn(['workspace', 'tiles', ownProps.data.id]),
    token: state.getIn(['main', 'token']),
    services: state.getIn(['me', 'services']),
    me: state.get('me')
  }
}

const ConnectedTile = connect(mapStateToProps, {
  selectAccount: workspace.selectAccount,
  saveData: workspace.saveData,
  loadModal: modal.loadModal,
  sendNotification: main.sendNotification,
  startDraggingDot: main.startDraggingDot
})(Tile)
export default ConnectedTile
