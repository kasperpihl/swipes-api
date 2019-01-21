import React, { PureComponent } from 'react';
import Button from 'src/react/components/Button/Button';
import withLoader from 'src/react/_hocs/withLoader';

@withLoader
export default class Tester extends PureComponent {
  componentDidMount() {
    const { loader } = this.props;
    loader.set('button');
  }

  handleClick = () => {
    const { loader } = this.props;
    console.log('clicked');
    loader.success('button', 'Testing success', 1500);
  };
  render() {
    const { loader } = this.props;
    return (
      <div style={{ margin: '24px' }}>
        <Button.Standard
          icon="Close"
          onClick={this.handleClick}
          title="Standard"
          status={{ ...loader.get('button') }}
        />
        {/* <Button.Rounded
          icon="ThreeDots"
          onClick={this.handleClick}
          title="Rounded"
          {...loader.get('button')}
        />
        <Button.Extended
          icon="ThreeDots"
          onClick={this.handleClick}
          bigTitle="12"
          smallTitle="People"
          {...loader.get('button')}
        /> */}
      </div>
    );
  }
}
