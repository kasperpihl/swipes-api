import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import * as a from 'actions';
import { setupDelegate, bindAll } from 'swipes-core-js/classes/utils';
import Icon from 'Icon';
import { colors } from 'globalStyles';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 54,
    paddingHorizontal: 15,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeButtonLabel: {
    paddingHorizontal: 5,
    fontSize: 12,
    includeFontPadding: false,
    marginTop: 3,
  },
})

class HOCReactions extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    setupDelegate(this, 'onAddReaction', 'onRemoveReaction');

    this.handleLike = this.handleLike.bind(this);
  }
  componentWillMount() {
    this.updateILike(this.props.reactions);
  }
  componentWillReceiveProps(nextProps) {
    this.updateILike(nextProps.reactions);
  }
  handleLike() {
    const { post, commentId: cId } = this.props;
    const { iLike } = this.state;

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
    const heartFill = iLike ? colors.red80 : 'transparent';
    const heartStroke = iLike ? colors.red80 : colors.deepBlue40;

    return (
      <View style={styles.likeButton}>
        <Icon icon="Heart" width="24" height="24" fill={heartFill} stroke={heartStroke} />
      </View>
    )
  }
  renderLikers() {
    const { reactions, commentId } = this.props;
    const { iLike } = this.state;

    if (!reactions || !reactions.size) {
      return undefined;
    }

    const likeString = `${reactions.size}`;
    const labelColor = iLike ? colors.red80 : colors.deepBlue40;

    return (

      <View style={styles.likers}>
        <Text selectable={true} style={[styles.likeButtonLabel, { color: labelColor }]}>
          {likeString}
        </Text>
      </View>
    )
  }
  render() {
    const { children, height } = this.props;
    const heightStyles = height ? { height: height } : {};

    return (
      <TouchableOpacity onPress={this.handleLike}>
        <View style={[styles.container, heightStyles]}>
          {this.renderLikers()}
          {this.renderButton()}
          {children}
        </View>
      </TouchableOpacity>
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
