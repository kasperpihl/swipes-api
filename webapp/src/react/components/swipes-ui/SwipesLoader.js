import React, { Component, PropTypes } from 'react';
import gradient from 'src/react/app/topbar/gradient';
import Icon from 'Icon';
import './styles/swipes-loader.scss';

const DEFAULT_SIZE = 60;

class SwipesLoader extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const startTime = new Date().getTime();
    let elapsedTime = 0;
    this.interval = setInterval(() => {
      elapsedTime = new Date().getTime() - startTime;
      const percent = gradient.percentOfValue(elapsedTime, 10000);
      this.setState({ gradientPos: percent });
    }, 15);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  renderText(text, textStyle) {
    if (!text || !text.length) {
      return undefined;
    }
    return <div className="sw-loader-wrap__text" style={{ textStyle }}>{text}</div>;
  }
  render() {
    const styles = gradient.getGradientStyles();
    const { size, style, center, text, textStyle } = this.props;

    if (this.state.gradientPos) {
      styles.backgroundPosition = `${this.state.gradientPos}% 50%`;
    }

    if (size) {
      const scale = size / DEFAULT_SIZE;
      styles.transform = `scale( ${scale})`;
    }

    let className = 'sw-loader-wrap';
    if (center) {
      className += ' sw-loader-wrap--center';
    }
    return (
      <div className={className} style={style}>
        <Icon svg="LogoLoader" className="loader-clippath" />
        <div className="sw-loader" style={styles} />
        {this.renderText(text, textStyle)}
      </div>
    );
  }
}

export default SwipesLoader;

SwipesLoader.propTypes = {
  size: PropTypes.number,
  center: PropTypes.bool,
};
