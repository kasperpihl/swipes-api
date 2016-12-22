import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import * as actions from 'actions';

import './styles/context-menu';


class HOCContextMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.clickedBackground = this.clickedBackground.bind(this);
    this.hideContextMenu = this.hideContextMenu.bind(this);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidMount() {
    window.addEventListener('resize', this.hideContextMenu);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.hideContextMenu);
  }
  hideContextMenu() {
    const {
      hide,
      contextMenu,
    } = this.props;
    if (contextMenu) {
      hide();
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
    const styles = this.stylesForOptions(contextMenu.options);
    return (
      <div className="context-menu__content" style={styles}>
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
  hide: actions.main.contextMenu.hide,
})(HOCContextMenu);

const { func, object } = PropTypes;
HOCContextMenu.propTypes = {
  hide: func,
  contextMenu: object,
};
