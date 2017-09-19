import React, { PureComponent } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { ImmutableListView } from 'react-native-immutable-list-view';
import EmptyListFooter from 'components/empty-list-footer/EmptyListFooter';
import { colors } from 'globalStyles';

const styles = StyleSheet.create({
  assigneeWrapper: {
    height: 60,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.deepBlue5,
  },
  profilePicWrapper: {
    width: 30,
    height: 30,
    borderRadius: 15,
    flex: 0,
  },
  profilePic: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  initials: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.deepBlue100,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0,
  },
  initialsLabel: {
    fontSize: 28,
    color: colors.bgColor,
    includeFontPadding: false,
  },
  assigneeLabelWrapper: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: 'center',
  },
  assigneeLabel: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.deepBlue90,
  }
})

class AssigneesList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    this.renderAssignee = this.renderAssignee.bind(this);
  }
  renderProfilePic(uId) {
    const image = msgGen.users.getPhoto(uId);
    const initials = msgGen.users.getInitials(uId);

    if (!image) {
      return (
        <View style={styles.initials}>
          <Text selectable={true} style={styles.initialsLabel}>
            {initials.toUpperCase()}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.profilePicWrapper}>
        <Image source={{ uri: image }} style={styles.profilePic} />
      </View>
    );
  }
  renderAssignee(uId) {
    const name = msgGen.users.getFullName(uId);
    
    return (
      <View style={styles.assigneeWrapper}>
        {this.renderProfilePic(uId)}
        <View style={styles.assigneeLabelWrapper}>
          <Text style={styles.assigneeLabel}>{name}</Text>
        </View>
      </View>
    )
  }
  renderFooter() {
    return <EmptyListFooter />;
  }
  render() {
    const { assignees } = this.props;

    return (
      <View>
        <ImmutableListView
          removeClippedSubviews={false}
          immutableData={assignees}
          renderRow={this.renderAssignee}
          renderFooter={this.renderFooter}
        />
      </View>
    );
  }
}

export default AssigneesList

// const { string } = PropTypes;

AssigneesList.propTypes = {};
