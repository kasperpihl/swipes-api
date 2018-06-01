import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List } from 'immutable';
import { DragDropContext } from 'react-beautiful-dnd';
import { withOptimist } from 'react-optimist';
import * as menuActions from 'src/redux/menu/menuActions';
import * as ca from 'swipes-core-js/actions';
import * as cs from 'swipes-core-js/selectors';
import { setupLoading } from 'swipes-core-js/classes/utils';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import getNewOrderFromResult from 'swipes-core-js/utils/getNewOrderFromResult';
import PlanList from './PlanList';

const emptyList = List();
const DISTANCE = 200;

@connect(state => ({
  organization: state.getIn(['me', 'organizations', 0]),
  plans: cs.milestones.getGrouped(state),
}), {
  inputMenu: menuActions.input,
  createPlan: ca.milestones.create,
  reorderPlans: ca.organizations.reorderPlans,
})
@navWrapper
@withOptimist

export default class extends PureComponent {
  static  sizes() {
    return [654];
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
  onAddPlan(e) {
    const options = { boundingRect: e.target.getBoundingClientRect() };
    const { createPlan, inputMenu } = this.props;
    inputMenu({
      ...options,
      placeholder: 'Title of the plan',
      text: '',
      buttonLabel: 'Create',
    }, (title) => {
      if (title && title.length && !this.isLoading('add')) {
        this.setLoading('add', 'Adding');
        createPlan(title).then((res) => {
          if (res && res.ok) {
            this.clearLoading('add', 'Plan created', 3000);
            window.analytics.sendEvent('Plan created', {});
          } else {
            this.clearLoading('add', '!Something went wrong');
          }
        });
      }
    });

  }
  onDragStart() {
    document.body.classList.add('no-select');
  }

  onDragEnd = (result) => {
    const { organization, reorderPlans, optimist } = this.props;
    const plansOldOrder = optimist.get(`milestone_order`, organization.get('milestone_order'));

    document.body.classList.remove('no-select');

    if (!result.destination) {
      return;
    }

    const newOrder = getNewOrderFromResult(plansOldOrder, result);

    optimist.set({
      key: `milestone_order`,
      value: newOrder,
      handler: (next) => {
        reorderPlans(newOrder.toJS()).then((res) => next());
      },
    });
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
    const { plans, organization, optimist } = this.props;
    const { tabs, tabIndex, limit, initialScroll } = this.state;

    return (
      <DragDropContext
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}>
        <PlanList
          delegate={this}
          limit={limit}
          initialScroll={initialScroll}
          plans={plans.get(tabs[tabIndex])}
          plansOrder={organization.get('milestone_order')}
          tabs={tabs.map((t) => {
            const size = plans.get(t).size;
            if (size) {
              t += ` (${size})`;
            }
            return t;
          })}
          tabIndex={tabIndex}
          optimist={optimist}
          {...this.bindLoading() }
        />
      </DragDropContext>
    );
  }
}

