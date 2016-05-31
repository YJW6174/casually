/**
 * Created: yuanjunwen
 * on 5/31/16.
 */
'use strict'
function bigToSmall(arr) {
    //coding here...
    let arr2 = arr.reduce(function (p, c) {
        return p.concat(c);
    });
    console.log(arr2.join('.'));
    return arr2.sort(function(a, b)
    {
        return a - b
    }
    ).join('>')
}

console.log(bigToSmall([[23, 33, 31, 0, 34, 7], [2, 39, 49, 38, 7], [21, 4, 31, 34, 22], [35, 18, 19, 15], [13, 1], [45], [16, 5, 11], [13, 25], [25, 29, 9, 1, 26, 42], [20, 46]]));
