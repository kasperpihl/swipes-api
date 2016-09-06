import React, { Component, PropTypes } from 'react'
import SwipesAppSDK from '../../classes/sdk/swipes-sdk-tile'
// Import the local tiles here and map them in componentForTypeAndData
import Chat from '../../tiles/chat/Chat'
import Browser from '../../tiles/browser/Browser'
import Goals from '../../tiles/goals/Goals'
import PureRenderMixin from 'react-addons-pure-render-mixin';

class LocalTile extends Component {
  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    // Setup SDK for tile, make sure it sends commands back to us
    const sdkForTile = new SwipesAppSDK(props.receivedCommand);
    this.state = { sdkForTile }
  }
  componentForType(type){
    let Component;
    switch(type){
      case 'slack-dashboard':
        return Chat;
      case 'jira-card':
        return Goals;
      default:
        return null
    }
  }
  shouldComponentUpdate(nextProps, nextState){
    if(JSON.stringify(nextProps) !== JSON.stringify(this.props))
      return true;
    return false;
  }
  componentDidMount() {
    const { tile } = this.props
    if(this.componentForType(tile.manifest_id)){
      // Provide the sendFunction so that the workspace communicate with the right tile sdk when sending commands
      const sendFunction = this.state.sdkForTile.com.receivedCommand;

      this.props.onLoad(sendFunction);
    }

  }
  render() {
    const { tile } = this.props

    const Component = this.componentForType(tile.manifest_id);
    if(!Component){
      return <div>Local Tile not found. Import it in LocalTile.js and add to componentForType()</div>
    }

    return (<Component swipes={this.state.sdkForTile} tile={tile} />);

  }
}

LocalTile.propTypes = {
  onLoad: PropTypes.func.isRequired,
  receivedCommand: PropTypes.func.isRequired,
  tile: PropTypes.object.isRequired
}

export default LocalTile
