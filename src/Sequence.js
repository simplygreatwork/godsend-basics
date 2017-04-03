var Step = require('step');

Sequence = module.exports = {
	
	start: function() {
		
		var next = null;
		var args = Array.prototype.slice.call(arguments);
		var wrapped = [];
		args.forEach(function(each) {
			wrapped.push(function(e) {
				if (e) throw e;						// Step.js does not throw exceptions by default: so wrapping to throw
				each();
			})
		});
		wrapped.unshift(function() {
			next = function() {
				setTimeout(function() {
					this();
				}.bind(this), 1);
			}.bind(this);
			next();
		});
		
		Step.apply(this, wrapped);
		
		return {
			next: next
		};
	}
};
