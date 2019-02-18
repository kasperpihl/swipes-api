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
  }
  periodicallyCheck = () => {
    clearTimeout(this.dayTimer);
    const { isNight } = this.state;
    const newNight = this.determineNight();
    if (isNight !== newNight) {
      this.setState({ isNight: newNight });
    }
    this.dayTimer = setTimeout(this.periodicallyCheck, 30000);
  };
  determineNight() {
    const hours = new Date().getHours();
    return hours < 8 || hours >= 18;
  }
  runPulse() {
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
