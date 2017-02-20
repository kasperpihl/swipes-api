import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import { Map } from 'immutable';
import Button from 'Button';
import * as actions from 'actions';
import * as views from 'views';
import { setupCachedCallback, debounce } from 'classes/utils';
import HOCBreadCrumbs from 'components/bread-crumbs/HOCBreadCrumbs';
import './styles/view-controller';

const DEFAULT_MIN_WIDTH = 500;
const DEFAULT_MAX_WIDTH = 800;
const SPACING = 20;
const OVERLAY_LEFT_MIN = 120;

class HOCViewController extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      onTop: 'secondary',
      fullscreen: null,
    };
    this.onPopCached = setupCachedCallback(props.pop, this);
    this.onPushCached = setupCachedCallback(props.push, this);
    this.onUnderlayCached = setupCachedCallback(this.onUnderlay, this);
    this.onFullscreenCached = setupCachedCallback(this.onFullscreen, this);
    this.onClose = this.onClose.bind(this);
    this.updateWidth = this.updateWidth.bind(this);
    this.bouncedUpdate = debounce(this.updateWidth, 50);
  }
  componentDidMount() {
    this.updateWidth();
    window.addEventListener('resize', this.bouncedUpdate);
  }
  componentWillReceiveProps(nextProps) {
    const nav = this.props.navigation;
    const nextNav = nextProps.navigation;
    const { onTop } = this.state;
    if (onTop === 'primary' && nav.get('secondary') !== nextNav.get('secondary')) {
      this.setState({ onTop: 'secondary' });
    }
    if (onTop === 'secondary' && nav.get('primary') !== nextNav.get('primary')) {
      this.setState({ onTop: 'primary' });
    }
  }
  componentWillUnmount() {
    this._unmounted = true;
    window.removeEventListener('resize', this.bouncedUpdate);
  }
  onClose() {
    const { navSet } = this.props;
    const { fullscreen } = this.state;
    if (fullscreen) {
      this.setState({ fullscreen: null });
    }
    navSet('secondary', null);
  }
  onUnderlay(target) {
    this.setState({ onTop: target });
  }
  onFullscreen(target) {
    const { fullscreen } = this.state;
    if (fullscreen) {
      this.setState({ fullscreen: null });
    } else {
      this.setState({ fullscreen: target });
    }
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
      sizes[0] = Math.min((width - OVERLAY_LEFT_MIN - SPACING), pMinMax[1]);
      sizes[1] = Math.min((width - OVERLAY_LEFT_MIN - SPACING), sMinMax[1]);
    }
    return sizes;
  }
  renderViewControllers() {
    const { navigation } = this.props;
    this._slackOptions = {};
    const { width, onTop, fullscreen } = this.state;

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
        transform: `translate3d(${runningX}px, 0px, 0px)`,
        zIndex: 2 - i,
      };
      runningX += (w + SPACING);
      if (isOverlay) {
        if (target === onTop) {
          style.zIndex = 3;
          xClass.push('view-container--overlay');
        } else {
          xClass.push('view-container--underlay');
        }
        if (target === 'secondary') {
          style.transform = `translate3d(${width - w - SPACING}px, 0px, 0px)`;
        }
      }
      if (fullscreen) {
        if (fullscreen === target) {
          xClass.push('view-container--fullscreen');
          style.zIndex = 4;
        } else {
          xClass.push('view-container--not-fullscreen');
        }
      }

      // If currentView is slack, ignore here and set global settings to pick up
      if (currentView && currentView.get('component') === 'Slack') {
        this._slackOptions = {
          target,
          style,
          xClass,
        };
        return undefined;
      }
      return currentView ? this.renderContent(currentView, target, style, xClass) : undefined;
    });
  }
  renderSlack() {
    const { target, style, xClass } = this._slackOptions;
    const classes = xClass || ['view-container--hidden'];
    return this.renderContent(Map({
      component: 'Slack',
      title: 'Slack',
      props: Map({
        hidden: !target,
      }),
    }), target, style, classes, 'slack');
  }
  renderCardHeader(target, canFullscreen, slack) {
    if (slack) {
      return (
        <div className="view-container__header" />
      );
    }
    const { fullscreen } = this.state;
    const closeButton = (target !== 'primary') ? (
      <Button
        small
        frameless
        onClick={this.onClose}
        icon="CloseSmall"
        className="view-container__close-button"
        key="close-button"
      />
    ) : undefined;
    const fullscreenButton = (canFullscreen) ? (
      <Button
        small
        frameless
        onClick={this.onFullscreenCached(target)}
        icon={fullscreen === target ? 'FromFullscreen' : 'ToFullscreen'}
        className="view-container__fullscreen-button"
        key="fullscreen-button"
      />
    ) : undefined;

    const hideBreadCrumbs = !closeButton;

    return (
      <div className="view-container__header">
        <HOCBreadCrumbs target={target} hidden={hideBreadCrumbs} />
        <div className="view-container__actions">
          {fullscreenButton}
          {closeButton}
        </div>
      </div>
    );
  }
  renderContent(currentView, target, style, xClasses, slack) {
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

    let canFullscreen = false;
    if (typeof View.fullscreen === 'function') {
      canFullscreen = !!View.fullscreen();
    }

    let onClick;
    if (xClasses.indexOf('view-container--underlay') !== -1) {
      onClick = this.onUnderlayCached(target);
    }
    return (
      <section
        className={className}
        key={slack || target}
        style={style}
        onClick={onClick}
      >
        {this.renderCardHeader(target, canFullscreen, slack)}
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

  render() {
    return (
      <div ref="controller" className="view-controller">
        {this.renderViewControllers()}
        {this.renderSlack()}
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
  navSet: func,
  pop: func,
};

const ConnectedHOCViewController = connect(mapStateToProps, {
  pop: actions.navigation.pop,
  push: actions.navigation.push,
  navSet: actions.navigation.set,
})(HOCViewController);
export default ConnectedHOCViewController;
