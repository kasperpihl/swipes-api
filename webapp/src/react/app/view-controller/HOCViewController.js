import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import { Map } from 'immutable';
import Button from 'Button';
import * as mainActions from 'src/redux/main/mainActions';
import * as navigationActions from 'src/redux/navigation/navigationActions';
import * as views from 'src/react/views';
import { setupCachedCallback, debounce, bindAll } from 'swipes-core-js/classes/utils';
import HOCBreadCrumbs from 'components/bread-crumbs/HOCBreadCrumbs';
import ContextWrapper from './ContextWrapper';
import './styles/view-controller';
import Modal from 'src/react/app/modal/Modal';
import prefixAll from 'inline-style-prefixer/static';

const DEFAULT_MAX_WIDTH = 800;
const SPACING = 15;
const OVERLAY_LEFT_MIN = 90;

class HOCViewController extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      appWidth: -1,
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
    bindAll(this, ['onClose', 'updateAppWidth', 'onToggleLock']);
    this.bouncedUpdateAppWidth = debounce(this.updateAppWidth, 50);
  }
  componentDidMount() {
    this.updateAppWidth();
    window.addEventListener('resize', this.bouncedUpdateAppWidth);
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
  getSizeForView(View, hasTwoViews) {
    
    if(typeof View === 'undefined') {
      return 0;
    }

    const { appWidth } = this.state;
    const spacing = hasTwoViews ? OVERLAY_LEFT_MIN : SPACING;

    if(typeof View.sizes === 'function') {
      const sizes = View.sizes();

      for(let i = sizes.length - 1 ; i >= 0 ; i--) {
        const size = sizes[i];
        if((appWidth - spacing - size) >= 0) {
          return size;
        }
      }
    }

    let maxWidth = DEFAULT_MAX_WIDTH;
    if(typeof View.maxWidth === 'function') {
      maxWidth = View.maxWidth();
    }
    return Math.min(maxWidth, appWidth - spacing);
  }
  getRemainingSpace(sizes) {
    const { appWidth } = this.state;
    return appWidth - SPACING - sizes.reduce((c, b) => c + b);
  }

  updateAppWidth() {
    if (!this._unmounted) {
      this.setState({ appWidth: this.refs.controller.clientWidth });
    }
  }
  renderViewControllers() {
    const { navigation } = this.props;
    const { appWidth, onTop, fullscreen } = this.state;
    if(appWidth === -1) return null;


    // Primary view
    const pView = navigation.getIn(['primary', 'stack']).last();
    const PView = views[(pView && pView.get('id'))] || views.NotFound;

    // Secondary view
    const sView = navigation.getIn(['secondary', 'stack']).last();
    const SView = sView ? (views[sView.get('id')] || views.NotFound) : undefined;

    const hasTwo = !!SView;
    const sizes = [this.getSizeForView(PView, hasTwo), this.getSizeForView(SView, hasTwo)];

    const remainingSpace = this.getRemainingSpace(sizes);
    const isOverlay = (SView && (remainingSpace < 0));

    let runningX = isOverlay ? 0 : remainingSpace / 2;
    return [pView, sView].map((currentView, i) => {

      const width = sizes[i];
      const options = {
        view: currentView,
        target: (i === 0) ? 'primary' : 'secondary',
        classes: [],
        width,
        styles: {
          width: `${width}px`,
          transform: `translate3d(${parseInt(runningX, 10)}px, 0px, 0px)`,
          zIndex: 2 - i,
        }
      };

      runningX += (width + SPACING);

      if (isOverlay) {
        let top = 0;
        let left = 0;
        if (options.target === onTop) {
          options.styles.zIndex = 3;
          options.classes.push('view-container--overlay');
        } else {
          options.classes.push('view-container--underlay');
          top = 20;
        }
        if (options.target === 'secondary') {
          left = appWidth - width - SPACING;
        }
        options.styles.transform = `translate3d(${parseInt(left, 10)}px, ${top}px, 0px)`;
      }
      if (fullscreen) {
        if (fullscreen === options.target) {
          options.classes.push('view-container--fullscreen');
          options.styles.zIndex = 4;
        } else {
          options.classes.push('view-container--not-fullscreen');
        }
      }

      return this.renderContent(options);
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

    return (
      <div className="view-container__header">
        <HOCBreadCrumbs target={target} />
        <div className="view-container__actions">
          {fullscreenButton}
          {lockButton}
          {closeButton}
        </div>
      </div>
    );
  }
  renderContent(options) {
    if(!options.view) {
      return undefined;
    }

    const { navigation } = this.props;

    const { target, classes } = options;
    const View = views[options.view.get('id')] || views.NotFound;
    let props = {};
    if (options.view.get('props')) {
      props = options.view.get('props').toObject();
    }

    const className = ['view-container', `view-container--${target}`].concat(classes).join(' ');

    let canFullscreen = false;
    if (typeof View.fullscreen === 'function') {
      canFullscreen = !!View.fullscreen();
    }

    let onClick;
    if (classes.indexOf('view-container--underlay') !== -1) {
      onClick = this.onUnderlayCached(target);
    }
    return (
      <ContextWrapper
        target={target}
        key={target}
        viewWidth={options.width}
        navPop={this.onPopCached(target)}
        navPush={this.onPushCached(target)}
        saveState={this.onSaveState(target)}
        openSecondary={this.onOpenSecondary(target)}
        popSecondary={this.onPopCached('secondary')}
        openModal={this.onOpenModalCached(target)}
      >
        <section
          className={className}
          style={prefixAll(options.styles)}
          onClick={onClick}
        >
          {this.renderCardHeader(target, canFullscreen)}
          <View
            delegate={this}
            key={navigation.getIn([target, 'id']) + navigation.getIn([target, 'stack']).size}
            {...props}
          />
          <Modal target={target} />
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
  pop: navigationActions.pop,
  push: navigationActions.push,
  modal: mainActions.modal,
  toggleLock: navigationActions.toggleLock,
  openSecondary: navigationActions.openSecondary,
  saveState: navigationActions.saveState,
  navSet: navigationActions.set,
})(HOCViewController);
export default ConnectedHOCViewController;
