import React from 'react';
import SW from './PlanList.swiss';
import useNav from 'src/react/_hooks/useNav';
import withRequests from 'swipes-core-js/components/withRequests';
import CardHeader from 'src/react/_components/CardHeader/CardHeader';
import SWView from 'src/react/_Layout/view-controller/SWView';
import Button from 'src/react/_components/Button/Button';
import Loader from 'src/react/_components/loaders/Loader';

import ModalCreate from 'src/react/Modal/Create/ModalCreate';
import PlanListItem from './Item/PlanListItem';

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
  { renderLoader: () => <Loader center /> }
)(PlanList);

function PlanList({ me, plans }) {
  const nav = useNav();
  const handleNewProject = () => {
    nav.openModal(ModalCreate, {
      type: 'plan'
    });
  };
  const sections = plans.groupBy(p => {
    if (p.get('completed_at')) return 'Completed';
    if (!p.get('started_at')) return 'Drafts';
    if (p.get('start_date') > new Date().toISOString().slice(0, 10))
      return 'Upcoming';
    return 'Current';
  });

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
        {['Current', 'Drafts', 'Upcoming', 'Completed'].map(
          sec =>
            sections.get(sec) && (
              <SW.Section key={sec}>
                <SW.SectionTitle>{sec}</SW.SectionTitle>
                {sections.get(sec).map(p => (
                  <PlanListItem plan={p} key={p.get('plan_id')} />
                ))}
              </SW.Section>
            )
        )}
      </SW.Wrapper>
    </SWView>
  );
}
