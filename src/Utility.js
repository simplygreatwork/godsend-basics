Utility = module.exports = {
	
	address: function() {
		
		return 'http://127.0.0.1:' + (process.env.PORT || 8080) + '/';
	}
};
