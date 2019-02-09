import React from 'react';
import useLoader from 'src/react/_hooks/useLoader';
import urlGetParameter from 'src/utils/url/urlGetParameter';
import CardHeader from 'src/react/_components/CardHeader/CardHeader';
import request from 'swipes-core-js/utils/request';
import Card from 'src/react/_components/Card/Card';

export default function ConfirmAccount() {
  const confirmationToken = urlGetParameter('confirmation_token');

  const loader = useLoader();

  useEffect(() => {
    if (!confirmationToken) {
      loader.error('confirm', 'Missing confirmation token');
      return;
    }
    loader.set('confirm', 'Confirming...');
    request('users.confirm', confirmationToken).then(res => {
      if (res.ok) {
        loader.success('confirm', 'Successfully confirmed the email');
      } else {
        loader.error('confirm', 'Something went wrong.');
      }
    });
  }, []);

  const lState = loader.get('confirm');
  const subtitle = lState.loading || lState.success || lState.error;

  return (
    <Card>
      <div style={{ marginTop: '36px' }}>
        <CardHeader title="confirming your email" subtitle={subtitle} />
      </div>
    </Card>
  );
}
