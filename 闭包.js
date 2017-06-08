var arr = [1, 2, 3, 4, 5];
for (var i = 0; i < arr.length; i++) {
    arr[i] = (function() {
        console.log(i)
    }())
}


function createFunction() {
    var arr = [];
    for (var i = 0; i < 10; i++) {
        arr[i] = function() {
            return i;
        };
    }
    return arr;
}
console.log(createFunction());
