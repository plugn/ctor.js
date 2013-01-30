/*
tries to get deep nested property of passed object, 
if found returns it, else returns `def` argument

getNested('p.a.t.h', {p:{a:{t:{h:[1],i:[2]}}}}, '*' )
[1]

getNested('p.a.t.i', {p:{a:{t:{h:[1],i:[2]}}}}, '*' )
[2]

('p.a.t.y', {p:{a:{t:{h:[1],i:[2]}}}}, '*' )
"*"

*/

var getNested = function(path, root, def){
  var key, val = root || this, arr = String(path).split('.');
  while (key = arr.shift())
    val = 'undefined' == typeof val[key]? ('undefined' == typeof def? null : def) : val[key];
  return val;  
}  
