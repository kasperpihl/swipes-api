import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import * as a from "actions";
import Search from './Search';

class HOCSearch extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchString: '',
      toSearchString: ''
    };
  }
  componentDidMount() {
    const { setActionButtons } = this.props;

    setActionButtons({
      hide: true
    })
  }
  onChange(value) {
    this.setState({ searchString: value  });
  }
  onSearch() {
    const { searchString } = this.state;
    this.setState({ toSearchString: searchString })
  }
  onOpenSearchResult(id, res) {
    console.warn(id)
  }
  onPopNav() {
    const { sliderChange } = this.props;

    sliderChange(2);
  }
  render() {
    const { searchString, toSearchString }  = this.state;

    return <Search searchString={searchString} toSearchString={toSearchString} delegate={this} />
  }
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, {
  sliderChange: a.navigation.sliderChange,
})(HOCSearch);
