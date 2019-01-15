export default object => {
  if (typeof object !== 'object') {
    throw Error('sqlJsonbBuild expected object');
  }
  const objects = Object.entries(object);

  let string = 'jsonb_build_object(';
  objects.forEach(([key, value], i) => {
    if (
      ['string', 'number', 'boolean'].indexOf(typeof key) === -1 &&
      key !== null
    ) {
      throw Error('sqlJsonbBuild invalid value for', key);
    }
    if (i > 0) {
      string += ', ';
    }
    if (typeof value === 'string' && !value.startsWith('$')) {
      value = `'${value}'`;
    }
    string += `'${key}', ${value}`;
  });
  string += ')';
  return string;
};
