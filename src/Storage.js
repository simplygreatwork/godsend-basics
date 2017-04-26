
var fs = require('fs');

Storage = module.exports = Class.extend({
	
	initialize: function(properties) {
		
		Object.assign(this, properties);
		this.path = process.cwd() + '/users.json';
		this.users = this.users || {};
		this.load(function(users) {
			Object.keys(users).forEach(function(key) {
				this.users[users[key].credentials.username] = users[key];
			}.bind(this));
		}.bind(this));
	},
	
	put: function(properties) {
		
		this.users[properties.key] = properties.value;
		properties.callback({
			error: null
		});
		this.save();
	},
	
	get: function(properties) {
		
		var value = this.users[properties.key];
		properties.callback({
			error: null,
			value: value
		});
	},

	save: function() {
		
		fs.writeFileSync(this.path, JSON.stringify(this.users, null, 2));
	},

	load: function(callback) {
		
		var result = {};
		if (fs.existsSync(this.path)) {
			var string = fs.readFileSync(this.path);
			if (string) {
				try {
					var object = JSON.parse(string);
					result = object;
				} catch (e) {
					console.error('Could not parse data JSON string.')
				}
			}
		}
		callback(result);
	}
});
