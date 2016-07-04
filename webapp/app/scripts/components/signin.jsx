var React = require('react');
var Router = require('react-router');
var Link = require('react-router').Link;
var Reflux = require('reflux');
var Vivus = require('vivus');
var stateStore = require('../stores/StateStore');
var TextField = require('material-ui/lib/text-field');
var Signin = React.createClass({
	mixins: [ Reflux.ListenerMixin ],
	componentDidMount:function() {
		amplitude.logEvent('Session - Opened Login');
        mixpanel.track('Opened Login');

        var direction = 1;

        var Layer_1 = new Vivus('Layer_1', {
            type: 'scenario'
        });

        function animation() {
            Layer_1.play(direction);
        };

        animation(direction);

        setInterval(function() {
            direction = direction > 0 ? -1 : 1;

            animation();
        }, 13500)
	},
	signin: function(){
		var email = this.refs.username.getValue();
		var password = this.refs.password.getValue();
		var data = {
			email: email,
			password: password
		};
		var self = this;
		swipesApi.request({force:true, command:"users.login"}, data, function(res,error){
			console.log(res,error);
			if(res && res.ok){
				amplitude.logEvent('Session - Signed In');
        mixpanel.track('Signed In');
				stateStore.actions.login(res.token);
			}
			else
				alert("Login failed");
		});
		return;
	},
	preventSubmit: function(e) {
		e.preventDefault();
	},
	render: function() {
		return (
            <div className="main-log-wrapper">
                <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2560 1440">
                    <g>
                        <path data-start="100" data-duration="200" d="M2459.51,1440c-159.52-86.32-303.59-207.33-420.17-361.41-145.45-192.23-419.2-230.14-611.43-84.69C1286.41,1101,1228.53,1277.58,1265.86,1440" />
                        <path data-start="150" data-duration="120" d="M2560,1393.06c-172.32-81.49-328.06-204.61-451-367.14-174.55-230.67-503-276.17-733.71-101.63-164.13,124.19-234.51,326.33-198.58,515.71" />
                        <path data-start="60" data-duration="230" d="M2560,1295.62c-145.13-75.31-276.2-183.3-381.43-322.37a608.27,608.27,0,0,0-303.71-214.17c-182.2-57.21-388.4-28.41-552.29,95.6C1135.8,996,1053.09,1223.84,1088,1440" />
                        <path data-start="30" data-duration="320" d="M2560,1196.13a1044.23,1044.23,0,0,1-311.82-275.56C2015.45,613,1577.46,552.34,1269.89,785.07,1060.47,943.54,965.53,1197.17,999.72,1440" />
                        <path data-start="0" data-duration="300" d="M2560,1093.76A958.46,958.46,0,0,1,2317.79,867.9C2058,524.57,1570.84,454.71,1225.28,709.44q-4,3-8.06,6C985.14,891.07,878,1170.57,911.65,1440" />
                        <path data-start="90" data-duration="120" d="M2560,987.3a873.4,873.4,0,0,1-172.6-172.07C2096.49,430.77,1549,354.94,1164.55,645.85,909.81,838.61,790.57,1144,823.74,1440" />
                        <path data-start="20" data-duration="250" d="M2560,874.48a789.55,789.55,0,0,1-103-111.93c-320-422.9-922.24-506.31-1345.14-186.31C834.47,786.14,703.14,1117.49,735.93,1440" />
                        <path data-start="40" data-duration="310" d="M2560,750.73q-17.31-19.64-33.38-40.85C2177.53,248.53,1520.54,157.53,1059.2,506.63,853.42,662.34,721.32,879.31,669.09,1112.85A1052.88,1052.88,0,0,0,648.23,1440"  />
                        <path data-start="10" data-duration="190" d="M2560,611.74C2174,151.75,1490.77,70.59,1006.52,437c-322.73,244.21-478.15,627.49-446,1003" />
                        <path data-start="20" data-duration="220"  d="M2560,482.2C2135.77,52.47,1448.45-6.85,953.85,367.4,608.46,628.76,441,1038,473,1440" />
                        <path data-start="10" data-duration="330"  d="M2560,361.94a1301.11,1301.11,0,0,0-313.78-206.17c-425.67-198.7-944.37-161.16-1345,142C533.12,576.3,353.65,1011.58,385.41,1440" />
                    </g>
                </svg>

                <svg id="Layer_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2560 1440">
                    <g>
                        <path d="M2459.51,1440c-159.52-86.32-303.59-207.33-420.17-361.41-145.45-192.23-419.2-230.14-611.43-84.69C1286.41,1101,1228.53,1277.58,1265.86,1440" />
                        <path d="M2560,1393.06c-172.32-81.49-328.06-204.61-451-367.14-174.55-230.67-503-276.17-733.71-101.63-164.13,124.19-234.51,326.33-198.58,515.71" />
                        <path d="M2560,1295.62c-145.13-75.31-276.2-183.3-381.43-322.37a608.27,608.27,0,0,0-303.71-214.17c-182.2-57.21-388.4-28.41-552.29,95.6C1135.8,996,1053.09,1223.84,1088,1440" />
                        <path d="M2560,1196.13a1044.23,1044.23,0,0,1-311.82-275.56C2015.45,613,1577.46,552.34,1269.89,785.07,1060.47,943.54,965.53,1197.17,999.72,1440" />
                        <path d="M2560,1093.76A958.46,958.46,0,0,1,2317.79,867.9C2058,524.57,1570.84,454.71,1225.28,709.44q-4,3-8.06,6C985.14,891.07,878,1170.57,911.65,1440" />
                        <path d="M2560,987.3a873.4,873.4,0,0,1-172.6-172.07C2096.49,430.77,1549,354.94,1164.55,645.85,909.81,838.61,790.57,1144,823.74,1440" />
                        <path d="M2560,874.48a789.55,789.55,0,0,1-103-111.93c-320-422.9-922.24-506.31-1345.14-186.31C834.47,786.14,703.14,1117.49,735.93,1440" />
                        <path d="M2560,750.73q-17.31-19.64-33.38-40.85C2177.53,248.53,1520.54,157.53,1059.2,506.63,853.42,662.34,721.32,879.31,669.09,1112.85A1052.88,1052.88,0,0,0,648.23,1440"  />
                        <path d="M2560,611.74C2174,151.75,1490.77,70.59,1006.52,437c-322.73,244.21-478.15,627.49-446,1003" />
                        <path d="M2560,482.2C2135.77,52.47,1448.45-6.85,953.85,367.4,608.46,628.76,441,1038,473,1440" />
                        <path d="M2560,361.94a1301.11,1301.11,0,0,0-313.78-206.17c-425.67-198.7-944.37-161.16-1345,142C533.12,576.3,353.65,1011.58,385.41,1440" />
                    </g>
                </svg>

                <div className="wrapper">
                    <div className="logo"></div>
                    <h1>Welcome to your Swipes</h1>
                    <div className="sign-up-card">
                        <h2>sign in to swipes</h2>
                        <form action="" onSubmit={this.preventSubmit}>
                            {/*<div className="swipes-floating-label" error-message="Error message">
                                <input ref="username" className="swipes-floating-input username borderless" type="text" id="email"/>
                                <label htmlFor="email">Email address</label>
                            </div>
                            <div className="swipes-floating-label" error-message="Error message">
                                <input className="swipes-floating-input" type="password" id="password"/>
                                <label htmlFor="password">Password</label>
                            </div>*/}
														<br/>
														<TextField floatingLabelText="Email" ref="username" id="email" className="username"/>
	    											<TextField floatingLabelText="Password" ref="password" type="password" />
														<br/>
                            <input type="submit" className="login-submit" value="SIGN IN" onClick={this.signin}/>
                        </form>
                    </div>
                    <h3>You don't have an account yet?</h3>
										<div className="signup-button"><Link to="/signup">SIGN UP</Link></div>
                </div>
            </div>
		);
	}
});

module.exports = Signin;
