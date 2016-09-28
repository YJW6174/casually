var Beverage = function(param) {
    var boildWater = function() {
        console.log('把水煮沸');
    };
    var brew = param.brew || function() {
        throw new Error('必须传递 brew 方法');
    }

    var pourInCup = param.pourInCup || function() {
        throw new Error('必须传递 pourInCup 方法 ');
    }

    var addCondiments = param.addCondiments || function() {
        throw new Error('必须传递 addCondiments 方法');
    }

    var F = function() {}
    F.prototype.init = function() {
        boildWater();
        brew();
        pourInCup();
        addCondiments();
    }
    return F;
}

var Coffee = Beverage({
    brew: function() {

    },
    pourInCup: function() {

    },
    addCondiments: function() {

    }
});

var Tea = Beverage({
    brew: function() {

    },
    pourInCup: function() {

    },
    addCondiments: function() {

    }
});

var coffee = new Coffee();
coffee.init();

var tea = new Tea();
tea.init();
