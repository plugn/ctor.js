

(function(scope) {

  var evPrefix = 'on-';
  var evRgx = new RegExp('^' + evPrefix);

  scope.util = {

    addEvent: function addEvent(el, type, fn, capture){
      if (el.addEventListener) {
        el.addEventListener(type, fn, capture);
      } else {
        el.attachEvent('on' + type, fn);
      }
      return fn;
    },

    setDOMEvents: function(){
      console.log(' * setDOMEvents() ');
      
      var evtList = scope.util.scanUIEvents();
      console.log(' = evtList : \n %o', evtList); 

      _.each(evtList, function(evt){
        var fn = _.bind( Function('event', evt.value ), evt.el );
        scope.util.addEvent(evt.el, evt.name, fn)
        
      });

    },

    // scan DOM for pseudo events marked as [data-ui-on${event}]
    scanUIEvents: function( ctx, conf ) {
      ctx = ctx || document.documentElement;
      var events = 'click,submit,change'; 
      
      var evQuery = _.map(events.split(','), function(ev){ return '['+evPrefix+ev+']'; }).join(',');
      console.log(' evQ: ' , evQuery);

      // var onv = $('[onclick],[onsubmit],[onchange]', ctx)
      var onv = $(evQuery, ctx)
        .map(function(){
          return _.chain(this.attributes)
            .map(function(a,n){ 
              var o = {};  
              if (0 === String(a.nodeName).indexOf(evPrefix)) {
                return {
                  el: (a.ownerElement || null),
                  name: String(a.nodeName || a.name).replace(evRgx, ''),
                  value: (a.nodeValue || a.value)
                }
              } 
            })
            .filter(_.identity)
            .value()    
        });   
        return onv;
    },

    mkFn: function(args){
      Function.prototype.constructor.apply(null, args);
    },
    mkBind: function( conf ){
      // var fn = _.bind( Function('event', evt.value ), evt.el );
      var args = [].concat(Object.keys(conf.args), 'event', evt.value);
      var f = Function.prototype.constructor.apply(null, args);
      var fn = _.bind.apply( null, Function('event', evt.value ), evt.el );
    }

  }



})( this );
