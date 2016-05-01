var React = require('react');

/*
	JSON Structure
	{
		name: string
		unread: int // number of unread messages (shows indicator)
		notification: int // number of notification to show (shows number)
		active: BOOL // if is current active, only 1 allowed
		user: BOOL // if is a user or not (e.g. bot, channel etc.)
	}
 */

var Sidemenu = React.createClass({
	getInitialState: function() {
		return {};
	},
	togglePin:function(){
		console.log("pinning", !(this.state.pinned));
		this.setState({pinned: !(this.state.pinned)});
	},
	componentDidUpdate:function(prevProps, prevState) {
		this.calculateBeforeAndAfter();    
	},
	componentDidMount:function() {
		this.bouncedCalculate = _.debounce(this.calculateBeforeAndAfter, 50);
		this.calculateBeforeAndAfter();
	},
	onScroll: function(){
		this.bouncedCalculate();
	},
	onScrollToTop: function(){
		this.refs.scroller.scrollTop = 0;
	},
	onScrollToBottom: function(){
		var height = this.refs.scroller.clientHeight;
		var scrollHeight = this.refs.scroller.scrollHeight;
		this.refs.scroller.scrollTop = Math.max(0, scrollHeight - height);
	},
	calculateBeforeAndAfter:function(){
		var itemEls = this.refs.scroller.getElementsByClassName("menu-item");
		var items = this.props.data.rows || [];
		var height = this.refs.scroller.clientHeight;
		var itemHeight = 26;
		var unreadAbove = 0;
		var notificationAbove = 0;
		var i;

		// above scroll (saving loops by breaking)
		for(i = 0 ; i < itemEls.length ; i++){
			var el = itemEls[i];
			var top = el.getBoundingClientRect().top;
			if(top < 0){
				var item = items[i];
				if(item.unread){ 
					unreadAbove += item.unread;
				}
				if(item.notification){ 
					notificationAbove += item.notification;
				}
			}
			else break;
		}
		// below scroll (saving loops by breaking)
		var unreadBelow = 0;
		var notificationBelow = 0;
		for(i = (itemEls.length -1) ; i > 0 ; i--){
			var el = itemEls[i];
			var top = el.getBoundingClientRect().top;
			if(top + itemHeight > height){
				var item = items[i];
				if(item.unread){ 
					unreadBelow += item.unread;
				}
				if(item.notification){ 
					notificationBelow += item.notification;
				}
			}
			else break;
		}
		if( unreadAbove != this.state.unreadAbove ||
			notificationAbove != this.state.notificationAbove ||
			unreadBelow != this.state.unreadBelow || 
			notificationBelow != this.state.notificationBelow ){

			this.setState({
				unreadAbove: unreadAbove,
				unreadBelow: unreadBelow,
				notificationAbove: notificationAbove,
				notificationBelow: notificationBelow
			});
		}
	},
	renderNotificationAbove:function(){
		var data = {
			name: "- Unread above -",
			unread: this.state.unreadAbove,
			notification: this.state.notificationAbove
		};
		if(!this.state.unreadAbove && !this.state.notificationAbove){
			return;
		}
		return (
			<div style={{position: 'absolute', zIndex: 1000, boxShadow: '0px 0px 8px -4px rgba(0,0,0,0.75)', top: 0, left: 0, background: 'white', height: '26px', width: '100%'}}>
				<Sidemenu.Item onClick={this.onScrollToTop} data={data} />
			</div>
		);
	},
	renderNotificationBelow: function(){
		var data = {
			name: "- Unread below -",
			unread: this.state.unreadBelow,
			notification: this.state.notificationBelow
		};
		if(!this.state.unreadBelow && !this.state.notificationBelow){
			return;
		}
		return (
			<div style={{position: 'absolute', zIndex: 1000, boxShadow: '0px 0px 8px -4px rgba(0,0,0,0.75)', bottom: 0, left: 0, background: 'white', height: '26px', width: '100%'}}>
				<Sidemenu.Item onClick={this.onScrollToBottom} data={data} />
			</div>
		);
	},
	render: function() {
		var className = "swipes-sidemenu";
		if(this.state.pinned){
			className += " pinned";
		}
		if(this.state.forceClose){
			className += " force-close";
		}

		var items = this.props.data.rows || [];
		var renderedChannels = [];
		var renderedUsers = [];
		var renderedStarred = [];
		_.each(items, function(item, i ){
			if(item.starred){
				renderedStarred.push(<Sidemenu.Item onClick={this.onClick} data={item} key={i}/>)
			}
			else if(!item.user) {
				renderedChannels.push(<Sidemenu.Item onClick={this.onClick} data={item} key={i}/>);
			}
			else{
				renderedUsers.push(<Sidemenu.Item onClick={this.onClick} data={item} key={i}/>);
			}
		}.bind(this))

		var overlayAbove, overlayBelow;
		return (
			<div className={className} onMouseLeave={this.onMouseLeave} onMouseEnter={this.onMouseEnter} style={this.props.style}>
				<div className="relative-wrapper">
					{this.renderNotificationAbove()}
					<div ref="scroller" onScroll={this.onScroll} className="scroller">
						{(renderedStarred.length) ? (<h3>Starred</h3>) : null}
						{(renderedStarred.length) ? renderedStarred : null}
						<h3>Channels</h3>
						{renderedChannels}
						<h3>Direct Messages</h3>
						{renderedUsers}
					</div>
				</div>
				{this.renderNotificationBelow()}
			</div>
		);
	},
	onClick: function(data){
		if(typeof this.props.onSelectedRow === 'function'){
			this.props.onSelectedRow(data);
			this.setState({forceClose: true});
			setTimeout(function(){
				this.setState({forceClose: false});
			}.bind(this), 1500);
		}
	}
});


Sidemenu.Item = React.createClass({
	renderNotification:function(){
		var count = parseInt(this.props.data.notification, 10);
		var even = (count % 2 == 0) ? "even" : "odd";

		if(count){
			var className = "notification " + even;
			return <div className={className}>{count}</div>;
		}
	},
	renderIndicator:function(){
		var count = parseInt(this.props.data.unread, 10);
		var even = (count % 2 == 0) ? "even" : "odd";
		var className = "indicator ";

		if(count){
			className += even;
		}
		return <div className={className} />
	},
	render: function(){
		var className = "menu-item";
		var presence = '';
		if(this.props.data.unread){
			className += " unread";
		}
		if(this.props.data.active){
			className += " active";
		}
		if(this.props.data.user && this.props.data.presence === 'active') {
			presence = 'presence active'
		} else if (this.props.data.user) {
			presence = 'presence'
		} else if (!this.props.data.user) {
			presence = ''
		}


		return (
			<div onClick={this.onClick} className={className}>
				{this.renderIndicator()}
				{this.renderNotification()}
				<div className={"name " + presence}>{this.props.data.name}</div>
		</div>
	);


	},
	onClick: function(){
		this.props.onClick(this.props.data);
	}
})
module.exports = Sidemenu;
