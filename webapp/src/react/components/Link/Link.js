import React, { PureComponent } from 'react';
import { addGlobalStyles } from 'swiss-react';
import { connect } from 'react-redux';
import * as mainActions from 'src/redux/main/mainActions';
import navWrapper from 'src/react/app/view-controller/NavWrapper';

addGlobalStyles({
  '.links': {
    color: '$blue',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});

@navWrapper
@connect(
  null,
  {
    browser: mainActions.browser,
  }
)
export default class Link extends PureComponent {
  onClick = () => {
    let { browser, target, url } = this.props;
    if (url.indexOf('://') === -1) {
      url = `https://${url}`;
    }
    browser(target, url);
  };
  render() {
    const { url, title } = this.props;
    return (
      <a className="links" onClick={this.onClick}>
        {title || url}
      </a>
    );
  }
}
