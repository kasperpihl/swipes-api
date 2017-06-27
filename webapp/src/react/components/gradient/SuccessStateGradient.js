import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import './style/success-gradient.scss';

class SuccessStateGradient extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { successState } = this.props;
    const gradientClass = successState ? 'success-gradient success-gradient--active' : 'success-gradient';

    return (
      <div className={gradientClass}>
        <div className="success-gradient__gradient" />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    successState: state.getIn(['main', 'successState']),
  };
}

export default connect(mapStateToProps, {

})(SuccessStateGradient);
