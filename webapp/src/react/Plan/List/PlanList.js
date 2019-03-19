import React, { Fragment } from 'react';
import SW from './PlanList.swiss';
import { List } from 'immutable';
import useNav from 'src/react/_hooks/useNav';
import usePaginationRequest from 'core/react/_hooks/usePaginationRequest';
import useUpdate from 'core/react/_hooks/useUpdate';
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

  useUpdate('plan', update => {
    if (update.created_at) {
      req.prependItem(update);
    }
  });

  const handleNewPlan = () => {
    nav.openModal(ModalCreate, {
      type: 'plan',
      onSuccess: res => {
        nav.push({
          screenId: 'PlanOverview',
          crumbTitle: 'Plan',
          uniqueId: res.plan_id,
          props: {
            planId: res.plan_id
          }
        });
      }
    });
  };

  const ContentWrapper = ({ children }) => (
    <CardContent
      noframe
      header={
        <CardHeader padding={30} title="Plans">
          <Button icon="CircledPlus" onClick={handleNewPlan} />
        </CardHeader>
      }
    >
      {children}
    </CardContent>
  );

  if (!req.items) {
    return (
      <ContentWrapper>
        <RequestLoader req={req} />
      </ContentWrapper>
    );
  }

  console.log(req.items.length);
  if (!req.items.length) {
    return (
      <ContentWrapper>
        <SW.Wrapper>
          <SW.EmptyState
            showIcon
            title="IT’S STILL AND QUIET"
            description={`Whenever someone creates a plan \n it will show up here.`}
          />
        </SW.Wrapper>
      </ContentWrapper>
    );
  }

  const currDate = new Date().toISOString().slice(0, 10);
  const sections = List(req.items).groupBy(p => {
    if (p.completed_at) return 'Completed';
    if (!p.started_at) return 'Drafts';
    if (p.start_date > currDate) return 'Upcoming';
    return 'Current';
  });

  return (
    <ContentWrapper>
      <SW.Wrapper>
        {['Drafts', 'Overdue', 'Current', 'Upcoming', 'Completed'].map(
          sec =>
            sections.get(sec) && (
              <Fragment key={sec}>
                <SectionHeader>{sec}</SectionHeader>
                <SW.Section key={sec}>
                  {sections.get(sec).map(p => (
                    <PlanListItem plan={p} key={p.plan_id} />
                  ))}
                </SW.Section>
              </Fragment>
            )
        )}
        <PaginationScrollToMore req={req} errorLabel="Couldn't get plans." />
      </SW.Wrapper>
    </ContentWrapper>
  );
}
