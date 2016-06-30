var a = [1, '1', 3, 4, 5, 6, 7, 3, 6, 'a', 1.3, 12];
console.log(unique2(a));


function unique(arr) {
    var res = [];
    for (var i = 0; i < arr.length; i++) {
        if (res.indexOf(arr[i]) != -1) {
        }
        else {
            res.push(arr[i]);
        }
    }
    return res;
}


function unique2(arr) {
    var res = [];
    for (var i = 0; i < arr.length; i++) {
        (res.indexOf(arr[i]) === -1) && (res.push(arr[i]))
    }
    return res;
}

function unique3(arr) {
    return arr.filter(function (item, index, arr) {
       return (arr.indexOf(item) == index)
    })
}

console.log(a.sort(function(a,b){
    return a-b;
}));