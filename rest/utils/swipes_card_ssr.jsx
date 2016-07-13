"use strict";

import fs from 'fs';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import {
  Provider,
  Card
} from './swipes-card';

const indexPath = path.join(__dirname, '../../webapp/ssr_card_dev/index.html');

const renderIndex = (data) => {
  const SwipesCard = new Provider(Card);
  const cardHtml = renderToString(<SwipesCard data={data} />)

  let indexHtml;
  try {
    indexHtml = fs.readFileSync(indexPath, 'utf8');
  }
  catch (e) {
    //T_TODO better error handling
    console.log(e);
  }

  const divContentString = '<div id="content">';
  const divContentStringLen = divContentString.length;
  const firstJsTagIndex = indexHtml.indexOf('<script type="text/javascript">');
  const embededScript = '<script type="text/javascript">window.__swipes_data = ' + JSON.stringify(data) + ';</script>'
  // http://stackoverflow.com/questions/4364881/inserting-string-at-position-x-of-another-string
  // Inserting the card html to the div within indexHtml that is with class content
  let finalHtml = indexHtml;
  finalHtml = [finalHtml.slice(0, firstJsTagIndex), embededScript, finalHtml.slice(firstJsTagIndex)].join('');

  const idContentIndex = finalHtml.indexOf(divContentString) + divContentStringLen;
  finalHtml = [finalHtml.slice(0, idContentIndex), cardHtml, finalHtml.slice(idContentIndex)].join('');

  return finalHtml;
}

export {renderIndex}
