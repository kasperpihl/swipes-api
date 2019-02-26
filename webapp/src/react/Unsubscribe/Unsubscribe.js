import React, { useEffect } from 'react';
import request from 'core/utils/request';
import useLoader from 'src/react/_hooks/useLoader';
import urlGetParameter from 'src/utils/url/urlGetParameter';
import SW from './Unsubscribe.swiss';

export default function Unsubscribe() {
  const loader = useLoader();

  useEffect(() => {
    const email = urlGetParameter('email');
    const emailType = urlGetParameter('email_type');
    loader.set('unsubscribe', 'Unsubscribing...');
    request('users.unsubscribe', {
      email,
      email_type: emailType
    }).then(res => {
      if (res.ok) {
        loader.success(
          'unsubscribe',
          'You have been unsubscribed from these types of emails'
        );
      } else {
        loader.error('unsubscribe', '!Something went wrong');
      }
    });
  }, []);

  return (
    <SW.Wrapper>
      <SW.Text>
        {loader.get('unsubscribe').loading}
        {loader.get('unsubscribe').success}
        {loader.get('unsubscribe').error}
      </SW.Text>
    </SW.Wrapper>
  );
}
