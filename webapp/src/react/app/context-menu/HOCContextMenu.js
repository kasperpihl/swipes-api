import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import * as actions from 'actions';
import { debounce } from 'classes/utils';

import './styles/context-menu';


class HOCContextMenu extends Component {
  constructor(props) {
    super(props);
    this.state = { styles: {} };
    this.clickedBackground = this.clickedBackground.bind(this);
    this.hideContextMenu = this.hideContextMenu.bind(this);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.bouncedResize = debounce(this.fitToScreen.bind(this), 50);
  }
  componentDidMount() {
    this.fitToScreen();
    window.addEventListener('resize', this.bouncedResize);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.bouncedResize);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.contextMenu && nextProps.contextMenu !== this.props.contextMenu) {
      this.setState({ styles: this.stylesForOptions(nextProps.contextMenu.options) });
    }
  }
  componentDidUpdate() {
    this.fitToScreen();
  }
  fitToScreen() {
    if (this.refs.menu) {
      const { styles } = this.state;
      const dStyle = {};

      const vw = this.refs.menu.clientWidth;
      const vh = this.refs.menu.clientHeight;

      const ww = window.innerWidth;
      const wh = window.innerHeight;

      let bottom = styles.bottom;
      const padding = 5;
      if (typeof bottom === 'string') {
        bottom = parseInt(bottom, 10);
        if ((bottom + vh) > wh) {
          dStyle.bottom = `${wh - vh - padding}px`;
        }
      }

      let top = styles.top;
      if (typeof top === 'string') {
        top = parseInt(top, 10);
        if ((top + vh) > wh) {
          dStyle.top = `${wh - vh - padding}px`;
        }
      }

      let left = styles.left;
      if (typeof left === 'string') {
        left = parseInt(left, 10);
        if ((left + vw) > ww) {
          dStyle.left = `${ww - vw - padding}px`;
        }
      }
      let right = styles.right;
      if (typeof right === 'string') {
        right = parseInt(right, 10);
        if ((right + vw) > ww) {
          dStyle.right = `${ww - vw - padding}px`;
        }
      }

      if (dStyle.top || dStyle.bottom || dStyle.left || dStyle.right) {
        if (dStyle.top !== styles.top || dStyle.bottom !== styles.bottom) {
          this.setState({ styles: Object.assign({}, styles, dStyle) });
        } else if (dStyle.left !== styles.left || dStyle.right !== styles.right) {
          this.setState({ styles: Object.assign({}, styles, dStyle) });
        }
      }
    }
  }
  hideContextMenu() {
    const {
      hide,
      contextMenu,
    } = this.props;
    if (contextMenu) {
      hide(null);
    }
  }
  clickedBackground(e) {
    const isBackground = e.target.classList.contains('context-menu');
    if (isBackground) {
      this.hideContextMenu();
    }
  }
  stylesForOptions(options) {
    const styles = {};
    options = options || {};
    const ww = window.innerWidth;
    const wh = window.innerHeight;
    const { boundingRect: bR } = options;

    const {
      alignX,
      positionX,
      excludeX,
    } = options;

    let exW = excludeX ? bR.width : 0;
    if (positionX && typeof positionX === 'number') {
      exW += positionX;
    }

    if (alignX === 'center') {
      styles.left = `${(bR.left) + ((bR.right - bR.left) / 2)}px`;
      styles.transform = 'translateX(-50%)';
    } else if (alignX === 'right') {
      styles.right = `${(ww - bR.right) + exW}px`;
    } else {
      styles.left = `${bR.left + exW}px`;
    }


    const {
      alignY,
      positionY,
      excludeY,
    } = options;
    let exH = excludeY ? bR.height : 0;
    if (positionY && typeof positionY === 'number') {
      exH += positionY;
    }
    if (alignY === 'center') {
      styles.top = `${(bR.top) + ((bR.bottom - bR.top) / 2)}px`;
      styles.transform = 'translateY(-50%)';
    } else if (alignY === 'bottom') {
      styles.bottom = `${(wh - bR.bottom) + exH}px`;
    } else {
      styles.top = `${bR.top + exH}px`;
    }

    return styles;
  }
  renderContextMenu(contextMenu) {
    if (!contextMenu) {
      return undefined;
    }
    const Comp = contextMenu.component;
    const props = contextMenu.props || {};
    const styles = this.state.styles;
    return (
      <div className="context-menu__content" ref="menu" style={styles}>
        <Comp {...props} />
      </div>
    );
  }
  render() {
    const {
      contextMenu,
    } = this.props;
    let className = 'context-menu';
    if (contextMenu) {
      className += ' context-menu--shown';
    }

    return (
      <div
        className={className}
        onClick={this.clickedBackground}
      >
        {this.renderContextMenu(contextMenu)}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    contextMenu: state.getIn(['main', 'contextMenu']),
  };
}

export default connect(mapStateToProps, {
  hide: actions.main.contextMenu,
})(HOCContextMenu);

const { func, object } = PropTypes;
HOCContextMenu.propTypes = {
  hide: func,
  contextMenu: object,
};
