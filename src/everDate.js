// @title everDate
// @description retrieves dirty Date values and make them valid
//              via custom restrictions with fallback to Date.now()
// @usage everDate.render(2014,02,31)                         -->  '2013-3-3' 
// @usage everDate.render('w2-01-f?f1 **', '  of 8ef', '-x-') -->  '2011-8-17' 

var everDate = (function(){

    var _dateObj = null
      , _year = null
      , _month = null
      , _date =  null
      , _day = null;

    // lazy getters
    function getDateObj() { return _dateObj || (_dateObj = new Date()); }
    function getYear()    { return _year || (_year = getDateObj().getFullYear()); }
    function getMonth()   { return _month || (_month = getDateObj().getMonth()+1); }
    function getDate()    { return _date || (_date = getDateObj().getDate()); }
    function getDay()     { return _day || (_day = getDateObj().getDay()); }

    // monads
    function toNumber(t){
      var a; return (a = String(t).match(/\d+/g)) && (parseInt(a.join(''), 10) || 0);
    }
    function restrict(v, min, max, def) {
      var num = toNumber(v);
      return (num < min || num > max)? def : num;
    }
    function makeValid(date){
      var oDate = date instanceof Date ? date : new Date(date);
      return ( oDate instanceof Date && [oDate.getFullYear(), oDate.getMonth()+1, oDate.getDate()] );
    }

    // customizable restrictions 
    function makeYear(v){
      return restrict(v, 1910, getYear(), getYear());
    }
    function makeMonth(v){
      return restrict(v, 1, 12, getMonth() );
    }
    function makeDate(v){
      return restrict(v, 1, 31, getDate());
    }

    // public API
    return {
      render: function everDate__render(y,m,d){
        return makeValid( [makeYear(y), makeMonth(m), makeDate(d)] );
      }
    };

})();
