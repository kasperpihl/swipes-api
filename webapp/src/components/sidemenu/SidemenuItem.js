import React, { Component, PropTypes } from 'react'
import { bindAll } from '../../classes/utils'
class SidemenuItem extends Component {
  constructor(props) {
    super(props)
    bindAll(this, ['onClick'])
  }
  renderNotification(notification){
    const count = parseInt(notification, 10);
    const even = (count % 2 == 0) ? "swipes-sidemenu__item__notification--even" : "swipes-sidemenu__item__notification--odd";

    if(count){
      const className = "swipes-sidemenu__item__notification " + even;
      return <div className={className}>{count}</div>;
    }
  }
  renderIndicator(unread){
    const count = parseInt(unread, 10);
    let even = (count % 2 == 0) ? "swipes-sidemenu__item__indicator--even" : "swipes-sidemenu__item__indicator--odd";
    let className = "swipes-sidemenu__item__indicator ";

    if(count){
      className += even;
    }
    return <div className={className} />
  }
  render(){
    let className = "swipes-sidemenu__item";
    const { unread, notification, active, name } = this.props.data;

    if(unread){
      className += " swipes-sidemenu__item--unread";
    }
    if(active){
      className += " swipes-sidemenu__item--active";
    }

    return (
      <div data-row={this.props.rowI} data-section={this.props.sectionI} onClick={this.onClick} className={className}>
        {this.renderIndicator(unread)}
        {this.renderNotification(notification)}
        <div className="swipes-sidemenu__item__title">{name}</div>
    </div>
  );


  }
  onClick(){
    this.props.onClick(this.props.data);
  }
}
export default SidemenuItem

SidemenuItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    unread: PropTypes.number,
    notification: PropTypes.number
  })
}
