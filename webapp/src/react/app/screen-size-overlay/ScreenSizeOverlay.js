import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import SW from './ScreenSizeOverlay.swiss';

const MIN_WIDTH = 1000;
const MIN_HEIGHT = 500;

@connect(state => ({
  isDev: state.globals.get('isDev'),
}))
export default class ScreenSizeOverlay extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tooSmall: false,
    };
  }
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  updateWindowDimensions = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    if ((width < MIN_WIDTH || height < MIN_HEIGHT) && !this.state.tooSmall) {
      this.setState({ tooSmall: true });
    } else if (
      width >= MIN_WIDTH &&
      height >= MIN_HEIGHT &&
      this.state.tooSmall
    ) {
      this.setState({ tooSmall: false });
    }

    this.setState({ width, height });
  };

  render() {
    const { isDev } = this.props;
    const { tooSmall, width, height } = this.state;
    if (isDev || !tooSmall) {
      return null;
    }

    return (
      <SW.Wrapper>
        <SW.Title>Your browser window is too small :(</SW.Title>
        <SW.Subtitle>
          The minimum supported size is {MIN_WIDTH}x{MIN_HEIGHT} pixels
        </SW.Subtitle>
        <SW.CurrentSize>{`${width}x${height}`}</SW.CurrentSize>
      </SW.Wrapper>
    );
  }
}
