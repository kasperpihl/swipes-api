import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List } from 'immutable';
import * as ca from 'swipes-core-js/actions';
import * as cs from 'swipes-core-js/selectors';
import { setupLoading } from 'swipes-core-js/classes/utils';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import PlanList from './PlanList';

const emptyList = List();
const DISTANCE = 200;

class HOCPlanList extends PureComponent {
  static sizes() {
    return [654, 954];
  }
  constructor(props) {
    super(props);
    const { savedState } = props;
    const initialScroll = (savedState && savedState.get('scrollTop')) || 0;
    const initialLimit = (savedState && savedState.get('limit')) || 15;
    this.state = {
      limit: initialLimit,
      initialScroll,
    };
    this.lastEnd = 0;
    setupLoading(this);
  }
  componentWillMount() {
    const { savedState } = this.props;
    const initialTabIndex = (savedState && savedState.get('tabIndex')) || 0;
    this.setState({
      tabs: ['Current plans', 'Achieved'],
      tabIndex: initialTabIndex,
    });
  }
  onScroll(e) {
    this._scrollTop = e.target.scrollTop;
    if (e.target.scrollTop > e.target.scrollHeight - e.target.clientHeight - DISTANCE) {
      if (this.lastEnd < e.target.scrollTop + DISTANCE) {
        this.setState({ limit: this.state.limit + 15 });
        this.lastEnd = e.target.scrollTop;
      }
    }
  }
  onOpenMilestone(milestoneId) {
    const { navPush } = this.props;
    this.saveState();
    navPush({
      id: 'PlanOverview',
      title: 'Plan overview',
      props: {
        milestoneId,
      },
    });
  }
  onAddMilestone(title) {
    const { createMilestone } = this.props;
    if (title && title.length && !this.isLoading('add')) {
      this.setLoading('add');
      createMilestone(title).then((res) => {
        if (res && res.ok) {
          this.clearLoading('add');
          window.analytics.sendEvent('Plan created', {});
        } else {
          this.clearLoading('add', '!Something went wrong');
        }
      });
    }
  }
  saveState() {
    const { saveState } = this.props;
    const { limit, tabIndex } = this.state;

    const savedState = {
      limit,
      scrollTop: this._scrollTop,
      tabIndex,
    }; // state if this gets reopened
    saveState(savedState);
  }
  tabDidChange(index) {
    const { tabIndex } = this.state;
    if (tabIndex !== index) {
      this.setState({
        tabIndex: index,
      });
    }
  }
  getInfoTabProps() {
    return {
      about: {
        title: 'What is Plan',
        text: 'Plan is one of the 3 main sections of the Workspace: Plan, Take Action and Discuss.\n\nHere you can make plans for your team and track the progress you are making. Plans can be projects, company objectives or ongoing company activities.',
      },
    }
  }
  render() {
    const { milestones } = this.props;
    const { tabs, tabIndex, limit, initialScroll } = this.state;

    return (
      <PlanList
        delegate={this}
        limit={limit}
        initialScroll={initialScroll}
        milestones={milestones.get(tabs[tabIndex])}
        tabs={tabs.map((t) => {
          const size = milestones.get(t).size;
          if (size) {
            t += ` (${size})`;
          }
          return t;
        })}
        tabIndex={tabIndex}
        {...this.bindLoading() }
      />
    );
  }
}

export default navWrapper(connect(state => ({
  milestones: cs.milestones.getGrouped(state),
}), {
  createMilestone: ca.milestones.create,
})(HOCPlanList));
