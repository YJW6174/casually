/**
 * Created: yuanjunwen
 * on 5/30/16.
 */
/*
 Write a function, which takes a non-negative integer (seconds) as input and returns the time in a human-readable format (HH:MM:SS)

 HH = hours, padded to 2 digits, range: 00 - 99
 MM = minutes, padded to 2 digits, range: 00 - 59
 SS = seconds, padded to 2 digits, range: 00 - 59
 The maximum time never exceeds 359999 (99:59:59)
 */

'use strict'
function humanReadable(seconds) {

    function pad(time) {
        return time < 10 ? '0' + time : time;
    }
    return  pad(Math.floor(seconds/3600)) + ":" +
            pad(Math.floor(seconds/60%60)) + ":" +
            pad(seconds % 60);

}


console.log(humanReadable(83405));