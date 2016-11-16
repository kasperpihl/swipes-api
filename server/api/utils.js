"use strict";

import randomstring from 'randomstring';

const generateSlackLikeId = (type) => {
  type = type.toUpperCase();
  const id = randomstring.generate(8).toUpperCase();

  return type + id;
}

const camelCaseToUnderscore = (word) => {
	// http://stackoverflow.com/questions/30521224/javascript-convert-camel-case-to-underscore-case
	return word.replace(/([A-Z]+)/g, (x,y) => {return "_" + y.toLowerCase()}).replace(/^_/, "");
}

export {
  generateSlackLikeId,
  camelCaseToUnderscore
}
