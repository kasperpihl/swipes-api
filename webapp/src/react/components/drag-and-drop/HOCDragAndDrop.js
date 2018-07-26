import React, {Component} from 'react';
import { connect } from 'react-redux';
import * as menuActions from 'src/redux/menu/menuActions';
import DragAndDrop from 'src/react/components/drag-and-drop/DragAndDrop';

@connect(state => ({
  navigation: state.get('navigation'),
}), {
  chooseDragAndDrop: menuActions.chooseDragAndDrop,
})

class HOCDragAndDrop extends Component {
  constructor(props){
    super(props);

    this.state = {
      hoverActive: false,
      showMenu: false,
    };
  }

  // && primary.size > 0 && secondary.size > 0 || primary.size > 0 && secondary.size === 0 || primary.size === 0 && secondary.size > 0

  handleDragEnter = (e) => {
    const primary = getState().main.getIn(['dragAndDrop', 'primary']);
    const secondary = getState().main.getIn(['dragAndDrop', 'secondary']);
    e.preventDefault();
    let dt = e.dataTransfer;
    if (
      dt.types && (dt.types.indexOf ? dt.types.indexOf('Files') != -1 : dt.types.contains('Files'))
    ) {
      this.setState({hoverActive: true})
    }
  }

  closeOverlay = (e) => {
    e.preventDefault();
    this.setState({hoverActive: false});
  }

  handleDragLeave = (e) => {
    e.preventDefault();
    this.setState({hoverActive: false});
  }

  handleDragOver = (e) => {
    e.preventDefault();
  }

  handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const {chooseDragAndDrop} = this.props;
    const options = {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'center',
      alignY: 'center',
    };
    chooseDragAndDrop(e.dataTransfer.files, options);
    this.setState({hoverActive: false});
  }

  render() {
    const { hoverActive } = this.state;
    const { children } = this.props;
    return (
      <DragAndDrop
        handleDragEnter={this.handleDragEnter}
        handleDragLeave={this.handleDragLeave}
        handleDragOver={this.handleDragOver}
        handleDrop={this.handleDrop}
        hoverActive={hoverActive}
        closeOverlay={this.closeOverlay}
      >
        {children}
      </DragAndDrop>
    )
  }
}

export default HOCDragAndDrop;

