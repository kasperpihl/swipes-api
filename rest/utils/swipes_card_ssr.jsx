"use strict";

import fs from 'fs';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server'
import {
  Provider,
  Card
} from './swipes-card'

const indexPath = path.join(__dirname, '../../webapp/ssr_card_dev/index.html');

const renderIndex = (data) => {
  // T_TODO map data to card format
  data = {
    title: 'swipes-icons.png'
  }

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

  const idContentIndex = indexHtml.indexOf('<div id="content"></div>');
  // http://stackoverflow.com/questions/4364881/inserting-string-at-position-x-of-another-string
  // Inserting the card html to the div within indexHtml that is with class content
  const finalHtml = [indexHtml.slice(0, idContentIndex), cardHtml, indexHtml.slice(idContentIndex)].join('');

  return finalHtml;
}

export {renderIndex}
