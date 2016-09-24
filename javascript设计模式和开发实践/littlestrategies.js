var S = function(salary){
	return salary * 4;
}

var A = function(salary){
	return salary * 3;
}

var B = function(salary){
	return salary * 2;
}

var calculateBonus =function(fn,salary){
	return fn.call(this,salary);
}

console.log(calculateBonus(S,1000));