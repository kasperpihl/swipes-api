import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import * as actions from 'actions';
import { setupDelegate } from 'classes/utils';

class HOCOrgDashboard extends Component {
  static contextButtons() {
    return [{
      component: 'Button',
      props: {
        icon: 'ArrowRightIcon',
        text: 'View Goals',
        alignIcon: 'right',
      },
    }];
  }
  constructor(props) {
    super(props);
    this.state = {};
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.callDelegate = setupDelegate(props.delegate);
  }
  componentDidMount() {
    this.callDelegate('viewDidLoad', this);
  }
  onContextClick() {
    const {
      navPush,
    } = this.props;
    navPush({
      component: 'GoalList',
      title: 'Goals',
      props: {
      },
    });
  }

  render() {
    return (
      <div className="className" />
    );
  }
}

function mapStateToProps(state) {
  return {
    main: state.get('main'),
  };
}

export default connect(mapStateToProps, {
  navPush: actions.navigation.push,
})(HOCOrgDashboard);
