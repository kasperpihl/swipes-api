import React, { Component, PropTypes } from 'react'
import { bindAll } from '../../classes/utils'
class SidemenuItem extends Component {
  constructor(props) {
    super(props)
    bindAll(this, ['onClick'])
  }
  renderNotification(notification){
    const count = parseInt(notification, 10);
    const even = (count % 2 == 0) ? "even" : "odd";

    if(count){
      const className = "notification " + even;
      return <div className={className}>{count}</div>;
    }
  }
  renderIndicator(unread){
    const count = parseInt(unread, 10);
    let even = (count % 2 == 0) ? "even" : "odd";
    let className = "indicator ";

    if(count){
      className += even;
    }
    return <div className={className} />
  }
  render(){
    let className = "menu-item";
    const { unread, notification, active, name } = this.props.data;
    if(unread){
      className += " unread";
    }
    if(active){
      className += " active";
    }


    return (
      <div data-row={this.props.rowI} data-section={this.props.sectionI} onClick={this.onClick} className={className}>
        {this.renderIndicator(unread)}
        {this.renderNotification(notification)}
        <div className={"name"}>{name}</div>
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
