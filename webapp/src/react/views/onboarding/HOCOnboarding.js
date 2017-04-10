import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import { map } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import Onboarding from './Onboarding';

class HOCOnboarding extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onClick(i, e) {
    console.log('i', i, e);
    const { browser, target, userOnboarding, complete, openSecondary } = this.props;
    openSecondary({
      id: 'Preview',
      title: 'Preview',
      props: {
        preview: {
          header: {
            title: 'Welcome video',
          },
          file: {
            content_type: 'video/quicktime',
            url: 'https://s3-us-west-2.amazonaws.com/staging.swipesapp.com/uploads/ONY8E94FL/1491855333-UVZWCJDHK/Thread%20concept.mov'
          }
        }
      }
    })
    //browser(target, 'http://youtube.com');
    //complete(userOnboarding.getIn(['order', i]));
  }
  render() {
    const { onboarding, userOnboarding } = this.props;
    const items = userOnboarding.get('order').map(
      (id) => onboarding.get(id).set('completed', !!userOnboarding.getIn(['completed',id]))
    );
    return (
      <Onboarding
        items={items}
        delegate={this}
      />
    );
  }
}
const { func } = PropTypes;

HOCOnboarding.propTypes = {
  onboarding: map,
  userOnboarding: map,
  complete : func,
};

function mapStateToProps(state) {
  return {
    onboarding: state.get('onboarding'),
    userOnboarding: state.getIn(['me', 'settings', 'onboarding']),
  };
}

export default connect(mapStateToProps, {
  complete: ca.onboarding.complete,
  browser: a.main.browser,
})(HOCOnboarding);
