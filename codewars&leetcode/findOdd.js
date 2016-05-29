/**
 * Given an array, find the int that appears an odd number of times.

 There will always be only one integer that appears an odd number of times.
 * @param A
 * @returns {number}
 */
function findOdd(A) {
    //happy coding!
    var obj = {};
    for(var i = 0; i<A.length;i++){
        if(obj[A[i]]){
            obj[A[i]]++;
        } else {
            obj[A[i]] = 1;
        }
    }
    for(var key in obj){
        if((obj[key] % 2 )!= 0){
            return parseInt(key);
        }
    }

}
//console.log(findOdd([5,4,3,2,1,5,4,3,2]));

var ar = [1,2,3];
var ar2 = [11,22,33];
var obj = {	a : 0,	b : 0	};
var myar = [];
for(var i = 0; i < 3; i ++)
{
    obj.a = ar[i];
    obj.b = ar2[i];
    myar.push(obj)
    console.log(myar);
}
console.log(myar[0].a);
/*
 function doTest(a, n) {
 console.log("A = ", a);
 console.log("n = ", n);
 Test.assertEquals(findOdd(a), n);
 }
 Test.describe('Example tests', function() {
 doTest([20,1,-1,2,-2,3,3,5,5,1,2,4,20,4,-1,-2,5], 5);
 doTest([1,1,2,-2,5,2,4,4,-1,-2,5], -1);
 doTest([20,1,1,2,2,3,3,5,5,4,20,4,5], 5);
 doTest([10], 10);
 doTest([1,1,1,1,1,1,10,1,1,1,1], 10);
 doTest([5,4,3,2,1,5,4,3,2,10,10], 1);
 });
 */