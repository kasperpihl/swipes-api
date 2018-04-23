import React, { PureComponent } from 'react';
import { styleElement } from 'react-swiss';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { bindAll, traverseElement } from 'swipes-core-js/classes/utils';
import {
  getVisibleSelectionRect,
} from 'draft-js';
import ControlPanel from './ControlPanel';
import prefixAll from 'inline-style-prefixer/static';
import styles from './MediumEditor.swiss';

const Wrapper = styleElement('div', styles.Wrapper);
const SPACING = 10;


class MediumEditor extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showPanel: false,
    };
    bindAll(this, ['onKeyDown', 'onKeyUp', 'onMouseMove', 'onMouseUp']);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.editorState !== this.props.editorState) {
      const { editorState } = nextProps;
      let { showPanel, selection } = this.state;
      const sel = editorState.getSelection();
      if (sel !== selection) {
        clearTimeout(this._shiftTimer);
      }
      if (!this.getHasSelected(sel) || this.getHasSelectionChanged(sel, selection)) {
        showPanel = false;
      }
      selection = sel;
      this.setState({ selection, showPanel });
    }
  }
  componentWillUnmount() {
    clearTimeout(this._shiftTimer);
    this._unmounted = true;
  }
  onKeyDown(e) {
    //
    if (e.keyCode === 16) {
      clearTimeout(this._shiftTimer);
      this._shiftTimer = setTimeout(() => {
        this.showPanel();
      }, 500);
    }
  }
  onKeyUp(e) {
    if (e.keyCode === 16) {
      clearTimeout(this._shiftTimer);
    }
  }


  onMouseUp(e) {
    const br = this.container.getBoundingClientRect();
    const scrollTop = this.getScrollTop();
    const x = e.pageX - br.left;
    const y = e.pageY - br.top - scrollTop;

    setTimeout(() => {
      this.showPanel({ x, y });
    }, 1);
  }
  onMouseMove() {
    setTimeout(() => {
      this.showPanel();
    }, 1);
  }
  getScrollTop() {

    let scrollTop = 0;
    if (this.container) {
      traverseElement(this.container, (el) => {
        if (el.scrollTop) {
          scrollTop = el.scrollTop;
          return true;
        }
        return false;
      });
    }

    return scrollTop;
  }
  getSelectionPosition() {

    const selectionRect = getVisibleSelectionRect(window);
    if (selectionRect && this.container) {
      const br = this.container.getBoundingClientRect();
      const scrollTop = this.getScrollTop();
      selectionRect.top -= br.top + scrollTop;
      selectionRect.bottom -= br.bottom;
      selectionRect.left -= br.left;
      selectionRect.right -= br.right;
    }
    return selectionRect;
  }
  getHasSelectionChanged(sel, oldSel) {
    if ((!oldSel && sel) || (!sel && oldSel)) {
      return true;
    }
    if (sel && oldSel) {
      return !(
        sel.get('anchorKey') === oldSel.get('anchorKey') &&
        sel.get('anchorOffset') === oldSel.get('anchorOffset') &&
        sel.get('focusKey') === oldSel.get('focusKey') &&
        sel.get('focusOffset') === oldSel.get('focusOffset')
      );
    }
    return false;
  }
  getHasSelected(sel) {
    return (
      sel &&
      (sel.get('anchorKey') !== sel.get('focusKey') ||
      sel.get('anchorOffset') !== sel.get('focusOffset'))
    );
  }
  getCenterFromX(x, w) {
    return x - (w / 2);
  }
  getControlPanelSize() {
    const def = {
      w: 0,
      h: 0,
    };
    const { controlPanel } = this.refs;
    if (!controlPanel || !controlPanel.refs.control) {
      return def;
    }
    const w = controlPanel.refs.control.clientWidth;
    const h = controlPanel.refs.control.clientHeight;
    return { w, h };
  }
  showPanel(mousePos) {
    const { selection, showPanel } = this.state;
    if (this.getHasSelected(selection) && !showPanel) {
      this.setState({
        showPanel: true,
        mousePos,
        style: this.calculatePosition(mousePos),
      });
    }
  }
  calculatePosition(mousePos) {
    let newStyles = Map({ top: 0, left: 0 });
    const position = this.getSelectionPosition();
    if (!position) {
      return newStyles;
    }
    newStyles = this.handleDefaultPosition(newStyles);
    newStyles = this.handleMousePosition(newStyles, mousePos);
    newStyles = this.handleContentOverlap(newStyles);
    newStyles = this.handleBoundaries(newStyles);

    const scrollTop = this.getScrollTop();
    newStyles = newStyles.set('top', newStyles.get('top') + scrollTop);

    return newStyles.toJS();
  }

  handleDefaultPosition(styles) {
    const { selection } = this.state;
    const position = this.getSelectionPosition();
    const { w, h } = this.getControlPanelSize();

    styles = styles.set('left', (position.left + (position.width / 2)) - (w / 2));
    if (selection.get('isBackward')) {
      styles = styles.set('top', position.top - h - SPACING);
    } else {
      styles = styles.set('top', position.top + position.height + SPACING);
    }

    return styles;
  }
  handleMousePosition(styles, mousePos) {
    const { selection } = this.state;
    const { w, h } = this.getControlPanelSize();
    const position = this.getSelectionPosition();

    if (mousePos) {
      styles = styles.set('left', this.getCenterFromX(mousePos.x, w));
      if (selection.get('isBackward')) {
        styles = styles.set('top', Math.min(mousePos.y, position.top) - h - SPACING);
      } else {
        styles = styles.set('top', Math.max(mousePos.y, (position.top + position.height)) + SPACING);
      }
    }

    return styles;
  }
  handleContentOverlap(styles) {
    const position = this.getSelectionPosition();
    const { h } = this.getControlPanelSize();
    const wh = this.container.clientHeight;

    const bottomY = styles.get('top') + h;
    const topY = styles.get('top');
    const selTopY = position.top;
    const selBottomY = position.top + position.height;

    if (topY < 0 || bottomY > wh || (bottomY > selTopY && topY < selBottomY)) {
      if ((selTopY - h - SPACING) >= SPACING) {
        styles = styles.set('top', selTopY - h - SPACING);
      } else {
        styles = styles.set('top', selBottomY + SPACING);
      }
    }

    return styles;
  }
  handleBoundaries(styles) {
    const { w, h } = this.getControlPanelSize();
    const ww = this.container.clientWidth;
    const wh = this.container.clientHeight;

    if (styles.get('left') < SPACING) {
      styles = styles.set('left', SPACING);
    } else if ((styles.get('left') + w) > ww - SPACING) {
      styles = styles.set('left', ww - SPACING - w);
    }
    if (styles.get('top') < SPACING) {
      styles = styles.set('top', SPACING);
    } else if ((styles.get('top') + h) > wh - SPACING) {
      styles = styles.set('top', wh - SPACING - h);
    }

    return styles;
  }
  renderControlPanel() {
    const { delegate, editorState } = this.props;
    const { showPanel, style } = this.state;
    return (
      <ControlPanel
        show={showPanel}
        editorState={editorState}
        style={prefixAll(style)}
        delegate={delegate}
        setEditorState={delegate.setEditorState}
        ref="controlPanel"
      />
    );
  }
  render() {
    const { children } = this.props;
    return (
      <Wrapper
        innerRef={(c) => { this.container = c; }}
        onKeyDown={this.onKeyDown}
        onKeyUp={this.onKeyUp}
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}
      >
        {this.renderControlPanel()}
        {children}
      </Wrapper>
    );
  }
}

export default MediumEditor;

const { element, object } = PropTypes;

MediumEditor.propTypes = {
  children: element,
  delegate: object,
  editorState: object,
};
