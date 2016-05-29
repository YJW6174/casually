/**
 * Created: yuanjunwen
 * on 5/24/16.
 */
var ids = [0,1,2,3,4,5,6,7,9,10];
console.log(ids.sort(function(a,b){
    return a-b;
}));
var temp = ids[0];
function nextId(ids){
    ids.sort(function(a,b){return a-b});
    var temp = ids[0];
    for (var i = 0; i < ids.length; i++) {
        if (ids[i] <= temp || ids[i] <= temp + 1) {
            temp = ids[i];
        } else {
            return ++temp
        }
    }

    return ids.length
}

 console.log(nextId(ids));
