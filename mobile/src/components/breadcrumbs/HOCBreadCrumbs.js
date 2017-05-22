import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import * as a from '../../actions';
import { setupCachedCallback } from '../../../swipes-core-js/classes/utils';
import { colors, viewSize } from '../../utils/globalStyles';
import Icon from '../icons/Icon.js';

const styles = StyleSheet.create({
  breadCrumbs: {
    width: viewSize.width,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgColor,
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 2,
    paddingHorizontal: 15,
  },
  breadcrumb: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 34,
    paddingBottom: 6,
  },
  breadcrumbLabel: {
    flexDirection: 'row',
    color: colors.deepBlue30,
    fontSize: 12,
  },
});

class HOCBreadCrumbs extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    this.crumbPress = setupCachedCallback(this.crumbPress, this);
  }
  crumbPress(i) {
    const { navPop, sliderIndex } = this.props;

    navPop(sliderIndex, i);
  }
  render() {
    const { routes } = this.props;
    let breadCrumbs;

    if (routes && routes.size > 1) {
      breadCrumbs = routes.map((r, i) => {
        if (i < routes.size - 1) {
          return (
            <TouchableOpacity onPress={this.crumbPress(i)} key={i}>
              <View style={styles.breadcrumb} key={i} >
                <Text style={styles.breadcrumbLabel}>{r.get('title')}</Text>
                <Icon name="Breadcrumb" width="24" height="24" fill={colors.deepBlue30} />
              </View>
            </TouchableOpacity>
          );
        }
      });
    }

    return (
      <View style={styles.breadCrumbs}>
        {breadCrumbs}
      </View>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    routes: state.getIn(['navigation', 'sliders', ownProps.sliderIndex, 'routes']),
  };
}

export default connect(mapStateToProps, {
  navPop: a.navigation.pop,
})(HOCBreadCrumbs);
