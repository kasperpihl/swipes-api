import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import GoalsUtil from 'swipes-core-js/classes/goals-util';

import * as menuActions from 'src/redux/menu/menuActions';
import * as ca from 'swipes-core-js/actions';

import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import HOCDiscussButton from 'components/discuss-button/HOCDiscussButton';
import InfoButton from 'components/info-button/InfoButton';
import HOCAssigning from 'src/react/components/assigning/HOCAssigning';

import SW from './GoalHeader.swiss';

@connect(state => ({
  myId: state.me.get('id'),
}), {
  renameGoal: ca.goals.rename,
  inputMenu: menuActions.input,
})
export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillUnmount() {
    this.unmounted = true;
  }
  getHelper() {
    const { goal, myId } = this.props;
    return new GoalsUtil(goal, myId);
  }
  onTitleClick(e) {
    const { goal, renameGoal, inputMenu } = this.props;

    inputMenu({
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'right',
      text: goal.get('title'),
      buttonLabel: 'Rename',
    }, (title) => {
      if (title !== goal.get('title') && title.length) {
        this.setState({ tempTitle: title });
        renameGoal(goal.get('id'), title).then(() => {
          !this.unmounted && this.setState({ tempTitle: null });
        });
      }
    });
  }
  render() {
    const { goal, showLine, delegate, dotsLoading } = this.props;
    const { tempTitle } = this.state;
    const helper = this.getHelper();
    return (
      <SW.Wrapper showLine={showLine}>
        <HOCHeaderTitle
          title={tempTitle || goal.get('title')}
          delegate={this}
        >
          <HOCAssigning
            assignees={helper.getAssignees()}
            delegate={delegate}
            maxImages={5}
            size={30}
            tooltipAlign="bottom"
            enableTooltip
          />
          <HOCDiscussButton
            context={{
              id: goal.get('id'),
              title: goal.get('title'),
            }}
            relatedFilter={msgGen.goals.getRelatedFilter(goal)}
            taggedUsers={helper.getAssigneesButMe().toArray()}
          />
          <InfoButton
            delegate={delegate}
            {...dotsLoading}
          />
        </HOCHeaderTitle>
      </SW.Wrapper>
    );
  }
}
