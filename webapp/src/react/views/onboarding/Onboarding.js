import React, { PureComponent } from 'react';
// import { map, list } from 'react-immutable-proptypes';
import SWView from 'SWView';
import Icon from 'Icon';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import './styles/onboarding.scss';

class Onboarding extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
  }
  renderProgressBar() {
    return undefined;
  }
  renderHeader() {
    return (
      <HOCHeaderTitle title="Getting started" subtitle="Welcome to your workspace. There are couple of things to learn before you start." >
        {this.renderProgressBar()}
      </HOCHeaderTitle>
    );
  }
  renderItems() {
    const { items } = this.props;

    const itemsHTML = items.map((item, i) => {
      let className = 'onboarding__item';

      if (item.completed) {
        className += ' onboarding__item--completed';
      }

      return (
        <div className={className} key={`onboarding-${i}`}>
          <div className="onboarding__indicator">
            <Icon icon="Checkmark" className="onboarding__svg" />
          </div>
          <div className="onboarding__content">
            <div className="onboarding__title">{item.title}</div>
            <div className="onboarding__subtitle">{item.subtitle}</div>
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
    const { items } = this.props;
    return (
      <SWView header={this.renderHeader()}>
        {this.renderItems()}
      </SWView>
    );
  }
}

export default Onboarding;

// const { string } = PropTypes;

Onboarding.propTypes = {};
