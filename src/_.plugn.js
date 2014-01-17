// @title plugins for underscore.js
// @author Max L Dolgov 
// @url http://github.com/plugn

_.mixin({
    clone: function clone(o) {
        if (!(this instanceof clone)) {
            return new clone(o); 
        }
        for(p in o) {
            this[p] = 'object' == typeof o[p] ? new clone(o[p]) : o[p]; 
        }
    },
    
    capitalize: function(string) {
        return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
    },

    trim: function(val) {
        return String(val).replace(/(^\s+|\s+$)/g, ''); 
    },

    toNumber: function(t){
        var a; return (a = String(t).match(/\d+/g)) && (parseInt(a.join(''), 10) || 0);
    },

    // results hash-items {key:value} 
    filterHash: function(obj, iterator, context) {
        var results = {};
        if (obj == null) return results;
        _.each(obj, function(value, index, list) {
            // var hVal = {}; hVal[index] = value;
            if (iterator.call(context, value, index, list)) results[index] = value;
        });
        return results;
    },
    rejectHash:  function(obj, iterator, context) {
        return _.filterHash(obj, function(value, index, list) {
            return !iterator.call(context, value, index, list);
        }, context);
    },

    getNested: function(path, def, root){
        var key, val = !!root? root : this, arr = String(path).split('.');
        while ((key = arr.shift()) && 'object' == typeof val && val) {
            val = 'undefined' == typeof val[key]? ('undefined' == typeof def? false : def) : val[key];
        }
        return val;  
    }  

});
