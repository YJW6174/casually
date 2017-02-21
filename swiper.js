function Swipe(container, options) {

    //
    var noop = function() {}; // simple no operation function
    var offloadFn = function(fn) { setTimeout(fn || noop, 0) }; // offload a function  //卸载函数执行?

    //check browser capabilities
    var browser = {
        addEventListerner: !!window.addEventListerner,
        touch: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
        transitions: (function(dom) {
            var props = ['transformProperty', 'WebkitTransform', 'MozTransform', 'OTransform', 'msTransform'];
            for (var i in props) {
                if (props[i] !== undefined) {
                    return true;
                }
            }
            return false;
        })(document.createElement('div'));
    }

    if (!container) return;
    var element = container.children[0]; // container = .swipe  element  = .swipe wrap
    var slides, slidePos, width;

    options = options || {};

    var index = parseInt(options.startSlide, 10) || 0;
    var speed = parseInt(options.speed, 10) || 300;

    options.continuous = options.continuous ? options.continuous : true;

    function setUp() {

        slides = element.children; //

        slidePos = new Array(slides.length);

        width = container.getBoundingClientRect().width || container.offsetWidth; //设置container 的宽度

        element.style.width = (slides.length * width) + 'px'; //设置.swiPe wrap 的宽度 

        var pos = slides.length;
        while (pos--) {
            var slide = slides[pos];
            slide.style.width = width + 'px';
            slide.setAttribute('data-index', pos);

            if (browser.transitions) {
                slide.style.left = (pos * -width) + 'px';
            }
        }

    }

    function translate(index, dist, speed) {
        var slide = slides[index];
        var style = slide && slide.style;

        if (!style) return;

        var scale = style['-webkit-transform'] && style['-webkit-transform'].match(/scale\([\d.]+\)/);
        if (scale && scale[0] != 'scale(1)') return;

        style.webkitTransitionDuration =
            style.MozTransitionDuration =
            style.msTransitionDuration =
            style.OTransitionDuration =
            style.transitionDuration = speed + 'ms';

        style.webkitTransform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
        style.msTransform =
            style.MozTransform =
            style.OTransform = 'translateX(' + dist + 'px)';
    }


    function animate(from, to, speed) {

        // if not an animation, just reposition
        if (!speed) {

            element.style.left = to + 'px';
            return;

        }

        var start = +new Date;

        var timer = setInterval(function() {

            var timeElap = +new Date - start;

            if (timeElap > speed) {

                element.style.left = to + 'px';

                if (delay) begin();

                options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);

                clearInterval(timer);
                return;

            }

            element.style.left = (((to - from) * (Math.floor((timeElap / speed) * 100) / 100)) + from) + 'px';

        }, 4);

    }


    function move(index, dist, speed) {

        translate(index, dist, speed);
        slidePos[index] = dist;

    }
}
