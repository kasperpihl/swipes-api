"use strict";

import config from 'config';
import Asana from 'asana';

const asanaConfig = config.get('asana');
const createClient = () => {
	const {
		clientId,
		clientSecret,
		redirectUri
	} = asanaConfig;

	return Asana.Client.create({ clientId, clientSecret, redirectUri });
}

export {
  createClient
}
