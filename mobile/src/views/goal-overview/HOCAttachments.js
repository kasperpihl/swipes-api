import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Platform, UIManager, LayoutAnimation } from 'react-native';
import { connect } from 'react-redux';
import { attachmentIconForService } from '../../../swipes-core-js/classes/utils';
import FeedbackButton from '../../components/feedback-button/FeedbackButton';
import Icon from '../../components/icons/Icon';
import { colors, viewSize } from '../../utils/globalStyles';


class HOCAttachments extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }
  getHelper() {
    const { goal } = this.props;
    return new GoalsUtil(goal);
  }
  renderAttachments() {
    const {
      attachments,
      attachmentOrder,
    } = this.props;

    return attachmentOrder.map((aId) => {
      const at = attachments.get(aId);
      const icon = attachmentIconForService(at.getIn(['link', 'service']) || at);

      return (
        <View key={aId} style={styles.attachment}>
          <View style={styles.icon}>
            <Icon name={icon} width="24" height="24" fill={colors.deepBlue100} />
          </View>
          <Text style={styles.label}>{at.get('title')}</Text>
        </View>
      );
    });
  }
  render() {
    return (
      <View>
        {this.renderAttachments()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  attachment: {
    width: viewSize.width,
    height: 72,
    marginHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.deepBlue5,
  },
  icon: {
    paddingRight: 18,
  },
  label: {
    color: colors.deepBlue100,
    fontSize: 18,
  },
});


function mapStateToProps(state) {
  return {
    me: state.get('me'),
  };
}

export default connect(mapStateToProps, {
})(HOCAttachments);
