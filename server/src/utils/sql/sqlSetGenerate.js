export default mapping => {
  // Prepare for dynamic support of adding values
  const values = [];
  const insertVariable = value => {
    values.push(value);
    return `$${values.length}`;
  };

  let text = '';

  // Create keys mapping
  const firstObjKeys = Object.keys(mappingArr[0]);
  text += `
    (${firstObjKeys.join(', ')})
    VALUES
  `;

  text += mappingArr
    .map(
      (obj, i) =>
        `(${firstObjKeys.map(key => {
          if (typeof obj[key] === 'undefined') {
            throw `dbInsertQuery expected key "${key}" in row[${i}]`;
          }
          return insertVariable(obj[key]);
        })})`
    )
    .join(', ');

  if (options.returning) {
    text += `
      RETURNING ${
        typeof options.returning === 'string' ? options.returning : '*'
      }
    `;
  }

  return {
    text,
    values
  };
};