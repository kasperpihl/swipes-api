import React, { PureComponent } from 'react';
import { styleElement, styleSheet, toggleGroup } from 'react-swiss';
import Button from 'src/react/components/button/Button2';
// import styles from './Tester.swiss';
import { setupLoading } from 'swipes-core-js/classes/utils';
const styles = styleSheet({
  Wrapper: {
    _flex: ['column', 'left', 'center'],
    '& > *': {
      margin: '10px',
    }
  }
});

const Wrapper = styleElement('div', styles.Wrapper);

class Tester extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    setupLoading(this);
  }
  componentDidMount() {
  }
  onClick = () => {
    this.setLoading('test', 'Loading');
    setTimeout(() => {
      this.clearLoading('test', 'Posted', 3000)
    }, 2000)
  }
  render() {
    console.log(this.getLoading('test'));
    return (
      <Wrapper>
        <Button
          title="Click me"
          onClick={this.onClick}
          {...this.getLoading('test')}
        />

        <Button
          icon="Plus"
          onClick={this.onClick}
          {...this.getLoading('test')}
        />
        <Button
          icon="Plus"
          title="Click me"
          onClick={this.onClick}
          {...this.getLoading('test')}
        />
        <Button
          icon="Plus"
          sideLabel="Click me"
          onClick={this.onClick}
          {...this.getLoading('test')}
        />
        <Button
          title="Click me"
          compact
          onClick={this.onClick}
          {...this.getLoading('test')}
        />
        <Button
          icon="Plus"
          compact
          onClick={this.onClick}
          {...this.getLoading('test')}
        />
        <Button
          icon="Plus"
          title="Click me"
          compact
          onClick={this.onClick}
          {...this.getLoading('test')}
        />
      </Wrapper>
    );
  }
}

export default Tester