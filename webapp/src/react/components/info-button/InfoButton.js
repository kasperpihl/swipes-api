import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as mainActions from 'src/redux/main/mainActions';
import { setupDelegate } from 'react-delegate';
import Button from 'src/react/components/button/Button2';
import InfoTab from 'src/react/context-menus/info-tab/InfoTab';

@connect(null, {
  contextMenu: mainActions.contextMenu,
})
export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.onClick = this.onClick.bind(this);
    setupDelegate(this, 'getInfoTabProps');
  }
  onClick(e) {
    const options = this.getOptionsForE(e);
    const { contextMenu, delegate } = this.props;

    const tabProps = this.getInfoTabProps() || {};
    if(!tabProps.delegate && delegate) {
      tabProps.delegate = delegate;
    }
    tabProps.__options = options;
    contextMenu({
      options,
      component: InfoTab,
      props: tabProps,
    });
  }
  getOptionsForE(e) {
    return {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'right',
      excludeY: true,
      positionY: 10,
    };
  }
  render() {
    const {
      contextMenu,
      delegate,
      ...rest,
    } = this.props;

    return (
      <Button
        onClick={this.onClick}
        icon="Information"
        {...rest}
      />
    );
  }
}
