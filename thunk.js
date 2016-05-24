var fs = require('fs');
//var thunkify = require('thunkify');
var readFile = thunkify(fs.readFile);

function thunkify(fn) {
    return function () {
        var args = new Array(arguments.length);
        var ctx = this;

        for (var i = 0; i < args.length; ++i) {
            args[i] = arguments[i];
        }

        return function (done) {
           // console.log(done.toString());
            var called;

            args.push(function () {
                if (called) return;
                called = true;
                done.apply(null, arguments);
            });

            try {
                fn.apply(ctx, args);
            } catch (err) {
                done(err);
            }
        }
    }
}


var gen = function* () {
    var r1 = yield readFile('a.txt');
    console.log('r1begin');
    console.log(r1.toString());//r1 应该是 next 穿进去的参数吧
    console.log('r1end');
    var r2 = yield readFile('b');
    console.log(r2.toString());
};

var g = gen();
var t1 = g.next();//{value:'readFile('a.txt')',done:false}
//console.log('r1');
//console.log(r1.value);
//console.log('----------');
t1.value(function (err, data) {
    if (err) throw err;
    var t2 = g.next(data);//把指针移到r2那一行;
    t2.value(function (err, data) {
        if (err) throw err;
        g.next(data);
    })
});
//function f(a, b, callback){
//    console.log('1');
//  var sum = a + b;
//  callback(sum);
////  callback(sum);
//}
//
//var ft = thunkify(f);
//var print = function(){ console.log('2');console.log(arguments)};//console.log.bind(console);
//ft(5, 6)(print);
//// 3