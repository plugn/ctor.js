// @title        validator
// @description  form fields validator for data rendered by formDump component
// @dependency   underscore.js
// @author       Max L Dolgov 
// @email        bananafishbone at gmail dot com

var validator = (function(){

	function lcType(val){
		return String(typeof val).toLowerCase();
	};

	// cast a field value to appropriate one
	function vCast(val, type){
			// if null | undefined
			if (null == val) return null;   

			switch ( lcType(val) ) {
				case 'string':
					return val.replace(/(^\s+|\s+$)/g, '');
				case 'number':
					return (0===val || !isFinite(val))? 0 : val;
				default:
					return val;  
			}
	}

	// native validation rules
	var vRules = {
		base: vCast
	}


	function Field(name, value, conf){
		conf = conf || {};
		console.log(' * Field('+name+')', value, conf);		
		this.name = name;
		this.value = value;

		// built-in value cast
		this.castValue = vCast(value);

		// castResult = castFunc(castValue)
		this.castFunc = ('function' == lcType(conf.castFunc) && conf.castFunc) || undefined; 
		this.castResult = undefined;
	
		this.checked = false;
		this.resolved = false;
		this.rejected = false;

		this.setRules( conf.rules );

	}

	Field.prototype._checkRules = function(rules){
		// console.log( ' _checkRules() rules', rules, '; lcType() : ', lcType(rules) );
		if (null == rules || 'object' !== lcType(rules)) {
			throw new Error('Field._checkRules() bad argument rules:' + rules);
		}
	}

	Field.prototype.setRules = function(rules){
		var rex = /^regexp:/g;
		var self = this;
		self.rules = [];

		// if array : keynames of vRules
		if (_.isEmpty(rules)) {
			self.rules.push(vRules.base);
		} else {
			// must be an array even if length of 1
			if ('string' == lcType(rules)) rules = [].concat(rules);
			self._checkRules(rules);

			_.each(rules, function(rule, key){ 

				if ('string' == lcType(rule)) {
					if (rule in vRules) {
						self.rules.push( vRules[rule] );
					} else if ('regexp' === key || rex.test(rule)) {
						try {
							var refunc = Function('str', ' return new RegExp("'+rule.replace(rex,'')+'","g").test(str); ');
							if ('function' == lcType(refunc)) self.rules.push(refunc);
						} catch (e) { ; }
					}

				} else if ('function' == lcType(rule)) {
					self.rules.push(rule);
				}

			});

		}
	}

	Field.prototype.check = function(){
		var self = this;
		console.log('check() self: ', self);
		self._checkRules(self.rules);

		var test = {};
		_.each(self.rules, function(rule, name){
			test[ name ] = rule(self.value)
		});

		var pass = _.every(test, _.identity);
		self.rejected = !(self.resolved = pass);
		self.checked = true;

		if (self.castFunc && self.checked) {
			self.castResult = self.castFunc(self.castValue);
		}

		return self.resolved;
	}

	// API
	return {
		Field: Field
	}


})();
