// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 		: '1824637854455196', // your App ID
		'clientSecret' 	: 'a297fdc023d2a9036255c1ede22a2bb3', // your App Secret
		'callbackURL' 	: 'https://scodelab.herokuapp.com/user/auth/facebook/callback'
	},

	'twitterAuth' : {
		'consumerKey' 		: 'o5qWY52WGnbUR0CXjjB2TKq9h',
		'consumerSecret' 	: 'l3HLN9RfURRHNRZr1ogdO75r01bhwCh8xqrCZgKvzyzk3JrK7j',
		'callbackURL' 		: 'https://scodelab.herokuapp.com/user/auth/twitter/callback'
	},

	'googleAuth' : {
		'clientID' 		: '1075508508694-psupcrdu2evuquru0rsuqbpgcblq3vda.apps.googleusercontent.com',
		'clientSecret' 	: 'O-UwYdbGid2d_y6UhOn9uW5_',
		'callbackURL' 	: 'https://scodelab.herokuapp.com/user/auth/google/callback'
	}

};