'use strict'

import React from 'react';
import ReactDOM from 'react-dom';
import SwipesDot from 'swipes-dot';
import {
  Provider,
  Card
} from '../../../rest/utils/swipes-card'

const swipesData = window.__swipes_data;
const SwipesCard = new Provider(Card);
const container = document.getElementById('content');

ReactDOM.unmountComponentAtNode(container); // Unmount the server-side component
ReactDOM.render(<SwipesCard data={swipesData} />, container);
