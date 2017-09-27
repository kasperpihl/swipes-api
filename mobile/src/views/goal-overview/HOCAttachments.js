import React, { PureComponent } from 'react';
import moment from 'moment';
import mime from 'react-native-mime-types';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import ImmutableVirtualizedList from 'react-native-immutable-list-view';
import ImagePicker from 'react-native-image-picker';
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
    const { createLink, createFile, addAttachment, goal, loadingModal } = this.props;

    const options = {
      title: 'Attach image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const type = mime.lookup(response.uri) || 'application/octet-stream';
        const ext = mime.extension(type);
        const name = response.fileName
          || `Photo ${moment().format('MMMM Do YYYY, h:mm:ss a')}.${ext}`;
        const file = {
          name,
          uri: response.uri,
          type,
        };
        console.log('res', response);
        loadingModal(true);
        let _title;
        createFile([file]).then((fileRes) => {
          if(!fileRes || !fileRes.ok) return new Promise((r, reject) => reject());

          const { id, title } = fileRes.file;

          _title = title;
          return createLink(this.getSwipesLinkObj('file', id, title));

        }).then((linkRes) => {
          if(!linkRes || !linkRes.ok) return new Promise((r, reject) => reject());

          return addAttachment(goal.get('id'), linkRes.link, _title);
        }).then((attRes) => {
          loadingModal();
        }).catch(() => {
          loadingModal();
        })
      }
    });
  }
  getSwipesLinkObj(type, id, title) {
    const { me } = this.props;
    return {
      service: {
        name: 'swipes',
        type,
        id,
      },
      permission: {
        account_id: me.get('id'),
      },
      meta: {
        title,
      },
    };
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
  return {
    me: state.get('me'),
  };
}

export default connect(mapStateToProps, {
  preview: a.links.preview,
  loadingModal: a.modals.loading,
  addAttachment: ca.attachments.add,
  createFile: ca.files.create,
  createLink: ca.links.create,
})(HOCAttachments);
