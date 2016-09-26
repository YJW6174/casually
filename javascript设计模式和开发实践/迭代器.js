var each = function(ary, callback) {
    for (var i = 0, l = ary.length; i < l; i++) {
        callback.call(ary[i], i, ary[i])
    }
}

//call 接收的参数是 1,2,3,
//apply 接收的参数是 [1,2,3]
//bind 创建一个函数的实例,this的值绑定给这个函数

/***************内部迭代器*************/
var compare = function(ary1, ary2) {
    if (ary1.length != ary2.length) {
        throw new Error('ary1 和 ary2 不相等');
    }
    each(ary1, function(index, item) {
        if (item != ary2[index]) {
            throw new Error('ary1 和 ary2 不相等');
        }
    })
    console.log('ary1和 ary2 相等');
}

compare([1, 2, 3, 4], [1, 2, 3, 4]);
//缺点,不方便,丑, 得益于 JavaScript 函数可以当参数传递,其他语言未必



/**************外部迭代器**************/

//松本行弘的程序世界 第四章 ruby
var Iterator = function(obj) {
    var current = 0;
    var next = function() {
        current += 1;
    }
    var isDone = function() {
        return current >= obj.length;
    }
    var getCurrItem = function() {
        return obj[current];
    }
    return {
        next: next,
        isDone: isDone,
        getCurrItem: getCurrItem
    }
}

var compare2 = function(iterator1, iterator2) {
    while (!iterator1.isDone() && !iterator2.isDone()) {
        if (iterator1.getCurrItem() != iterator2.getCurrItem()) {
            throw new Error('iterator1 和 iterator2 不相等');
        }
        iterator1.next();
        iterator2.next();
    }
    console.log('iterator1 和 iterator2 相等')
}

var iterator1 = Iterator([1, 2, 3]);
var iterator2 = Iterator([1, 2, 3]);

compare2(iterator1, iterator2);

/******迭代类数组对象和字面量对象**************/
$.each = function(obj, callback) {
    var value,
        i = 0,
        length = obj.length,
        isArray = Array.isArray(obj);
    if (isArray) {
        for (; i < length; i++) {
            value = callback.call(obj[i], i, obj[i]);
            if (value == false) {
                break;
            }
        }
    } else {
        for (i in ob) {
            value = callback.call(obj[i], i, obj[i]);
            if (value == false) {
                break;
            }
        }
    }
    return obj;
}

/******倒序迭代器**************/

/******终止迭代器*************/
var each = function(ary, callback) {
    for (var i = 0; i < ary.length; i++) {
        if (callback(i, ary[i]) == false) {
            break;
        }
    }
}

each([1, 2, 3, 4, 5, 6], function(i, n) {
    if (n > 3) {
        return false;
    }
    console.log(n);
})


/******迭代器应用模式*********/

var getActiveUploadObj = function() {
    try {

    } catch (e) {
        return false
    }
}

var getFlashUploadObj = function() {
    if () {

    }
    return false;
}

var getFormUploadObj = function() {

}

var iteratorUploadObj = function() {
    for (var i = 0, fn; fn = arguments[i++];) {
        var uploadObj = fn();
        if (uploadObj !== false) {
            return uploadObj;
        }
    }
}

var uploadObj = iteratorUploadObj(getActiveUploadObj, getFlashUploadObj, getFormUploadObj)
