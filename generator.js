/**
 * 形式上，Generator 函数是一个普通函数，但是有两个特征。一是，function关键字与函数名之间有一个星号；
 * 二是，函数体内部使用yield语句，定义不同的内部状态（yield在英语里的意思就是“产出”）。
 */

function* helloWorldGenerator() {
    yield 'hello';
    yield 'world';
    return 'ending';
}
/**
 * 即该函数有三个状态：hello，world和return语句（结束执行）。
 * 调用Generator函数后，该函数并不执行，返回的也不是函数运行结果，
 * 而是一个指向内部状态的指针对象，也就是上一章介绍的遍历器对象（Iterator Object）。
 */
let hw = helloWorldGenerator();

console.log(hw);

function* gen() {
    yield 123 + 456;
}
/**
 * 上面代码中，yield后面的表达式123 + 456，不会立即求值，只会在next方法将指针移到这一句时，才会求值。
 */
let g1 = gen();
g1.next();

/**
 * 由于Generator函数返回的遍历器对象，只有调用next方法才会遍历下一个内部状态，所以其实提供了一种可以暂停执行的函数。yield语句就是暂停标志。
 
 遍历器对象的next方法的运行逻辑如下。
 
 （1）遇到yield语句，就暂停执行后面的操作，并将紧跟在yield后面的那个表达式的值，作为返回的对象的value属性值。
 
 （2）下一次调用next方法时，再继续往下执行，直到遇到下一个yield语句。
 
 （3）如果没有再遇到新的yield语句，就一直运行到函数结束，直到return语句为止，并将return语句后面的表达式的值，作为返回的对象的value属性值。
 
 （4）如果该函数没有return语句，则返回的对象的value属性值为undefined。
 */

/**
 * yield句本身没有返回值，或者说总是返回undefined。next方法可以带一个参数，该参数就会被当作上一个yield语句的返回值。
 */

function* f() {
    for (let i = 0; true; i++) {
        let reset = yield i;
        if (reset) {
            i = -1;
        }
    }
}

let g = f();

g.next(); // { value: 0, done: false }
g.next(); // { value: 1, done: false }
g.next(true); // { value: 0, done: false }

// ===========================================================================================

function* foo(x) {
    let y = 2 * (yield (x + 1));
    let z = yield (y / 3);
    return (x + y + z);
}

let a = foo(5);
a.next(); // Object{value:6, done:false}
a.next(); // Object{value:NaN, done:false}
a.next(); // Object{value:NaN, done:true}

let b = foo(5);
b.next(); // { value:6, done:false }
b.next(12); // { value:8, done:false }
b.next(13); // { value:42, done:true }

// ============================================================================================
// yield* 遍历完全二叉树

// 下面是二叉树的构造函数，
// 三个参数分别是左树、当前节点和右树
function Tree(left, label, right) {
    this.left = left;
    this.label = label;
    this.right = right;
}

// 下面是中序（inorder）遍历函数。
// 由于返回的是一个遍历器，所以要用generator函数。
// 函数体内采用递归算法，所以左树和右树要用yield*遍历
function* inorder(t) {
    if (t) {
        yield* inorder(t.left);
        yield t.label;
        yield* inorder(t.right);
    }
}

// 下面生成二叉树
function make(array) {
    // 判断是否为叶节点
    if (array.length === 1) return new Tree(null, array[0], null);
    return new Tree(make(array[0]), array[1], make(array[2]));
}
let tree = make([[['a'], 'b', ['c']], 'd', [['e'], 'f', ['g']]]);

// 遍历二叉树
let result = [];
for (let node of inorder(tree)) {
    result.push(node);
}

console.log(result);
