"use strict";

import {
  camelCaseToUnderscore
} from '../../utils';

const mapApiMethod = (method) => {
  const pathItems = method.split('.');
	let path = '';

	pathItems.forEach((item) => {
		path = path + '/' + camelCaseToUnderscore(item);
	})

	return path;
}

export {
  mapApiMethod
}
