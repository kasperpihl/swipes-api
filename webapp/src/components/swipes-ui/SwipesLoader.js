import React, { Component, PropTypes } from 'react'
import gradient from '../topbar/gradient'
import './styles/swipes-loader.scss'
import { LogoLoader } from '../icons'
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
    }, 15);
  }
  renderText(text, textStyle) {
    if(text && text.length) {
      return <div className="sw-loader-wrap__text" style={{textStyle}}>{text}</div>
    }
  }
  render() {
    let styles = gradient.getGradientStyles();
    const { size, style, center, text, textStyle } = this.props;

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
        <LogoLoader className="loader-clippath"/>
        <div className="sw-loader" style={styles}></div>
        {this.renderText(text, textStyle)}
      </div>
    )
  }
}

export default SwipesLoader

SwipesLoader.propTypes = {
  size: PropTypes.number,
  center: PropTypes.bool
}
