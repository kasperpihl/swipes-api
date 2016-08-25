import React, { Component, PropTypes } from 'react'
import gradient from './topbar/gradient'
import './test.scss'

class Test extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
    const startTime = new Date().getTime();
    let elapsedTime = 0;
    setInterval(() => {
      elapsedTime = new Date().getTime() - startTime;
      let percent = gradient.percentOfValue(elapsedTime, 10000);
      this.setState({gradientPos: percent});
    }, 5);
  }
  render() {
    var styles = gradient.getGradientStyles();

    if(this.state.gradientPos) {
      styles.backgroundPosition = this.state.gradientPos + '% 50%';
    }
    return (
      <div className="test-stuff" style={styles}></div>
    )
  }
}
export default Test