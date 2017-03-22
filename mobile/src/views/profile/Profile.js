import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import FeedbackButton from '../../components/feedback-button/FeedbackButton';
import { viewSize } from '../../utils/globalStyles';

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {};
  }
  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={require('../../assets/img/profile.png')}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  }
});

export default Profile;
