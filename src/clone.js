function clone(o) {
  if (! (this instanceof clone)) {
  	return new clone(o); 
  }
  for(p in o) {
  	this[p] = 'object' === typeof o[p] ? (new clone(o[p])) : o[p]; 
  }
}
