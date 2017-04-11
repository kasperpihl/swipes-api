import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
// import * as a from 'actions';
// import * as ca from 'swipes-core-js/actions';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import AccountList from './AccountList';

class HOCAccountList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      sections: [
        {
          id: 'Profile',
          title: 'My Profile',
          subtitle: 'get your best looks out',
        },
        {
          id: 'Organization',
          title: 'My Team',
          subtitle: 'manage here and there',
        },
        {
          id: 'Settings',
          title: 'Change Settings',
          subtitle: 'yalla yalla settings',
        },
        {
          id: 'Payment',
          title: 'Manage Payment',
          subitle: 'Hello payment'
        }
      ]
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
    })
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
