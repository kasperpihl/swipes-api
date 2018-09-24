import React from 'react';
// import { URL_REGEX } from 'swipes-core-js/classes/utils';
const URL_REGEX = /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/g;
import Link from 'src/react/components/Link/Link';

export default function(string) {
  if (!Array.isArray(string)) {
    string = [string];
  }
  let finalArr = [];
  string.forEach((s, j) => {
    if (typeof s === 'string') {
      const urls = s.match(URL_REGEX);
      if (urls) {
        const splitUrlWithText = [];
        let runningIndex = 0;
        urls.forEach((url, i) => {
          const index = s.indexOf(url, runningIndex);
          if (index > runningIndex) {
            splitUrlWithText.push(s.substr(runningIndex, index - runningIndex));
          }
          splitUrlWithText.push(
            <Link key={`parse-link-${j}-${i}`} url={url} />
          );
          runningIndex = index + url.length;
          if (i === urls.length - 1 && runningIndex < s.length - 1) {
            splitUrlWithText.push(s.substr(runningIndex));
          }
        });
        finalArr = finalArr.concat(splitUrlWithText);
        return;
      }
    }
    finalArr.push(s);
  });

  return finalArr.length === 1 ? finalArr[0] : finalArr;
}
