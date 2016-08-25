import React, { Component, PropTypes } from 'react'
import gradient from '../topbar/gradient'
import './swipes-loader.scss'
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
      className += " center";
    }
    return (
      <div className={className} style={style}>
        <svg viewBox="0 0 60 45" className="sw-loader__svg">
          <defs>
            <clipPath id="sw-loader-clip">
  					  <path d="M51.7080002,16.5839996 L51.7080002,16.5839996 C50.9400002,16.1999996 50.0930002,15.9999996 49.2345002,15.9999996 L16.584501,15.9999996 C15.772501,15.9999996 15.044501,15.3914997 15.002001,14.5804997 C14.957001,13.7149997 15.645001,12.9999997 16.500001,12.9999997 L51.8750002,12.9999997 L60,0 L15.321001,0 C6.93250117,0 -0.136498672,6.86449985 0.00200132518,15.2519997 C0.0970013231,21.0174995 3.44700125,25.9884994 8.29200114,28.4159994 C8.29650114,28.4179994 8.30050114,28.4204994 8.30500114,28.4224994 C9.09700112,28.8179994 9.9780011,28.9999994 10.8630011,28.9999994 L43.5000004,28.9999994 C44.3125003,28.9999994 45.0405003,29.6084993 45.0825003,30.4199993 C45.1275003,31.2849993 44.4395003,31.9999993 43.5845004,31.9999993 L8.12500115,31.9999993 L1.32522384e-06,44.999999 L44.6790003,44.999999 C53.0675002,44.999999 60.136,38.1354992 59.998,29.7479993 C59.903,23.9829995 56.5530001,19.0114996 51.7080002,16.5839996"></path>
            </clipPath>
          </defs>
        </svg>
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
