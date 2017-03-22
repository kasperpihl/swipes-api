import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as a from 'actions';
import { debounce, bindAll } from 'swipes-core-js/classes/utils';

import './styles/context-menu';


class HOCContextMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { styles: {} };
    bindAll(this, ['clickedBackground', 'onKeyDown', 'hideContextMenu']);
    this.bouncedResize = debounce(this.fitToScreen.bind(this), 50);
  }
  componentDidMount() {
    this.fitToScreen();
    window.addEventListener('resize', this.bouncedResize);
    window.addEventListener('keydown', this.onKeyDown);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.contextMenu && nextProps.contextMenu !== this.props.contextMenu) {
      this.setState({ styles: this.stylesForOptions(nextProps.contextMenu.options) });
    }
  }
  componentDidUpdate() {
    this.fitToScreen();
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.bouncedResize);
    window.removeEventListener('keydown', this.onKeyDown);
  }
  onKeyDown(e) {
    if (e.keyCode === 27) {
      this.hideContextMenu();
    }
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
      const padding = 20;
      if (typeof bottom === 'string') {
        bottom = parseInt(bottom, 10);
        if ((bottom + vh) > wh) {
          dStyle.bottom = `${wh - vh - padding}px`;
        }
      }

      let top = styles.top;
      if (typeof top === 'string') {
        const { alignY } = this.props.contextMenu.options;
        top = parseInt(top, 10);
        let extraCalc = 0;
        if (alignY === 'center') {
          extraCalc = (vh / 2);
          top -= extraCalc;
        }
        if (top < 0) {
          dStyle.top = `${extraCalc + padding}px`;
        } else if ((top + vh) > wh) {
          dStyle.top = `${(wh - vh - padding) + extraCalc}px`;
        }
      }

      let left = styles.left;
      if (typeof left === 'string') {
        const { alignX } = this.props.contextMenu.options;
        left = parseInt(left, 10);
        let extraCalc = 0;
        if (alignX === 'center') {
          extraCalc = (vw / 2);
          left -= extraCalc;
        }
        if (left < 0) {
          dStyle.left = `${extraCalc + padding}px`;
        } else if ((left + vw) > ww) {
          dStyle.left = `${(ww - vw - padding) + extraCalc}px`;
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
    const styles = { transform: '' };
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
      styles.left = `${(bR.left) + (bR.width / 2)}px`;
      styles.transform += 'translateX(-50%) ';
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
      styles.top = `${(bR.top) + (bR.height / 2)}px`;
      styles.transform += 'translateY(-50%) ';
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
    const key = contextMenu.id;
    const styles = this.state.styles;
    return (
      <div className="context-menu__content" ref="menu" style={styles} key={key}>
        <Comp hide={this.hideContextMenu} {...props} />
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
  hide: a.main.contextMenu,
})(HOCContextMenu);

const { func, object } = PropTypes;
HOCContextMenu.propTypes = {
  hide: func,
  contextMenu: object,
};
