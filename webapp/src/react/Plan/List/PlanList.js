import React from 'react';
import SW from './PlanList.swiss';
import useNav from 'src/react/_hooks/useNav';
import withRequests from 'swipes-core-js/components/withRequests';
import CardHeader from 'src/react/_components/CardHeader/CardHeader';
import SWView from 'src/react/_Layout/view-controller/SWView';
import Button from 'src/react/_components/Button/Button';
import ModalCreate from 'src/react/Modal/Create/ModalCreate';
// import PlanListItem from './Item/PlanListItem';

PlanList.sizes = [750];

export default withRequests(
  {
    plans: {
      request: {
        url: 'plan.list',
        resPath: 'plans'
      },
      cache: {
        path: ['planList']
      }
    }
  },
  { renderLoader: () => <div>loading</div> }
)(PlanList);

function PlanList({ me, plans }) {
  const nav = useNav();
  const handleNewProject = () => {
    nav.openModal(ModalCreate, {
      type: 'plan'
    });
  };
  const handleItemClick = planId => {
    nav.push({
      screenId: 'PlanOverview',
      crumbTitle: 'Plan',
      uniqueId: planId,
      props: {
        planId: planId
      }
    });
  };
  return (
    <SWView
      noframe
      header={
        <CardHeader padding={30} title="Plans">
          <Button.Rounded icon="Plus" onClick={handleNewProject} />
        </CardHeader>
      }
    >
      <SW.Wrapper>
        {plans.map(p => (
          <div
            onClick={() => handleItemClick(p.get('plan_id'))}
            key={p.get('plan_id')}
          >
            {p.get('title')}
          </div>
        ))}
      </SW.Wrapper>
    </SWView>
  );
}
