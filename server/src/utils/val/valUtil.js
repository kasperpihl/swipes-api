import { funcWrap } from 'valjs';

export default (schema, util) => funcWrap(schema, (err, ...args) => {
  if (err) {
    schema.forEach((s) => console.log(s.toString()));
    throw Error(`Validation Error: ${err}`);
  }
  return util(...args);
});