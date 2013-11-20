

(function(scope) {

  var evPrefix = 'on-';
  var evRgx = new RegExp('^' + evPrefix);
  var removeSrc = false; //true;

  scope.util = {

    addEvent: function addEvent(el, type, fn, capture){
      if (el.addEventListener) {
        el.addEventListener(type, fn, capture);
      } else {
        el.attachEvent('on' + type, fn);
      }
    },

    getBinding: function( evt, conf ){
      var 
        fArgs = [].concat(_.keys(conf), 'event', evt.value),
        F = Function.prototype.constructor.apply(null, fArgs),
        bParams = [].concat(F, evt.el, _.values(conf)),
        binding = _.bind.apply( null, bParams );
      // console.log(' getBinding() \n conf: %o \n fArgs: %o \n bParams: %o ', conf, fArgs, bParams);
      return binding;
    },

    setDOMEvents: function( conf ){
      var evtList = scope.util.scanUIEvents();
      // console.log(' * setDOMEvents() evtList : \n %o', evtList); 
      _.each(evtList, function(evt){
        var fn = scope.util.getBinding(evt, conf);
        scope.util.addEvent(evt.el, evt.name, fn);
        if (removeSrc) evt.el.removeAttribute(evPrefix + evt.name);   
      });
    },

    // scan DOM for pseudo events marked as [data-ui-on${event}]
    scanUIEvents: function( ctx, conf ) {
      ctx = ctx || document.documentElement;
      var events = 'submit,change,click'; 
      // ',dblclick,blur,focus,input,mousedown,mouseup,keydown,keypress,keyup';
      var evQuery = _.map(events.split(','), function(ev){ return '['+evPrefix+ev+']'; }).join(',');
      var onv = $(evQuery, ctx)
        .map(function(){        
          return _.chain(this.attributes)
            .map(function(a,n){ 
              var o = {};             
              if (0 === String(a.nodeName).indexOf(evPrefix)) {
                var el = a.ownerElement || null;
                // if (removeSrc && el) el.removeAttribute(a.nodeName);
                return {
                  el: el,
                  name: String(a.nodeName || a.name).replace(evRgx, ''),
                  value: (a.nodeValue || a.value)
                }
              } 
            })
            .filter(_.identity)
            .value()    
        });     
        return onv;
    }

  }



})( this );
