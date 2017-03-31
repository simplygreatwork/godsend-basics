var Class = require('godsend').Class;
var Bus = require('godsend').Bus;
var Credentials = require('./Credentials.js');
var Storage = require('./Storage.js');
var Utility = require('./Utility.js');

Authorizer = module.exports = Class.extend({
	
	initialize: function(properties) {
		
		Object.assign(this, properties);
      this.address = this.address || Utility.address();
		this.storage = new Storage({
			users: this.users
		});
	},
	
	connect: function(callback) {
		
		new Bus({
			address: this.address,
			secure: false
		}).connect({
			credentials: {
				username: Credentials.get('authenticator').username,
				passphrase: Credentials.get('authenticator').passphrase,
			},
			initialized : function(connection) {
				this.process(connection);
			}.bind(this),
			connected: function(connection) {
				this.connection = connection;
				callback();
			}.bind(this),
			errored : function(errors) {
				console.error('Connection errors: ' + errors);
			}.bind(this)
		});
	},
	
	process: function(connection) {
		
		connection.process({
			id: 'authentication-get-user',
			on: function(request) {
				request.accept({
					topic: 'authentication',
					action: 'get-user'
				});
			}.bind(this),
			run: function(stream) {
				this.storage.get({
					collection: 'users',
					key: stream.object.username,
					callback: function(properties) {
						stream.push(properties.value);
						stream.next();
					}
				});
			}.bind(this)
		});

		connection.process({
			id: 'authentication-put-user',
			on: function(request) {
				request.accept({
					topic: 'authentication',
					action: 'put-user'
				});
			}.bind(this),
			run: function(stream) {
				this.storage.get({
					collection: 'users',
					key: stream.object.username,
					callback: function(properties) {
						if (properties.value) {
							stream.error({
								message: 'The user already exists and may not be added.'
							});
							stream.next();
						} else {
							this.storage.put({
								collection: 'users',
								key: stream.object.credentials.username,
								value: stream.object,
								callback: function(properties) {
									if (properties.error) {
										stream.push({
											success: false
										});
									} else {
										stream.push({
											success: true
										});
									}
									stream.next();
								}.bind(this)
							});
						}
					}.bind(this)
				});
			}.bind(this)
		});
	}
});
