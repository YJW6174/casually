/**
 * Created: yuanjunwen
 * on 5/30/16.
 */
/*
 函数的柯理化
 是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术。
 */


function toCurrying(fn) {
    var args = [];
    return function() {
        if (arguments.length === 0) {
            return fn.apply(this, args);
        } else {
            console.log(args);
            console.log(arguments);
            console.log('------');
            Array.prototype.push.apply(args, arguments);
            return arguments.callee; //还是返回方法
        }
    }
}

function add() {
    return;
}

var curriedAdd = toCurrying(add);

curriedAdd(2);
curriedAdd(3);
curriedAdd(4);
curriedAdd(5);
console.log(curriedAdd());