var o = o || {};

(function(o) {
  
  o.extend = function (target, source) {
    for (var prop in source) if (source.hasOwnProperty(prop)) {
      target[prop] = source[prop];
    }
    return target;
  };  
  
  o.ctor = function oConstructor(){
    return this.class.super.apply(this, arguments);
  };
  
  o.inherit = (function(){
    function F() {}
    return function (child, parent) {
      var proto = ('function' === typeof parent) ? 
        parent.prototype : ('object' === typeof parent ? parent : {} );
      F.prototype = proto;
      child.prototype = new F();
      child.prototype.constructor = child;
      child.super = proto;
      child.prototype.class = child;
      return child;
    };
  }) ();

  // class from proto-Object or Function 
  o.class = function(proto){

    // if function then it's a class already 
    if ('function' === typeof proto) return proto;

    // has constructor? use it or an empty function
    var constructor = ('function' === typeof proto.constructor) ? proto.constructor : function(){};
    delete proto.constructor;

    // has extends key? use it as a parent for inheritance
    var parent = (/^object|function$/.test(typeof proto.extends) ) ? proto.extends : null;
    delete proto.extends;
    if (parent) {
      return o.inherit(constructor, parent);
    } 

    // that's it
    constructor.prototype = proto;
    return constructor;
  }

})(o);
