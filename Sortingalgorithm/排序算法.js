// 1.冒泡排序（Bubble Sort）

// 好的，开始总结第一个排序算法，冒泡排序。我想对于它每个学过C语言的都会了解的吧，这可能是很多人接触的第一个排序算法。
// (1)算法描述

// 冒泡排序是一种简单的排序算法。它重复地走访过要排序的数列，一次比较两个元素，如果它们的顺序错误就把它们交换过来。走访数列的工作是重复地进行直到没有再需要交换，也就是说该数列已经排序完成。这个算法的名字由来是因为越小的元素会经由交换慢慢“浮”到数列的顶端。
// (2)算法描述和实现

// 具体算法描述如下：

// <1>.比较相邻的元素。如果第一个比第二个大，就交换它们两个；
// <2>.对每一对相邻元素作同样的工作，从开始第一对到结尾的最后一对，这样在最后的元素应该会是最大的数；
// <3>.针对所有的元素重复以上的步骤，除了最后一个；
// <4>.重复步骤1~3，直到排序完成。
// 


function bubbleSort(arr) {
    console.time('冒泡排序耗时');
    var len = arr.length;
    for (var i = 0; i < len; i++) {
        for (var j = 0; j < len; j++) {
            if (arr[j] > arr[j + 1]) {
                var temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    console.timeEnd('冒泡排序耗时');
    // return arr;
}

// console.log(bubbleSort(arr));

// 改进冒泡排序： 设置一标志性变量pos,用于记录每趟排序中最后一次进行交换的位置。
// 由于pos位置之后的记录均已交换到位,故在进行下一趟排序时只要扫描到pos位置即可。
function bubbleSort2(arr) {
    console.time('改进后的冒泡排序耗时');
    var i = arr.length - 1;
    while (i > 0) {
        var pos = 0;
        for (var j = 0; j < i; j++) {
            if (arr[j] > arr[j + 1]) {
                pos = j;
                var temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;

            }
        }
        i = pos;
    }
    console.timeEnd('改进后的冒泡排序耗时')
        // return arr;
}

// 传统冒泡排序中每一趟排序操作只能找到一个最大值或最小值,
// 我们考虑利用在每趟排序中进行正向和反向两遍冒泡的方法一次可以得到两个最终值(最大者和最小者) ,
// 从而使排序趟数几乎减少了一半。

function bubbleSort3(arr3) {
    var low = 0;
    var high = arr.length - 1; //设置变量的初始值
    var tmp, j;
    console.time('2.改进后冒泡排序耗时');
    while (low < high) {
        for (j = low; j < high; ++j) //正向冒泡,找到最大者
            if (arr[j] > arr[j + 1]) {
                tmp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = tmp;
            }
            --high; //修改high值, 前移一位
        for (j = high; j > low; --j) //反向冒泡,找到最小者
            if (arr[j] < arr[j - 1]) {
                tmp = arr[j];
                arr[j] = arr[j - 1];
                arr[j - 1] = tmp;
            }
            ++low; //修改low值,后移一位
    }
    console.timeEnd('2.改进后冒泡排序耗时');
    return arr3;
}

function selectionSort(arr) {
    var len = arr.length;
    var minIndex, temp;
    console.time('选择排序耗时');
    for (var i = 0; i < len - 1; i++) {
        minIndex = i;
        for (var j = i + 1; j < len; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        temp = arr[i];
        arr[i] = arr[minIndex];
        arr[minIndex] = temp;
    }

    return arr;
}

function insertionSort(arr) {
    console.time('插入排序耗时');
    for (var i = 1; i < arr.length; i++) {
        var key = arr[i]; //取出这个要排序的元素 
        var j = i - 1; //这个要排序的元素前面一个元素的索引
        while (j >= 0 && arr[j] > key) { //当前面有值 且前面的值 大于要排序的元素的时候
            arr[j + 1] = arr[j]; // 把前面这个值,放到后面
            j--;
        }
        arr[j + 1] = key; //把要排序的元素,插进去
    }
    console.timeEnd('插入排序耗时')
    return arr;
}


function binaryinsertionSort(arr) {
    console.time('二分插入排序耗时');
    for (var i = 1; i < arr.length; i++) {
        var key = arr[i],
            left = 0,
            right = i - 1;
        while (left <= right) {
            var middle =  ~~((left + right)/2);
            if(key < arr[middle]){
                right = middle - 1;
            } else {
                left  = middle + 1;
            }
        }
        for(var j = i-1; j>=left;j--){
            arr[j+1] = arr[j];
        }
        arr[left] = key
    }
    console.timeEnd('二分插入排序耗时');
    return arr;
}
var arr = [3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48];
var rarr = outRandomArr();
// console.log(bubbleSort2(rarr));
// console.log(bubbleSort(rarr));
// console.log(bubbleSort3(rarr))
// console.log()/
console.log(insertionSort(arr))


function outRandomArr() {
    var arr = [];
    for (var i = 0; i < 1000; i++) {
        arr.push(~~(Math.random() * 20000))
    }
    return arr;
}
