/******计算乘积*******/
var mult = function(){
	var a = 1;
	for (var i = arguments.length - 1; i >= 0; i--) {
		a = a * arguments[i]
	}
	return a;
};
console.time('start');
/******计算加和******/
var plus = function(){
	var a = 0;
	for (var i = arguments.length - 1; i >= 0; i--) {
		a = a + arguments[i]
	}
	return a;
};

/*******创建缓存代理的工厂*****/

var createProxyFactory = function(fn){
	var cache = {};
	return function(){
		var args = Array.prototype.join.call(arguments,','); //这里的 arguments 是什么从哪儿来的呢;
		if(args in cache){
			return cache[args];
		}
		return cache[args] = fn.apply(this,arguments);
	}
}
setTimeout(function(){
console.timeEnd('start');

},2000)

var proxyMult = createProxyFactory(mult);
var proxyPlus = createProxyFactory(plus);

console.log(proxyPlus(1,3,4,5));
console.log(proxyPlus(1,2,3,4));

console.log(proxyMult(100,99,10,1));
console.log(proxyMult(100,99,10,1));
