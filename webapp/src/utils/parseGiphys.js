import React from 'react';
const regEx = /<!giphy*\|(.*)\|(.*)>/gm;
export default function(string) {
  console.log(string);
  let parsedMessage;
  const match = regEx.exec(string);
  if (string && match) {
    parsedMessage = <img src={match[1]} style={{ width: '200px' }} />;
  } else {
    parsedMessage = string;
  }
  return parsedMessage;
}
