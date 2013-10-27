	function castBDate(v){
  	return everDate.restrict(v, 1, 31, '');
	}
	function castBMonth(v){
		return everDate.restrict(v, 1, 12, 0);
	}	
	function castBYear(v){
		return everDate.restrict(v, 1910, everDate.getYear(), '');
	}	

	// fields global configuration
	var gConf = {
		'Mail__Login' : {
			rules: function(v) {
				return (v.length && v.length > 3);
			}
		},

		'BDay__Day'   : {
			rules: 		castBDate,
			castFunc: function(v){
				var re = /\d+/g; 
				return parseInt(re.exec(String(v)), 10);
			}
		},

		'BDay__Month' : {
			rules:    function nonZeroStr(v){
				return !('0'===v);
			}
		},

		'BDay__Year'  : {
			rules:    castBYear,
			castFunc: function(v){
				var re = /\d+/g; 
				return parseInt(re.exec(String(v)), 10);
			}
			
		}
	};

var fGroups = formDump.group(formDump.collect(aForm));
formDump.validate( fGroups, gConf);
