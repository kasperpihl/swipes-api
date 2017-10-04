import React, { PureComponent } from 'react';
import gradient from 'swipes-core-js/classes/gradient';

import './style/gradient.scss';

class Gradient extends PureComponent {
  constructor(props) {
    super(props);
    const gradientPos = gradient.getGradientPos();
    this.state = {
      gradientPos,
    };
    this.gradientStep = this.gradientStep.bind(this);
  }
  componentDidMount() {
    this.gradientStep();
  }
  componentWillUnmount() {
    window.cancelAnimationFrame(this.animationFrame);
  }
  gradientStep() {
    const gradientPos = gradient.getGradientPos();

    if (this.state.gradientPos !== gradientPos) {
      this.setState({ gradientPos });
    }

    this.animationFrame = window.requestAnimationFrame(this.gradientStep);
  }
  render() {
    let styles = gradient.getGradientStyles();

    if (this.state.gradientPos) {
      styles.backgroundPosition = `${this.state.gradientPos}% 50%`;
    }

    return (
      <div className="gradient-bg" style={styles} />
    );
  }
}

export default Gradient;
