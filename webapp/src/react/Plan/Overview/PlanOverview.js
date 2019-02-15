import React, { PureComponent } from 'react';
import SW from './PlanOverview.swiss';
import Loader from 'src/react/_components/loaders/Loader';
import withRequests from 'swipes-core-js/components/withRequests';
import SWView from 'src/react/_Layout/view-controller/SWView';
import CardHeader from 'src/react/_components/CardHeader/CardHeader';
import PlanSide from 'src/react/Plan/Side/PlanSide';
import withNav from 'src/react/_hocs/Nav/withNav';

@withNav
@withRequests(
  {
    plan: {
      request: {
        url: 'plan.get',
        body: props => ({
          plan_id: props.planId
        }),
        resPath: 'plan'
      },
      cache: {
        path: props => ['plan', props.planId]
      }
    }
  },
  { renderLoader: () => <Loader center /> }
)
export default class PlanOverview extends PureComponent {
  static sizes = [750];

  render() {
    const { plan } = this.props;

    return (
      <SWView
        noframe
        header={<CardHeader padding={30} title={plan.get('title')} />}
      >
        <SW.Wrapper>
          <PlanSide plan={plan} />
          <SW.TasksWrapper>Here will be many tasks</SW.TasksWrapper>
        </SW.Wrapper>
      </SWView>
    );
  }
}
