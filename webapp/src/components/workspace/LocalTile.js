import React, { Component, PropTypes } from 'react'
import SwipesAppSDK from '../../classes/sdk/swipes-sdk-tile'
// Import the local tiles here and map them in componentForTypeAndData
import Chat from '../../tiles/chat/Chat'
import Goals from '../../containers/tiles/Goals'

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
      case 'slack':
        return Chat;
      case 'goals':
        return Goals;
      default:
        return Goals;
    }
  }
  componentDidMount() {
    const { tile } = this.props
    if(this.componentForType(tile.get('id'))){
      // Provide the sendFunction so that the workspace communicate with the right tile sdk when sending commands
      const sendFunction = this.state.sdkForTile.com.receivedCommand;

      this.props.onLoad(sendFunction);
    }

  }
  render() {
    const { tile, size, selectedAccountId } = this.props

    const Component = this.componentForType(tile.get('id'));
    if(!Component){
      return <div>Local Tile not found. Import it in LocalTile.js and add to componentForType()</div>
    }
    const tileJS = tile.toJS();
    tileJS.selectedAccountId = selectedAccountId;
    return (<Component size={size} swipes={this.state.sdkForTile} tile={tileJS} />);

  }
}

const { func } = PropTypes;
import { map, mapContains, list, listOf } from 'react-immutable-proptypes'

LocalTile.propTypes = {
  onLoad: func.isRequired,
  receivedCommand: func.isRequired,
  tile: map.isRequired
}

export default LocalTile
