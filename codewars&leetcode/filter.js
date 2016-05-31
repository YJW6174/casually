function countGrade(scores) {
    //coding here...
    var obj = {
        S: 0,
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        X: 0
    };
    scores.filter(function (item, index) {
        if (item == 100) {
            obj.S ? obj.S++ : obj.S = 1;
        }
        if (item < 100 && item >= 90) {
            obj.A ? obj.A++ : obj.A = 1;
        }
        if (item < 90 && item >= 80) {
            obj.B ? obj.B++ : obj.B = 1;
        }
        if (item < 80 && item >= 60) {
            obj.C ? obj.C++ : obj.C = 1;
        }
        if (item < 60 && item >= 0) {
            obj.D ? obj.D++ : obj.D = 1;
        }
        if (item == -1) {
            obj.X++;
        }
    });
    return obj;
}

console.log(countGrade([65, 75, 85, 85, 95, 100, 100]));

function countGrade2(scores) {
    return {
        S: scores.filter(x => x >= 100).length,
        A: scores.filter(x => x < 100).filter(x => x >= 90).length,
        B: scores.filter(x => x < 90).filter(x => x >= 80).length,
        C: scores.filter(x => x < 80).filter(x => x >= 60).length,
        D: scores.filter(x => x > 0).filter(x => x < 60).length,
        X: scores.filter(x => x == -1).length
    }
}

console.log(countGrade2([65, 75, 85, 85, 95, 100, 100]));