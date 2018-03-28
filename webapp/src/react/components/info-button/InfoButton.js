import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as a from 'actions';
import { setupDelegate } from 'react-delegate';
import Button from 'src/react/components/button/Button2';
import InfoTab from 'context-menus/info-tab/InfoTab';

class InfoButton extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.onClick = this.onClick.bind(this);
    setupDelegate(this, 'getInfoTabProps');
    // setupLoading(this);
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

export default connect(null, {
  contextMenu: a.main.contextMenu,
})(InfoButton);
