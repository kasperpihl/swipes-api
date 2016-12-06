 import React, { Component } from 'react';
 import Vivus from 'vivus';
 import Icon from '../icons/Icon';

 class SwipesBackgroundAnimation extends Component {
   componentDidMount() {
     let direction = 1;

     const layer1 = new Vivus('layer1', {
       type: 'scenario',
     });

     function animation() {
       layer1.play(direction);
     }

     animation(direction);

     setInterval(() => {
       direction = direction > 0 ? -1 : 1;

       animation();
     }, 13500);
   }
   render() {
     return (
       <div className="swipes-background-animation">
         <Icon svg="LoginIconOne" />
         <Icon svg="LoginIconTwo" />
       </div>
     );
   }
}
 export default SwipesBackgroundAnimation;
