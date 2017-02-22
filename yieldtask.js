function scheduler(task) {
    console.log('task:' + task)
    var taskObj = task.next(task.value);
    console.log(taskObj);
    // 如果Generator函数未结束，就继续调用
    if (!taskObj.done) {
        task.value = taskObj.value
        scheduler(task);
    }
}

var Task = function*() {
    var a = yield 1; //1.
    console.log(a);
    var b = yield a + 'a';
    console.log(b);
    var c = yield b + 'b';
    console.log(c);
    var d = yield d + 'd';
    console.log(d);
}

var task = Task(); //返回一个状态机, 迭代器对象;

//scheduler(task)


function autoDoTask(task) {
    var taskObj = task.next(task.value); // task是个状态机,generater函数 task.next() 返回一个对象{value:'',done:false}

    if (!taskObj.done) {
        task.value = taskObj.value;
        autoDoTask(task)
    }

}

autoDoTask(task)

//1.next 参数会变成yield 左边的值

//2. task.next() 每次返回的是一个对象{value: , done:};

//把task.next().value 赋值给 task 对象,再把task对象传进自执行函数中,
