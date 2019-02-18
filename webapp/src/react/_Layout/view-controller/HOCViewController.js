import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as views from 'src/react/registerScreens';
import * as mainActions from 'src/redux/main/mainActions';
import throttle from 'swipes-core-js/utils/throttle';
import NavProvider from 'src/react/_hocs/Nav/NavProvider';
import Card from 'src/react/_Layout/Card/Card';
import SW from './ViewController.swiss';
import ErrorBoundary from 'src/react/_Layout/ErrorBoundary/ErrorBoundary';

const DEFAULT_MAX_WIDTH = 800;
const SPACING = 15;
const OVERLAY_LEFT_MIN = 90;
const kSidebarExpandedThreshold = 100; // pixels that sidebar needs to be expanded

@connect(
  state => ({
    navigation: state.navigation
  }),
  {
    sidebarSetExpanded: mainActions.sidebarSetExpanded
  }
)
export default class extends PureComponent {
  state = {
    appWidth: -1
  };
  componentDidMount() {
    this.updateAppWidth();
    this.updateSidebarExpanded();
    window.addEventListener('resize', this.updateAppWidth);
  }
  componentDidUpdate() {
    this.updateSidebarExpanded();
  }
  componentWillUnmount() {
    this._unmounted = true;
    window.removeEventListener('resize', this.updateAppWidth);
  }
  updateSidebarExpanded() {
    const { sidebarSetExpanded } = this.props;
    if (typeof this._sidebarExpanded === 'boolean') {
      sidebarSetExpanded(this._sidebarExpanded);
    }
  }
  handleToggleLock = () => {
    const { toggleLock } = this.props;
    toggleLock();
  };
  getSizeForComp(Comp, hasTwoViews) {
    if (!Comp) {
      return 0;
    }

    const { appWidth } = this.state;
    const spacing = hasTwoViews ? OVERLAY_LEFT_MIN : SPACING;

    if (Array.isArray(Comp.sizes)) {
      const sizes = Comp.sizes;

      for (let i = sizes.length - 1; i >= 0; i--) {
        const size = sizes[i];
        if (appWidth - spacing - size >= 0) {
          return size;
        }
      }
    }

    let maxWidth = DEFAULT_MAX_WIDTH;
    if (typeof Comp.maxWidth === 'function') {
      maxWidth = Comp.maxWidth();
    }
    return Math.min(maxWidth, appWidth - spacing);
  }

  updateAppWidth = throttle(() => {
    if (!this._unmounted) {
      this.setState({ appWidth: this.wrapperRef.clientWidth });
    }
  }, 50);
  getScreen(side) {
    const { navigation } = this.props;
    const screen = navigation.get(side).last();
    if (!screen) {
      return [null, null];
    }
    const Comp = views[screen && screen.get('screenId')] || views.NotFound;
    const props = screen.get('props') && screen.get('props').toObject();
    return [Comp, props];
  }
  renderViewControllers() {
    const { appWidth } = this.state;
    const onTopSide = this.props.navigation.get('onTopSide');
    if (appWidth === -1) return null;

    const [LeftComp, leftProps] = this.getScreen('left');
    const [RightComp, rightProps] = this.getScreen('right');
    const sizes = [
      this.getSizeForComp(LeftComp, !!RightComp),
      this.getSizeForComp(RightComp, !!RightComp)
    ];

    const remainingSpace = appWidth - SPACING - sizes[0] - sizes[1];
    const hasOverlay = RightComp && remainingSpace < 0;
    console.log(sizes, appWidth, remainingSpace, hasOverlay);

    const startX = hasOverlay ? 0 : remainingSpace / 2;
    this._sidebarExpanded = startX > kSidebarExpandedThreshold;

    return (
      <>
        {this.renderSide('left', {
          Comp: LeftComp,
          props: leftProps,
          width: sizes[0],
          cardProps: {
            left: hasOverlay ? 0 : startX,
            isOverlay: hasOverlay && onTopSide === 'left',
            isUnderlay: hasOverlay && onTopSide !== 'left'
          }
        })}
        {RightComp &&
          this.renderSide('right', {
            Comp: RightComp,
            props: rightProps,
            width: sizes[1],
            cardProps: {
              left: hasOverlay
                ? appWidth - sizes[1] - SPACING
                : startX + sizes[0] + SPACING,
              isOverlay: hasOverlay && onTopSide === 'right',
              isUnderlay: hasOverlay && onTopSide !== 'right'
            }
          })}
      </>
    );
  }
  renderSide(side, { Comp, width, props, cardProps }) {
    const { navigation } = this.props;
    const screenId = navigation
      .get(side)
      .last()
      .get('screenId');

    const key = side + screenId + navigation.get(side).size;
    return (
      <NavProvider
        isLocked={side === 'right' && navigation.get('locked')}
        side={side}
        width={width}
        key={side}
      >
        <Card {...cardProps}>
          <ErrorBoundary key={key}>
            <Comp key={key} {...props} />
          </ErrorBoundary>
        </Card>
      </NavProvider>
    );
  }

  render() {
    return (
      <SW.Wrapper innerRef={c => (this.wrapperRef = c)}>
        {this.renderViewControllers()}
      </SW.Wrapper>
    );
  }
}
