import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
// import * as a from 'actions';
// import * as ca from 'swipes-core-js/actions';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import AccountList from './AccountList';

class HOCAccountList extends PureComponent {
  static minWidth() {
    return 600;
  }
  static maxWidth() {
    return 600;
  }
  constructor(props) {
    super(props);
    this.state = {
      sections: [
        {
          id: 'Profile',
          title: 'My Profile',
          subtitle: 'Change your profile picture and correct your surname',
        },
        {
          id: 'Organization',
          title: 'Manage Team',
          subtitle: 'Invite new team members and manage current ones',
        },
        {
          id: 'Settings',
          title: 'Change Settings',
          subtitle: 'Manage integrations',
        },
        {
          id: 'Payment',
          title: 'Payment',
          subtitle: 'Manage payment',
        },
      ],
    };
  }
  componentDidMount() {
  }
  onClick(section) {
    console.log('section', section);
    const { navPush } = this.props;
    navPush({
      id: section.id,
      title: section.title,
    });
  }
  render() {
    const { sections } = this.state;
    console.log(sections);
    return (
      <AccountList
        sections={sections}
        delegate={this}
      />
    );
  }
}
// const { string } = PropTypes;

HOCAccountList.propTypes = {};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps, {
})(HOCAccountList);
