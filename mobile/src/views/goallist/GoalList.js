import React, { Component } from 'react';
import { View, Text, StyleSheet, ListView } from 'react-native';
import FeedbackButton from '../../components/feedback-button/FeedbackButton';
import { viewSize } from '../../utils/globalStyles';

class GoalList extends Component {
  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      dataSource: ds.cloneWithRows(['row 1', 'row 2', 'row 1', 'row 2', 'row 1', 'row 2', 'row 1', 'row 2', 'row 1', 'row 2', 'row 1', 'row 2', 'row 2', 'row 1', 'row 2', 'row 1', 'row 2', 'row 1', 'row 2', 'row 1', 'row 2', 'row 1', 'row 2']),
    };
  }
  render() {
    return (
      <View style={styles.container}>
        <ListView
          style={styles.container}
          dataSource={this.state.dataSource}
          renderRow={(rowData) => <Text style={styles.text}>{rowData}</Text>}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    width: 200,
    height: 50,
    backgroundColor: '#333ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  buttonLabel: {
    color: 'white'
  },
  image: {
    width: viewSize.width,
    height: viewSize.height
  },
  text: {
    paddingVertical: 60,
    fontSize: 40,
  }
});

export default GoalList;
