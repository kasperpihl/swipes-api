import React from 'react';

export default function parseGiphys(string) {
  if (!Array.isArray(string)) {
    string = [string];
  }
  let finalArr = [];
  let didMatch = false;
  string.forEach((s, i) => {
    if (typeof s === 'string') {
      const regex = /<!giphy*\|(.*)\|(.*)>/gm;
      const match = regex.exec(string);
      if (string && match) {
        finalArr.push(
          <img
            src={match[1]}
            style={{ height: '150px', borderRadius: '3px' }}
            key={`prase-gif-${i}`}
          />
        );
        didMatch = true;
      }
    }
  });

  return didMatch ? finalArr : string;
}
