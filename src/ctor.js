// @title ctor.js
// @description Advanced Classic OOP for JavaScript
// @author Max L Dolgov bananafishbone at gmail dot com

(function() {
  // root object, 'window' in the browser, or 'global' on the server.
  var root = this;

  var ctor = {
  
    unlink: function(o){
      var unlinked;
      if ('object'==typeof o) {
        if (o.length){
          unlinked = [];
          for (var i = 0, l = o.length; i < l; i++) unlinked[i] = unlink(o[i]);
        } else { 
          unlinked = {};
          for (var p in o) unlinked[p] = unlink(o[p]);
        }
      } else { return o; }
      return unlinked;
    },    
    
    clone: function(o){
      function es5(o){
        var copy = Object.create( Object.getPrototypeOf(o) );
        var propNames = Object.getOwnPropertyNames(o);
        propNames.forEach(function(name){
          var desc = Object.getOwnPropertyDescriptor(o, name);
          Object.defineProperty(copy, name, desc);
        });
        return copy;
      };  
      function es3(o){
        for(p in o)
          this[p] = (typeof(o[p]) == 'object')? new Clone(o[p]) : o[p];
      };
      
      return  ('object'!==typeof o)? ctor.unlink(o) : (Object.create? es5(o) : new es3(o));
    },
    
    //  OOP Object Factory instantiates an object with own properties cloned from a prototype
    //  var o = ctor.spawn( (Function) constructor, (Array) arguments )
    spawn: function( konstr, args ) {
      if ('function' != typeof konstr)
        throw new Error('ctor.spawn() : konstr is not a Function');
      function fn(){};
      var instance = new fn();
      konstr.apply( instance, [].slice(args) );
      for (var prop in konstr.prototype)
        instance[ prop ] = ctor.clone( konstr.prototype[prop] );
      return instance;
    },
    
    // Classic OOP inheritance 
    // instance has special '$parent' key of Instance points to a parent object
    // var o = ctor.inherit((Function or Object) [TopClass, ..] MidClass, BaseClass);
    inherit: function() {
      var args = [].slice.call(arguments);
      if (args.length < 2) {
        return false;
      } else if (args.length > 2) {
        for (var idx = args.length - 2, obj = args[idx + 1]; idx > -1; idx--){
          obj = arguments.callee(args[idx], obj);
        }  
        return obj;
      } else {
        var instance = (typeof args[0] == 'function') ? ctor.spawn(args[0]) : ctor.clone(args[0]),
            parent   = (typeof args[1] == 'function') ? ctor.spawn(args[1]) : ctor.clone(args[1]);
        for (var k in parent) {
          if ('$parent'==k || 'undefined'==typeof parent[k])
            continue;
          if (typeof instance[k] == 'undefined')
            instance[k] =  ctor.clone(parent[k]);
          if (typeof parent[k] != 'function') 
            delete parent[k];
        }
        instance.$parent = parent;
        return instance;
      }
    }
  }
  
  root.ctor = ctor;

}).call(this);