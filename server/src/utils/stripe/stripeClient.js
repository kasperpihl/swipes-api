import config from 'config';
import stripePackage from 'stripe';

const stripeConfig = config.get('stripe');
export default stripePackage(stripeConfig.secretKey);
