import React, { Fragment }  from 'react';

export default function (string)  {
  if(typeof string === 'string' && string.indexOf('\n') === -1) {
    return string;
  }

  if(!Array.isArray(string)) {
    string = [string];
  }
  const finalArr = [];
  string.forEach(s => {

    if(typeof s === 'string') {
      s.split('\n').forEach((item, i) => {
        if(i > 0) {
          finalArr.push(<br key={`new-line-br-${i}`} />);
        }
        finalArr.push(item);
      });
    } else {
      finalArr.push(s);
    }
  })
  if(finalArr.length === 1) {
    return finalArr[0];
  }
  return finalArr;
}