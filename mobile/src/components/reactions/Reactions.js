import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Platform, UIManager, LayoutAnimation, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import * as a from '../../actions';
import { setupDelegate, bindAll } from '../../../swipes-core-js/classes/utils';
import RippleButton from '../ripple-button/RippleButton';
import Icon from '../icons/Icon';
import { colors } from '../../utils/globalStyles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeButtonLabel: {
    paddingLeft: 3,
    fontSize: 12,
  },
  likers: {
    paddingLeft: 3,
  }
})

class HOCReactions extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    setupDelegate(this, 'onAddReaction', 'onRemoveReaction');

    this.handleLike = this.handleLike.bind(this);

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  componentWillMount() {
    this.updateILike(this.props.reactions);
  }
  componentWillReceiveProps(nextProps) {
    this.updateILike(nextProps.reactions);
  }
  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }
  handleLike() {
    const { post, commentId: cId } = this.props;
    const { iLike } = this.state;

    console.log('cId', cId);

    if (iLike) {
      this.onRemoveReaction(post, cId)
    } else {
      this.onAddReaction(post, cId)
    }
  }
  updateILike(nextReactions) {
    const { reactions } = this.props;
    const myId = msgGen.users.getUser('me').get('id');
    const { iLike } = this.state;

    if (typeof iLike === 'undefined' || reactions !== nextReactions) {
      const newILike = !!nextReactions.find(r => r.get('created_by') === myId);

      if (iLike !== newILike) {
        this.setState({ iLike: newILike });
      }
    }
  }
  renderButton() {
    const { iLike } = this.state;
    const heartColor = iLike ? colors.red80 : colors.deepBlue100;
    const labelColor = iLike ? colors.red80 : colors.deepBlue100;

    return (
      <TouchableOpacity onPress={this.handleLike}>
        <View style={styles.likeButton}>
          <Icon name="Heart" width="12" height="12" fill={heartColor} />
          <Text style={[styles.likeButtonLabel, { color: labelColor }]}>Like</Text>
        </View>
      </TouchableOpacity>
    )
  }
  renderLikers() {
    const { reactions, commentId } = this.props;

    if (!reactions || !reactions.size) {
      return undefined;
    }

    const likeString = `— ${reactions.size}`;

    return (

      <View style={styles.likers}>
        <Text style={styles.likeButtonLabel}>
          {likeString}
        </Text>
      </View>
    )
  }
  render() {
    const { children } = this.props;

    return (
      <View style={styles.container}>
        {this.renderButton()}
        {this.renderLikers()}
        {children}
      </View>
    );
  }
}

// const { string } = PropTypes;

HOCReactions.propTypes = {};

function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps, {

})(HOCReactions);
