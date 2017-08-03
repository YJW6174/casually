var util = {
    extend: function (receiver, supplier) {
        for (var key in supplier) {
            if (Object.prototype.hasOwnProperty.call(supplier, key)) {
                receiver[key] = supplier[key];
            }
        }
        return receiver;
    },

    /**
     * 绑定事件兼容性处理
     * @param name 监听的事件名称
     * @param callback 事件触发时的回调
     * @param useCapture 是否在捕获阶段执行
     * @param target 绑定时间的目标元素(默认为window)
     */
    addEventListener: function (name, callback, useCapture, target) {
        if (target && target.addEventListener) { //非ie 和ie9
            target.addEventListener(name, callback, false);

        }
        else if (target && target.attachEvent) { //ie6到ie8
            target.attachEvent("on" + name, callback);

        }
        else if (target) { //ie5
            target["on" + name] = callback;
        }
        else if (window.addEventListener) {
            return window.addEventListener(name, callback, useCapture);
        }
        else if (window.attachEvent) {
            return window.attachEvent('on' + name, callback);
        }
    },

    //注册DOMReady事件的函数
    DOMReady: function () {
        var isIE=navigator.userAgent.match(/MSIE (\d)/i);
        isIE=isIE?isIE[1]:undefined;
        //先保存参数列表和参数长度
        var s = arguments, i = s.length;
        if (isIE < 9)//传统浏览器使用doScroll
        //创建计时器
            var itv = setInterval(function () {
                try {//测试doScroll的运行是否错误，如果错误则DOM还没加载完成
                    document.documentElement.doScroll();
                    //如果没有错误，则清除计时器
                    clearInterval(itv);
                    //并且把传入的参数全都调用一遍
                    while (i--)s[i]();
                } catch (e) {
                }
            }, 1);
        else//现代浏览器使用DOMContentLoaded事件
            document.addEventListener("DOMContentLoaded", function () {
                //触发时把传入的函数全都调用一遍
                while (i--)s[i]();
            });
    },

    getParentsAttr: function (ele, attr) {
        var data;
        var eleParent = ele.parentNode;

        while (eleParent.nodeName !== 'BODY' && !eleParent.getAttribute(attr)) {
            eleParent = eleParent.parentNode;
        }
        data = eleParent.getAttribute(attr);

        return data;
    },

    /**
     * page unload
     * onbeforeunload is the right event to fire, but not all browsers don't support it.
     * This allows us to fall back to onunload when onbeforeunload isn't implemented
     */
    onunload: function (callback) {
        this.addEventListener('unload', callback, false);
        this.addEventListener('beforeunload', callback, false);
    },

    now: function () {
        return +(new Date());
    },

    //todo: zhengquexing
    ajax: function ajax(options) {
        //编码数据
        function setData() {
            //设置对象的遍码
            function setObjData(data, parentName) {
                function encodeData(name, value, parentName) {
                    var items = [];
                    name = parentName === undefined ? name : parentName + "[" + name + "]";
                    if (typeof value === "object" && value !== null) {
                        items = items.concat(setObjData(value, name));
                    } else {
                        name = encodeURIComponent(name);
                        value = encodeURIComponent(value);
                        items.push(name + "=" + value);
                    }
                    return items;
                }

                var arr = [], value;
                if (Object.prototype.toString.call(data) == '[object Array]') {
                    for (var i = 0, len = data.length; i < len; i++) {
                        value = data[i];
                        arr = arr.concat(encodeData(typeof value == "object" ? i : "", value, parentName));
                    }
                } else if (Object.prototype.toString.call(data) == '[object Object]') {
                    for (var key in data) {
                        value = data[key];
                        arr = arr.concat(encodeData(key, value, parentName));
                    }
                }
                return arr;
            };
            //设置字符串的遍码，字符串的格式为：a=1&b=2;
            function setStrData(data) {
                var arr = data.split("&");
                var name, value = '';
                for (var i = 0, len = arr.length; i < len; i++) {
                    name = encodeURIComponent(arr[i].split("=")[0]);
                    value = encodeURIComponent(arr[i].split("=")[1]);
                    arr[i] = name + "=" + value;
                }
                return arr;
            }

            if (data) {
                if (typeof data === "string") {
                    data = setStrData(data);
                } else if (typeof data === "object") {
                    data = setObjData(data);
                }
                data = data.join("&").replace("/%20/g", "+");
                //若是使用get方法或JSONP，则手动添加到URL中
                if (type === "get" || dataType === "jsonp") {
                    url += url.indexOf("?") > -1 ? (url.indexOf("=") > -1 ? "&" + data : data) : "?" + data;
                }
            }
        }

        // JSONP
        function createJsonp() {
            var script = document.createElement("script"),
                timeName = new Date().getTime() + Math.round(Math.random() * 1000),
                callback = "JSONP_" + timeName;

            window[callback] = function (data) {
                clearTimeout(timeout_flag);
                document.body.removeChild(script);
                success(data);
            }
            script.src = url + (url.indexOf("?") > -1 ? "&" : "?") + "callback=" + callback;
            script.type = "text/javascript";
            document.body.appendChild(script);
            setTime(callback, script);
        }

        //设置请求超时
        function setTime(callback, script) {
            if (timeOut !== undefined) {
                timeout_flag = setTimeout(function () {
                    if (dataType === "jsonp") {
                        delete window[callback];
                        document.body.removeChild(script);

                    } else {
                        timeout_bool = true;
                        xhr && xhr.abort();
                    }
                    console.log("timeout");

                }, timeOut);
            }
        }

        // XHR
        function createXHR() {
            //由于IE6的XMLHttpRequest对象是通过MSXML库中的一个ActiveX对象实现的。
            //所以创建XHR对象，需要在这里做兼容处理。
            function getXHR() {
                if (window.XMLHttpRequest) {
                    return new XMLHttpRequest();
                } else {
                    //遍历IE中不同版本的ActiveX对象
                    var versions = ["Microsoft", "msxm3", "msxml2", "msxml1"];
                    for (var i = 0; i < versions.length; i++) {
                        try {
                            var version = versions[i] + ".XMLHTTP";
                            return new ActiveXObject(version);
                        } catch (e) {
                        }
                    }
                }
            }

            //创建对象。
            xhr = getXHR();
            xhr.open(type, url, async);
            //设置请求头
            if (type === "post" && !contentType) {
                //若是post提交，则设置content-Type 为application/x-www-four-urlencoded
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
            } else if (contentType) {
                xhr.setRequestHeader("Content-Type", contentType);
            }
            //添加监听
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (timeOut !== undefined) {
                        //由于执行abort()方法后，有可能触发onreadystatechange事件，
                        //所以设置一个timeout_bool标识，来忽略中止触发的事件。
                        if (timeout_bool) {
                            return;
                        }
                        clearTimeout(timeout_flag);
                    }
                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                        success(xhr.responseText);
                    } else {
                        error(xhr.status, xhr.statusText);
                    }
                }
            };
            //发送请求
            xhr.send(type === "get" ? null : data);
            setTime(); //请求超时
        }

        var url = options.url || "", //请求的链接
            type = (options.type || "get").toLowerCase(), //请求的方法,默认为get
            data = options.data || null, //请求的数据
            contentType = options.contentType || "", //请求头
            dataType = options.dataType || "", //请求的类型
            async = options.async === undefined ? true : options.async, //是否异步，默认为true.
            timeOut = options.timeOut, //超时时间。
            before = options.before || function () {
                }, //发送之前执行的函数
            error = options.error || function () {
                }, //错误执行的函数
            success = options.success || function () {
                }; //请求成功的回调函数
        var timeout_bool = false, //是否请求超时
            timeout_flag = null, //超时标识
            xhr = null; //xhr对角
        setData();
        before();
        if (dataType === "jsonp") {
            createJsonp();
        } else {
            createXHR();
        }
    },

    removeElement: function (_element) {
        var _parentElement = _element.parentNode;
        if (_parentElement) {
            _parentElement.removeChild(_element);
        }
    },

    type: function (_element) {
        if (_element == null) {
            return _element + "";
        }
        return typeof _element;
    },

    isArrayLike: function (_element) {
        var length = !!_element && "length" in _element && _element.length;
        var type = this.type(_element);

        if (type === "function" || _element == window._element) {
            return false;
        }

        return type === "array" || length === 0 ||
            typeof length === "number" && length > 0 && ( length - 1 ) in _element;
    },

    isArray: function (arg) {
        if (!Array.isArray) {
            Array.isArray = function (arg) {
                return Object.prototype.toString.call(arg) === '[object Array]';
            };
        }
        else {
            return Array.isArray(arg);
        }
    },

    /**
     * 判断输入是否为html的dom
     */
    isDOM: ( typeof HTMLElement === 'object' ) ?
        function (obj) {
            return obj instanceof HTMLElement;
        } :
        function (obj) {
            return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
        },

    /**
     * 将search转为对象
     * @param str
     * @returns {{}}
     */
    urlParams: function urlQuery2Obj(str) {
        if (!str) {
            str = location.search;
        }
        if (str[0] === '?' || str[0] === '#') {
            str = str.substring(1);
        }
        var query = {};
        str.replace(/\b([^&=]*)=([^&=]*)/g, function (m, a, d) {
            if (typeof query[a] != 'undefined') {
                query[a] += ',' + decodeURIComponent(d);
            } else {
                query[a] = decodeURIComponent(d);
            }
        });
        return query;
    },

    stopBubble: function (e) {
        if (e && e.stopPropagation) {
            e.stopPropagation();
        } else {
            window.event.cancelBubble = true;
        }
    },

    isNull: function isNull(arg) {
        return !arg && arg !== 0 && typeof arg !== "boolean" ? true : false;
    },

    getAds: function (arg) {
        var ads;
        if (typeof arg === 'string') {
            ads = document.querySelectorAll(arg);
        }
        else {
            ads = arg && arg.element || document.querySelectorAll('[data-midas]');
        }
        ads = this.isArrayLike(ads) ? ads : [].concat(ads);

        return ads;
    },

    eventBus: {
        _eventList: {},
        trigger: function () {
            var _shift = Array.prototype.shift;
            var type = _shift.call(arguments);
            var arg = _shift.call(arguments);

            if (!this._eventList[type]) {
                return false;
            }
            for (var i = 0; i < this._eventList[type].length; i++) {
                this._eventList[type][i].call(this, arg);
            }
        },
        on: function (type, callback) {
            if (typeof callback !== 'function') {
                return;
            }
            if (!this._eventList[type]) {
                this._eventList[type] = [];
            }
            this._eventList[type].push(callback);
        }
    }
};

MIDAS.util = util;