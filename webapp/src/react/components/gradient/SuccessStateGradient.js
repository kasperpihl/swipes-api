import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import './style/success-gradient.scss';

class SuccessStateGradient extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activePulse: false,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.successState !== this.props.successState) {
      this.runPulse(nextProps.successState);
    }
  }
  componentWillUnmount() {
    clearTimeout(this.timer);
  }
  runPulse() {
    this.setState({ activePulse: true });
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.setState({ activePulse: false });
    }, 700);
  }
  render() {
    const { successState, successColor } = this.props;
    const { activePulse } = this.state;

    let gradientClass = 'success-gradient';
    if (activePulse) {
      gradientClass += ' success-gradient--active';
    }

    return (
      <div className={gradientClass}>
        <div className={`success-gradient__gradient success-gradient__gradient--${successColor || ''}`} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    successState: state.getIn(['main', 'successState']),
    successColor: state.getIn(['main', 'successColor']),
  };
}

export default connect(mapStateToProps, {

})(SuccessStateGradient);
