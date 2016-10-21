var warn = alert;
window.alert = function(txt){
	if(confirm('how are you')){
		warn(txt);
	}
}

hijack = function(obj,method,func){
	var orgin = obj[method];
	obj[method] = func(orgin);
}

hijack(window,'confirm',function(orgin){
	return function(text){
		alert('HELP');
		if(orgin.call(this,text)){
			alert('YOU-----');
		} else {
			alert('NO------');
		}
	}
})