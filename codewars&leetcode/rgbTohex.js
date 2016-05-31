/**
 * Created: yuanjunwen
 * on 5/31/16.
 */
function rgb(r, g, b) {
    // complete this function
    if (r > 255)r = 255;
    if (r < 0)r = 0;
    if (g > 255)g = 255;
    if (g < 0)g = 0;
    if (b > 255)b = 255;
    if (b < 0)b = 0;
    return pad(r)+pad(g)+pad(b);
}
function pad(r){
  return  r.toString(16).length<2?'0'+ r.toString(16).toUpperCase() : r.toString(16).toUpperCase()
}
console.log(rgb(0, 0, 0));
console.log('0' < 10);