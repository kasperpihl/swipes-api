import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import { map } from 'react-immutable-proptypes';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import * as overlays from 'src/react/overlays';
import * as actions from 'actions';
import Icon from 'Icon';


class HOCOverlay extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.transitionName = 'fade';
    this.clickedClose = this.clickedClose.bind(this);
  }
  clickedClose() {
    const {
      overlayHide,
    } = this.props;
    overlayHide();
  }
  renderOverlay() {
    const { overlay } = this.props;

    if (!overlay) {
      return undefined;
    }

    let props = {};

    if (overlay.get('props')) {
      props = overlay.get('props').toObject();
    }

    const Comp = overlays[overlay.get('component')];

    if (!Comp) {
      console.warn(`unsupported overlay: ${overlay.get('component')}, Check react/overlays/index.js`);
      return undefined;
    }

    return <Comp key={overlay.get('component')} {...props} />;
  }
  renderOverleyActions() {
    return (
      <div className="overlay__actions">
        <div className="overlay__action" onClick={this.clickedClose}>
          <Icon svg="CloseIcon" className="overlay__icon" />
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

        {this.renderOverleyActions()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    overlay: state.getIn(['main', 'overlay']),
  };
}

const { func } = PropTypes;
HOCOverlay.propTypes = {
  overlay: map,
  overlayHide: func,
};

const ConnectedHOCOverlay = connect(mapStateToProps, {
  overlayHide: actions.main.overlayHide,
})(HOCOverlay);
export default ConnectedHOCOverlay;
