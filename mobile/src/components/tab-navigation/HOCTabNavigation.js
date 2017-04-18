import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet } from 'react-native';
import FeedbackButton from '../feedback-button/FeedbackButton';
import { colors, viewSize } from '../../utils/globalStyles';

class HOCTabNavigation extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <View style={styles.nav}><Text>Gayyy</Text></View>
    );
  }
}

function mapStateToProps(state) {
  return {

  };
}

export default connect(mapStateToProps, {

})(HOCTabNavigation);

const styles = StyleSheet.create({
  nav: {
    width: viewSize.width,
    height: 100,
    backgroundColor: 'green',
  },
});
