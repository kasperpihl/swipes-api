import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { setupCachedCallback } from 'react-delegate';
import Button from 'src/react/components/Button/Button';
import SW from './Confirmation.swiss';

class Confirmation extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onClickCached = setupCachedCallback(props.onClick, this);
  }
  renderActions() {
    let { actions } = this.props;

    if (!actions) {
      actions = [
        {
          title: 'No',
        },
        {
          title: 'Yes',
        },
      ];
    }

    const renderButtons = actions.map((a, i) => {
      const props = {
        ...a,
      };

      const isLast = (actions.length - 1) === i;

      return <Button {...props} key={i} onClick={this.onClickCached(i)} />;
    });

    return (
      <SW.Actions>
        {renderButtons}
      </SW.Actions>
    );
  }
  render() {
    const { title, message } = this.props;
    return (
      <SW.Wrapper>
        {title && <SW.Title>{title}</SW.Title>}
        {message && <SW.Message>{message}</SW.Message>}
        {this.renderActions()}
      </SW.Wrapper>
    );
  }
}

export default Confirmation;

const { string, array, func } = PropTypes;

Confirmation.propTypes = {
  title: string,
  onClick: func,
  message: string,
  actions: array,
};
