import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { list } from 'react-immutable-proptypes';
import SWView from 'SWView';
import Icon from 'Icon';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import { setupDelegate } from 'swipes-core-js/classes/utils';
import './styles/onboarding.scss';

const CIRCLE_LENGTH = 190;

class Onboarding extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    setupDelegate(this, 'onClick');
  }
  renderProgressBar() {
    const { items } = this.props;
    const completedItems = items.filter(i => i.get('completed'));
    const numberOfAllItems = items.size;
    const numberOfCompletedItems = completedItems.size;
    const completedPercentage = parseInt((numberOfCompletedItems * 100) / numberOfAllItems, 10);
    const svgDashOffset = CIRCLE_LENGTH - ((CIRCLE_LENGTH * completedPercentage) / 100);
    let className = 'onboarding__progress';

    if (completedPercentage === 100) {
      className += ' onboarding__progress--completed';
    }

    return (
      <div className={className}>
        <Icon
          icon="Circle"
          className="onboarding__svg"
          strokeDasharray={CIRCLE_LENGTH}
          strokeDashoffset={svgDashOffset}
        />
        <div className="onboarding__progress-number">{completedPercentage}%</div>
        <div className="onboarding__splash">
          <div className="onboarding__progress-number">{completedPercentage}%</div>
        </div>
      </div>
    );
  }
  renderHeader() {
    const title = `Let's get started, ${msgGen.users.getName('me', { disableYou: true })}`;
    return (
      <HOCHeaderTitle
        title={title}
        subtitle="We have added a few easy steps that will set you up for success."
      >
        {this.renderProgressBar()}
      </HOCHeaderTitle>
    );
  }
  renderItems() {
    const { items } = this.props;

    const itemsHTML = items.map((item, i) => {
      let className = 'onboarding__item';

      if (item.get('completed')) {
        className += ' onboarding__item--completed';
      }

      return (
        <div className={className} key={`onboarding-${i}`} onClick={this.onClick(i, item)}>
          <div className="onboarding__indicator">
            <Icon icon="Checkmark" className="onboarding__svg" />
          </div>
          <div className="onboarding__content">
            <div className="onboarding__title">{item.get('title')}</div>
            <div className="onboarding__subtitle">{item.get('subtitle')}</div>
          </div>
          <div className="onboarding__button">
            <Icon icon="ArrowRightLine" className="onboarding__svg" />
          </div>
        </div>
      );
    });

    return (
      <div className="onboarding">
        {itemsHTML}
      </div>
    );
  }
  render() {
    return (
      <SWView header={this.renderHeader()}>
        {this.renderItems()}
      </SWView>
    );
  }
}

export default Onboarding;

const { object } = PropTypes;

Onboarding.propTypes = {
  delegate: object,
  items: list,
};
