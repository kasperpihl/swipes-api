import React from 'react';

const getStyles = (props, state) => {
  return {
    root: {
      width: '100vw',
      height: '100vh',
      position: 'fixed',
      top: '0px',
      left: '0px',
      opacity: '1',
      zIndex: 9999
    }
  }
}

const Overlay = React.createClass({
  onClickRoot(e) {
    const {
      onClickClose
    } = this.props;

    e.stopPropagation();
    onClickClose();
  },
  render() {
    const styles = getStyles(this.props, this.state);

    return (
      <div
        style={Object.assign({}, styles.root)}
        onClick={this.onClickRoot}
      >
      </div>
    )
  }
});

export default Overlay;
