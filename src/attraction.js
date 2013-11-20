/*
 * @title attraction 
 * @description declarative DOM event binding via attributes
 * @usage
 * html: <element on-click="app.method(this, event)">
 * javascript: attraction.setup({'app': this, 'any': {'key': value} });
**/

(function(scope) {

  var evPrefix = 'on-';
  var evRgx = new RegExp('^' + evPrefix);
  var removeSrc = true;

  var self = {

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

    setup: function( conf ){
      var evtList = self.scanUIEvents();
      // console.log(' * setDOMEvents() evtList : \n %o', evtList); 
      _.each(evtList, function(evt){
        var fn = self.getBinding(evt, conf);
        self.addEvent(evt.el, evt.name, fn);
        if (removeSrc) evt.el.removeAttribute(evPrefix + evt.name);   
      });
    },

    // scan DOM for pseudo events marked as [on-{event}]
    scanUIEvents: function( ctx ) {
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

  };

  scope.attraction = self;



})( this );
