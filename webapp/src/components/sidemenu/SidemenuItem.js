import React, { Component, PropTypes } from 'react'
class SidemenuItem extends Component {
  constructor(props) {
    super(props)
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
    let presenceClass = '';
    const { unread, notification, active, user, name, presence } = this.props.data;
    if(unread){
      className += " unread";
    }
    if(active){
      className += " active";
    }
    if(user && presence === 'active') {
      presenceClass = 'presence active'
    } else if (user) {
      presenceClass = 'presence'
    } else if (!user) {
      presenceClass = 'channel'
    }


    return (
      <div onClick={this.onClick} className={className}>
        {this.renderIndicator(unread)}
        {this.renderNotification(notification)}
        <div className={"name " + presenceClass}>{name}</div>
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
  data: PropTypes.object
}
