import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as a from 'actions';
import { setupDelegate } from 'react-delegate';
// import * as ca from 'swipes-core-js/actions';
// import * s from 'selectors';
// import * as cs from 'swipes-core-js/selectors';
// import { setupLoading } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import Button from 'Button';
import InfoTab from 'context-menus/info-tab/InfoTab';

class HOCInfoButton extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.onClick = this.onClick.bind(this);
    setupDelegate(this, 'getInfoTabProps');
    // setupLoading(this);
  }
  onClick(e) {
    const options = this.getOptionsForE(e);
    const { contextMenu } = this.props;

    const tabProps = this.getInfoTabProps() || {};
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
// const { string } = PropTypes;

HOCInfoButton.propTypes = {};

export default connect(null, {
  contextMenu: a.main.contextMenu,
})(HOCInfoButton);
