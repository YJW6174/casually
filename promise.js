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