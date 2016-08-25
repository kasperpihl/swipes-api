import React, { Component, PropTypes } from 'react'
import gradient from '../topbar/gradient'
import './swipes-loader.scss'
import LogoSVG from './images/sw-logo-loader.svg'
const DEFAULT_SIZE = 60;

class SwipesLoader extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentWillUnmount(){
    clearInterval(this.interval);
  }
  componentDidMount() {
    const startTime = new Date().getTime();
    let elapsedTime = 0;
    this.interval = setInterval(() => {
      elapsedTime = new Date().getTime() - startTime;
      let percent = gradient.percentOfValue(elapsedTime, 10000);
      this.setState({gradientPos: percent});
    }, 5);
  }
  render() {
    let styles = gradient.getGradientStyles();
    const { size, style, center } = this.props;

    if(this.state.gradientPos) {
      styles.backgroundPosition = this.state.gradientPos + '% 50%';
    }

    if ( size ) {
      const scale = size / DEFAULT_SIZE;
      styles.transform = 'scale( ' + scale + ')';
    }

    let className = "sw-loader-wrap";
    if(center){
      className += " sw-loader-wrap--center";
    }
    return (
      <div className={className} style={style}>
        <LogoSVG />
        <div className="sw-loader" style={styles}></div>
      </div>
    )
  }
}

export default SwipesLoader

SwipesLoader.propTypes = {
  size: PropTypes.number,
  center: PropTypes.bool
}
