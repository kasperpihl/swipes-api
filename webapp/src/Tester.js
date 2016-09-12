const props = {};
let view;


// Welcome to Swipes Component Tester, change anything between the ==='s
// ==========================================

// 1. Import the component you want to test
import SwipesCard from './components/swipes-card/SwipesCard'

// 2. Set the properties for your test
props.data = {"title": "Yir"};

// 3. Set the view to test
view = SwipesCard;

// 4. Change this to true, to enable the tester
const enableTester = false;

// =========================================


module.exports = enableTester ? {
  props,
  view
} : undefined;

if(enableTester){
  console.log('Component Tester enabled in src/Tester.js');
}