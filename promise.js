/**
 * Promise 是异步编程的一种解决方案，
 * 比传统的解决方案——回调函数和事件——更合理和更强大。
 * 它由社区最早提出和实现，ES6将其写进了语言标准，统一了用法，原生提供了Promise对象。
 * 
 *Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。
 *从语法上说，Promise 是一个对象，从它可以获取异步操作的消息。
 *Promise 提供统一的 API，各种异步操作都可以用同样的方法进行处理。
 *
 * Promise对象代表一个异步操作，
 * 有三种状态：
 * Pending（进行中）、
 * Resolved（已完成，又称 Fulfilled）
 * Rejected（已失败）。
 *
 * 
*/
 
var promise = new Promise(function(resolve, reject) {
  // ... some code

  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
});

/**
 * resolve函数的作用是，将Promise对象的状态从“未完成”变为“成功”（即从Pending变为Resolved），
 * 在异步操作成功时调用，并将异步操作的结果，作为参数传递出去；
 * reject函数的作用是，将Promise对象的状态从“未完成”变为“失败”（即从Pending变为Rejected），
 * 在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。
 *
 * Promise实例生成以后，可以用then方法分别指定Resolved状态和Reject状态的回调函数。
 */

promise.then(function(value) {
  // success
}, function(error) {
  // failure
});



/**
 * Created: yuanjunwen
 * on 5/24/16.
 */

/**
 *基于 promise 对象的自动执行
 */

var fs = require('fs');
var readFile = function(filename){
  return new Promise(function(resolve,reject){
      fs.readFile(filename,function(error,data){
          if(error)reject(error);
          resolve(data);
      })
  })
};

var gen = function* (){
    var f1 = yield readFile('a');
    console.log(f1.toString());
    var f2 = yield readFile('b');
    console.log(f2.toString());
};
/*
手动执行 generator 函数
 */
var g = gen();/*
g.next() 返回一个对象,{ value: new promisexxx , done,false}
g.next().value.then() 是promise.then(function(resolve的值))
*/
//
//g.next().value.then(function(data){
//    g.next(data).value.then(function(data){
//        g.next(data);
//    })
//});

function run(gen){
    var g = gen();
    var i = 0;
    function next(data){
        console.log(++i)//data 是 resolve()的参数,放在 next中,传给 yeild 的值
        var resultpromise = g.next(data);//这里 result 是一个对象,value 个 promise {value:readFile('a'),done:false};
        if(resultpromise.done) return resultpromise.value;
        resultpromise.value.then(function(data){
            next(data);
        })
    }
    next();
}
run(gen);