/**
 * Utility class for Harshad numbers (also called Niven numbers).
 *
 * @namespace Harshad
 */
var Harshad = ( function() {
  'use strict';

  return {
    /**
     * Returns true when the given number is a valid Harshad number.
     *
     * @param {Number} number The given number
     * @returns {Boolean}
     * @function Harshad.isValid
     */
    isValid: function( number ) {
       var sum = 0;
        number.toString().split('').forEach(function(item,index){
            sum+= parseInt(item);
       })
        return number % sum == 0;
      // Your implementation goes here
    },
    /**
     * Gets the next Harshad number after the given number.
     *
     * @param {Number} number The given number
     * @returns {Number}
     * @function Harshad.getNext
     */
    getNext: function( number ) {
      // Your implementation goes here
      do{
        number++
      }while(this.isValid(number) == false);
      return number
    },
    /**
     * Returns the suite of Harshad numbers, starting after a given number.
     *
     * @param {Number} count The number of elements to return
     * @param {Number} start The number after which the serie should start;
     *  defaults to 0
     * @returns {Array}
     * @function Harshad.getSerie
     */
    getSerie: function( count, start ) {
      // Your implementation goes here
      start = start || 0;
      var res = [];
      do{
        start++;
        if(this.isValid(start)){
            res.push(start);
            count--
        }
      }while(count)
      return res;
    }
  };

} () );

