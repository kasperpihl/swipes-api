let view;
import React from 'react'

// Welcome to Swipes Component Tester, change anything between the ==='s
// ==========================================

// 1. Import the component you want to test
import SwipesCard from './components/swipes-card/SwipesCard'

// 2. Set the components to test
view = (
  <SwipesCard data={{"title": "This is the properties of the component"}} />
)

// 3. Change this to true, to enable the tester
const enableTester = false;

// =========================================


module.exports = enableTester ? view : undefined;

if(enableTester){
  console.log('Component Tester enabled in src/Tester.js');
}