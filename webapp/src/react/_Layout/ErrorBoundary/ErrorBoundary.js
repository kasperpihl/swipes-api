import React, { Component } from 'react';
import Button from 'src/react/_components/Button/Button';
import SW from './ErrorBoundary.swiss';

export default class ErrorBoundary extends Component {
  state = {
    error: null
  };
  componentDidCatch(error) {
    this.setState({ error });
  }
  render() {
    const { children } = this.props;
    const { error } = this.state;
    if (!error) {
      return children;
    }
    return (
      <SW.Wrapper>
        <div>Something went really wrong in this view :(</div>
        <Button
          title="Try again"
          onClick={() => this.setState({ error: null })}
        />{' '}
        <Button title="Reset data (logout)" />
        or contact support (help@swipesapp.com)
      </SW.Wrapper>
    );
  }
}
