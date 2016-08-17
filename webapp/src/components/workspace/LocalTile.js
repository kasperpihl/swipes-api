import React, { Component, PropTypes } from 'react'
import SwipesAppSDK from '../../classes/sdk/swipes-sdk-tile'
// Import the local tiles here and map them in componentForTypeAndData
import Chat from '../../tiles/chat/Chat'

class LocalTile extends Component {
  constructor(props) {
    super(props)
    // Setup SDK for tile, make sure it sends commands back to us
    const sdkForTile = new SwipesAppSDK(props.receivedCommand);
    this.state = { sdkForTile }
  }
  componentForType(type){
    let Component;
    switch(type){
      case 'slack-dashboard':
        return Chat;
      default:
        return null
    }
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
export default LocalTile

LocalTile.propTypes = {
  onLoad: PropTypes.func.isRequired,
  receivedCommand: PropTypes.func.isRequired,
  tile: PropTypes.object.isRequired
}


export default LocalTile