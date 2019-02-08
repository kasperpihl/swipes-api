import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as navigationActions from 'src/redux/navigation/navigationActions';
import SW from './Breadcrumbs.swiss';

@connect(
  (state, props) => ({
    history: state.navigation.get(props.side)
  }),
  {
    pop: navigationActions.pop
  }
)
export default class Breadcrumbs extends Component {
  static propTypes = {
    side: PropTypes.oneOf(['left', 'right']).isRequired
  };
  handleClickCached = i => () => {
    const { side, pop } = this.props;
    pop(side, i);
  };
  renderBreadcrumbs() {
    const { history } = this.props;

    if (!history) {
      return undefined;
    }

    return history
      .map((crumb, i) => {
        if (
          (history.size === 1 && !crumb.get('showTitleInCrumb')) ||
          (history.size > 1 && i === history.size - 1)
        ) {
          return null;
        }
        const disableClick = history.size === i + 1;
        return (
          <SW.Crumb
            key={i}
            className="crumb"
            disableClick={disableClick}
            onClick={this.handleClickCached(i)}
          >
            {i > 0 && (
              <SW.Seperator>
                <SW.CrumbIcon disableClick={disableClick} icon="Breadcrumb" />
              </SW.Seperator>
            )}
            <SW.Title disableClick={disableClick}>
              {crumb.get('crumbTitle')}
            </SW.Title>
          </SW.Crumb>
        );
      })
      .toArray()
      .filter(v => !!v);
  }
  render() {
    return <SW.Wrapper>{this.renderBreadcrumbs()}</SW.Wrapper>;
  }
}
