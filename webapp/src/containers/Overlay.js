import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import { list } from 'react-immutable-proptypes';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import * as overlays from './overlays';


class Overlay extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.transitionName = 'fade';
  }
  componentWillUpdate(nextProps) {
    const { overlays: oldVal } = this.props;
    const { overlays: newVal } = nextProps;
    if (newVal.size !== oldVal.size) {
      // Is the first overlay to be shown
      if (!oldVal.size && newVal.size) {
        this.transitionName = 'fade';
      } else if (oldVal.size && !newVal.size) {
        // Removing the last overlay
        this.transitionName = 'fade';
      } else if (newVal.size > oldVal.size) {
        // Pushing a new overlay
        this.transitionName = 'fade';
      } else if (newVal.size < oldVal.size) {
        // Popping an overlay (going back with breadcrumps)
        this.transitionName = 'fade';
      }
    } else if (newVal.size && newVal.size === oldVal.size) {
      // Replacing overlay with a new overlay
      if (oldVal.last().get('component') !== newVal.last().get('component')) {
        this.transitionName = 'fade';
      }
    }
  }
  renderOverlay() {
    const { overlays: propOverlays } = this.props;
    const overlay = propOverlays.last();

    if (!overlay) {
      return undefined;
    }

    let props = {};

    if (overlay.get('props')) {
      props = overlay.get('props').toObject();
    }

    const Comp = overlays[overlay.get('component')];

    if (!Comp) {
      return undefined;
    }

    return <Comp key={overlay.get('component')} {...props} />;
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
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    overlays: state.get('overlays'),
  };
}


Overlay.propTypes = {
  overlays: list,
};

const ConnectedOverlay = connect(mapStateToProps, {
})(Overlay);
export default ConnectedOverlay;
