import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import * as a from "actions";
import Search from './Search';
import WaitForUI from 'WaitForUI';

class HOCSearch extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchString: '',
      toSearchString: ''
    };

    this.onOpenSearchResult = this.onOpenSearchResult.bind(this);
  }
  componentDidMount() {
    const { setActionButtons } = this.props;

    setActionButtons({
      hide: true
    })
  }
  componentWillUpdate(nextProps) {
    const { setActionButtons } = this.props;

    if (nextProps.isActive && !this.props.isActive) {
      setActionButtons({
        hide: true
      })
    }
  }
  onChange(value) {
    this.setState({ searchString: value  });
  }
  onSearch() {
    const { searchString } = this.state;
    this.setState({ toSearchString: searchString })
  }
  onOpenSearchResult(id, res) {
    const { navPush } = this.props;

    if (id.startsWith('M')) {
      navPush({
        id: 'MilestoneOverview',
        title: 'Milestone overview',
        props: {
          milestoneId: id,
        },
      })
    } else if (id.startsWith('G')) {
      navPush({
        id: 'GoalOverview',
        title: 'Goal overview',
        props: {
          goalId: id,
        },
      })
    } else if (id.startsWith('P')) {
      navPush({
        id: 'PostView',
        title: 'Post',
        props: {
          postId: id
        }
      })
    }
  }
  onPopNav() {
    const { sliderChange } = this.props;

    sliderChange(2);
  }
  render() {
    const { searchString, toSearchString }  = this.state;

    return <WaitForUI><Search searchString={searchString} toSearchString={toSearchString} delegate={this} /></WaitForUI>
  }
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, {
  sliderChange: a.navigation.sliderChange,
})(HOCSearch);
