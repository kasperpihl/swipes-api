import React, { Component } from 'react';
import { styleElement } from 'swiss-react';
import PropTypes from 'prop-types';
import { setupCachedCallback } from 'react-delegate';
import Button from 'src/react/components/button/Button';
import styles from './Confirmation.swiss';

const Wrapper = styleElement('div', styles.Wrapper);
const Title = styleElement('div', styles.Title);
const Message = styleElement('div', styles.Message);
const Actions = styleElement('div', styles.Actions);

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
          text: 'No',
        },
        {
          text: 'Yes',
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
      <Actions>
        {renderButtons}
      </Actions>
    );
  }
  render() {
    const { title, message } = this.props;
    return (
      <Wrapper>
        {title && <Title>{title}</Title>}
        {message && <Message>{message}</Message>}
        {this.renderActions()}
      </Wrapper>
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
