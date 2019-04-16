import React from 'react';
import moment from 'moment';

import useRequest from 'core/react/_hooks/useRequest';

import BillingPaymentModal from 'src/react/Billing/Payment/Modal/BillingPaymentModal';
import Button from 'src/react/_components/Button/Button';
import Spacing from '_shared/Spacing/Spacing';
import Loader from '_shared/loaders/Loader';

import SW from './BillingPaymentActive.swiss';

export default function BillingPaymentActive({ openModal, team }) {
  const handleCardDetails = () => {
    openModal(BillingPaymentModal, {
      teamId: team.get('team_id')
    });
  };

  const req = useRequest('billing.get', {
    team_id: team.get('team_id')
  });

  if (typeof req.result === 'undefined') {
    return (
      <SW.Wrapper loading>
        <Loader size={36} />
      </SW.Wrapper>
    );
  } else {
    const periodStart =
      req.result.customer.subscriptions.data[0].current_period_end;
    const nextPaymentDate = moment(periodStart).format('MMM DD, YYYY');
    return (
      <SW.Wrapper>
        <SW.Title>Thank you for your purchase.</SW.Title>
        <Spacing height={9} />
        <SW.StatusWrapper>
          <SW.StatusLabel>Your subscription status is:</SW.StatusLabel>
          <SW.Status>Active</SW.Status>
        </SW.StatusWrapper>
        <Spacing height={9} />
        <SW.NextPaymentDate>{`Your next payment is due ${nextPaymentDate}`}</SW.NextPaymentDate>
        <Spacing height={9} />
        <Button
          title="Change card details"
          onClick={handleCardDetails}
          border
        />
      </SW.Wrapper>
    );
  }
}
