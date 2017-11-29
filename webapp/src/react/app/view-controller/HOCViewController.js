import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import { Map } from 'immutable';
import Button from 'Button';
import * as a from 'actions';
import * as views from 'views';
import { setupCachedCallback, debounce, bindAll } from 'swipes-core-js/classes/utils';
import HOCBreadCrumbs from 'components/bread-crumbs/HOCBreadCrumbs';
import ContextWrapper from './ContextWrapper';
import './styles/view-controller';
import HOCModal from './HOCModal';
import prefixAll from 'inline-style-prefixer/static';

const DEFAULT_MIN_WIDTH = 500;
const DEFAULT_MAX_WIDTH = 800;
const SPACING = 20;
const OVERLAY_LEFT_MIN = 120;

class HOCViewController extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      width: 1200,
      onTop: 'secondary',
      fullscreen: null,
    };
    this.onPopCached = setupCachedCallback(props.pop, this);
    this.onPushCached = setupCachedCallback(props.push, this);
    this.onOpenModalCached = setupCachedCallback(props.modal, this);
    this.onOpenSecondary = setupCachedCallback(props.openSecondary, this);
    this.onSaveState = setupCachedCallback(props.saveState, this);
    this.onUnderlayCached = setupCachedCallback(this.onUnderlay, this);
    this.onFullscreenCached = setupCachedCallback(this.onFullscreen, this);
    bindAll(this, ['onClose', 'updateWidth', 'onToggleLock']);
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
    this.setState({ onTop: 'primary' });
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
  onToggleLock() {
    const { toggleLock } = this.props;
    toggleLock();
  }
  getSizeForView(View) {

    if(typeof View === 'undefined') {
      return 0;
    }

    const { width } = this.state;
    if(typeof View.sizes === 'function') {
      const sizes = View.sizes();

      for(let i = sizes.length - 1 ; i >= 0 ; i--) {
        const size = sizes[i];
        if((width - OVERLAY_LEFT_MIN - size) >= 0) {
          return size;
        }
      }
    }

    let maxWidth = DEFAULT_MAX_WIDTH;
    if(typeof View.maxWidth === 'function') {
      maxWidth = View.maxWidth();
    }
    return Math.min(maxWidth, width - OVERLAY_LEFT_MIN);
  }
  getRemainingSpace(sizes) {
    const { width } = this.state;
    let spacing = SPACING;
    if (sizes[1] > 0) {
      spacing += SPACING;
    }
    return width - spacing - sizes.reduce((c, b) => c + b);
  }

  updateWidth() {
    if (!this._unmounted) {
      this.setState({ width: this.refs.controller.clientWidth });
    }
  }
  renderViewControllers() {
    const { navigation } = this.props;
    const { width, onTop, fullscreen } = this.state;

    // Primary view
    const pView = navigation.getIn(['primary', 'stack']).last();
    const PView = views[(pView && pView.get('id'))] || views.NotFound;

    // Secondary view
    const sView = navigation.getIn(['secondary', 'stack']).last();
    const SView = sView ? (views[sView.get('id')] || views.NotFound) : undefined;

    const sizes = [this.getSizeForView(PView), this.getSizeForView(SView)];

    const remainingSpace = this.getRemainingSpace(sizes);
    const isOverlay = (SView && (remainingSpace < 0));

    let runningX = isOverlay ? 0 : remainingSpace / 2;
    return [pView, sView].map((currentView, i) => {
      const target = (i === 0) ? 'primary' : 'secondary';
      const xClass = [];
      const w = sizes[i];
      const style = {
        width: `${w}px`,
        transform: `translate3d(${parseInt(runningX, 10)}px, 0px, 0px)`,
        zIndex: 2 - i,
      };
      runningX += (w + SPACING);
      if (isOverlay) {
        let top = 0;
        let left = 0;
        if (target === onTop) {
          style.zIndex = 3;
          xClass.push('view-container--overlay');
        } else {
          xClass.push('view-container--underlay');
          top = 20;
        }
        if (target === 'secondary') {
          left = width - w - SPACING;
        }
        style.transform = `translate3d(${parseInt(left, 10)}px, ${top}px, 0px)`;
      }
      if (fullscreen) {
        if (fullscreen === target) {
          xClass.push('view-container--fullscreen');
          style.zIndex = 4;
        } else {
          xClass.push('view-container--not-fullscreen');
        }
      }

      return currentView ? this.renderContent(currentView, target, style, xClass) : undefined;
    });
  }
  renderCardHeader(target, canFullscreen) {
    const { fullscreen } = this.state;
    const { navigation } = this.props;
    const closeButton = (target !== 'primary' && !navigation.get('locked')) ? (
      <Button
        small
        frameless
        onClick={this.onClose}
        icon="CloseSmall"
        className="view-container__close-button"
        key="close-button"
      />
    ) : undefined;
    const lockButton = (target !== 'primary') ? (
      <Button
        small
        frameless
        onClick={this.onToggleLock}
        icon={navigation.get('locked') ? 'WindowLock' : 'WindowUnlock'}
        className="view-container__lock-button"
        key="lock-button"
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

    const hideBreadCrumbs = !closeButton && !lockButton && !fullscreenButton;

    return (
      <div className="view-container__header">
        <HOCBreadCrumbs target={target} hidden={hideBreadCrumbs} />
        <div className="view-container__actions">
          {fullscreenButton}
          {lockButton}
          {closeButton}
        </div>
      </div>
    );
  }
  renderContent(currentView, target, style, xClasses) {
    const { navigation } = this.props;
    const View = views[currentView.get('id')] || views.NotFound;
    let props = {};
    if (currentView.get('props')) {
      props = currentView.get('props').toObject();
    }

    const className = ['view-container', `view-container--${target}`].concat(xClasses).join(' ');

    let canFullscreen = false;
    if (typeof View.fullscreen === 'function') {
      canFullscreen = !!View.fullscreen();
    }

    let onClick;
    if (xClasses.indexOf('view-container--underlay') !== -1) {
      onClick = this.onUnderlayCached(target);
    }
    return (
      <ContextWrapper
        target={target}
        key={target}
        navPop={this.onPopCached(target)}
        navPush={this.onPushCached(target)}
        saveState={this.onSaveState(target)}
        openSecondary={this.onOpenSecondary(target)}
        popSecondary={this.onPopCached('secondary')}
        openModal={this.onOpenModalCached(target)}
      >
        <section
          className={className}
          style={prefixAll(style)}
          onClick={onClick}
        >
          {this.renderCardHeader(target, canFullscreen)}
          <View
            delegate={this}
            key={navigation.getIn([target, 'id']) + navigation.getIn([target, 'stack']).size}
            {...props}
          />
          <HOCModal target={target} />
        </section>
      </ContextWrapper>
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
  saveState: func,
  openSecondary: func,
  toggleLock: func,
  push: func,
  navSet: func,
  pop: func,
};

const ConnectedHOCViewController = connect(mapStateToProps, {
  pop: a.navigation.pop,
  push: a.navigation.push,
  modal: a.main.modal,
  toggleLock: a.navigation.toggleLock,
  openSecondary: a.navigation.openSecondary,
  saveState: a.navigation.saveState,
  navSet: a.navigation.set,
})(HOCViewController);
export default ConnectedHOCViewController;
