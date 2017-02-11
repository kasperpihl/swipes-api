import React, { PureComponent, PropTypes } from 'react';
import { map } from 'react-immutable-proptypes';
import { fromJS } from 'immutable';

import { connect } from 'react-redux';
import * as actions from 'actions';
import { setupDelegate } from 'classes/utils';
import BrowseSectionList from './BrowseSectionList';

import './styles/browse.scss';

class HOCBrowse extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      queries: fromJS([]),
      results: fromJS([]),
      selectedIndexes: fromJS([]),
      accountId: null,
      serviceName: null,
    };
    this.callDelegate = setupDelegate(props.delegate);
  }

  componentDidMount() {
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.queries !== this.state.queries) {
      console.log('updated q', this.state);
      this.fetchQuery();
    }
    /* if (prevState.paths.length !== this.state.paths.length) {
      setTimeout(() => {
        const { scroller } = this.refs;
        if (scroller) {
          const scrollW = scroller.scrollWidth;
          const clientW = scroller.clientWidth;
          scroller.scrollLeft = Math.max(scrollW - clientW, 0);
        }
      }, 600);
    }*/
  }
  fetchQuery() {
    const {
      queries,
      results,
      serviceName,
      accountId,
    } = this.state;

    if (queries.size !== results.size) {
      const query = queries.last();
      const { request } = this.props;
      request('services.browse', {
        service_name: serviceName,
        account_id: accountId,
        query,
      }).then((res) => {
        console.log(res);

        if (res && res.ok) {
          this.setState({ results: results.push(res.result) });
        }
      });
    }
  }
  clickedItem(depth, i, entry) {
    const { queries, results, selectedIndexes } = this.state;
    if (typeof depth !== 'number') {
      this.setState({
        queries: queries.clear().push(null),
        results: results.clear(),
        selectedIndexes: selectedIndexes.clear(),
        serviceName: entry.serviceName,
        accountId: entry.accountId,
      });
    } else {
      const r = results.get(depth).items[i];
      if (r && r.on_click.type === 'query') {
        const query = r.on_click.query;
        this.setState({
          queries: queries.setSize(depth + 1).push(query),
          results: results.setSize(depth + 1),
          selectedIndexes: selectedIndexes.setSize(depth).push(i),
        });
      } else if (r && r.on_click.type === 'preview') {
        this.callDelegate('onPreviewLink', r.on_click.preview);
      }
    }
  }
  mapResults(items) {
    return items.map(item => ({
      title: item.title,
      leftIcon: item.left_icon,
      rightIcon: (item.on_click.type === 'query') ? 'ArrowRightLine' : undefined,
    }));
  }
  renderSidebarSection() {
    const { me, services } = this.props;
    const myServices = me.get('services')
                          .filter(s => services.getIn([s.get('service_id'), 'browse']))
                          .sort((a, b) => a.get('service_name').localeCompare(b.get('service_name')));
    const { accountId, serviceName } = this.state;
    let selectedIndex;

    const props = {
      delegate: this,
      sections: [{
        title: 'Services',
        items: myServices.map((s, i) => {
          if (s.get('id') === accountId && s.get('service_name') === serviceName) {
            selectedIndex = i;
          }
          return {
            id: s.get('service_name'),
            serviceName: s.get('service_name'),
            accountId: s.get('id'),
            title: services.getIn([s.get('service_id'), 'title']),
          };
        }).toArray(),
      }, {
        title: 'Shortcuts',
        items: [
          { id: '1', title: 'Brand Guidelines', leftIcon: 'Note' },
          { id: '2', title: 'Design notes', leftIcon: 'Note' },
          { id: '3', title: 'Production', leftIcon: 'Person', rightIcon: 'ArrowRightLine' },
          { id: '4', title: 'Prototype', leftIcon: 'Person', rightIcon: 'ArrowRightLine' },
          { id: '5', title: 'creative', leftIcon: 'Hashtag', rightIcon: 'ArrowRightLine' },
          { id: '6', title: 'general', leftIcon: 'Hashtag', rightIcon: 'ArrowRightLine' },
          { id: '7', title: 'Kasper', leftIcon: 'Person' },
          { id: '8', title: 'Journal', leftIcon: 'Note' },
        ],
      }],
    };
    props.selectedIndex = selectedIndex;
    return <BrowseSectionList {...props} />;
  }
  renderHorizontalSections() {
    const {
      queries,
      selectedIndexes,
      results,
    } = this.state;

    return queries.map((q, i) => {
      const r = results.get(i);
      let sections;
      if (r) {
        sections = [{
          title: r.title,
          items: this.mapResults(r.items),
        }];
      }

      const props = {
        depth: i,
        delegate: this,
        selectedItemId: selectedIndexes.get(i),
        loading: !r,
        sections,
      };
      return <BrowseSectionList key={i} {...props} />;
    });
  }
  render() {
    return (
      <div className="browse-container">
        <div className="browse-sidebar">
          {this.renderSidebarSection()}
        </div>
        <div className="browse-horizontal-scroller" ref="scroller">
          {this.renderHorizontalSections()}
        </div>
      </div>
    );
  }
}

const { func, object } = PropTypes;
HOCBrowse.propTypes = {
  request: func,
  me: map,
  services: map,
  delegate: object,
};

function mapStateToProps(state) {
  return {
    services: state.getIn(['main', 'services']),
    me: state.get('me'),
  };
}

export default connect(mapStateToProps, {
  request: actions.api.request,
  preview: actions.main.preview,
})(HOCBrowse);
