import React, { useEffect, useState } from 'react';
import moment from 'moment';

import request from 'core/utils/request';

import BillingPaymentModal from 'src/react/Billing/Payment/Modal/BillingPaymentModal';
import Button from 'src/react/_components/Button/Button';
import Spacing from '_shared/Spacing/Spacing';
import Loader from '_shared/loaders/Loader';

import SW from './BillingPaymentActive.swiss';

export default function BillingPaymentActive({ openModal, team }) {
  const [nextPaymentDate, changeNextPaymentDate] = useState();
  const handleCardDetails = () => {
    openModal(BillingPaymentModal, {
      teamId: team.get('team_id')
    });
  };
  useEffect(() => {
    request('billing.get', {
      team_id: team.get('team_id')
    }).then(res => {
      if (res.customer) {
        const periodStart =
          res.customer.subscriptions.data[0].current_period_end;
        changeNextPaymentDate(moment(periodStart).format('MMM DD, YYYY'));
      }
    });
  }, [nextPaymentDate]);

  if (typeof nextPaymentDate === 'undefined') {
    return (
      <SW.Wrapper loading>
        <Loader size={36} />
      </SW.Wrapper>
    );
  }
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
      <Button title="Change card details" onClick={handleCardDetails} border />
    </SW.Wrapper>
  );
}
