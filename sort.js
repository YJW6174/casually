var a = [4, 2, 5, 7, 3, 6, 9];
var temp;

// 冒泡排序
for (var i = 0; i < a.length; i++) {
    for (var j = i; j < a.length; j++) {
        if (a[i] > a[j]) {
            temp = a[i];
            a[i] = a[j];
            a[j] = temp;
        }
    }
}
console.log(a);
