'use strict'
let res = [];
let data = {};
let index = {};

let arr = [{type: 1, count:2}, {type: 1, count: 2}, {type: 2, count: 3}];

for (let item of arr) {
    if (!data[item.type]) {
        data[item.type] = true;
        res.push({ type: item.type, count: item.count });
        index[item.type] = res.length - 1
    } else {
        res[index[item.type]].count += item.count
    }
}

console.log(res);