let stripeToken = 'pk_live_vLIRvcBoJ4AA9sFUpmVT11gQ';
let mixpanelToken = '280f53ea477a89ca86e0f7c8825528ca';

if (
  process.env.NODE_ENV !== 'production' ||
  window.location.hostname === 'wspc.io'
) {
  stripeToken = 'pk_test_0pUn7s5EyQy7GeAg93QrsJl9';
  mixpanelToken = 'cdb182baa17a94f1a4ace32ad04c2322';
}

export { stripeToken, mixpanelToken };
