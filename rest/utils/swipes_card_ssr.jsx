"use strict";

import fs from 'fs';
import path from 'path';
import React from 'react';
import renderToString from 'react-dom/server';

const indexPath = path.join(__dirname, '../../webapp/ssr_card_dev/index.html');
let indexHtml;

try {
  indexHtml = fs.readFileSync(indexPath, 'utf8');
}
catch (e) {
  console.log(e);
}

const renderIndex = (html) => {
  return indexHtml;
}

export {renderIndex}
