import React from 'react';

const HomeProvider = (ComposedComponent) => class extends React.Component {
  constructor() {
    super();
    this.state = {
      url: 'https://google.com'
    };
  }
  onSubmit(e, value) {
    if (value.length > 0) {
      this.setState({
        url: value
      });
    } else {
      alert('slap your hand now! 3 times!!!');
    }

    return e.preventDefault();
  }
  render() {
    return <ComposedComponent {...this.props} url={this.state.url} onSubmit={this.onSubmit} />
  }
}

const Home = class extends React.Component {
  render () {
    const {
      onSubmit,
      url,
      ...other
    } = this.props;

    return <div class='home-container'>
      <form onSubmit={onSubmit.bind(this, this.refs.input.value)}>
        <input
          ref='input'
          type='text'
          placeholder='browser, browser on the screen... who is the prettiest of them all' />
      </form>
      <iframe src={url}></iframe>
    </div>
  }
}

export {
  HomeProvider,
  Home
}
