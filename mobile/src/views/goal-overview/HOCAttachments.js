import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Platform, UIManager, LayoutAnimation } from 'react-native';
import { connect } from 'react-redux';
import ImmutableListView from 'react-native-immutable-list-view';
import { attachmentIconForService, setupCachedCallback } from '../../../swipes-core-js/classes/utils';
import EmptyListFooter from '../../components/empty-list-footer/EmptyListFooter';
import Icon from '../../components/icons/Icon';
import * as a from '../../actions';
import RippleButton from '../../components/ripple-button/RippleButton';
import { colors } from '../../utils/globalStyles';


class HOCAttachments extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    this.renderAttachment = this.renderAttachment.bind(this);
    this.attachmentPress = setupCachedCallback(this.attachmentPress, this);
  }
  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }
  attachmentPress(att) {
    const { preview } = this.props;

    preview(att);
  }
  renderAttachment(attachment) {
    const { attachments } = this.props;

    const at = attachments.get(attachment);
    const icon = attachmentIconForService(at.getIn(['link', 'service']) || at);

    return (
      <RippleButton rippleColor={colors.deepBlue60} style={styles.attachment} rippleOpacity={0.8} key={attachment} onPress={this.attachmentPress(at)}>
        <View style={styles.attachment}>
          <View style={styles.icon}>
            <Icon name={icon} width="24" height="24" fill={colors.blue100} />
          </View>
          <Text style={styles.label} ellipsizeMode="tail">{at.get('title')}</Text>
        </View>
      </RippleButton>
    );
  }
  renderFooter() {
    return <EmptyListFooter />;
  }
  renderAttachmentList() {
    const {
      attachmentOrder,
    } = this.props;

    return (
      <ImmutableListView
        removeClippedSubviews={false}
        immutableData={attachmentOrder}
        renderRow={this.renderAttachment}
        renderFooter={this.renderFooter}
      />
    );
  }
  render() {
    return (
      <View>
        {this.renderAttachmentList()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  attachment: {
    flex: 1,
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
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
  preview: a.links.preview,
})(HOCAttachments);
