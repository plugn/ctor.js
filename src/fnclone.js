/*
function a1(x,y){ var X = arguments[0], Y = arguments[1]; return X + Y;  }; a1.prop = 'PROP-a1';
"PROP-a1"
a1 
function a1(x,y){ var X = arguments[0], Y = arguments[1]; return X + Y;  }
a1.toString()
"function a1(x,y){ var X = arguments[0], Y = arguments[1]; return X + Y;  }"
var b1 = Function(a1.toString());
undefined
b1
function anonymous() {
function a1(x,y){ var X = arguments[0], Y = arguments[1]; return X + Y;  }
}
b1.prop 
undefined
a2 = a1;
function a1(x,y){ var X = arguments[0], Y = arguments[1]; return X + Y;  }
a2(3,5)
8
a1(2,1)
3
b1(7,8)
undefined
a1.toString()
"function a1(x,y){ var X = arguments[0], Y = arguments[1]; return X + Y;  }"
a1.toString().match()
[""]
a1.toString().replace(/^\s|\s$/g,'')
"function a1(x,y){ var X = arguments[0], Y = arguments[1]; return X + Y;  }"
*/

a1.toString().replace(/^\s|\s$/g,'')

a1.toString().replace(/^\s|\s$/g,'').match(/function\s+([^(]+)\(([^)]+)\)\s*?\\{(.*)\\}/gmi) // fail
var s = a1.toString().replace(/^\s|\s$/g,''); 
s.match(/function\s+([^(]+)\(([^)]+)\)\s?\{.*}$/g) // match

var s = a1.toString().replace(/^\s|\s$/g,''); 
s.match(/function\s+([^(]+)\(([^)]+)\)\s?\{.*}$/g) // ok
