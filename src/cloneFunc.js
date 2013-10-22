/**
 *  @title cloning a Function
 *  @author  Max L Dolgov 
 *  @contact bananafishbone at gmail dot com
 */

function cloneFunc( func ) {
  var reFn = /^function\s*([^\s(]*)\s*\(([^)]*)\)[^{]*\{([^]*)\}$/gi
    , s = func.toString().replace(/^\s|\s$/g, '')
    , m = reFn.exec(s);
  if (!m || !m.length) return; 
  var conf = {
      name : m[1] || '',
      args : m[2].replace(/\s+/g,'').split(','),
      body : m[3] || ''
  }
  var clone = Function.prototype.constructor.apply(this, [].concat(conf.args, conf.body));
  return clone;
}

