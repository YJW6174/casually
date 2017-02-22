//1.正常的setTimeout() 使用方法 第一个参数为一个函数名,在js中,函数名为该函数的指针

setTimeout(function() {
        console.log('1')
    }, 5000) //  5秒后执行

setTimeout((function() {
        console.log('2')
    }()), 5000) //立即执行


// 打出六个六
for (var i = 0; i <= 5; i++) {
    setTimeout(function() {
        console.log(i)
    }, 500);
}

//打出六个undefined
for (var i = 0; i <= 5; i++) {
    setTimeout(function(i) {
        console.log(i)
    }, 500);
}

//接下来几个是类似的 延迟5秒后 打出0,1,2,3,4,5

//1
for (var i = 0; i <= 5; i++) {
    setTimeout((function(num) {
    	console.log('AAA')
        return function() { console.log(num) };
    })(i), 5000);
}

//2
function cb2(num) {
	console.log('BBB')
    return function() {
        console.log(num)
    }
}

for (var i = 0; i <= 5; i++) {
    setTimeout(cb2(i), 5000);
}

//3
function cb3(num) {
	console.log('CCC')
    console.log(num)
}

for (var i = 0; i <= 5; i++) {
    setTimeout(cb3.bind(this, i), 5000);
}
