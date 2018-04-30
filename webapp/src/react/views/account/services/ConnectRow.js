import React, { Component } from 'react';

class ConnectRow extends Component {
  clickedButton = () => {
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
