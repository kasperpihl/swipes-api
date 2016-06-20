"use strict";

import fs from 'fs';
import path from 'path';
import React from 'react';
import renderToString from 'react-dom/server';
import {
  Provider,
  Card
} from './swipes-card'

const indexPath = path.join(__dirname, '../../webapp/ssr_card_dev/index.html');

const renderIndex = (data) => {
  const SwipesCard = new Provider(Card);
  const cardHtml = renderToString(<SwipesCard data={data} />)
  console.log(cardHtml)

  let indexHtml;
  try {
    indexHtml = fs.readFileSync(indexPath, 'utf8');
  }
  catch (e) {
    console.log(e);
  }

  return indexHtml;
}

export {renderIndex}
