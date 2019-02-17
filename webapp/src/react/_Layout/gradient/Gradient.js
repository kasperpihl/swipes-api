import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import SW from './Gradient.swiss';

@connect(state => ({
  successState: state.main.get('successState'),
  successColor: state.main.get('successColor')
}))
export default class Gradient extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      isNight: this.determineNight()
    };
  }
  componentDidMount() {
    this.periodicallyCheck();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.successState !== this.props.successState) {
      this.runPulse(nextProps);
    }
  }
  componentWillUnmount() {
    clearTimeout(this.pulseTimer);
    clearTimeout(this.dayTimer);
    window.cancelAnimationFrame(this.animationFrame);
  }
  periodicallyCheck = () => {
    clearTimeout(this.dayTimer);

    const { isNight } = this.state;
    const newNight = this.determineNight();
    console.log('checking', newNight);
    this.setState({ isNight: !isNight });
    if (isNight !== newNight) {
      // this.setState({ isNight: newNight });
    }
    this.dayTimer = setTimeout(this.periodicallyCheck, 4000);
  };
  determineNight() {
    const hours = new Date().getHours();
    return hours < 8 || hours >= 18;
  }
  runPulse(nextProps) {
    this.setState({ show: true });
    clearTimeout(this.pulseTimer);
    this.pulseTimer = setTimeout(() => {
      this.setState({ show: false });
    }, 700);
  }
  render() {
    const { show, isNight } = this.state;
    const { successColor } = this.props;
    return (
      <SW.Wrapper isNight={isNight}>
        <SW.Success color={successColor} show={show} />
      </SW.Wrapper>
    );
  }
}
