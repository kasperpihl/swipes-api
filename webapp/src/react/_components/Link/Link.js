import React, { PureComponent } from 'react';
import { addGlobalStyles } from 'swiss-react';
import { connect } from 'react-redux';
import * as mainActions from 'src/redux/main/mainActions';
import withNav from 'src/react/_hocs/Nav/withNav';

addGlobalStyles({
  '.links': {
    color: '$blue',
    '&:hover': {
      textDecoration: 'underline'
    }
  }
});

@withNav
@connect(
  null,
  {
    browser: mainActions.browser
  }
)
export default class Link extends PureComponent {
  onClick = () => {
    let { browser, nav, url } = this.props;
    if (url.indexOf('://') === -1) {
      url = `https://${url}`;
    }
    browser(nav.side, url);
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
