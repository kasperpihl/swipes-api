import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { styleElement } from 'swiss-react';

import styles from './ScreenSizeOverlay.swiss';

const Wrapper = styleElement('div', styles.Wrapper);
const Title = styleElement('div', styles.Title);
const Subtitle = styleElement('div', styles.Subtitle);
const CurrentSize = styleElement('div', styles.CurrentSize);

const MIN_WIDTH = 1000;
const MIN_HEIGHT = 600;

class ScreenSizeOverlay extends PureComponent {
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
      this.setState({ tooSmall: true })
    } else if ((width >= MIN_WIDTH && height >= MIN_HEIGHT) && this.state.tooSmall) {
      this.setState({ tooSmall: false })
    }

    this.setState({ width, height });
  }

  render() {
    const { isDev } = this.props;
    const { tooSmall, width, height } = this.state;
    if(isDev || !tooSmall) {
     return null;
    }

    return (
      <Wrapper>
        <Title>
          Your browser window is too small :(
        </Title>
        <Subtitle>
          The minimum supported size is {MIN_WIDTH}x{MIN_HEIGHT} pixels
        </Subtitle>
        <CurrentSize>
          {`${width}x${height}`}
        </CurrentSize>
      </Wrapper>
    );
  }
}

export default connect(state => ({
  isDev: state.getIn(['globals', 'isDev']),
}))(ScreenSizeOverlay);

