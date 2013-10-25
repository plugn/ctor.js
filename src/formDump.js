/*
 @title form data dumper module
 @dependencies 
  * underscore.js, 
  * validator.js
 @description carefully collects fields' data of a form passed in 
 @why because of jQuery.serializeArray() doesn't work with radio and checkboxes correctly
*/

(function formDump(scope){

	var splitter = '__';

	function dumpField(el) {
		var fName = el.getAttribute('name'),
			fType = el.getAttribute('type');
		if (!fName) { return; }

		var complicated = _.contains(['radio', 'checkbox'],  fType);
		return {
			type  : fType,
			name  : fName,
			value : (!complicated || el.checked? el.value : null)
		};
	}

	var API = {
		collect: function(aForm) {
			if ( !(aForm instanceof HTMLFormElement) ) 
				throw new Error('aForm is not an HTMLFormElement');

			var formData = _.chain(aForm.elements)
				.map(dumpField)
				.filter(_.identity) // remove nameless fields 
				.reduce(function(memo, item, index, arr){
					if ('checkbox' === item.type) {
						if ( !(item.name in memo) || !(Array.isArray(memo[item.name])) )
							memo[item.name] = [];
						if (item.value)
							memo[item.name].push(item.value);
					} else if ('radio' === item.type) { 
						memo[item.name] = (item.name in memo && !item.value)? memo[item.name] : item.value; 
					} else {
						memo[item.name] = item.value;
					}			
					return memo; 
				}, {})
				.value();	

			return formData;
		},

		// group collected data  
		group: function( formData ) {
			var fieldSet = {};

			_.each(formData, function(item, key, list){ 
				var couple = key.split(splitter);

				if ( 1 < couple.length  ) {
					if ( !(_.has(fieldSet, couple[0])) ) {
						fieldSet[couple[0]] = {};
					}

					fieldSet[couple[0]] [key] = item;
					// fieldSet[couple[0]] [couple[1]] = item;

				} else {
					fieldSet[key] = item;
			  }

			});

			return fieldSet;

		},

		// validate grouped data
		validate: function( fGroups, conf ) {

			function typer (g, k){
				return ('object' == typeof g) && (null !== g);
			}

			var 
				self = this,
				mFields = _.filterHash(fGroups, typer),
				sFields = _.rejectHash(fGroups, typer);

			self.conf = conf || {};

			// console.log(sFields, mFields);

			// simple fields validated list
			var svItems = self.checkList( sFields );

			// mark them easily
			_.each(svItems, function(vItem){
				self.markField(vItem);
				self.markAbout(vItem);
			}); 

			// multi-fields 
			_.each( mFields, function(fset, fabout){

				var mvItems = self.checkList( fset );
				var ok = _.every(mvItems, function(mvItem){ return mvItem.resolved; });
				_.each(mvItems, function(vItem){
					self.markField(vItem);
					self.markAbout({ name: fabout, resolved: ok})
				})
			});
		},

		checkList: function( vFields ) {
			var self = this;
			var vList = {};
			_.each( vFields, function(fval, fkey){
				var vConf = _.getNested(fkey, null, self.conf);
				var vItem = new validator.Field(fkey, fval, vConf);
				if (vItem) {
					vItem.check();
					vList[fkey] = vItem;
				}
			});

			return vList;
		},


		// toggle validation messages / indicators
		markField: function(vField) {
			var f = $('[name="' + vField.name + '"]');
			f.toggleClass('field-warn', !vField.resolved);

			// reflect cast right
			if (vField.castFunc && (null != vField.castResult)) {
				f.val(vField.castResult);
			};
		},

		// toggle validation messages / indicators
		markAbout: function(vField, message) {
			// console.log(' * markAbout() ', vField);
			var 
				ok = vField.resolved,
				p = $('[data-about="' + vField.name + '"]');

			p.toggleClass('warn', !ok).toggleClass('ok', !!ok); 
			if (message) {
				p.find('.warn-reason').text(message);
			}
		}



	};		

	// export module
	_.extend(scope, API);

})(this.formDump = this.formDump || {});
