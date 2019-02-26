import React from 'react';
import SW from './PlanList.swiss';
import { fromJS } from 'immutable';
import useNav from 'src/react/_hooks/useNav';
import useRequest from 'core/react/_hooks/useRequest';
import CardHeader from 'src/react/_components/CardHeader/CardHeader';
import SWView from 'src/react/_Layout/view-controller/SWView';
import Button from 'src/react/_components/Button/Button';
import RequestLoader from 'src/react/_components/RequestLoader/RequestLoader';

import ModalCreate from 'src/react/Modal/Create/ModalCreate';
import PlanListItem from './Item/PlanListItem';

PlanList.sizes = [750];

export default function PlanList() {
  const nav = useNav();
  const req = useRequest('plan.list');
  if (req.error || req.loading) {
    return <RequestLoader req={req} />;
  }

  const handleNewProject = () => {
    nav.openModal(ModalCreate, {
      type: 'plan'
    });
  };
  const sections = fromJS(req.result.plans).groupBy(p => {
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
          <Button icon="Plus" onClick={handleNewProject} />
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
