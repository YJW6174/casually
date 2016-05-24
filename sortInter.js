function order(words) {
    // ...
    var resultArr = [];
    words.split(' ').map(function (item) {
        resultArr.push(getOrder(item));
    });

    resultArr.sort(createComparisonFunction('index'));
    var result = '';
    for (var i = 0; i < resultArr.length; i++) {
        result += resultArr[i].item + ' ';
    }
    return (result.slice(0,-1));
}

function getOrder(item) {
    item = item.split('');
    for (var i = 0; i < item.length; i++) {
        if (typeof Number(item[i]) == 'number' && !isNaN(item[i])) {

            return {index: item[i], item: item.join('')};
        }
    }
}
function createComparisonFunction(propertyName) {
    return function (object1, object2) {
        var value1 = object1[propertyName];
        var value2 = object2[propertyName];
        if (value1 < value2) {
            return -1;
        } else if (value1 > value2) {
            return 1;
        } else {
            return 0;
        }
    };
}

order("is2 Thi1s T4est 3a");