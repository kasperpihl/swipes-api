import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Measure from 'react-measure';
import * as mainActions from 'src/redux/main/mainActions';
import debounce from 'swipes-core-js/utils/debounce';
import SW from './ContextMenu.swiss';

@connect(state => ({
  contextMenu: state.main.get('contextMenu'),
}), {
  hideContextMenu: mainActions.hideContextMenu,
})
export default class ContextMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { styles: {} };
    this.bouncedResize = debounce(this.fitToScreen.bind(this), 50);
  }
  componentDidMount() {
    this.fitToScreen();
    window.addEventListener('resize', this.bouncedResize);
    window.addEventListener('keydown', this.onKeyDown);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.contextMenu && nextProps.contextMenu !== this.props.contextMenu) {
      this.didFit = false;
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
  onKeyDown = (e) => {
    if (e.keyCode === 27) {
      this.handleHide();
    }
  }
  fitToScreen() {
    if (this.menuRef && !this.didFit) {
      const padding = 20;
      const { styles } = this.state;
      const dStyle = {};
      const vw = this.menuRef.clientWidth;
      const vh = this.menuRef.clientHeight;
      const ww = window.innerWidth;
      const wh = window.innerHeight;
      let bottom = styles.bottom;

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
          this.didFit = true;
          this.setState({ styles: Object.assign({}, styles, dStyle) });
        } else if (dStyle.left !== styles.left || dStyle.right !== styles.right) {
          this.didFit = true;
          this.setState({ styles: Object.assign({}, styles, dStyle) });
        }
      }
    }
  }
  handleHide = (...args) => {
    const {
      hideContextMenu,
      contextMenu,
    } = this.props;
    if (contextMenu) {
      hideContextMenu(...args);
    }
  }
  clickedBackground = (e) => {
    const isBackground = e.target.classList.contains('context-menu');

    if (isBackground) {
      this.handleHide();
    }
  }
  stylesForOptions(options = {}) {
    const styles = { transform: '' };
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
    return (
      <Measure onMeasure={this.bouncedResize}>
        <SW.Content
          innerRef={(c) => { this.menuRef = c; }}
          {...this.state.styles}>
          <Comp hide={this.handleHide} {...props} />
        </SW.Content>
      </Measure>
    );
  }
  render() {
    const { contextMenu } = this.props;

    return (
      <SW.Wrapper
        className="context-menu"
        shown={contextMenu}
        showBackground={!!(contextMenu && contextMenu.showBackground)}
        onClick={this.clickedBackground}
      >
        {this.renderContextMenu(contextMenu)}
      </SW.Wrapper>
    );
  }
}
