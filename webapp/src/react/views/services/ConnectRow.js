import React, { Component, PropTypes } from 'react';
import { bindAll } from 'classes/utils';

class ConnectRow extends Component {
  constructor(props) {
    super(props);
    bindAll(this, ['clickedButton']);
  }
  clickedButton() {
    this.props.clickedButton(this.props.data);
  }
  render() {
    const { title, subtitle } = this.props.data;
    const { disconnect } = this.props;
    let toggleStateClass;

    if (disconnect) {
      toggleStateClass = 'swipes-services__row__toggle--connected';
    } else {
      toggleStateClass = 'swipes-services__row__toggle--disconnected';
    }

    return (
      <div className="swipes-services__row">
        <div className={`swipes-services__row__toggle ${toggleStateClass}`} onClick={this.clickedButton} />
        <div className="swipes-services__row__info">
          <div className="swipes-services__row__info--title">{title}</div>
          <div className="swipes-services__row__info--subtitle">{subtitle}</div>
        </div>
      </div>
    );
  }
}

export default ConnectRow;

ConnectRow.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
  }),
  disconnect: PropTypes.bool,
  clickedButton: PropTypes.func,
};
