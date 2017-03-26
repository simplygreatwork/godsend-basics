var fs = require('fs');
var path = require('path');
var Express = require('express');
Express.serveIndex = require('serve-index');
var Logger = require('js-logger');
var Class = require('godsend').WebServer;
var SocketServer = require('godsend').SocketServer;
var exchange = require('godsend').Exchange;

Server = module.exports = Class.extend({
   
   initialize: function(properties) {
      
      Logger.setLevel(Logger.INFO);
      if (false) Logger.setLevel(Logger.OFF);
      Object.assign(this, properties);
      if (this.secure) {
         this.options = {
            key: fs.readFileSync('/home/ubuntu/workspace/trust/server.key.private.pem'),
            cert: fs.readFileSync('/home/ubuntu/workspace/trust/server.cert.pem'),
            requestCert: false
         };
      }
   },
   
   start: function(callback) {

      console.log('Starting server.');
      this.server = {};
      this.server.web = new WebServer({
         options: this.options || {}
      });
      this.server.web.start(function(express) {
         express.use('/', Express.static(path.join(process.env.PWD, '../../examples')));
         express.use('/', Express.serveIndex(path.join(process.env.PWD, '../../examples'), {
            'icons': true
         }));
         express.use('/godsend-client.js', Express.static(path.join(process.env.PWD, '../../node_modules/godsend/client.js')));
         this.server.socket = new SocketServer({
            server: this.server.web.server,
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
