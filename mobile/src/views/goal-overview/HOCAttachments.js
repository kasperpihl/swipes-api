import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import ImmutableVirtualizedList from 'react-native-immutable-list-view';
import { attachmentIconForService, setupCachedCallback } from 'swipes-core-js/classes/utils';
import EmptyListFooter from 'components/empty-list-footer/EmptyListFooter';
import Icon from 'Icon';
import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import RippleButton from 'RippleButton';
import { colors } from 'globalStyles';
import * as gs from 'styles';


class HOCAttachments extends PureComponent {
  constructor(props) {
    super(props);

    this.renderAttachment = this.renderAttachment.bind(this);
    this.onAddAttachment = this.onAddAttachment.bind(this);
    this.attachmentPress = setupCachedCallback(this.attachmentPress, this);
  }
  onAddAttachment() {
    const { uploadAttachment, addAttachment, goal, showLoading } = this.props;

    uploadAttachment((att) => {
      showLoading('Adding to goal');
      addAttachment(goal.get('id'), att.get('link').toJS()).then((res) => {
        showLoading();
      });
    });
  }
  attachmentPress(att) {
    const { preview } = this.props;

    preview(att);
  }
  renderEmptyState() {

    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateLabel}>No attached materials to this goal. Attach an image from your phone with the "+" button.</Text>
      </View>
    )
  }
  renderAttachment(attachment) {
    const { attachments } = this.props;

    const at = attachments.get(attachment);
    const icon = attachmentIconForService(at.getIn(['link', 'service']) || at);

    return (
      <RippleButton rippleColor={colors.deepBlue60} style={styles.attachment} rippleOpacity={0.8} key={attachment} onPress={this.attachmentPress(at)}>
        <View style={styles.attachment}>
          <View style={styles.icon}>
            <Icon name={icon} width="24" height="24" fill={colors.deepBlue100} />
          </View>
          <Text selectable={true} style={styles.label} ellipsizeMode="tail">{at.get('title')}</Text>
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

    if (!attachmentOrder.size) return this.renderEmptyState();

    return (
      <ImmutableVirtualizedList
        removeClippedSubviews={false}
        immutableData={attachmentOrder}
        renderRow={this.renderAttachment}
        renderFooter={this.renderFooter}
      />
    );
  }
  renderFAB() {
    return (
      <View style={styles.fabWrapper}>
        <RippleButton rippleColor={colors.bgColor} rippleOpacity={0.5} style={styles.fabButton} onPress={this.onAddAttachment}>
          <View style={styles.fabButton}>
            <Icon name="Plus" width="24" height="24" fill={colors.bgColor} />
          </View>
        </RippleButton>
      </View>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderAttachmentList()}
        {this.renderFAB()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...gs.mixins.size(1),
  },
  attachment: {
    ...gs.mixins.size(1),
    ...gs.mixins.flex('row', 'left', 'center'),
    ...gs.mixins.padding(0, 15),
    minHeight: 50,
  },
  icon: {
    paddingRight: 9,
  },
  label: {
    ...gs.mixins.font(15, gs.colors.deepBlue100, 18),
  },
  fabWrapper: {
    ...gs.mixins.size(60),
    borderRadius: 60 / 2,
    position: 'absolute',
    right: 15, bottom: 30,
  },
  fabButton: {
    ...gs.mixins.size(60),
    ...gs.mixins.flex('center'),
    backgroundColor: gs.colors.blue100,
    borderRadius: 60 / 2,
  },
  emptyState: {
    ...gs.mixins.size(1),
    ...gs.mixins.flex('center'),
    ...gs.mixins.padding(0, 70),
  },
  emptyStateLabel: {
    ...gs.mixins.font(13, gs.colors.deepBlue60, 18),
    textAlign: 'center'
  }
});


function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, {
  uploadAttachment: a.attachments.upload,
  showLoading: a.main.loading,
  preview: a.attachments.preview,
  addAttachment: ca.attachments.add,
})(HOCAttachments);
