# Codename Swiss
Syntactical winning (Charlie Sheen) style sheets 
### Webpack plugin
- [ ] Read swiss on div
- [ ] Parse emmet to styles
- [ ] Move styles to dom
- [ ] Remove swiss element

### Kris usecases
- Being able to hover effect
- Pseudo classes

'swiss-loader'
'swiss'

import Swiss from 'swiss'
import React, { Component, PropTypes } from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin';
class Tree extends Component {
  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.swiss = new Swiss()
  }
  componentDidMount() {
    var newHeight = '100px';
    setTimeout(() =>{
      this.swiss.update('hello', 'h100px')
    }, 5000)
  }
  render() {
    return (
      <div swiss={{id: 'hello', css:[pos$a, h, w100] }}>
      </div>
    )
  }
}


