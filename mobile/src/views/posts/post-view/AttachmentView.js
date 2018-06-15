import React, { PureComponent } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { bindAll, attachmentIconForService } from 'swipes-core-js/classes/utils';
import { setupDelegate } from 'react-delegate';
import * as gs from 'styles';
import HOCHeader from 'HOCHeader';
import RippleButton from 'RippleButton';
import Icon from 'Icon';
import WaitForUI from 'WaitForUI';

const styles = StyleSheet.create({
  container: {
    ...gs.mixins.size(1),
  },
  list: {
    ...gs.mixins.size(1),
  },
  addAttachmentButton: {
    ...gs.mixins.size(44),
    ...gs.mixins.flex('center'),
  },
  attachments: {
    ...gs.mixins.padding(0, 15),
    paddingTop: 15,
  },
  attachment: {
    ...gs.mixins.size(1),
    ...gs.mixins.flex('row', 'left', 'center'),
    ...gs.mixins.padding(0, 12),
    ...gs.mixins.border(1, gs.colors.deepBlue10),
    borderRadius: 6,
    height: 48,
    marginBottom: 6,
  },
  attachmentLabel: {
    ...gs.mixins.size(1),
    ...gs.mixins.font(12, gs.colors.deepBlue80),
    fontWeight: '500',
    paddingLeft: 12,
  }
})

class AttachmentView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    setupDelegate(this, 'onChooseAttachmentTypeToAdd', 'onAttachmentPress');
  }
  componentDidMount() {
    const { attachments } = this.props;
    
    if (!attachments.size) {
      this.onChooseAttachmentTypeToAdd();
    }
  }
  renderHeader() {

    return (
       <HOCHeader
        title="Attachments"
      >
        <RippleButton onPress={this.onChooseAttachmentTypeToAdd}>
          <View style={styles.addAttachmentButton}>
            <Icon icon="Plus" width="24" height="24" fill={gs.colors.deepBlue80} />
          </View>
        </RippleButton>
      </HOCHeader>
    )
  }
  renderAttachments() {
    const { attachments } = this.props;

    if (!attachments.size) {
      return undefined;
    }

    const attachmentsRender = attachments.map((att, i) => (
      <RippleButton onPress={this.onAttachmentPressCached(att)} key={i}>
        <View style={styles.attachment}>
          <Icon
            icon={attachmentIconForService(att.getIn(['link', 'service']))}
            width="24"
            height="24"
            fill={gs.colors.deepBlue80}
          />
          <Text style={styles.attachmentLabel} numberOfLines={1} ellipsizeMode="tail">{att.get('title')}</Text>
        </View>
      </RippleButton>
    ))

    return (
      <View style={styles.attachments}>
        {attachmentsRender}
      </View>
    )
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        <WaitForUI>
          <ScrollView style={styles.list}>
            {this.renderAttachments()}
          </ScrollView>
        </WaitForUI>
      </View>
    );
  }
}

export default AttachmentView

// const { string } = PropTypes;

AttachmentView.propTypes = {};
