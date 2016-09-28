var Beverage = function() {};

Beverage.prototype.boilWater = function() {
    console.log('把水煮沸');
}

Beverage.prototype.brew = function() {
    throw new Error('子类必须重写 brew 方法');
}

Beverage.prototype.pourInCup = function() {
    throw new Error('子类必须重写 pourInCup');
}

Beverage.prototype.addCondiments = function() {
    throw new Error('子类必须重写 addCondiments');
}

Beverage.prorotype.customerWantsCondiments = function() {
    return true;
}

Beverage.prorotype.init = function() {
    this.boilWater();
    this.brew();
    this.pourInCup();
    if (this.customerWantsCondiments()) {
        this.addCondiments();
    }
}

var CoffeeWithHook = function(){};

CoffeeWithHook.prototype = new Beverage();

CoffeeWithHook.prototype.brew = function(){
	console.log('用沸水冲泡咖啡');
};

CoffeeWithHook.prototype.pourInCup = function(){
	console.log('把咖啡倒进杯子');
};

CoffeeWithHook.prototype.addCondiments = function(){
	console.log('加糖和牛奶');
};

CoffeeWithHook.prorotype.customerWantsCondiments = function(){
	return window.confirm('请问需要调料吗');
}

var coffeeWithHook  = new CoffeeWithHook();
coffeeWithHook.init();
