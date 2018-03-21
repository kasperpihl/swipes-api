import React, { Component } from 'react';
import { element } from 'react-swiss';
import PropTypes from 'prop-types';
import { setupCachedCallback } from 'swipes-core-js/classes/utils';
import Button from 'Button';

import sw from './Confirmation.swiss';

const Wrapper = element('div', sw.Wrapper);
const Title = element('div', sw.Title);
const Message = element('div', sw.Message);
const Actions = element('div', sw.Actions);

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

      return <Button primary={isLast} {...props} key={i} onClick={this.onClickCached(i)} />;
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
