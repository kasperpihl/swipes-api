/*
  JSON Structure
  {
    name: string
    unread: int // number of unread messages (shows indicator)
    notification: int // number of notification to show (shows number)
  }
 */
import React, { Component, PropTypes } from 'react'
import SidemenuItem from './SidemenuItem'

class Sidemenu extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidUpdate(prevProps, prevState) {
    this.calculateBeforeAndAfter()
  }
  componentDidMount() {
    this.bouncedCalculate = debounce(this.calculateBeforeAndAfter, 50);
    this.calculateBeforeAndAfter()
  }
  onScroll(){
    this.bouncedCalculate();
  }
  scrollToTop(){
    this.refs.scroller.scrollTop = 0;
  }
  scrollToBottom(){
    const height = this.refs.scroller.clientHeight;
    const scrollHeight = this.refs.scroller.scrollHeight;
    this.refs.scroller.scrollTop = Math.max(0, scrollHeight - height);
  }
  togglePin(){

    console.log("pinning", !(this.state.pinned));
    this.setState({pinned: !(this.state.pinned)});
    if(this.props.onWidthChanged){
      let newWidth = 210;
      if(!this.state.pinned){
        newWidth = 30;
        setTimeout(() => {
          this.props.onWidthChanged(newWidth);
        }, 300);
      }
      else{
        this.props.onWidthChanged(newWidth);
      }

    }
  }
  calculateBeforeAndAfter(){
    var itemEls = this.refs.scroller.getElementsByClassName("menu-item");
    var items = this.props.data.rows || [];
    var height = this.refs.scroller.clientHeight;
    var itemHeight = 26;
    let unreadAbove = 0;
    let notificationAbove = 0;
    let unreadBelow = 0;
    let notificationBelow = 0;

    itemEls.forEach((el, i) => {

      const item = items[i];

      const top = el.getBoundingClientRect().top;
      const below = (top + itemHeight > height)
      const above = (top < 0)
      if(item.unread){
        unreadAbove += above ? item.unread : 0;
        unreadBelow += below ? item.unread : 0;
      }
      if(item.notification){
        notificationAbove += above ? item.notification : 0;
        notificationBelow += below ? item.notification : 0;
      }
    })

    if( unreadAbove != this.state.above.unread ||
      notificationAbove != this.state.above.notification ||
      unreadBelow != this.state.below.unread ||
      notificationBelow != this.state.below.notification ){

      this.setState({
        above: {
          name: "- Unread above -",
          unread: unreadAbove,
          notification: notificationAbove
        }
        below: {
          name: "- Unread below -",
          unread: unreadBelow,
          notification: notificationBelow
        }
      });
    }
  }
  renderNotificationOverlay(below){
    const styles = {top: 0, position: 'absolute', zIndex: 1000, boxShadow: '0px 0px 8px -4px rgba(0,0,0,0.75)', left: 0, background: 'white', height: '26px', width: '100%'};
    let onClick = this.scrollToTop
    let data = this.state.above

    if(below){
      data = this.state.below
      onClick = this.scrollToBottom
      delete styles.top
      styles.bottom = 0
    }
    
    // If no extra notifications, let's not render anything, shall we.
    if(!data || (!data.unread && !data.notification)){
      return;
    }

    return (
      <div style={styles}>
        <SidemenuItem onClick={onClick} data={data} />
      </div>
    );
  },
  renderRows(rows, sectionI){
    return rows.map((item, i ) => {
      return <SidemenuItem onClick={this.onClick} data={item} key={sectionI + '-' + i}/>
    })
  }
  renderTitle(title, sectionI){
    return <h3 key={sectionI + '-title'}>title</h3>
  }
  render() {
    let className = "swipes-sidemenu";

    const { pinned, forceClose } = this.state
    let { data } = this.props

    if(pinned){
      className += " pinned";
    }
    if(forceClose){
      className += " force-close";
    }

    if(!Array.isArray(data)){
      data = [ data ]
    }
    
    let renderedItems = [];
    data.forEach((section, i) => {
      if(section.title){
        renderedItems.push(this.renderTitle(section.title, i));
      }
      renderedItems.push(this.renderRows(section.rows, i));
    })

    return (
      <div className={className} style={this.props.style}>
        <div className="relative-wrapper">
          {this.renderNotificationOverlay()}
          <div ref="scroller" onScroll={this.onScroll} className="scroller">
            {renderedItems}
          </div>
        </div>
        {this.renderNotificationOverlay('below')}
      </div>
    );
  }
  onClick(data){
    if(this.props.onSelectedRow){
      this.props.onSelectedRow(data);
      this.setState({forceClose: true});
      setTimeout(() => {
        this.setState({forceClose: false});
      }, 1500);
    }
  }
}
export default Sidemenu

const rowProps = PropTypes.arrayOf(PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  unread: PropTypes.number,
  notification: PropTypes.number
}))

Sidemenu.propTypes = {
  onWidthChanged: PropTypes.func,
  onSelectedRow: PropTypes.func.isRequired,
  data: PropTypes.shape({
    sections: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string,
      rows: rowProps.isRequired
    })).isRequired,
    activeRowId: PropTypes.string

  }).isRequired
}