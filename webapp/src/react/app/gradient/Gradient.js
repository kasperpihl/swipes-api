import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import gradient from 'swipes-core-js/classes/gradient';
import SW from './Gradient.swiss';

@connect(state => ({
  successState: state.getIn(['main', 'successState']),
  successColor: state.getIn(['main', 'successColor']),
}))
export default class Gradient extends PureComponent {
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
      <SW.Wrapper style={styles}>
        <SW.Success color={successColor} show={show}/>
      </SW.Wrapper>
    );
  }
}
