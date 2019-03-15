import React from 'react';

export default function(string) {
  console.log(string);
  if (typeof string === 'string' && string.indexOf('\n') === -1) {
    return string;
  }

  if (!Array.isArray(string)) {
    string = [string];
  }
  const finalArr = [];
  string.forEach((s, i) => {
    if (typeof s === 'string') {
      s.split('\n').forEach((item, j) => {
        if (j > 0) {
          finalArr.push(<br key={`new-line-br-${i}-${j}`} />);
        }
        finalArr.push(item);
      });
    } else {
      finalArr.push(s);
    }
  });
  if (finalArr.length === 1) {
    return finalArr[0];
  }
  return finalArr;
}
