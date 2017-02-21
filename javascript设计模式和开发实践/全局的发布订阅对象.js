var Event = (function(){
	var clientList = {},
		listen,
		trigger,
		remove;

	listen = function (key, fn){
		if(!clientList[key]){
			clientList[key] = [];
		}
		clientList[key].push(fn);
	};

	trigger = function (){
		var key = Array.prototype.shift.call(arguments);
			fns = clientList[key];
			if( !fns || fns.length  === 0){
				return false;
			}
			for (var i = 0,fn; fn = fns[i++];) {
				fn.apply(this,arguments);
			}
	};

	remove = function (key,fn){
		var fns = clientList[key];
		if(!fns){
			return false;
		}
		if(!fn){
			fns && (fns.length = 0);
		} else {
			for (var i = fns.length - 1; i >= 0; i--) {
				var _fn = fns[i];
				if(_fn === fn){
					fns.splice(i,1)
				}
			}
		}

	};

	return {
		listen: listen,
		trigger: trigger,
		remove: remove
	}
})()

Event.listen('squareMeter88',function(price){
	console.log('价格=' + price);
})

Event.listen('squareMeter88',function(price){
	console.log('价格2=' + price);
})
Event.trigger('squareMeter88',20000);