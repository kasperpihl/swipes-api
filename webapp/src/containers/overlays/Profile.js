import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { overlay } from '../../actions'
import { bindAll } from '../../classes/utils'
import PureRenderMixin from 'react-addons-pure-render-mixin';

class Profile extends Component {
  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    bindAll(this, ['clickedServices'])
  }
  clickedServices(){
    const { pushOverlay } = this.props;
    pushOverlay({component: "Services", title: "Services"});
  }
  render() {
    const { me } = this.props;
    console.log('me', me);
    console.log('me.toJS()', me.toJS());
    console.log("me.get('name')", me.get('name'));
    console.log("me.getIn(['services', 0])", me.getIn(['services', 0, 'authData']));
    console.log("me.getIn(['services', 0]).toJS()", me.getIn(['services', 0]).toJS());
    return (
      <div onClick={this.clickedServices}>Hello
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    me: state.get('me')
  }
}

import { map, mapContains, list, listOf } from 'react-immutable-proptypes'
const { string } = PropTypes;
Profile.propTypes = {
}


const ConnectedProfile = connect(mapStateToProps, {
  pushOverlay: overlay.push
})(Profile)
export default ConnectedProfile