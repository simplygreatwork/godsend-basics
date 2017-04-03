
var path = require('path');
var Express = require('express');
Express.serveIndex = require('serve-index');
var Logger = require('js-logger');
var Class = require('godsend').WebServer;
var SocketServer = require('godsend').SocketServer;
var exchange = require('godsend').Exchange;

Server = module.exports = Class.extend({
   
   initialize: function(properties) {
      
		Logger.useDefaults();
		Logger.setLevel(Logger.INFO);
      if (false) Logger.setLevel(Logger.OFF);
      Object.assign(this, properties);
      this.address = this.address || 'http://127.0.0.1:' + (process.env.PORT || 8080) + '/'
   },
   
   start: function(callback) {
      
      console.log('Starting server.');
      this.server = {};
      var options = {};
      if (this.key) options.key = this.key;
      if (this.cert) options.cert = this.cert;
      this.server.web = new WebServer({
         options: options
      });
      this.server.web.start(function(express) {
         if (process.env.PWD) {
            express.use('/', Express.static(path.join(process.env.PWD, '../../examples')));
            express.use('/', Express.serveIndex(path.join(process.env.PWD, '../../examples'), {
               'icons': true
            }));
            express.use('/godsend-client.js', Express.static(path.join(process.env.PWD, '../../node_modules/godsend/dist/godsend-client.js')));
            express.use('/godsend-basics-client.js', Express.static(path.join(process.env.PWD, '../../node_modules/godsend-basics/dist/godsend-basics-client.js')));
         }
         this.server.socket = new SocketServer({
            server: this.server.web.server,
            address : this.address,
            exchange: this.exchange || new exchange.Secure({
               users: require('./users.json')
            })
         });
         this.server.socket.start(function() {
            callback();
         });
      }.bind(this));
   }
});
