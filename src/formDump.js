/*
 * @title form data dumper module
 * @dependencies underscore.js
*/


(function formDump(scope){

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
		}
	}		

	// export module
	_.extend(scope, API);

})(this.formDump = this.formDump || {});
