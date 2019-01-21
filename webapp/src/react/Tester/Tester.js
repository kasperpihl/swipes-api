import React, { PureComponent } from 'react';
import Button from 'src/react/_components/Button/Button';
import withLoader from 'src/react/_hocs/withLoader';
import { styleSheet } from 'swiss-react';

const SW = styleSheet('Test', {
  Wrapper: {
    _flex: ['column', 'flex-start', 'flex-start']
  }
});

@withLoader
export default class Tester extends PureComponent {
  handleClickCached = key => e => {
    const { loader } = this.props;
    console.log('setting', key);
    loader.set(key, 'Loading', 2000, () => {
      console.log('success', key);
      loader.success(key, 'Success', 1500);
    });
  };

  handleContextMenuCached = key => e => {
    const { loader } = this.props;
    e.preventDefault();
    loader.set(key, 'Loading', 2000, () => {
      loader.error(key, 'Error', 1500);
    });
  };

  render() {
    const { loader } = this.props;
    return (
      <SW.Wrapper>
        <Button.Standard
          icon="Close"
          onClick={this.handleClickCached('StandardIcon')}
          onContextMenu={this.handleContextMenuCached('StandardIcon')}
          status={loader.get('StandardIcon')}
        />
        <Button.Standard
          title="Close"
          onClick={this.handleClickCached('StandardTitle')}
          onContextMenu={this.handleContextMenuCached('StandardTitle')}
          status={loader.get('StandardTitle')}
        />
        <Button.Standard
          icon="Close"
          onClick={this.handleClickCached('StandardIconTitle')}
          onContextMenu={this.handleContextMenuCached('StandardIconTitle')}
          status={loader.get('StandardIconTitle')}
          title="Close"
        />
        <Button.Rounded
          icon="ThreeDots"
          onClick={this.handleClickCached('RoundedIcon')}
          onContextMenu={this.handleContextMenuCached('RoundedIcon')}
          status={loader.get('RoundedIcon')}
        />
        <Button.Rounded
          title="Close"
          onClick={this.handleClick}
          onClick={this.handleClickCached('RoundedTitle')}
          onContextMenu={this.handleContextMenuCached('RoundedTitle')}
          status={loader.get('RoundedTitle')}
        />
        <Button.Rounded
          icon="ThreeDots"
          title="Close"
          onClick={this.handleClick}
          onClick={this.handleClickCached('RoundedIconTitle')}
          onContextMenu={this.handleContextMenuCached('RoundedIconTitle')}
          status={loader.get('RoundedIconTitle')}
        />
        <Button.Extended
          icon="ThreeDots"
          onClick={this.handleClickCached('ButtonExtended')}
          onContextMenu={this.handleContextMenuCached('ButtonExtended')}
          bigTitle="12"
          smallTitle="People"
          status={loader.get('ButtonExtended')}
        />
      </SW.Wrapper>
    );
  }
}
