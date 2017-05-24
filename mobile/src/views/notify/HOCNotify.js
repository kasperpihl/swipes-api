import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, TextInput, Image } from 'react-native';
import HOCHeader from '../../components/header/HOCHeader';
import HOCAssigning from '../../components/assignees/HOCAssigning';
import { colors } from '../../utils/globalStyles';

class HOCNotify extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
  }
  renderHeader() {
    return <HOCHeader title={this.props.title} />;
  }
  renderWriteHandoff() {
    const { me } = this.props;
    const assignees = [`${me.get('id')}`];

    return (
      <View style={styles.handoff}>
        <View style={styles.profileImage}>
          <HOCAssigning assignees={[`${me.get('id')}`]} />
        </View>
        <View style={styles.handoffInput}>
          <TextInput
            numberOfLines={6}
            multiline
            onChange={(event) => {
              this.setState({
                text: event.nativeEvent.text,
              });
            }}
            value={this.state.text}
            placeholderTextColor={colors.deepBlue50}
            style={styles.input}
          />
        </View>
      </View>
    );
  }
  renderAttachmentList() {

  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        {this.renderWriteHandoff()}
        {/* {this.renderAttachmentList()}*/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
  },
  handoff: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 15,
  },
  profileImage: {
    width: 32,
  },
  handoffInput: {
    flex: 1,
  },
  input: {
    padding: 0,
    margin: 0,
    marginLeft: 15,
    paddingRight: 9,
    paddingLeft: 3,
    paddingBottom: 15,
    marginTop: 3,
    fontSize: 15,
    lineHeight: 25,
    textAlignVertical: 'top',
  },
});

function mapStateToProps(state, ownProps) {
  return {
    goal: state.getIn(['goals', ownProps.goalId]),
    me: state.get('me'),
  };
}

export default connect(mapStateToProps, {
})(HOCNotify);
