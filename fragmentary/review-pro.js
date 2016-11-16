/**
 * @package{widget} review

 * @require  core
 * @require  input-checker
 * @require  input-filter
 * @require  length-limit
 * @require  placeholder
 * @require  hippo
 */


/**
 * @module  star-rating
 * @author  Kael Zhang
 * @constructor
 * @method: {
        getRate: // getter
        setRate: function(rate){} // setter, if rate is undefined, undo star-rating
        check:
   }

 * @usage:
    <code>
        new DP.StarRating('J_shop-rating', {activeHintCls: [null, 'hint-rate-20', 'hint-rate-30', null]}).setRate(20);
    </code>
 */

/**
 * to do:
 * 1. 将starRating移到DP 的namespace下，因此函数内使用D - DONE！
 * 2. ua脱离mootools
 */
(function(D, undefined) {

    // 这两个属性是今后强制要求HTML属性中拥有的
    var VALUE_ATTR = 'data-rate-value', // 记录每个星星对应分值的属性
        HINT_ATTR = 'data-hint', // 记录每个星星所对应提示的属性

        DELAY = 50,

        DOT = '.',
        NOOP = function() {},

        // Cls -> Class,        不带DOT
        // CS -> CSS Selector   有必要时，携带'.'、 '#'或者高级选择符
        _default_options = {
            activeCls: 'active-star',
            hintCls: 'hint',
            errHintCls: 'err-hint',
            activeHintCls: [], // 当某一个star激活时，对应的hint的class，若activeHintCls为数组，则顺序与stars的顺序对应；若为字符串，则所有的stars的hint公用这个class
            starCS: 'a',

            // to do:
            onSelect: NOOP,
            onCancel: NOOP,
            onHover: NOOP
        },

        TagList = new Class({
            Implements: Events,
            initialize: function(el) {
                this.container = el;

                this.enterhint = el.getElement(".addenter");
                this.inputbox = el.getElement(".addfood-box");
                this.input = el.getElement(".addfood");
                this.toggleBtn = el.getElement(".for-open");
                this.createMore();
                this.bind();
            },
            /**
             * 设置展开收起
             */
            createMore: function() {
                var btn = this.toggleBtn;
                var cont = this.container.getElement(".chara-con");
                var icons = this.container.getElements(".chara-label");
                var expend = false;
                var defaultHeight = 32;
                var expendHeight;

                if (!cont || !btn) {
                    return;
                }

                cont.set('tween', {
                    duration: 'short',
                    link: 'cancel',
                    onComplete: function() {
                        if (expend) {
                            cont.css({
                                'overflow': 'visible'
                            });
                        }
                    }
                })

                cont.css({
                    "overflow": "visible",
                    "height": "auto"
                });
                expendHeight = cont.getHeight();

                if (expendHeight > defaultHeight) {
                    cont.css({
                        "height": defaultHeight,
                        "overflow": "hidden"
                    });

                    btn.removeClass("Hide");

                    btn.on("click", function() {
                        if (expend) {
                            cont.css({
                                'overflow': 'hidden'
                            });
                            expendHeight = cont.getHeight();
                            cont.tween('height', expendHeight, defaultHeight);
                            btn.set("html", "展开");
                            btn.set("class", "for-open");
                        } else {
                            cont.tween('height', defaultHeight, expendHeight);
                            btn.set("html", "收起");
                            btn.set("class", "for-close");
                        }
                        expend = !expend;
                        return false;
                    });
                } else {
                    cont.css({
                        "height": "auto",
                        "overflow": "visible"
                    });
                }

                for (var i = icons.length - 1; i >= 0; i--) {
                    icons[i].on("click", function() {
                        if (!btn.hasClass("Hide")) {
                            if (!expend) {
                                btn.set("html", "收起");
                                btn.set("class", "for-close");
                                cont.tween('height', defaultHeight, expendHeight);
                            }
                        }
                        expend = !expend;
                    });
                }

            },
            /**
             * 很难受的代码，等点评全部行业化了，重构糟糕的html结构
             */
            positionHint: function() {
                var container = this.container;
                var enterhint = this.enterhint;
                var input = this.input;

                enterhint.css({
                    "left": input.getLeft() - container.getLeft() + input.getWidth() + 4,
                    "top": input.getTop() - container.getTop() - 1
                });
            },
            bind: function() {
                var self = this;
                var container = this.container;
                var enterhint = this.enterhint;
                var input = this.input;
                var cont = this.container.getElement(".chara-con");

                this.container.on("click", function(e) {
                    var el = $(e.target);
                    if (el.match(".chara-label")) {
                        e && e.preventDefault();
                        self.toggle(el);
                        self.fireEvent("toggle");
                    }
                });


                input.on("focus", function() {
                    enterhint.removeClass("Hide");
                    self.positionHint();
                });

                input.on("blur", function() {
                    enterhint.addClass("Hide");
                });

                input.on("keyup", function(e) {
                    var newtag, oldtag;
                    var val = input.get("value").trim();

                    if (e.code == 13 && val) {

                        input.set("value", "");

                        oldtag = self.container.getElements(".chara-label").filter(function(el) {
                            return el.get("html") == val
                        });

                        if (oldtag.length) {
                            self.toggle(oldtag[0]);
                        } else {
                            newtag = self.add(val);
                            self.toggle(newtag);
                        }
                        self.positionHint();
                        cont.css({
                            'overflow': 'visible',
                            'height': 'auto'
                        })
                    }
                })
            },
            val: function(values) {
                if (values) {
                    this.container.getElements(".chara-label").forEach(function(tag) {
                        if (values.contains(tag.get("text"))) {
                            tag.addClass("cur");
                        }
                    });
                } else {
                    return this.container.getElements(".chara-label").filter(function(tag) {
                        return tag.hasClass("cur");
                    }).map(function(tag) {
                        return tag.get("text");
                    });
                }
            },
            toggle: function(tag) {
                tag.toggleClass("cur");
            },
            add: function(name) {
                var a = new Element("a");
                a.set({
                    "class": "chara-label",
                    "href": "javascript:;",
                    "text": name
                });
                a.inject(this.inputbox, "before");
                return a;
            },
            getTitle: function() {
                return this.container.get("data-title");
            }
        }),

        StarRating = new Class({
            initialize: function(wrap, options) {
                var _this = this,
                    o, hint;

                wrap = $(wrap);

                if (wrap) {

                    _this.o = o = D.mix(options || {}, _default_options, false);

                    _this.wrap = wrap;
                    _this.stars = wrap.getElements(o.starCS);

                    _this.hint = hint = wrap.getElement(DOT + o.hintCls);
                    if (hint) {
                        _this.defaultHint = hint.get('text');
                    } else {
                        _this._setHint = NOOP;
                    }

                    _this._bind();
                }
            },

            // @public
            // --------------------------------------------------------------------------* \
            // get rating
            getRate: function() {
                return this._rating;
            },

            getHint: function() {
                return this.hint.get("text");
            },

            // set rating
            // @param v {Number} rating value
            setRate: function(v) {
                var _this = this,
                    i = 0,
                    len = _this.stars.length,
                    star;

                if (chk(v)) {
                    for (; i < len; i++) {
                        star = _this.stars[i];
                        if (Number(star.getAttribute(VALUE_ATTR)) === v) {
                            _this._activeStar(i, v, true);
                            break;
                        }
                    }
                } else {
                    _this._undo();
                }
            },

            check: function() {
                var _this = this,
                    pass = chk(_this.getRate());

                !pass && _this.hint.addClass(_this.o.errHintCls);
                return pass;
            },

            // @private
            // ------------------------------------------------------------------------- *\

            // undo star selection
            _undo: function() {
                var _this = this;

                _this._removeOnCls(_this._star);
                _this._star = _this._rating = _this._index = undefined;
                // _this.setRate();
                _this._setHint();
            },

            _bind: function() {
                var _this = this,
                    o = _this.o,
                    timer,
                    clear = clearTimeout,
                    timeout = setTimeout,
                    data = o.data,
                    activeCls = o.activeCls;

                _this.stars.each(function(s, index) {
                    var _t = _this;

                    if (s.hasClass(activeCls)) {
                        _t._activeStar(index);
                        _t._setHint(index);
                    }

                    s.addEvents({
                        click: function(e) {
                            e && e.preventDefault();
                            _t._activeStar(index);
                            o.onSelect.call(_this);
                        },
                        mouseenter: function() {
                            clear(timer);

                            var star = _t._star,
                                el = this;
                            star && star !== el && _t._removeOnCls(star);
                            el.addClass(_t.o.activeCls);
                            _t._setHint(index);
                        },
                        mouseleave: function() {
                            _t._removeOnCls(this);
                            // 设置鼠标离开star-rating的方法
                            timer = timeout(function() {
                                _t._leave()
                            }, DELAY);
                        }
                    });
                });

                // _this destruction
                _this._bind = NOOP;
            },

            // @private
            // set a specified star as selected star
            // @param star {Element} the index of the star to be selected
            // @param light_star_now {Boolean} whether light the star up immediately
            _activeStar: function(index, rating, light_star_now) {
                var _this = this,
                    star = _this.stars[index];

                if (star) {
                    _this._removeOnCls(_this.actived);
                    _this._index = index;
                    _this._star = star;
                    _this._rating = rating || Number(star.getAttribute(VALUE_ATTR));

                    light_star_now && _this._leave();
                }
            },

            // mouseleave star-rating
            _leave: function() {
                var _this = this,
                    star = _this._star;

                star && star.addClass(_this.o.activeCls);
                _this._setHint(_this._index);
            },

            // remove active-class
            _removeOnCls: function(el) {
                el && el.removeClass(this.o.activeCls);
            },

            _setHint: function(index) {
                var _this = this,
                    o = _this.o,
                    el = _this.stars[index],
                    extra_class = D.isArray(o.activeHintCls) ? o.activeHintCls[index] : o.activeHintCls;

                _this.hint.set('text', el ? el.getAttribute(HINT_ATTR) : _this.defaultHint);
                _this.hint.className = o.hintCls + (extra_class && index !== undefined ? ' ' + extra_class : '');
            }
        });

    D.TagList = TagList;
    D.StarRating = StarRating;

    function chk(v) {
        return !!v || v === 0;
    }

})(DP);

/**
 * @ module {Toggle Button}
 */

(function(D) {
    var NOOP = function() {},
        NULL = null,
        defaultOptions = {
            eventType: 'click',
            toggles: [{
                'btn': {
                    'klass': 'on',
                    'text': '收起',
                    'callback': NOOP
                },
                'view': {
                    'klass': 'view-on',
                    'callback': NOOP
                }
            }, {
                'btn': {
                    'klass': 'off',
                    'text': '展开',
                    'callback': NOOP
                },
                'view': {
                    'klass': 'view-ff',
                    'callback': NOOP
                }
            }],
            status: 1,
            toggleBtn: NULL,
            viewWrap: NULL
        },

        Toggle = new Class({
            Implements: [Options],
            initialize: function(options) {
                var self = this;

                self.setOptions(options);
                options = self.options;
                self.__status = options.status;
                //self._changeView(options.toggles[self.__status]);
                options.toggleBtn.addEvent(options.eventType, function(e) {
                    e.stop();
                    self._changeView();
                });
            },
            options: defaultOptions,
            __status: 0,
            _changeView: function() {
                var self = this,
                    view,
                    options = self.options || {},
                    btn = options.toggleBtn,
                    wrap = options.viewWrap;

                view = options.toggles[self.__status];
                btn && wrap && (function(b, w, v) {

                    var btnV = v.btn,
                        viewV = v.view;

                    b.set('class', btnV.klass).set('html', btnV.text);
                    w.set('class', viewV.klass);
                    btnV.callback && btnV.callback(b, self.__status);
                    viewV.callback && viewV.callback(w, self.__status);

                })(btn, wrap, view);
                self.__status = self.__status ? 0 : 1;
            }
        });
    DP.Form.ToggleButton = Toggle;
})(DP);
/**
 * @module{widget}  review-form
 * @constructor

 * @require  input-checker
 * @require  input-filter
 * @require  length-limit
 * @require  star-rating
 * @require  placeholder
 */

(function(D) {

    var FORM_CLS_PREFIX = 'J_review-',
        FORM_ERR_CLS_PREFIX = 'J_review-err-',
        NOOP = function() {},
        Form = D.Form,
        hideCls = 'Hide',
        mix = D.mix;


    // get element from id
    function id(name) {
        return FORM_CLS_PREFIX + name;
    }

    function errid(name) {
        return FORM_ERR_CLS_PREFIX + name;
    }

    // query one
    function one(name) {
        return $(id(name));
    }

    function err(name) {
        return $(errid(name));
    }

    function msg_creater(name) {
        return '请选择' + (name || '分数');
    }

    function getKeys(obj, data, splitter) {
        var ret = [],
            key;

        obj = obj || {};
        data = data || {};

        for (key in obj) {
            if (!data[key] || data[key].nolisted !== true) {
                ret.push(key);
            }
        }

        return ret.join(splitter || '|');
    }

    /**
     * @param label_s {String} label text of the sender checkbox
     * @param label_r {String} label text of the receiver checkbox
     * @param checks {Array of Elements} all checkboxes
     * @param mutual {Boolean} if the sender and receiver are mutual related
     * @param reverse {Boolean} sender and receiver are fetched by the order of their occurence. set reverse as true, if you want to swap them
     */
    function addRelatedTags(label_r, label_s, checks, mutual, reverse) {
        var s, r,
            i = 0,
            len = checks.length,
            c,
            n, txt,
            temp,
            test_check;

        for (; i < len; i++) {
            c = checks[i];
            n = c.getNext('label');

            if (n && (txt = n.get('text'))) {
                if (!r && txt === label_r) {
                    r = c;
                    continue;
                }

                if (!s && txt === label_s) {
                    s = c;
                    continue;
                }
            }

            if (s && r) {
                break;
            }
        }

        if (s && r) {
            if (reverse) {
                temp = s;
                s = r;
                r = temp;
            }

            test_check = mutual ?
                function() {
                    // if not triggered by event,
                    // don't use triple equal, for the object type of this
                    var checked = this === false ? (r.checked || s.checked) : this.checked;

                    // if mutual related, both receiver and sender will affect the checked status
                    s.checked = checked;
                    r.checked = checked;
            } :
                function() {

                    // if user had checked sender before js is loaded,
                    // we only apply receiver if sender is checked

                    // @type {Object} this
                    // if the function called with false,
                    // this === new Boolean(false)  -> true
                    // this === false               -> false
                    if (this !== false || s.checked) {
                        r.checked = s.checked;
                    }
            };

            s.addEvent('click', test_check);
            mutual && r.addEvent('click', test_check);

            test_check.call(false);
        }
    }

    /**
 * 补充简写的定义，老代码，焦虑啊：
   tap      -> shop type -> true: Food, false: Life
   s[1-4]   -> Score[1-4]
   ap       -> average price
   body     -> review body
   dtag     -> dish tags
   stag     -> shop tags
   park     -> whether can park
   star     -> rating star
   sa       -> shop name
   setag    -> searchable tags
   category -> shop type
 */
    var invalidType;
    var reviewForm = {
        autoSaveLength: 0,
        leaveConfirm: false,
        isShortReview: false,

        init: function() {

            var checker = Form.InputChecker,
                filter = Form.InputFilter,
                AUTO_SAVE_INTERVAL = 10000,
                KEY_CODE_S = 83,
                r = reviewForm,
                data = D.data('reviewData'),
                shopID = D.data('shopID'),


                checks = [],

                // 废弃的元素
                // stayed = one('setag'), 是否住过
                // dish_tag = one('dtag'), 最爱推荐菜
                // shop_tag = one('stag'), 商户标签
                // shop_feature = one('feature'), 商户特色
                // stayed = false 是否住过

                /**
                 * 标签组
                 */

                /**
                 * 价格输入框
                 */
                expenses = r.expenses = $$('.price-input'),
                /**
                 * 额外数据输入框
                 */
                extinputs = r.extinputs = $$('.ext-input'),

                /**
                 * 附加信息
                 */
                extinfo = r.extinfo = $$('.ext-info'),

                /**
                 * 额外输入组tag组
                 */
                exttaggroup = r.exttaggroup = $$(".charac-list").map(function(el) {
                    var taglist = new D.TagList(el);
                    taglist.addEvent("toggle", function() {
                        r.saveReviewDraft();
                    });
                    el.type = "tagList";
                    el.store("taglist", taglist);
                    return taglist;
                }),

                review_body = one('body'),

                review_user_recommend = one('user-recommend'),
                review_park = one('park'),

                /**
                 * 删除点评按钮
                 */
                del_review = one('del'),
                /**
                 * 提交按钮
                 */
                submit_btn = one('submit'),
                /**
                 * 展开回应框按钮
                 * @type {[type]}
                 */
                toggle_btn = one('t-btn'),

                review_wrap = $(D.data('reviewWrap')),
                related_checks;

            function is_selected(v) {
                return Number(v) !== -1;
            }

            function register_checker(checker, type) {
                checks.push(checker);
                r.__errs[type] = checker;
            }

            function create_select_checker() {

                var ratings = [],
                    StarRating = D.StarRating;

                $$(".J_score_rating").forEach(function(el, i) {
                    var rating = new StarRating(el, {
                        activeHintCls: 'active-hint',
                        activeCls: 'active-square',
                        onSelect: r.saveReviewDraft
                    });
                    rating.title = el.get("data-title");
                    ratings.push(rating);
                    register_checker(rating, "rating_" + i);
                })

                r.ratings = ratings;
            }

            function removeLengthHint() {
                $$('.review-counter .note').destroy();
                review_body.removeEvent('keyup', removeLengthHint);
                review_body.onpaste = null;
            }

            function fetch() {
                if (!this.enable || this.cacheStatus != 'loaded') return false;
                var value = this.element.value,
                    query = value,
                    index = 0;
                this.queryIndex = index;
                //if extraParams or queryValue is changed,get new data.

                this.queryValue = query;
                if (this.element.readOnly)
                    this.queryValue = "";
                this.update(this.filter(this.cached));
                return true;
            }

            // 3个评分
            create_select_checker();

            // 人均，输入框/选择框
            expenses.concat(extinputs).forEach(function(elem) {
                var regmap = {
                    "Double": /^([0-9]+\.?[0-9]{0,2}|)$/,
                    "Integer": /^\d{0,8}$/
                }, type = elem.get("data-type"),
                    dataopt = elem.get("data-options"),
                    suggests, autocompleter;

                if (dataopt) {
                    suggests = dataopt.split("|").filter(function(v) {
                        return v
                    });
                    autocompleter = new Autocompleter(elem, suggests, {
                        listCloseBtn: false,
                        fxOptions: false,
                        width: 76,
                        delay: 0,
                        adjust: {
                            y: -1
                        },
                        onFocus: fetch
                    });
                    autocompleter.fetch = fetch;
                }

                if (elem.hasClass("calendar")) {
                    var datepicker = new Datepicker(elem, elem, {
                        triggerType: "focus",
                        preventKey: true
                    });

                }

                if (elem.match('input') && type in regmap) {
                    // register_checker( new checker( elem, errid('ap'), function(v){return (v = Number(v)) >= 0 && v <= data.avglimit; }, /* '金额应为0-' + data.avglimit*/ '', {ev: 'observer'} ), 'ap' );
                    new Form.InputFilter(elem, regmap[type], {
                        type: 'limit'
                    });
                }
            })



            // 是否住过
            var stayed = false;
            if (stayed) {
                register_checker(new checker(stayed, errid('setag'), is_selected, '请选择是否住过'), 'setag');
            }

            // 主体点评
            var noLimit = (D.data("bodyMinCount")==0); // 零门槛

            //只能重载原型方法，不然ie,6,7下初始化的时候拿不到新实例方法。
            Form.LengthLimit.prototype.check = function(e) {
                var pass = false;
                var length = this.target.value.length;
                var minlength = this.target.value == this.target.placeholder ? 0 : this.target.value.replace(this.options.invalidCharsRegExp, '').length;
                r.isShortReview = false;
                if (minlength < this.options.min) {
                    if (noLimit) {
                        this._setInfo(this.options.minMsg, 'form-content-block notepart', this.options.min - minlength);
                        if (minlength < 15) r.isShortReview = true;
                        return true;
                    }
                    this._setInfo(this.options.minMsg, (e && e.type == 'keyup') ? 'form-content-block notepart' : 'form-content-block overnote', this.options.min - minlength);
                } else if (length > this.options.max) {
                    this._setInfo(this.options.maxMag, 'form-content-block overnote', length - this.options.max);
                } else {
                    pass = true;
                    this._setInfo(this.options.msg, 'form-content-block cannote', this.options.max - length);
                }
                return pass;
            };

            var limiter = new Form.LengthLimit(review_body, errid('body'), {
                invalidCharsRegExp: /[\t\r\n\s]/g,
                min: noLimit ? D.data("bodyAvgCount") : D.data("bodyMinCount"),
                maxMag: '<span class="note">已超过上限num个字</span>',
                minMsg: noLimit ? '<span class="note">离该商户平均点评字数还差num字' :
                    '<span class="note">最少min字，你还需要输入num个字',
                msg: '<span class="note">你还可以输入num个字',
                defClass: 'form-content-block notepart'
            });

            //overwrite check function

            limiter._setInfo = function(msg, klass, num) {
                msg = msg.replace("min", this.options.min)
                    .replace("max", this.options.max)
                    .replace("num", num);

                this.info.className = klass;
                this.info.set('html', msg);

            };
            (function(limiter) {
                var callback = function(e) {
                    limiter.check(e);
                };
                setTimeout(function() {
                    limiter.target.removeEvent('keyup').addEvents({
                        'keyup': callback,
                        'blur': callback
                    });
                }, 0);
            })(limiter);

            register_checker(limiter, 'body');

            var bodyPlaceHolder = new Form.PlaceHolder(review_body);

            if(review_user_recommend){
                var user_recommend_placeholder = new Form.PlaceHolder(review_user_recommend);
            }

            if (review_park) {
                var park_placeholder = new Form.PlaceHolder(review_park);
            }

            review_body.addEvent('keyup', removeLengthHint);

            // there's a bug in mootools 1.3 about 'paste' events
            review_body.onpaste = removeLengthHint;
            r.autoSaveLength = review_body.value.length;

            var defaultTagOptions = {
                lineClass: 'form-block',
                listClass: 'chara-con',
                titleClass: hideCls,
                itemClass: 'chara-label',
                selectClass: 'cur',
                itemParentTag: 'div',
                hasTitle: false,
                allowEmpty: true
            };

            if (del_review) {
                del_review.removeEvents().addEvent('click', function() {
                    var del = confirm('确定要删除此点评？\n\n');
                    if (del) {
                        r._disableForm(true, true);
                        new AjaxReq({
                            url: '/ajax/json/review/reviewAction',
                            data: {
                                'run': 'ad',
                                'shopId': shopID,
                                'reviewId':D.data('reviewId')
                            },
                            method: 'post',
                            onSuccess: r._submitReturn,
                            onError: r._submitReturn
                        }).send();
                    }
                    return false;
                });
            }

            //显示选填项目
            this._checkOptional();

            //检查草稿箱,并给草稿箱绑定事件
            this._checkDraft(shopID);


            if (one('ex-features')) r.extraTag = new Form.PlaceHolder(id('ex-features'));


            submit_btn && submit_btn.removeEvents().addEvent('click', function(e) {
                e && e.preventDefault();
                r._submitCheck();
            });

            /* personalize placeholder */
            r.starRating = new D.StarRating('J_shop-rating', {
                activeHintCls: 'active-hint',
                activeCls: 'active-star',
                onSelect: function() {
                    r.saveReviewDraft();
                }
            });
            r.starRating.title = $('J_shop-rating').get('data-title');
            r.checks = checks;

            r.init = NOOP;
            r._inited = true;

            // 处理输入框展开的事件
            r._bindHash();
            review_body.addEvent('focus', function() {
                r.expand();
            });

            toggle_btn && toggle_btn.addEvent('click', function(e) {
                e && e.preventDefault();
                r.expand();
            });

            if (review_wrap && (related_checks = review_wrap.getElements('[type=checkbox]')) && related_checks.length) {
                addRelatedTags('免费停车', '免费停车', related_checks, true);
                addRelatedTags('可以刷卡', '刷卡消费', related_checks);
            }

            //输入框自动保存
            function autoSave(el) {
                var timeout;
                el.addEvent("keyup", function() {
                    clearTimeout(timeout);
                    timeout = setTimeout(function() {
                        r.saveReviewDraft();
                    }, 2000);
                });
            }
            autoSave(review_body);
            extinputs.forEach(autoSave);
            expenses.forEach(autoSave);

            this.initSyncIcons();
            this.pasteLog();
        },

        // 选填项
        _checkOptional: function () {
            var firstRun = true,
                moreItemBtn = $('J_review-more-item'),
                viewWrap = $('J_review-options-wrap');

            if (moreItemBtn && viewWrap) {
                var btnKlass = ['separated-block open-options', 'separated-block close-options'],
                    changeBtnClass = function (btn, status) {
                        btn.getParent().set('class', btnKlass[status]);
                    },
                    showToggleView = function (view, status) {
                        view[status ? 'removeClass' : 'addClass']('Hide');
                    };

                new D.Form.ToggleButton({
                    eventType: 'click',
                    toggles: [{
                        'btn': {
                            'klass': '',
                            'text': '更多',
                            'callback': changeBtnClass
                        },
                        'view': {
                            'klass': '',
                            'callback': showToggleView
                        }
                    }, {
                        'btn': {
                            'klass': 'off',
                            'text': '收起',
                            'callback': changeBtnClass
                        },
                        'view': {
                            'klass': 'view-ff',
                            'callback': showToggleView
                        }
                    }],
                    toggleBtn: $('J_review-more-item'),
                    viewWrap: $('J_review-options-wrap')
                });
            }
        },

        // 草稿箱
        _checkDraft: function (shopID) {

            // 校验草稿箱是否有数据
            new AjaxReq({
                url: '/ajax/json/review/reviewDraftAction',
                data: {
                    'run': 'd',
                    'mode': 'pro',
                    'shopId': shopID
                },
                method: 'post',
                onSuccess: this._submitReturn,
                onError: this._submitReturn
            }).send();

            // 草稿箱绑定事件
            if (location.href.indexOf('review') > 0) {
                this.leaveConfirm = true;
                window.onbeforeunload = function () {
                    if (this.leaveConfirm) {
                        if (D.data('needAutoSaved')) {
                            return "您的草稿已保存……";
                        } else {
                            return "您的修改尚未提交……";
                        }
                    }
                };

                window.onunload = function () {
                    if (this.leaveConfirm) {
                        this._delUnSubmitPics("用户关闭或刷新页面");
                    }
                    _hip.push(['mv', {
                        module: '2_reviewfail_leavepage',
                        action: 'click',
                        shopid: D.data('shopID')
                    }])
                };
            }

        },

        // 删除未提交的图片
        _delUnSubmitPics:function(cause){
            var uncommitPicIds = [];
            $$(".upload-pic li input[name=picId]").forEach(function (el, i) {
                if (el.getParent().id.indexOf("SWFUpload") != -1) {
                    uncommitPicIds.push(el.value);
                }
            });
            if (uncommitPicIds.length > 0) {
                var picIds = uncommitPicIds.join(",");
                new AjaxReq({
                    url: "/ajax/json/shoppic/picture/delete",
                    method: "post",
                    data: {
                        picIds: picIds,
                        from:location.href,
                        cause:cause
                    },
                    async: false // 同步删除
                }).send();
            }
        },

        saveReviewDraft: function() {
            if (D.data('needAutoSaved')) {
                var r = reviewForm;
                var review = r._getReview();
                var post_data = {
                    "run": "s",
                    "mode": "pro",
                    "shopId": D.data('shopID'),
                    "info": JSON.encode(review)
                };

                new AjaxReq({
                    url: '/ajax/json/review/reviewDraftAction',
                    data: post_data,
                    method: 'post',
                    onSuccess: r._submitReturn,
                    onError: r._submitReturn
                }).send();
            }
        },

        // 记录用户粘贴行为
        pasteLog: function() {
            var r = reviewForm;
            var review_body = one('body');
            var old_paste = review_body.onpaste;

            function log_paste(content) {
                _hip.push(['mv', {
                    module: '5_reviewtext_paste',
                    action: 'paste',
                    shopid: D.data('shopID')
                }]);
            }
            if (old_paste) {
                review_body.onpaste = function(content) {
                    log_paste();
                    old_paste();
                }
            } else {
                review_body.onpaste = log_paste;
            }

            review_body.on("click", function() {
                var data = {
                    module: '5_reviewtext_click',
                    action: 'click',
                    shopid: D.data('shopID')
                };
                if (window.localStorage && localStorage.getItem("hippo_rid")) {
                    data.requestid = localStorage.getItem("hippo_rid");
                }
                _hip.push(['mv', data]);
            });
        },
        // 初始化第三方同步点亮图标
        initSyncIcons: function() {
            var COOKIE_NAME = 'bind_feed',
                DATA_ID_FO = 'J_sync_',
                TOP_DOMAIN = (window.page && page.topDomain) || '.dianping.com',
                _con = $('J_sync_icons');

            _con && _con.addEvent('click', function(e) {
                var _target = e.target,
                    _data_type = _target.get('data-type'),
                    _href = _target.get('href'),
                    _bind_type,
                    _value_item;

                if (_data_type && _href) {
                    e.stop();

                    _value_item = $(DATA_ID_FO + _data_type);
                    _bind_type = _value_item.get('value');

                    if (_bind_type == '2') {
                        // 未绑定
                        _target.$open = window.open(_href);
                        _target.$interval = setInterval(function() {
                            var _cookie = Cookie.read(COOKIE_NAME);
                            if (_cookie &&
                                _cookie.toLowerCase() == _data_type) {
                                Cookie.dispose(COOKIE_NAME, {
                                    domain: TOP_DOMAIN
                                });
                                clearInterval(_target.$interval);
                                _target.$open && _target.$open.close();
                                delete _target.$open;
                                delete _target.$interval;
                                _target.removeClass(_data_type + '-u').addClass(_data_type + '-o');
                                _value_item.set('value', '1');
                            }
                        }, 100);
                    } else if (_bind_type == '1') {
                        // 绑定 已点亮
                        _target.removeClass(_data_type + '-o').addClass(_data_type + '-u');
                        _value_item.set('value', '0');
                    } else if (_bind_type == '0') {
                        // 绑定 未点亮
                        _target.removeClass(_data_type + '-u').addClass(_data_type + '-o');
                        _value_item.set('value', '1');
                    }
                }
            });
        },

        expand: function() {

            var r = reviewForm;

            if (r._inited) {
                new Fx.Tween(one('body'), {
                    property: 'height',
                    duration: 500,
                    transition: Fx.Transitions.Quart.easeOut,
                    onComplete: NOOP
                }).start(100);
                r.expand = NOOP;
            }
        },

        // 这部分代码今后将使用 @module  ajax-history 实现，并统一管理
        _bindHash: function() {
            var hash, timer;

            timer = DP.delay(function() {
                var h = location.hash;
                if (hash !== h) {
                    hash = h;

                    if (h.indexOf('mr') > 0) {
                        timer.cancel();
                        reviewForm.expand();
                    }
                }
            }, 100, true);

            timer.start();
        },

        __errs: {},

        check: function() {
            var pass = true;

            reviewForm.checks.each(function(c) {
                var rs = c.check(),
                    input,
                    type = D.data('isShopPage') ? 'shop' : 'add',
                    inputId;

                if (!rs && pass) {
                    input = c.input || c.wrap || c.target;
                    if (input) {
                        switch (input.get('id')) {
                            case 'J_review-s1':
                                invalidType = 'score1';
                                break;
                            case 'J_review-s2':
                                invalidType = 'score2';
                                break;
                            case 'J_review-s3':
                                invalidType = 'score3';
                                break;
                            case 'J_review-body':
                                invalidType = 'text';
                                break;
                        }
                        _hip.push(['mv', {
                            module: '8_reviewfail_' + invalidType,
                            action: 'click',
                            shopid: D.data('shopID')
                        }]);
                    }
                }
                pass = rs && pass;
            });
            return pass;
        },
        /*
    {
    "shopId": 509276,
    "shopType": 10,
    "cityId": 1,
    "star": {
        "title": "总体评价",
        "value": 10,
        "desc": "很差"
    },
    "scoreList": [{
            "title": "口味",
            "value": 3,
            "desc": "很好"
        }...],
    "expenseInfoList": [{
            "title": "价格",
            "value": 10,
            "desc": "元"
        }
    ],
    "reviewBody": "好吃好吃好吃好吃好吃好吃好吃好吃好吃好吃好吃",
    // "lastIp": "10.0.0.1",
    "extInfoList": [{
            "title": "交通停车",
            "values": ["有停车位"]
        }, {
            "title": "推荐菜",
            "values": ["红烧肉", "红烧鱼"]
        }, {
            "title": "餐厅特色",
            "values": ["无线上网", "下午茶"]
        }
    ]
}
*/
        _optionalReviewBodyCheck: function() {
            var r = reviewForm,
                review = r._getReview(),
                review_body = one('body').get('value');

            var noLimit = (DP.data("bodyMinCount") == 0),
                tips = noLimit ? ['添加“签到短评”', '您的点评字数较少(小于15)，将成为一条签到短评。点击“取消”继续编辑，点击“确定”提交。'] :
                    ['重复内容较多', '您的点评重复内容较多，建议您修改后提交。点击“取消”返回编辑，点击“确定”继续提交。'],
                junk_pass = noLimit || !r._isJunkReviewBody(review_body);

            if (!junk_pass || r.isShortReview) {
                new Prompt().confirm(tips, {
                    onReturn: function(select) {
                        if (select) {
                            r._submit();
                        } else {
                            dpga("dp_addreview_cancel_guanshui");
                        }
                    }
                });
            } else {
                r._submit();
            }

        },

        _isJunkReviewBody: function(reviewBody) {
            var englishRe = /[a-zA-Z]{3,}/g;
            var chineseRe = /[\u4E00-\u9FFF]/g;
            var englishCount = {};
            var chineseCount = {};
            var match = "";
            while ((match = englishRe.exec(reviewBody)) != null) {
                if (match in englishCount) {
                    englishCount[match]++;
                } else {
                    englishCount[match] = 1;
                }
            }
            while ((match = chineseRe.exec(reviewBody)) != null) {
                if (match in chineseCount) {
                    chineseCount[match]++;
                } else {
                    chineseCount[match] = 1;
                }
            }
            var englishKeyCount = 0;
            var englishTotalCount = 0;
            for (var key in englishCount) {
                englishKeyCount++;
                englishTotalCount = englishTotalCount + englishCount[key];
            }
            var chineseKeyCount = 0;
            var chineseTotalCount = 0;
            for (var key in chineseCount) {
                chineseKeyCount++;
                chineseTotalCount = chineseTotalCount + chineseCount[key];
            }
            var keyCount = englishKeyCount + chineseKeyCount;
            var totalCount = englishTotalCount + chineseTotalCount;
            if (englishKeyCount > 9) {
                return false;
            }
            var minTotalCount = Math.floor(D.data("bodyMinCount") / 2);
            if (totalCount >= minTotalCount && totalCount < 100 && (keyCount / totalCount) >= 0.4) {
                return false;
            }
            if (totalCount >= 100) {
                return false;
            }
            dpga("dp_addreview_reminder_guanshui");
            return true;
        },

        _submitCheck: function() {
            var r = reviewForm,
                star = r.starRating,
                review_body = one('body'),
                star_pass = star.check();

            if (!star_pass) {
                _hip.push(['mv', {
                    module: '8_reviewfail_shopstar',
                    action: 'click',
                    shopid: D.data('shopID')
                }])
                dpga('dp_addreview_add_invalid_star');
                return;
            }

            var score_pass = r.check();
            var review_pass = !r.extraCtrl || r.extraCtrl.check();

            if (!score_pass || !review_pass) {
                _hip.push(['mv', {
                    'note': review_body.value.length,
                    'type': 1,
                    'action': 'click',
                    'shopid': D.data('shopID'),
                    'module': '8_review_fail'
                }]);
                dpga('dp_addreview_add_invalid_' + invalidType);
                return;
            }
            r._optionalReviewBodyCheck();
        },

        _submit: function() {
            var r = reviewForm,
                review = r._getReview();

            r._disableForm(true);

            // bug:未登录状态到达写点评页,点击登录后会自动提交表单,跳转到点评成功页,导致报错!!!
            var reviewId = D.data('reviewId');
            if (r.isShortReview) {
                new AjaxReq({
                    url: '/ajax/json/review/addShort',
                    data: {
                        content: review.reviewBody,
                        star: review.star.value,
                        shopId: review.shopId
                    },
                    method: 'post',
                    onSuccess: r._submitReturn,
                    onError: r._submitReturn
                }).send();
                return;
            }

            var post_data = {
                "run": "a",
                "mode": "pro",
                "info": JSON.encode(review),
                "reviewId": D.data('reviewId'),
                "referPage": document.referrer
            };

            // 第三方同步图标值
            var third_party_sync_icons = {};
            ["sina", "qzone", "sohu"].forEach(function(name) {
                var elem = $("J_sync_" + name),
                    key, value;
                if (elem) {
                    key = elem.get("name"),
                    value = elem.get("value");
                    third_party_sync_icons[key] = value;
                }
            });
            D.mix(post_data, third_party_sync_icons);

            // 同步团购评价参数传递
            var match,
                pl = /\+/g, // Regex for replacing addition symbol with a space
                search = /([^&=]+)=?([^&]*)/g,
                decode = function(s) {
                    return decodeURIComponent(s.replace(pl, " "));
                },
                query = window.location.search.substring(1),
                urlParams = {};
            while (match = search.exec(query))
                urlParams[decode(match[1])] = decode(match[2]);
            D.mix(post_data, urlParams);

            new AjaxReq({
                url: '/ajax/json/review/reviewAction',
                data: post_data,
                method: 'post',
                onSuccess: r._submitReturn,
                onError: r._submitReturn
            }).send();

            _hip.push(['mv', {
                'module': '8_review_success',
                'shopid': D.data('shopID'),
                'action': 'click'
            }]);
        },

        _getReview: function() {
            var r = reviewForm,
                O = one,
                DATA = D.data(),
                U, EMPTY = '',
                val = function(name, default_value) {
                    var el = O(name);

                    return (el && el.value !== el.get('placeholder')) ? el.value : (default_value === U ? 0 : default_value);
                },
                getRating = function(name, default_value) {
                    var ratings = r.ratings || {},
                        rating = ratings[id(name)],
                        v = rating && rating.getRate();

                    return v === U ? default_value : v;
                },
                expenseInfoList = r.expenses.map(function(input) {
                    return {
                        "title": input.get("data-title"),
                        "value": input.value,
                        "desc": input.get("data-desc")
                    };
                }).filter(function(info) {
                    return info.value;
                }),
                extInfoList = r.extinputs.map(function(input) {
                    return {
                        title: input.get("data-title"),
                        values: [input.value]
                    };
                }).concat(r.exttaggroup.map(function(ext) {
                    return {
                        title: ext.getTitle(),
                        values: ext.val()
                    }
                })).filter(function(info) {
                    return info.values[0];
                }),
                getPicList = function() {
                    var picList = [];
                    $$(".upload-pic li").forEach(function(el) {
                        var picIdEl = el.getElement('input[name=picId]');
                        if (picIdEl == null) {
                            return;
                        }
                        var url = el.getElement('input[name=url]').value;
                        picList.push({"picId":picIdEl.value, "url":url})
                    });
                    return picList;
                },
                review = {
                    "shopId": DATA.shopID,
                    "shopType": DATA.shopType,
                    "cityId": DATA.cityID,
                    "star": {
                        title: r.starRating.title,
                        value: r.starRating.getRate(),
                        desc: r.starRating.getHint()
                    },
                    "scoreList": r.ratings.map(function(rating) {
                        return {
                            "title": rating.title,
                            "value": rating.getRate(),
                            "desc": rating.getHint()
                        }
                    }),
                    "reviewBody": val('body', EMPTY),
                    "expenseInfoList": expenseInfoList.length ? expenseInfoList : undefined,
                    "extInfoList": extInfoList.length ? extInfoList : undefined,
                    "reviewPics": getPicList()
                };

            return review;
        },

        _alertDraft: function(data) {
            var r = reviewForm;
            var dataJson = JSON.decode(data);
            dataJson && new Prompt().confirm(['点评草稿箱', '你的点评尚未完成，要继续吗？<p class=\'Color7\'>(如果取消，该点评草稿将被删除)</p>'], {
                onReturn: function(select) {
                    if (select) {
                        r._setDraft(dataJson);
                    } else {
                        r._deleteDraft();
                    }
                }
            });
        },

        _deleteDraft: function() {
            new AjaxReq({
                url: '/ajax/json/review/reviewDraftAction',
                data: {
                    'run': 'dd',
                    'mode': 'pro',
                    'shopId': D.data('shopID')
                },
                method: 'post'
            }).send();
        },

        _setDraft: function(data) {
            var r = reviewForm,
                reviewBody = data.reviewBody,
                ratings = r.ratings,
                setVal = function(name, value) {
                    var el = one(name);
                    if (el) el.value = value;
                };

            var setByType = function(elem) {
                var type = elem.get("type");
                var dataTitle = elem.get("data-title");
                if (type == "text") {
                    data.extInfoList.forEach(function(info, i) {
                        if (info.title == dataTitle) {
                            if (info.values) {
                                elem.value = info.values[0];
                            }
                        }
                    });
                } else if (type == "tagList") {
                    data.extInfoList.forEach(function(info, i) {
                        if (info.title == dataTitle) {
                            if (info.values) {
                                elem.retrieve("taglist").val(info.values);
                            }
                        }
                    });
                }
            };


            if (data) {
                r.autoSaveLength = reviewBody.length;
                data.star && data.star.value > 0 && r.starRating.setRate(data.star.value);
                data.scoreList && data.scoreList.forEach(function(score, i) {
                    var rating = r.ratings[i];
                    rating.setRate(score.value);
                });

                reviewBody && setVal('body', reviewBody.cnDecode());

                if (data.expenseInfoList) {
                    data.expenseInfoList.forEach(function(info, i) {
                        r.expenses[i].set('value', info.value);
                    });
                }

                if (data.extInfoList) {
                    r.extinfo.forEach(function(ext, i) {
                        setByType(ext);
                    });
                }

                one('body').focus();
                // r._deleteDraft();
            }
        },

        _submitReturn: function(data) {
            var r = reviewForm;

            if (data && data.code && data.msg) {
                r._disableForm(false);
                switch (data.code) {
                    case 200:
                        //点评添加成功
                        r._onSuccess(data.msg, data.ugcValidateCode);
                        break;
                    case 201:
                        //检测到草稿
                        r._alertDraft(data.msg);
                        break;
                    case 202:
                    case 302:
                        //保存草稿成功/或失败
                        r._autoSaveReturn(data.msg);
                        break;
                    case 300:
                        //添加点评错误
                        r._onError(data.msg);
                        break;
                    case 403:
                        DP.authBox('', function(){
                            // 登录验证的回调
                            location.reload();
                        }, "addreview_{city}_{channel}".substitute({
                            city: D.data("cityEnName"),
                            channel: D.data("channel")
                        }));
                        break;
                    case 401:
                    case 402:
                    case 404:
                    case 500:
                        r._onHardError(data.msg);
                        break;
                }
            }
        },

        _autoSaveReturn: function(data) {
            err('asbody').set('html', (!data.r ? '点评自动保存失败' : '点评已经自动保存于 ' + data.d));
        },

        _disableForm: function(disabled, isDelete) {
            var DISABLED = 'disabled',
                set_disable = function(name) {
                    var _one = one,
                        i = 0,
                        args = arguments,
                        len = args.length,
                        el,
                        dis = disabled;

                    for (; i < len; i++) {
                        el = _one(args[i]);
                        el && el.setProperty(DISABLED, dis);
                    }
                },
                del_btn = one('del');

            disabled = disabled ? DISABLED : '';

            set_disable('s1', 's2', 's3', /* 'f1', 'f2', 'f3', 'f4',*/ 'ap', 'body', 'dtag', 'stag', 'setag', 'park', 'submit', 'del', 'ctitle');

            $$('.J_review-spec-wrap input').each(function(tag) {
                set_disable(tag)
            });


            if (disabled) {
                if (isDelete) {
                    del_btn.value = '正在删除...';
                } else {
                    one('submit').value = '正在提交...';
                }
            } else {
                if (del_btn) {
                    del_btn.value = '删除点评';
                }
                one('submit').value = '提交点评';
            }


        },

        _onHardError: function(result) {
            reviewForm._disableForm(false);
            new Prompt().alert(result || '发生未知错误，请稍候再试');
        },

        _onError: function(result) {
            var r = reviewForm,
                err = r.__errs;

            r._disableForm(false);

            if (result.s1) {
                err.s1.err(true);
            } else if (result.s2) {
                err.s2.err(true);

            } else if (result.s3) {
                err.s3.err(true);

            } else if (result.ap) {
                err.ap.err(true);

            } else if (result.body) {
                err.body.setInfo(result.body, true)
            }
        },

        _onSuccess: function(data, code) {
            var r = reviewForm,
                link = '',
                hash = '',
                L = window.location,
                refresh = function() {
                    var query = {}, qs;
                    if (L.pathname == link) {
                        query.r = Math.floor(Math.random() * 100);
                    }

                    if (code) {
                        query.ugcValidateCode = code;
                    }

                    qs = Object.keys(query).length ? ("?" + DP.toQueryString(query)) : "";

                    L.replace(link + qs + hash);
                };

            r.leaveConfirm = false;

            if (r.isShortReview) {
                link = '/shop/' + D.data('shopID') + '/review_short';
                dpga('dp_addreview_add_shortreview');
            } else if (data.add) {
                try {
                    var h = document.hippo;
                    h && h.mv(data.isupdate ? "set_rw" : "add_rw", data.reviewid)
                } catch (e) {}
                //GA
                link = '/addreview/success/shop/' + D.data('shopID');
                dpga('dp_addreview_submitreview_' + D.data('cityEnName') + '_' + D.data('channel'));
            } else {
                // 删除点评
                link = "/member/" + D.data('userID') + "/reviews";
            }

            //renren
            if (data.add && $('renrenCheck')) {
                if ($('renrenCheck').checked) {
                    var ada = {};
                    ada['do'] = 'rr';
                    new AjaxReq({
                        url: '/renren.v',
                        data: ada,
                        method: 'post',
                        async: false,
                        onSuccess: function(a) {
                            if (a.msg.r === 0 && data.access === undefined && data.access !== true) {
                                //  RenRen.showRenRenLogin();
                                r._disableForm(false);
                                var s = '/rr_login';
                                data.access = true;
                                Mbox.open({
                                    onClose: function() {
                                        r._onSuccess(data);
                                    },
                                    type: 'iframe',
                                    url: s,
                                    size: {
                                        x: 300,
                                        y: 140
                                    }
                                });
                            } else {
                                var isup = (data.isupdate) ? 1 : 0;
                                new AjaxReq({
                                    url: '/renren.v',
                                    data: {
                                        'do': 'f',
                                        'r': data.reviewid,
                                        'i': isup
                                    },
                                    method: 'post',
                                    onSuccess: function(a) {
                                        RenRen.sendXiaoneiFeed(a.msg.id, a.msg.data, a.msg.content, '', a.msg.title);
                                        setTimeout(refresh, 500);
                                    }
                                }).send();
                            }
                        }
                    }).send();

                } else {
                    setTimeout(refresh, 100);
                }
            }
            // sina
            else if (data.add && $('sinaCheck')) {
                if ($('sinaCheck').checked || $('sinaCheck').value == 'checked') {
                    var rid = data.reviewid;
                    new AjaxReq({
                        url: '/thirdpart.v',
                        data: {
                            'do': 'se',
                            'tpt': 2,
                            'ei': rid,
                            'ft': 4
                        },
                        method: 'post',
                        async: false,
                        onSuccess: function(e) {
                            setTimeout(refresh, 100);
                        }
                    }).send();
                } else {
                    setTimeout(refresh, 100);
                }
            } else {
                setTimeout(refresh, 100);
            }
        }
    };

    D.reviewForm = reviewForm;




})(DP);