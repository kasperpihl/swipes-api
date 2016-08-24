import React, { Component, PropTypes } from 'react'
import { bindAll } from '../../classes/utils'

class ConnectRow extends Component {
  constructor(props) {
    super(props)
    bindAll(this, ['clickedButton'])
  }
  clickedButton() {
    this.props.clickedButton(this.props.data);
  }
  render() {
    const { title, subtitle } = this.props.data;
    const { disconnect } = this.props;

    let className = 'services-row ';
    className += disconnect ? 'connected' : 'connect';
    const buttonTitle = disconnect ? 'Disconnect' : 'Connect';

    return (
      <div className={className}>
        <h6>{title} <p>{subtitle}</p></h6>
        <div className="services-button" onClick={this.clickedButton}>{buttonTitle}</div>
      </div>
    )
  }
}
export default ConnectRow

ConnectRow.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string
  }),
  disconnect: PropTypes.bool,
  clickedButton: PropTypes.func
}