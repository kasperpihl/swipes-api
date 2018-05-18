import React, { PureComponent, createContext } from 'react';

import { OptimistProvider, withOptimist } from 'react-optimist';

class Child extends PureComponent {
  constructor(props) {
    super(props);
    props.optimist.subscribe('hello');
  }
  onClick = () => {
    const { optimist, index } = this.props;
    optimist.queue(`child`, 'Hi New guy', (next) => {
      setTimeout(() => next(), 5000);
    });
    setTimeout(() => {
      optimist.queue(`child`, 'Hi New guy2', (next) => {
        setTimeout(() => next(), 1000);
      });
    }, 1000)
    
  }
  render() {
    const { optimist, title, index } = this.props;
    return (
      <div onClick={this.onClick}>{title}</div>      
    )
  }
}

const WrappedChild = withOptimist(Child);

const ChangeListener = withOptimist(({ optimist }) => (
  <div>{optimist.get('child', 'Waiting')}</div>
));


class Parent extends PureComponent {
  render() {
    return (
      <OptimistProvider>
        <div>
          <WrappedChild index={1} title="Hi Tisho"/>
          <WrappedChild index={2} title="Hi Peter"/>
          <WrappedChild index={3} title="Hi Kasper"/>
          <ChangeListener />
        </div>
      </OptimistProvider>
    );
  }
}

export default Parent;