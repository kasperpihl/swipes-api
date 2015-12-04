var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');
var stateStore = require('../stores/StateStore');
var Navigation = Router.Navigation;
var Login = React.createClass({
	mixins: [ Navigation, Reflux.ListenerMixin ],
	onContinue: function(){
		if($(this.refs.create).is(":checked"))
			this.signup();
		else
			this.login();
	},
	onStateChange: function(states){
		if(states.isLoggedIn){
			return this.transitionTo('/');
		}
	},
	componentWillMount:function(){
		this.listenTo(stateStore, this.onStateChange, this.onStateChange);
	},
	signup: function(){
		var username = $(this.refs.username).val();
		var email = username + "@swipesapp.com";

		var password = username;
		var data = {
			email: email,
			name: username,
			password: password,
			repassword: password
		};
		var self = this;
		swipes._client.callSwipesApi({force:true, command:"users.create"}, data, function(res,error){
			console.log(res,error);
			if(res && res.ok){
				stateStore.actions.login(res.token);
			}
			else
				alert("Login failed");
		});
		return;
	},
	login: function(){
		var username = $(this.refs.username).val();
		var email = username + "@swipesapp.com";
		var password = username;
		var data = {
			email: email,
			password: password
		};
		var self = this;
		swipes._client.callSwipesApi({force:true, command:"users.login"}, data, function(res,error){
			console.log(res,error);
			if(res && res.ok){
				stateStore.actions.login(res.token);
			}
			else
				alert("Login failed");
		});
		return;
	},
	render: function() {

		return (
			<div className="login">

				<div className="input-wrapper" error-attribute="">
					<input ref="username" type="text" className="username borderless" placeholder="Enter your username" />
				</div>
				<div >
					<input type="radio" name="choice" defaultChecked/>Login
					<input ref="create" type="radio" id="create-choice" name="choice" />Create Account
				</div>
				<input type="button" onClick={this.onContinue} value="Continue" />
			</div>
		);
	}
});

module.exports = Login;
