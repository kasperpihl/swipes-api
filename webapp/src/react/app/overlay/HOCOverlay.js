import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import * as overlays from 'src/react/overlays';
import * as actions from 'actions';
import Button from 'Button';


class HOCOverlay extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.transitionName = 'fade';
    this.clickedClose = this.clickedClose.bind(this);
  }
  clickedClose() {
    const {
      hide,
    } = this.props;
    hide(null);
  }
  renderOverlay() {
    const { overlay } = this.props;

    if (!overlay) {
      return undefined;
    }

    let props = {};

    if (overlay.props) {
      props = overlay.props;
    }

    const Comp = overlays[overlay.component];

    if (!Comp) {
      console.warn(`unsupported overlay: ${overlay.component}, Check react/overlays/index.js`);
      return undefined;
    }

    return <Comp key={overlay.component} {...props} />;
  }
  renderOverlayActions() {
    const { overlay } = this.props;
    if (!overlay || overlay.hideClose) {
      return undefined;
    }
    return (
      <div className="overlay__actions">
        <div className="overlay__action" onClick={this.clickedClose}>
          <Button icon="CloseIcon" />
        </div>
      </div>
    );
  }
  render() {
    const renderedOverlay = this.renderOverlay();
    let className = 'overlay';

    if (renderedOverlay) {
      className += ' overlay--shown';
    }
    return (
      <div className={className}>
        <ReactCSSTransitionGroup
          transitionName={this.transitionName}
          component="div"
          className="transition overlay__anim-wrap"
          transitionEnterTimeout={400}
          transitionLeaveTimeout={400}
        >
          {renderedOverlay}
        </ReactCSSTransitionGroup>

        {this.renderOverlayActions()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    overlay: state.getIn(['main', 'overlay']),
  };
}

const { func, object } = PropTypes;
HOCOverlay.propTypes = {
  overlay: object,
  hide: func,
};

const ConnectedHOCOverlay = connect(mapStateToProps, {
  hide: actions.main.overlay,
})(HOCOverlay);
export default ConnectedHOCOverlay;
