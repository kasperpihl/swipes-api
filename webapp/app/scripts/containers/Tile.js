import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { modal, workspace, main } from '../actions'
import * as actions from '../constants/ActionTypes'

import SelectRow from '../components/services/SelectRow'
import Webview from '../components/workspace/Webview'
import DropzoneOverlay from '../components/workspace/DropzoneOverlay'

const remote = nodeRequire('electron').remote;
const app = remote.app;
const path = nodeRequire('path');
const os = nodeRequire('os');


class Tile extends Component {
  constructor(props) {
    super(props)

    _.bindAll(this, 'sendCommandToTile', 'onLoad', 'callDelegate','addListenersToCommunicator', 'onSelectedAccount', 'receivedCommand');
  }
  componentDidMount(){
    this.callDelegate('tileDidLoad', this.props.data.id);
  }
  componentWillUnmount(){
    this.callDelegate('tileWillUnload', this.props.data.id);
  }
  callDelegate(name){
    if(this.props.delegate && typeof this.props.delegate[name] === "function"){
      return this.props.delegate[name].apply(null, [this].concat(Array.prototype.slice.call(arguments, 1)));
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
    const tile = this.props.tile;

    // K_TODO || T_TODO : WARNING, This is a super hack hahaha
    if(tile && this.slackToken){
      tile.slackToken = this.slackToken;
    }

    const initObj = {
      // Info object will be available in SDK from swipes.info
      info: {
        workflow: tile,
        userId: this.props.me.id
      },
      token: this.props.token
    };
    if(tile.selectedAccountId){
      initObj.info.selectedAccountId = tile.selectedAccountId;
    }

    // Initialize the communicator
    this.com = new SwClientCom(sendFunction, initObj);
    // Add the listeners for which commands to handle from the tile
    this.addListenersToCommunicator();

    if (electronConfig.env === 'dev') {
      //webview.openDevTools();
    }
  }
  addListenersToCommunicator(){

    this.com.addListener('navigation.setTitle', (data) => {
      if (data.title) {
        //this.setState({"titleFromCard": data.title});
      }
    });

    this.com.addListener('modal.load', (data) => {
      modal.loadModal(data.modal, data.options, callback);
    })

    this.com.addListener('openURL', (data) => {
      if(data.url){
        window.open(data.url, "_blank");
      }
    });
    this.com.addListener('analytics.action', (data) => {
      var analyticsProps = {'Card': this.props.tile.manifest_id, 'Action': data.name};
    });
    this.com.addListener('notifications.send', (data) => {
      var notif = {
        title: this.props.tile.name,
        message: data.message
      };
      if(data.title){
        notif.title += ": " + data.title;
      }
      if(!document.hasFocus()) {
        this.props.sendNotification(notif);
      }
    });

    this.com.addListener('dot.startDrag', (data) => {
      this.props.startDraggingDot(this.props.tile.id, data);
    })
  }
  receivedCommand(command){
    this.com.receivedCommand(command);
  }
  renderServiceSelector(tile){
    // Determine if the selected account is still a service.
    if(tile.required_services.length > 0){
      // Find services from the required services
      const services = this.props.services.filter( ({service_name}) => (service_name === tile.required_services[0]))
      // Check if a the selected account exist
      const selectedAccount = services.find( ({id}) => (id === tile.selectedAccountId) )

      // Hack to pass on the right slack token to the tile for file upload
      if(selectedAccount && selectedAccount.service_name === 'slack'){
        this.slackToken = selectedAccount.authData.access_token;
      }
      
      if(!selectedAccount){
        return ( <SelectRow
          onSelectedAccount={this.onSelectedAccount}
          data={{
            services: services,
            title: tile.required_services[0],
            service_name: tile.required_services[0]
          }}
        />);
      }

      

    }
    return null;
  }
  renderDropzoneOverlay(){
    //return <DropzoneOverlay hover={true} />
    if(this.props.draggingDot){
      let { draggingDot, tile } = this.props;
      return <DropzoneOverlay hover={(tile.id === draggingDot.hoverTarget)} title={"Share to: " + tile.name}/>
    }
  }
  renderWebview(tile){
    const url = this.props.baseUrl + tile.manifest_id + '/' + tile.index + '?id=' + tile.id;
    let preloadUrl = 'file://' + path.join(app.getAppPath(), 'preload/tile-preload.js');

    if (os.platform() === 'win32') {
      console.log('windows');
      preloadUrl = path.resolve('preload/tile-preload.js')
    }

    return <Webview onLoad={this.onLoad} receivedCommand={this.receivedCommand} preloadUrl={preloadUrl} url={url} />;
  }
  renderLocalTile(){

  }
  render() {
    // KRIS_TODO: Replace Loading with something dope
    var cardContent = <div>Loading</div>;

    const tile = this.props.tile;
    if(tile){
      cardContent = this.renderServiceSelector(tile);
      if(!cardContent){
        cardContent = this.renderWebview(tile);
        // Render local tiles
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
    draggingDot: state.main.draggingDot,
    baseUrl: state.main.tileBaseUrl,
    tile: state.workspace.tiles[ownProps.data.id],
    token: state.main.token,
    services: state.me.services,
    me: state.me
  }
}

const ConnectedTile = connect(mapStateToProps, {
  selectAccount: workspace.selectAccount,
  sendNotification: main.sendNotification,
  startDraggingDot: main.startDraggingDot
})(Tile)
export default ConnectedTile
