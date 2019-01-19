import React, { PureComponent } from 'react';
import withLoader from 'src/react/_hocs/withLoader';

@withLoader
export default class Tester extends PureComponent {
  state = {};
  componentDidMount() {
    const { loader } = this.props;
    loader.success('load', 'Hello', 6000, () => {
      this.setState({ hi: true });
    });
  }
  render() {
    const { loader } = this.props;
    return (
      <div>
        Loading: {loader.get('load').loading}
        <br />
        Success: {loader.get('load').success}
        <br />
        Error: {loader.get('load').error}
        <br />
      </div>
    );
  }
}
