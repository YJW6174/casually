var a = [2, 4, 5, 7, 3, 6, 9];
var temp;
for (var i = 0; i < a.length - 1; i++) {
    if (a[i] > a[i + 1]) {
        temp = a[i];
        a[i] = a[i + 1];
        a[i + 1] = temp;
    }
}
console.log(a);

var Thunk = function(fn) {
    return function() {
        var args = Array.prototype.slice.call(arguments);
        return function(callback) {
            args.push(callback);
            return fn.apply(this, args);
        }
    };
};


var Thunk = function(fn) {
    return function() {
        var args = Array.prototype.slice.call(arguments);
        return function(callback) {
            args.push(callback);
            return fn.apply(this, args);
        }
    }
}


function thunkify(fn){
  return function(){
    var args = new Array(arguments.length);
    var ctx = this;

    for(var i = 0; i < args.length; ++i) {
      args[i] = arguments[i];
    }

    return function(done){
      var called;

      args.push(function(){
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
};
