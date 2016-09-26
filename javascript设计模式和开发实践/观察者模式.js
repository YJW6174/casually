var saleOffices = {};

saleOffices.clientList = [];

saleOffices.listen = function(fn){
	this.clientList.push(fn);
}

saleOffices.trigger = function(){
	for(var i = 0 ,fn;fn = this.clientList[i++];){
		fn.apply(this,arguments);
	}
}

saleOffices.listen(function(price,squareMeter){ //小明订阅
	console.log(price);
	console.log(squareMeter);
})

saleOffices.listen(function(price,squareMeter){ //小红订阅
	console.log(price);
	console.log(squareMeter);
})

saleOffices.trigger(20000,100);
saleOffices.trigger(18000,88);

console.log('---saleOffices-------------');
console.log('----saleOffices-----------');
//增加标志 key,让订阅者只订阅自己感兴趣的

var saleOffices = {};

saleOffices.clientList = {}; //缓存列表,存放订阅者的回调函数

saleOffices.listen = function(key,fn){
	if(!this.clientList[key]){
		this.clientList[key] = [];
	}
	this.clientList[key].push(fn);
}

saleOffices.trigger = function(){
	var key = Array.prototype.shift.call(arguments),
		fns = this.clientList[key];

	if( !fns || fns.length === 0){
		return false;
	} 

	for (var i = 0,fn;fn = fns[i++];) {
		fn.apply(this,arguments);
	}
}

saleOffices.listen('squareMeter88',function(price){
	console.log(price);
})

saleOffices.listen('squareMeter100',function(price){
	console.log(price);
})

saleOffices.trigger('squareMeter100','20000');
saleOffices.trigger('squareMeter88','18000');