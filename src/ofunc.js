/**
 * @title oFunc
 * @description objects functional utility
**/

function oEach(o, iterator) {
    Object.keys(o).forEach(iterator.bind(o));
}

function oValues(o) {
    var acc = [];
    oEach(o, function (key) {
        acc.push(this[key]);
    })
    return acc;
}

/*
oEach(t, function (key) {
    console.log('#' + key + ': ', this[key]);
});

*/
