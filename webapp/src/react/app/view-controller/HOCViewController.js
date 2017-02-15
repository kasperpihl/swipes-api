import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import Button from 'Button';
import * as actions from 'actions';
import * as views from 'views';
import { setupCachedCallback, debounce } from 'classes/utils';
import './styles/view-controller';

const DEFAULT_MIN_WIDTH = 500;
const DEFAULT_MAX_WIDTH = 800;
const SPACING = 20;
const OVERLAY_LEFT_MIN = 100;
const OVERLAY_RIGHT_SPACING = 20;

class HOCViewController extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
    };
    this.onPopCached = setupCachedCallback(props.pop, this);
    this.onPushCached = setupCachedCallback(props.push, this);
    this.onClose = this.onClose.bind(this);
    this.updateWidth = this.updateWidth.bind(this);
    this.bouncedUpdate = debounce(this.updateWidth, 50);
  }
  componentDidMount() {
    this.updateWidth();
    window.addEventListener('resize', this.bouncedUpdate);
  }
  componentWillUnmount() {
    this._unmounted = true;
    window.removeEventListener('resize', this.bouncedUpdate);
  }
  onClose() {
    const { navigateToId } = this.props;
    navigateToId('secondary');
  }
  getMinMaxForView(View) {
    const minMax = [DEFAULT_MIN_WIDTH, DEFAULT_MAX_WIDTH];
    if (typeof View.minWidth === 'function') {
      minMax[0] = View.minWidth();
    }
    if (typeof View.maxWidth === 'function') {
      minMax[1] = View.maxWidth();
    }
    minMax.push(minMax[1] - minMax[0]);
    return minMax;
  }
  getRemainingSpace(sizes) {
    let { width } = this.state;
    width = width || 1200;
    let spacing = SPACING;
    if (sizes[1] > 0) {
      spacing += SPACING;
    }
    return width - spacing - sizes.reduce((a, b) => a + b);
  }

  updateWidth() {
    if (!this._unmounted) {
      this.setState({ width: this.refs.controller.clientWidth });
    }
  }
  determineSizesForWidths(pMinMax, sMinMax) {
    if (!sMinMax) {
      sMinMax = [0, 0, 0];
    }
    const { width } = this.state;

    const sizes = [pMinMax[0], sMinMax[0]];
    let remaining = this.getRemainingSpace(sizes);
    if (remaining > 0) {
      const pDiff = pMinMax[2]; // 200
      const sDiff = sMinMax[2]; // 600
      const diff = pDiff - sDiff;
      if (diff < 0) {
        sizes[1] += Math.min(remaining, Math.abs(diff));
      } else if (diff > 0) {
        sizes[0] += Math.min(remaining, diff);
      }
      remaining = this.getRemainingSpace(sizes);
      const equalSplit = Math.min(pDiff, sDiff);
      if (remaining > 0 && equalSplit > 0) {
        const toAdd = Math.min(remaining / 2, equalSplit);
        sizes[0] += toAdd;
        sizes[1] += toAdd;
      }
    }
    if (remaining < 0) {
      sizes[0] = Math.min(width - SPACING, pMinMax[1]);
      sizes[1] = Math.min((width - OVERLAY_LEFT_MIN - OVERLAY_RIGHT_SPACING), sMinMax[1]);
    }
    return sizes;
  }
  renderViewControllers() {
    const { navigation } = this.props;
    const { width } = this.state;

    // Primary view
    const pView = navigation.get('primary').last();
    const PView = views[pView.get('component')];
    const pMinMax = this.getMinMaxForView(PView);

    // Secondary view
    const sView = navigation.get('secondary').last();
    const SView = sView ? views[sView.get('component')] : undefined;
    const sMinMax = sView ? this.getMinMaxForView(SView) : 0;

    const sizes = this.determineSizesForWidths(pMinMax, sMinMax);

    const remainingSpace = this.getRemainingSpace(sizes);
    const isOverlay = (SView && (remainingSpace < 0));

    let runningX = isOverlay ? 0 : remainingSpace / 2;
    return [pView, sView].map((currentView, i) => {
      const target = (i === 0) ? 'primary' : 'secondary';
      const xClass = [];
      const w = sizes[i];
      const style = {
        width: `${w}px`,
        transform: `translateX(${runningX}px)`,
        zIndex: 2 - i,
      };
      runningX += (w + SPACING);
      if (target === 'secondary' && isOverlay) {
        style.transform = `translateX(${width - w}px)`;
        style.zIndex = 3;
        xClass.push('view-container--overlay');
      }
      return currentView ? this.renderContent(currentView, target, style, xClass) : undefined;
    });
  }
  renderCloseButton(target) {
    if (target && target === 'secondary') {
      return (
        <Button
          small
          frameless
          onClick={this.onClose}
          icon="Close"
          className="view-container__close-button"
          key="close-button"
        />
      );
    }

    return undefined;
  }
  renderContent(currentView, target, style, xClasses) {
    const View = views[currentView.get('component')];
    if (!View) {
      return `View (${currentView.get('component')}) not found!`;
    }
    let props = {};
    if (currentView.get('props')) {
      props = currentView.get('props').toObject();
    }
    if (currentView.get('savedState')) {
      props.savedState = currentView.get('savedState');
    }
    const className = ['view-container'].concat(xClasses).join(' ');
    console.log('style', style);
    return (
      <section className={className} key={target} style={style}>
        {this.renderCloseButton(target)}
        <View
          navPop={this.onPopCached(target)}
          navPush={this.onPushCached(target)}
          openSecondary={this.onPushCached('secondary')}
          delegate={this}
          target={target}
          key={currentView.get('component')}
          {...props}
        />
      </section>
    );
  }

  renderSlack(hidden) {
    const HOCSlack = views.Slack;
    return (
      <HOCSlack hidden={hidden} />
    );
  }
  render() {
    return (
      <div ref="controller" className="view-controller">
        {this.renderViewControllers()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    navigation: state.get('navigation'),
  };
}

const { func } = PropTypes;
HOCViewController.propTypes = {
  navigation: map,
  push: func,
  navigateToId: func,
  pop: func,
};

const ConnectedHOCViewController = connect(mapStateToProps, {
  pop: actions.navigation.pop,
  push: actions.navigation.push,
  navigateToId: actions.navigation.navigateToId,
})(HOCViewController);
export default ConnectedHOCViewController;
