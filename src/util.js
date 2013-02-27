(function() {
  
  this.motto = {
/*
    tries to get deep nested property of passed object, 
    if found returns it, else returns `def` argument
    
    getNested('p.a.t.h', '*', {p:{a:{t:{h:[1],i:[2]}}}} )
    [1]
    getNested.call({p:{a:{t:{h:[1],i:[2]}}}}, 'p.a.t.i', '*' )
    [2]
    ('p.a.t.y', '*', {p:{a:{t:{h:[1],i:[2]}}}} )
    "*"
*/
    getNested: function(path, def, root){
      var key, val = !!root? root : this, arr = String(path).split('.');
      while ((key = arr.shift()) && 'object' == typeof val && val) {
        val = 'undefined' == typeof val[key]? ('undefined' == typeof def? false : def) : val[key];
      }
      return val;  
    },
    
    
    // Function.bind() aka Currying micro implementaion
    curry: function(fn, context){
      var args = [].slice.call(arguments, 2);
      return function(){ 
        fn.apply(context, args.concat([].slice.call(arguments))) 
      };
    },
    
    // sample of call as constructor guaranteed
    factory: function(){ 
      if (!this.__asConstructor__)
        return new arguments.callee([].slice.call(arguments)); 
    }
    factory.prototype = {
      __asConstructor__ = true;
    }
    
  };  

}).call(this);
