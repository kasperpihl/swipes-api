import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as a from 'actions';
// import * as ca from 'swipes-core-js/actions';
// import * s from 'selectors';
import * as cs from 'swipes-core-js/selectors';
import { bindAll } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import './styles/discuss-button.scss';

class HOCDiscussButton extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    bindAll(this, ['onDiscuss', 'onFeed']);
    // setupLoading(this);
  }
  componentDidMount() {
  }
  onFeed() {
    const { openSecondary, target, filterId, filterTitle } = this.props;
    openSecondary(target, {
      id: 'PostFeed',
      title: 'Discussions',
      props: {
        filterId,
        filterTitle,
      },
    });
  }
  onDiscuss() {
    const { navPush, target, filterId, filterTitle, taggedUsers } = this.props;
    navPush(target, {
      id: 'CreatePost',
      title: 'Create Post',
      props: {
        context: {
          title: filterTitle,
          id: filterId,
        },
        taggedUsers
      },
    });
  }
  renderLeftSide() {
    return (
      <div className="discuss-button__button" onClick={this.onDiscuss}>Discuss</div>
    )
  }
  renderRightSide() {
    const { posts } = this.props;

    return (
      <div className="discuss-button__button" onClick={this.onFeed}>{posts.size}</div>
    )
  }
  render() {
    return (
      <div className="discuss-button">
        {this.renderLeftSide()}
        {this.renderRightSide()}
      </div>
    );
  }
}
// const { string } = PropTypes;

HOCDiscussButton.propTypes = {};

function mapStateToProps(state, ownProps) {
  return {
    posts: cs.posts.getSortedIds(state, ownProps),
  };
}

export default navWrapper(connect(mapStateToProps, {
  openSecondary: a.navigation.openSecondary,
  navPush: a.navigation.push,
})(HOCDiscussButton));
