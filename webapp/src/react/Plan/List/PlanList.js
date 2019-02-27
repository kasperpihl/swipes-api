import React, { Fragment } from 'react';
import SW from './PlanList.swiss';
import { fromJS } from 'immutable';
import useNav from 'src/react/_hooks/useNav';
import usePaginationRequest from 'core/react/_hooks/usePaginationRequest';
import CardHeader from 'src/react/_components/Card/Header/CardHeader';
import CardContent from 'src/react/_components/Card/Content/CardContent';
import Button from 'src/react/_components/Button/Button';
import RequestLoader from 'src/react/_components/RequestLoader/RequestLoader';
import SectionHeader from 'src/react/_components/SectionHeader/SectionHeader';

import PaginationScrollToMore from 'src/react/_components/pagination/PaginationScrollToMore';

import ModalCreate from 'src/react/Modal/Create/ModalCreate';
import PlanListItem from './Item/PlanListItem';

PlanList.sizes = [750];

export default function PlanList() {
  const nav = useNav();
  const req = usePaginationRequest(
    'plan.list',
    {},
    {
      cursorKey: 'skip',
      idAttribute: 'plan_id',
      resultPath: 'plans'
    }
  );

  if (!req.items) {
    return <RequestLoader req={req} />;
  }

  const handleNewProject = () => {
    nav.openModal(ModalCreate, {
      type: 'plan'
    });
  };
  const sections = fromJS(req.items).groupBy(p => {
    if (p.get('completed_at')) return 'Completed';
    if (!p.get('started_at')) return 'Drafts';
    if (p.get('start_date') > new Date().toISOString().slice(0, 10))
      return 'Upcoming';
    return 'Current';
  });

  return (
    <CardContent
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
              <Fragment key={sec}>
                <SectionHeader>{sec}</SectionHeader>
                <SW.Section key={sec}>
                  {sections.get(sec).map(p => (
                    <PlanListItem plan={p} key={p.get('plan_id')} />
                  ))}
                </SW.Section>
              </Fragment>
            )
        )}
        <PaginationScrollToMore req={req} errorLabel="Couldn't get plans." />
      </SW.Wrapper>
    </CardContent>
  );
}
