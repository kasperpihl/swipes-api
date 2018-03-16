import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import gradient from 'swipes-core-js/classes/gradient';
import { element } from 'react-swiss';
import sw from './Gradient.swiss';

const GradientWrapper = element('div', sw.GradientWrapper);
const SuccessGradient = element('div', sw.SuccessGradient);

class Gradient extends PureComponent {
  constructor(props) {
    super(props);
    const gradientPos = gradient.getGradientPos();
    this.state = {
      gradientPos,
      show: false,
    };
    this.gradientStep = this.gradientStep.bind(this);
  }
  componentDidMount() {
    this.gradientStep();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.successState !== this.props.successState) {
      this.runPulse(nextProps);
    }
  }
  componentWillUnmount() {
    clearTimeout(this.timer);
    window.cancelAnimationFrame(this.animationFrame);
  }
  runPulse(nextProps) {
    this.setState({ show: true });
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.setState({ show: false });
    }, 700);
  }
  gradientStep() {
    const gradientPos = gradient.getGradientPos();

    if (this.state.gradientPos !== gradientPos) {
      this.setState({ gradientPos });
    }

    this.animationFrame = window.requestAnimationFrame(this.gradientStep);
  }
  render() {
    const { show, gradientPos } = this.state;
    const { successColor } = this.props;
    let styles = gradient.getGradientStyles();

    if (gradientPos) {
      styles.backgroundPosition = `${gradientPos}% 50%`;
    }

    return (
      <GradientWrapper style={styles}>
        <SuccessGradient color={successColor} show={show}/>
      </GradientWrapper>
    );
  }
}

export default connect(state => ({
  successState: state.getIn(['main', 'successState']),
  successColor: state.getIn(['main', 'successColor']),
}), null)(Gradient);
