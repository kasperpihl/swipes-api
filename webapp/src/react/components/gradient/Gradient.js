import React, { Component, PropTypes } from 'react';
import gradient from 'classes/gradient';

class Gradient extends Component {
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
    const styles = gradient.getGradientStyles();

    if (this.state.gradientPos) {
      styles.backgroundPosition = `${this.state.gradientPos}% 50%`;
    }

    return (
      <div className="gradient-bg" style={styles}>
        <div className="gradient-bg__gradient" style={styles} />
      </div>
    );
  }
}

export default Gradient;

const { string } = PropTypes;

Gradient.propTypes = {

};
