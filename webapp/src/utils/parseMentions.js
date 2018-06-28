import React from 'react';

export default function parseMentions(string)  {
  if(!Array.isArray(string)) {
    string = [string];
  }
  let finalArr = [];
  string.forEach((s, j) => {
    if(typeof s === 'string') {
      const regex = /<![A-Z0-9]*\|.*?>/gi;
      const mentions = s.match(regex);
      if (mentions) {
        s = s.split(regex);
        mentions.forEach((mention, i) => {
          const sepI = mention.indexOf('|');
          s.splice(1 + i + i, 0, (
            <b key={`mention-${j}-${i}`}>
              {mention.substr(sepI + 1, mention.length - sepI - 2)}
            </b>
          ));
        });
        s = s.filter(sI => sI !== '');
        finalArr = finalArr.concat(s);
        return;
      }
    }
    finalArr.push(s);
  })

  return finalArr.length === 1 ? finalArr[0] : finalArr;
}