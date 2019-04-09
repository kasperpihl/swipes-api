import React from 'react';

import useNav from 'src/react/_hooks/useNav';

import SectionHeader from '_shared/SectionHeader/SectionHeader';
import Spacing from '_shared/Spacing/Spacing';

import SW from './TeamBillingStatus.swiss';
import Button from '_shared/Button/Button';

export default function TeamBillingStatus({ subType, daysLeft, team }) {
  const nav = useNav();
  const openBillingView = () => {
    nav.push({
      screenId: 'Billing',
      crumbTitle: 'Billing',
      props: {
        teamId: team.get('team_id')
      }
    });
  };
  return (
    <SW.Wrapper>
      <SectionHeader>
        <SW.Text>Billing</SW.Text>
      </SectionHeader>
      <SW.Row>
        <SW.StatusWrapper>
          <SW.SubscriptionType>{subType}</SW.SubscriptionType>
          <Spacing height={2} />
          <SW.DaysLeft>{`${daysLeft} ${
            daysLeft === 1 ? 'day' : 'days'
          }`}</SW.DaysLeft>
        </SW.StatusWrapper>
        <SW.ButtonWrapper>
          <Button
            title={
              subType === 'Expired' || subType === 'Trial'
                ? 'Add payment method'
                : 'Manage Billing'
            }
            border
            onClick={openBillingView}
          />
        </SW.ButtonWrapper>
      </SW.Row>
    </SW.Wrapper>
  );
}
