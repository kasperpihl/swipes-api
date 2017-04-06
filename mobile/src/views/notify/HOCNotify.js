import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, TextInput, Image } from 'react-native';
import Header from '../../components/header/Header';
import HOCAssigning from '../../components/assignees/HOCAssigning';
import { colors } from '../../utils/globalStyles';

class HOCNotify extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '', height: 162 };
  }
  renderHeader() {
    return <Header title={this.props.title} />;
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
            multiline
            onChange={(event) => {
              this.setState({
                text: event.nativeEvent.text,
              });
            }}
            value={this.state.text}
            placeholderTextColor={colors.deepBlue50}
            underlineColorAndroid={colors.bgColor}
            style={[styles.input, { height: Math.max(27, this.state.height) }]}
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
    height: 162,
    padding: 0,
    margin: 0,
    marginLeft: 15,
    paddingRight: 9,
    paddingLeft: 3,
    marginTop: 3,
    color: colors.deepBlue100,
    fontSize: 15,
    lineHeight: 25,
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
