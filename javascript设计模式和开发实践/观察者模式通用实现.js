var event = {
    clientList: [],
    listen: function(key, fn) {
        if (!this.clientList[key]) {
            this.clientList[key] = [];
        }
        this.clientList[key].push(fn);
    },
    trigger: function() {
        var key = Array.prototype.shift.call(arguments),
            fns = this.clientList[key];

        if (!fns || fns.length == 0) {
            return false;
        }

        for (var i = 0, fn; fn = fns[i++];) {
            fn.apply(this, arguments);
        }
    },
    remove:function(key,fn){
    	var fns = this.clientList[key];
    	if(!fns){
    		return false;
    	}
    	if(!fn){ //如果没有回调函数,删除 key 对应的消息的 所有订阅
    		fns && (fns.length = 0);
    	} else {
    		for (var i = fns.length - 1; i >= 0; i--) {
    			var _fn = fns[i];
    			if(_fn === fn){
    				fns.splice(i,1)
    			}
    		}
    	}
    }
}

/***********给所有对象都动态安装发布订阅功能***************/
var installEvent = function(obj){
	for( var i in event){
		obj[i] = event[i];
	}
}

var saleOffices = {};
installEvent(saleOffices);

saleOffices.listen('square88',function(price){ // 小明订阅88平米的价格
	console.log(price);
})

saleOffices.listen('square100',function (price) { //小红订阅100平的价格
	console.log(price)
})

saleOffices.listen('square100',fn2 = function(price){
	console.log('second:' + price);
})

saleOffices.trigger('square100',20000);  // 发布 输出2000
saleOffices.trigger('square88',18000);  // 发布 输出18000

saleOffices.remove('square100',fn2);
saleOffices.trigger('square100',20000);

