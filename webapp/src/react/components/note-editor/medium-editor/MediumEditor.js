import React, { PureComponent, PropTypes } from 'react';
import { Map } from 'immutable';
import { bindAll } from 'classes/utils';
import {
  getVisibleSelectionRect,
} from 'draft-js';
import ControlPanel from './ControlPanel';

const SPACING = 10;

class MediumEditor extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showPanel: false,
    };
    bindAll(this, ['onKeyDown', 'onKeyUp', 'onMouseMove', 'onMouseUp', 'hidePanel']);
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
    const { container } = this.refs;
    const br = container.getBoundingClientRect();
    const x = e.pageX - br.left;
    const y = e.pageY - br.top;

    setTimeout(() => {
      this.showPanel({ x, y });
    }, 1);
  }
  onMouseMove() {
    setTimeout(() => {
      this.showPanel();
    }, 1);
  }
  getSelectionPosition() {
    const { container } = this.refs;

    const selectionRect = getVisibleSelectionRect(window);
    if (selectionRect && container) {
      const br = container.getBoundingClientRect();
      selectionRect.top -= br.top;
      selectionRect.bottom -= br.bottom;
      selectionRect.left -= br.left;
      selectionRect.right -= br.right;
    }
    return selectionRect;
  }
  getHasSelectionChanged(sel, oldSel) {
    if (!oldSel && sel || !sel && oldSel) {
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

    newStyles = this.handleDefaultPosition(newStyles);
    newStyles = this.handleMousePosition(newStyles, mousePos);
    newStyles = this.handleBoundaries(newStyles);
    newStyles = this.handleContentOverlap(newStyles);

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
  handleBoundaries(styles) {
    const { w, h } = this.getControlPanelSize();
    const { container } = this.refs;
    const ww = container.clientWidth;
    const wh = container.clientHeight;

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
  handleContentOverlap(styles) {
    const position = this.getSelectionPosition();
    const { h } = this.getControlPanelSize();
    const { container } = this.refs;
    const wh = container.clientHeight;
    const bottomY = styles.get('top') + h;

    if (
        (bottomY) > position.top &&
        (bottomY) < (position.top + position.height)) {
      styles = styles.set('top', position.top + position.height + SPACING);
    } else if ((styles.get('top') + h) > wh) {
      styles = styles.set('top', position.top - h - SPACING);
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
        style={style}
        delegate={delegate}
        setEditorState={delegate.setEditorState}
        ref="controlPanel"
      />
    );
  }
  render() {
    const { children } = this.props;
    return (
      <div
        ref="container"
        className="medium-editor"
        onKeyDown={this.onKeyDown}
        onKeyUp={this.onKeyUp}
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}
      >
        {this.renderControlPanel()}
        {children}
      </div>
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
