Utility = module.exports = {
	
	address: function(options) {
		
		if (options && options.secure) {
			return 'https://127.0.0.1:' + (process.env.PORT || 8080) + '/';
		} else {
			return 'http://127.0.0.1:' + (process.env.PORT || 8080) + '/';
		}
	}
};
