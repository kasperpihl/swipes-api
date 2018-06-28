import React from 'react';
import { URL_REGEX } from 'swipes-core-js/classes/utils';
import { addGlobalStyles } from 'swiss-react';
addGlobalStyles({
  '.links': {
    color: '$blue',
    '&:hover': {
      textDecoration: 'underline',
    }
  }
})

export default function (string)  {
  if(!Array.isArray(string)) {
    string = [string];
  }
  let finalArr = [];
  string.forEach((s, j) => {
    if(typeof s === 'string') {
      const urls = s.match(URL_REGEX);
      if (urls) {
        s = s.split(URL_REGEX);
        urls.forEach((url, i) => {
          s.splice(1 + i + i, 0, (
            <a
              className="links"
              href={url}
              key={`parse-link-${j}-${i}`}
              target="_blank"
            >
              {url}
            </a>
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