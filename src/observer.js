
function Observer() {}

Object.defineProperty(Observer.prototype, 'watch', {
	enumerable: false,
	configurable: true,
	writable: false,
	value: function(prop, handler) {
		enumerable: false,
		configurable: true,
		writable: false,
		var 
			oldVal = this[prop],
			newVal = oldVal,
			getter = function () {
				return newVal;
			},
			setter = function (val) {
				oldVal = newVal;
				var tapVal = handler.call(this, prop, oldVal, val);
				newVal = ('undefined' !== typeof tapVal) && tapVal || val;
				return newVal;
			};

		Object.defineProperty(this, prop, {
			enumerable: true,
			configurable: true,
			writable: true,
			get: getter,
			set: setter			
		});
	}

});

Object.defineProperty(Observer.prototype, 'unwatch', {
	enumerable: false,
	configurable: true,
	writable: false, 
	value: function (prop) {
		var val = this[prop]; // preserve prop value
		delete this[prop];    // remove accessor
		this[prop] = val;     // set prop value
	}
});
