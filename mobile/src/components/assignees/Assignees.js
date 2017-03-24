import React, { Component, PropTypes } from 'react';
import { 
  View,
  StyleSheet,
  Image,
  Text
} from 'react-native';
import Icon from '../icons/Icon';
import { colors } from '../../utils/globalStyles';

class Assignees extends Component {
  constructor(props) {
    super(props);
    this.state = {
      maxImages: props.maxImages || 2,
    };
  }
  renderAddAssignees() {
    return (
      <View style={styles.icon}>
        <Icon name="Person" fill={colors.deepBlue40} width="24" height="24" />
      </View>
    );
  }
  renderAssignees() {
    const { assignees } = this.props;
    const { maxImages } = this.state;

    if (!assignees || assignees.size < 1) {
      return this.renderAddAssignees();
    }

    const renderPeople = assignees.map((a, i) => {
      const pic = a.get('profile_pic');
      const firstLetter = a.get('first_name').charAt(0);

      if (i < maxImages || (i === maxImages && assignees.size === (maxImages + 1))) {
        if (pic) {
          return (
            <View style={[styles.profileImageWrapper, { zIndex: 0 - i }]} key={i}>
              <Image style={styles.profileImage} source={{ uri: pic }}/>
            </View>
          ) 
        }
        return (
          <View key={i}>
            <Text>{firstLetter}</Text>
          </View>
        );
      }
      return undefined;
    });

    let morePeople;

    if (assignees.size > (maxImages + 1)) {
      morePeople = <View style={[styles.morePeople, {zIndex: 1}]}><Text style={styles.morePeopleText}>+{assignees.size - maxImages}</Text></View>;
    }

    return (
      <View style={styles.profiles}>
        {morePeople}
        <View style={styles.people}>
          {renderPeople}
        </View>
      </View>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderAssignees()}
      </View>
    );
  }
}

export default Assignees;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginRight: 9
  },
  profiles: {
    flexDirection: 'row'
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.deepBlue20,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 50,
    
  },
  profileImageWrapper: {
    width: 33,
    height: 33,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginRight: -9,
  },
  people: {
    flexDirection: 'row'

  },
  morePeople: {
    width: 32,
    height: 32,
    borderRadius: 50,
    backgroundColor: colors.deepBlue20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
    marginRight: -9,
    paddingBottom: 1

  },
  morePeopleText: {
    fontSize: 12,
    color: colors.deepBlue80,
  }
})