import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { colors, viewSize } from '../../utils/globalStyles';
import Icon from '../icons/Icon.js';

class HOCBreadCrumbs extends PureComponent {
  renderBreadcrumbs() {
    const { routes } = this.props;

    if (routes && routes.size > 1) {
      const breadCrumbsJSX = routes.map((r, i) => {
        if (i < routes.size - 1) {
          return (
            <View style={styles.breadcrumb} key={i} >
              <Text style={styles.breadcrumbLabel}>{r.get('title')}</Text>
              <Icon name="Breadcrumb" width="24" height="24" fill={colors.deepBlue30} />
            </View>
          );
        }
      });

      return (
        <View style={styles.breadcrumbs}>
          {breadCrumbsJSX}
        </View>
      );
    }

    return (
      <View />
    );
  }
  render() {
    const { routes } = this.props;
    let breadCrumbs;

    if (routes && routes.size > 1) {
      breadCrumbs = routes.map((r, i) => {
        if (i < routes.size - 1) {
          return (
            <View style={styles.breadcrumb} key={i} >
              <Text style={styles.breadcrumbLabel}>{r.get('title')}</Text>
              <Icon name="Breadcrumb" width="24" height="24" fill={colors.deepBlue30} />
            </View>
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

const styles = StyleSheet.create({
  breadCrumbs: {
    width: viewSize.width,
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgColor,
    position: 'absolute',
    left: 0,
    top: 30,
    zIndex: 2,
    paddingHorizontal: 15,
  },
  breadcrumb: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  breadcrumbLabel: {
    flexDirection: 'row',
    marginTop: -2,
    color: colors.deepBlue30,
    fontSize: 12,
  },
});

function mapStateToProps(state, ownProps) {
  return {
    routes: state.getIn(['navigation', 'sliders', ownProps.sliderIndex, 'routes']),
  };
}

export default connect(mapStateToProps, {
})(HOCBreadCrumbs);
