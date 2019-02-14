export default function sqlInsertQuery(
  tableName,
  mapping,
  options = { returning: true }
) {
  if (typeof tableName !== 'string') {
    throw 'dbInsertQuery expects tableName as first parameter';
  }
  const mappingArr = Array.isArray(mapping) ? mapping : [mapping];

  // Prepare for dynamic support of adding values
  const values = [];
  const insertVariable = value => {
    values.push(value);
    return `$${values.length}`;
  };

  let text = `INSERT INTO ${tableName}`;

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
          if (options.dontPrepare && options.dontPrepare[key]) {
            return obj[key];
          }
          return insertVariable(obj[key]);
        })})`
    )
    .join(', ');
  if (options.upsert) {
    text += `ON CONFLICT ON CONSTRAINT ${options.upsert} DO UPDATE SET `;
    const setStatements = [];
    firstObjKeys.forEach(key => {
      setStatements.push(`${key} = excluded.${key}`);
    });
    text += setStatements.join(', ');
  }
  if (typeof options.returning === 'undefined' || options.returning) {
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
}
