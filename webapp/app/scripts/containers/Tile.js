import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { modal, notification } from '../actions'
import * as actions from '../constants/ActionTypes'
import SelectRow from '../components/services/SelectRow'

const remote = nodeRequire('electron').remote;
const app = remote.app;
const path = nodeRequire('path');


class Tile extends Component {
  constructor(props) {
    super(props)
    this.state = { webviewLoaded: false }
    _.bindAll(this, 'sendCommandToTile', 'addHandlersForWebview', 'onLoad', 'callDelegate','addListenersToCommunicator');
  }
  componentDidMount(){
    this.callDelegate('tileDidLoad', this.props.data.id);
    this.addHandlersForWebview();
  }
  componentDidUpdate(){
    this.addHandlersForWebview();
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
  addHandlersForWebview(){
    const webview = this.refs.webview;
    if(this.state.webviewLoaded)
      return;

    if (webview) {
      webview.addEventListener('dom-ready', this.onLoad);
      webview.addEventListener('ipc-message', (event) => {
        var arg = event.args[0];
        // Pass the received message on to the communicator
        this.com.receivedCommand(arg); 
      });
      this.setState({webviewLoaded: true});
    }
    
  }
  onLoad(){
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
    // Provide the sendFunction that the communicator will use to send the commands
    const sendFunction = data => this.refs.webview.send('message', data)
    this.com = new SwClientCom(sendFunction, initObj);
    // Add the listeners for which commands to handle from the tile
    this.addListenersToCommunicator();
  }
  addListenersToCommunicator(){
    
    this.com.addListener('navigation.setTitle', (data) => {
      if (data.title) {
        this.setState({"titleFromCard": data.title});
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
      var notification = {
        title: this.state.workflow.name,
        message: data.message
      };
      if(data.title){
        notification.title += ": " + data.title;
      }
      if(!document.hasFocus()) {
        
      }
    });

    this.com.addListener('dot.startDrag', (data) => {
      var newData = {
        fromCardId: this.props.data.id,
        data: data
      };

    })
  }

  render() {
    var cardContent = <div>Loading</div>;

    const tile = this.props.tile;
    if(this.props.tile){

      const url = this.props.baseUrl + tile.manifest_id + '/' + tile.index + '?id=' + tile.id;

      // For Kris
      // preload={'file://' + path.resolve(__dirname) + 'b\\swipes-electron\\preload\\tile-preload.js'}

      cardContent = <webview preload={'file://' + path.join(app.getAppPath(), 'preload/tile-preload.js')} src={url} ref="webview" className="workflow-frame-class"></webview>;

      // Determine if the
      if(tile.required_services.length > 0){
        const requiredService = tile.required_services[0];
        const selectedAccountId = tile.selectedAccountId;
        let foundSelectedAccount = false;
        const connectedServices = _.filter(this.props.services, (service) => {
          if(service.service_name === requiredService){
            if(selectedAccountId && selectedAccountId === service.id){
              foundSelectedAccount = true;
              // K_TODO || T_TODO : WARNING, This is a super hack hahaha
              if(service.service_name === "slack" && service.authData){
                this.slackToken = service.authData.access_token;
              }
            }
            return true;
          }
          return false;
        });

        if(!tile.selectedAccountId || !foundSelectedAccount){
          cardContent = <SelectRow
            data={{
              services: connectedServices,
              title: tile.required_services[0],
              manifest_id: tile.required_services[0]
            }}
          />
        }
      }
    }

    return (
      <div className="tile">
        {cardContent}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    baseUrl: state.main.tileBaseUrl,
    tile: state.workspace.tiles[ownProps.data.id],
    token: state.auth.token,
    services: state.me.services,
    me: state.me
  }
}

const ConnectedTile = connect(mapStateToProps, {
  onDoing: actions.doStuff
})(Tile)
export default ConnectedTile