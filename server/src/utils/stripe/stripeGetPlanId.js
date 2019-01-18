import config from 'config';
const stripeConfig = config.get('stripe');

export default plan => {
  if (plan === 'yearly') {
    return stripeConfig.yearlyPlanId;
  }
  return stripeConfig.monthlyPlanId;
};
