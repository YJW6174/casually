'use strict'
let a = [4, 2, 5, 7, 3, 6, 9];
let temp;

// 冒泡排序 稳定 O(n^2)
for (let i = 0; i < a.length; i++) {
    for (let j = i; j < a.length; j++) {
        if (a[i] > a[j]) {
            a[j] = {x: a[i], y: (a[i] = a[j])}.x;
            //a[i]  = {x:a[i],y:a[j]}.y;
        }
    }
}
console.log(a);

//简单选择排序 不稳定的排序方法 O(n^2)
let b = [4, 3, 12, 5, 67, 23, 1, 4];
let small;
for (let i = 0; i < b.length - 1; i++) {
    small = i;
    for (let j = i + 1; j < b.length; j++) {
        if (b[j] < b[small]) {
            b[j] = {x: b[small], y: b[small] = b[j]}.x;
        }
    }
}
console.log(b);

//直接插入排序 O(n)~0(n^2) 稳不稳定取决于 <(稳定) 还是<=(不稳定)
let c = [4, 3, 5, 1, 7, 2, 5];
for (let i = 1; i < c.length; i++) {
    let j = i;
    let temp2 = c[i];
    while (j > 0 && temp2 < c[j - 1]) {
        c[j] = c[j - 1];
        j--;
    }
    c[j] = temp2
}
console.log(c);

//快速排序
var quickSort = function(arr) {
    if (arr.length <= 1) { return arr; }
    var pivotIndex = Math.floor(arr.length / 2);
    var pivot = arr.splice(pivotIndex, 1)[0];
    var left = [];
    var right = [];
    for (var i = 0; i < arr.length; i++){
        if (arr[i] < pivot) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
    return quickSort(left).concat([pivot], quickSort(right));
};
console.log(quickSort(c));
