// 获取一定范围内的随机数，默认为0~10;

function getRandom(start, end) {
    let delta;
    if (start && end) {
        delta = Math.abs(end - start) + 1;
    } else {
        delta = 10;
    }
    return Math.floor(Math.random() * delta + (start || 0));
}

// 指定获得n个从 start到 end 的不重复数字。
function getNoRepeatNumber(n, start, end, bool) {
    let arr = [];
    let obj = {};
    if (Math.abs(start - end) < (n - 1)) {
        throw new Error('Illegal input');
    }
    while (arr.length < n) {
        let temp = getRandom(start, end);
        if (!obj[temp]) {
            obj[temp] = true;
            arr.push(temp);
        }
    }
    if (bool) {
        arr = arr.sort((a, b) => {
            return a - b;
        });
    }
    return arr;
}

console.log(getNoRepeatNumber(10, 2, 50));
module.exports = {
    getNoRepeatNumber,
    getRandom
};
