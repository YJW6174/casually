/** test **/
(function(D, win) {
	var SWFUpload = D.SWFUpload,
        userId = D.data('userID') || 0,
        shopId = D.data('shopID') || 0,
    picListBox = $$('.upload-pic-box')[0].getElement('.upload-pic'),

    refreshPagingEnabled = function(){
        var fromLeft = picListBox.getElement('ul').getStyle('left').toInt();
        if (fromLeft == 0) {
            picListBox.getElement('a.prev').addClass('p-disb');
        } else {
            picListBox.getElement('a.prev').removeClass('p-disb');
        }
        if (fromLeft.abs() + 140*4 >= 140 * picListBox.getElement('ul').getChildren().length) {
            picListBox.getElement('a.next').addClass('n-disb');
        } else {
            picListBox.getElement('a.next').removeClass('n-disb');
        }
    },
    initPaging = function(){
        var fxTween = new Fx.Tween(picListBox.getElement('ul'), {
            duration: 500,
            transition: 'linear',
            link: 'cancel',
            property: 'left',
            onComplete: function(e) {
                refreshPagingEnabled();
            }
        });

        picListBox.getElement('a.next').addEvents({
            click: function(e) {
                e.preventDefault();
                if (!picListBox.getElement('a.next').hasClass('n-disb')) {
                    picListBox.getElement('a.next').addClass('n-disb');
                    picListBox.getElement('a.prev').addClass('p-disb');
                    var fromLeft = picListBox.getElement('ul').getStyle('left').toInt();
                    fxTween.start(fromLeft, fromLeft - 140*4);
                }
            }
        });

        picListBox.getElement('a.prev').addEvents({
            click: function(e) {
                e.preventDefault();
                if (!picListBox.getElement('a.prev').hasClass('p-disb')) {
                    picListBox.getElement('a.next').addClass('n-disb');
                    picListBox.getElement('a.prev').addClass('p-disb');
                    var fromLeft = picListBox.getElement('ul').getStyle('left').toInt();
                    fxTween.start(fromLeft, fromLeft + 140*4);
                }
            }
        });
    },
    initQRButton = function() {
        var qrBtn = $$('.upload-pic-box')[0].getElement('.J_qr_btn'),
            qrBox = $$('.upload-pic-box')[0].getElement('.pop-upload-qrcode'),
            parent = $$('.upload-pic-box')[0].getElement('.upload-form'),
            mobileupload_timeout,
            id_prefix = 'file_lastupload_',
            id_suffix = 0,
            getFileId = function (){
                return id_prefix + id_suffix++;
            };

        var now = -1,
            intervalFlag = -1;
        qrBtn.addEvents({
            mouseenter: function (e) {
                e.preventDefault();
                parent.setStyle('z-index', 1001);
                qrBox.hasClass('Hide') ? qrBox.removeClass('Hide') : qrBox.addClass('Hide');
                pageTracker._trackPageview('dp_addreview_add_mobileupload_{city}_{category}'.substitute({
                    city: D.data("cityEnName"),
                    category: D.data("channel")
                }));
                if (now == -1){
                    now = new Date().getTime();
                }
                var url = '/ajax/json/lasteduploadpics',
                    upload_pic = jQuery('.upload-pic'),
                    slider = jQuery('.upload-pic .slider'),
                    items = jQuery('div.upload-pic ul.s-item'),
                    picInterval = -1;
                if(intervalFlag != -1){
                    return;
                }
                intervalFlag = picInterval = win.setInterval(function () {
                        jQuery.post(url, {userId: userId, shopId: shopId, uploadTime: now, t: Math.random()}, function (result) {
                            if (result.code == 200) {
                                // 手机上传成功后是一个list,如果list为null,表示暂时没有上传,则继续轮询
                                var list = result.data.list;
                                if (!list || list.length == 0) {
                                    return;
                                }

                                upload_pic.removeClass('Hide');
                                slider.css('height','120px');
                                // 轮询成功,则不再继续轮询
                                //win.clearInterval(picInterval);
                                for (var i = 0;i < list.length;i++){
                                    // 过滤已经存在的图片:图片的md5值相同
                                    var picItem = jQuery('#' + list[i].origUrl);
                                    if (picItem.length > 0){
                                        continue;
                                    }
                                    var pic = list[i],
                                        picId = pic.picId,
                                        src = pic.url,
                                        picKey = pic.origUrl,
                                        fileId = getFileId(),
                                        title = pic.title || '点击输入标题',
                                        time = pic.uploadTime,
                                        year = time.substring(0,4),
                                        month = time.substring(5,7),
                                        day = time.substring(8,10),
                                        uploadTime ='上传于' + year + '.' + month + '.' + day,
                                        item = [
                                            '<li id=' + fileId + '>',
                                            '<input data-type="new" type="hidden" name="picId" value="' + picId + '"/>',
                                            '<input id="' + picKey + '" type="hidden" name="url" value="' + picKey + '"/>',
                                            '<div class="pic"><img width="120" height="90" title="" src="' + src + '" /></div>',
                                            '<div class="txt">',
                                            '<a class="input-tit" href="javascript:void(0);">' + title + '</a>',
                                            '<input class="ipt-tit Hide" type="text" value="" value-old="">',
                                            '</div>',
                                            '<div style="line-height: 14px;text-align: center;">',
                                            '<span style="top: 100px;color: red;">' + uploadTime + '</span>',
                                            '</div>',
                                            '<a href="javascript:void(0);" class="icon-close Hide"></a>',
                                            '</li>'
                                        ].join('');

                                    items.append(jQuery(item));

                                    initPicBox(fileId);

                                    refreshPagingEnabled();
                                }

                            }else if (result.code == 500){
                                //错误:如服务器异常等
                                //upload_pic.removeClass('Hide');
                                //var item = '<li id="uploadErrorMsg"></li>';
                                //items.html(jQuery(item));
                                //showErrorBox('uploadErrorMsg','服务器出错了!');
                                win.clearInterval(picInterval);
                            }else {
                                //
                            }

                        })
                    }, 2000);

            },
            mouseleave:function(e) {
                e.preventDefault();
                closeQrBox();
            }
        });

        qrBox.addEvents({
            mouseenter: function(e) {
                e.preventDefault();
                parent.setStyle('z-index', 1001);
                mobileupload_timeout && clearTimeout(mobileupload_timeout)
            },
            mouseleave: function(e) {
                e.preventDefault();
                closeQrBox();
            }
        });

        function closeQrBox() {
                mobileupload_timeout = setTimeout(function() {
                    qrBox.addClass('Hide');
                    parent.setStyle('z-index', 999);
                },100);
        }
    },

    handleCheckinTips = function() {
        var tipsBox = $('J_review-checkin');
        if(!tipsBox) {
            $('J_review-body').setStyle('margin-left', '0px');
            return;
        }
        //关闭提示框
        tipsBox.getElement('.close-regist').addEvent('click', function(e) {
            e.preventDefault();
            $('J_review-body').setStyle('margin-left', '0px');
            tipsBox.addClass('Hide');
            dpga('dp_addreview_add_checkin_close');
        });
        //点击复制
        tipsBox.getElements('.J_copy-checkin-content').addEvent('click', function(e) {
            e.preventDefault();
            var parent = $(this).getParent('li'),
                body = $('J_review-body'),
                copied = new Element('span').set('html', '已复制'),
                content =  '';
            if(body.get('value') == body.get('placeholder')) {
                content =  parent.getElement('.J_checkin-tips').get('html') +'\r\n';
            } else {
                content =  body.get('value') + parent.getElement('.J_checkin-tips').get('html') +'\r\n';
            }
            $(this).destroy();
            copied.inject(parent);
            parent.addClass('copy-exp');
            body.set('value', content);
            body.focus();
            D.reviewForm.check();
            dpga('dp_addreview_add_checkin_show_copy');
        });
        var moreTips = tipsBox.getElements('.J_checkin-more')[0];
        if(!moreTips) {
            return;
        }
        var expand = tipsBox.getElement('.J_checkin-open'),
            fold = tipsBox.getElement('.J_checkin-close');
        //点击更多
        expand && expand.addEvent('click', function(e) {
            e.preventDefault();
            moreTips.removeClass('Hide');
            expand.addClass('Hide');
            fold.removeClass('Hide');
            dpga('dp_addreview_add_checkin_show_more');
        });
        //点击收起
        fold && fold.addEvent('click', function(e) {
            e.preventDefault();
            moreTips.addClass('Hide');
            expand.removeClass('Hide');
            fold.addClass('Hide');
        });
    },

    // 监控对象
    flashMonitor = {
        type : 1,
        flashLoadTime : 0,
        flashLoaded : 0,
        flashVersion : "-1",
        fileSize : 0,
        status : 0,
        requestTime : 0
    },
    initPicBox = function (boxId){
        var picBox;
        if (typeof boxId == "object") {
            picBox = boxId;
        } else {
            picBox = picListBox.getElementById(boxId);
        }
        var closeBtn = picBox.getElement('.icon-close');

        closeBtn.addEvents({
            click: function(e){
                e.preventDefault();
                var picId = picBox.getElement('input[name=picId]').get('value');
                picBox.destroy();
                refreshPagingEnabled();
                if (!picListBox.getElement('li')){
                    picListBox.addClass('Hide');
                }
                new AjaxReq({
                    url: "/ajax/json/shoppic/picture/delete",
                    method: "post",
                    data: {
                        picIds:picId,
                        from:location.href,
                        cause:"用户自删"
                    }
                }).send();
            }
        });
        picBox.addEvents({
            mouseenter: function(e){
                closeBtn.removeClass('Hide');
            },
            mouseleave: function(e){
                closeBtn.addClass('Hide');
            }
        });

        picBox.getElement('.input-tit').addEvents({
            click : function(el) {
                el.preventDefault();
                var target = el.target,
                    inputText = target.getParent('.txt').getElement('.ipt-tit');
                target.addClass('Hide');
                inputText.removeClass('Hide');
                inputText.focus();
                inputText.select();
            }
        });

        function saveTitle(e) {
            e.preventDefault();
            var target = e.target;
            var picId = target.getParent('li').getElement('input[name=picId]').get('value');
            var picTitle = target.get('value') || "";
            var oldTitle = target.get('value-old') || "";
            if (picTitle != "" && picTitle != oldTitle) {
                new AjaxReq({
                    url : "/ajax/json/piccenterweb/title",
                    method : "post" ,
                    data : {"picId" : picId,"title" : picTitle}
                }).send();
                target.set('value-old', picTitle);
                target.getParent('.txt').getElement('.input-tit').set('text',picTitle);
            }
            target.addClass('Hide');
            target.getParent('.txt').getElement('.input-tit').removeClass('Hide');
        };

        picBox.getElement('.ipt-tit').addEvents({
            keyup: function(e) {
                if (e.key == 'enter') {
                    saveTitle(e);
                }
            },
            blur: saveTitle
        });
    },
    showErrorBox = function(boxId, msg){
        var errorBox = picListBox.getElementById(boxId),
            errorBoxHtml = '<div class="pic">'
                + '<div class="err">'
                + '<p><i class="icon-close"></i>上传失败！</p>'
                + '<p>{errorMsg}</p>'
                + '</div>'
                + '</div>'
                + '<a href="javascript:;" class="icon-close J_close_btn Hide"></a>';
        errorBox.set("html", errorBoxHtml.substitute({errorMsg: msg}));

        var closeBtn = errorBox.getElement('.J_close_btn');

        errorBox.addEvents({
            mouseenter: function(e){
                closeBtn.removeClass('Hide');
            },
            mouseleave: function(e){
                closeBtn.addClass('Hide');
            },
            click: function(e){
                e.preventDefault();
                if (e.target.hasClass('J_close_btn')){
                    errorBox.destroy();
                    refreshPagingEnabled();
                    if (!picListBox.getElement('li')){
                        picListBox.addClass('Hide');
                    }
                }
            }
        });
    },
    getFlashVersion = function() {
        if (!swfobject) {
            return "-1";
        }
        var flashVersionObj = swfobject.getFlashPlayerVersion();
        if (flashVersionObj) {
            return flashVersionObj.major + "." + flashVersionObj.minor + "." + flashVersionObj.release;
        }
        return "-1";

    },
	_Handlers = {
        flashLoaded: function () {
            // 监控代码
            flashMonitor.flashLoadTime = (+new Date() - flashMonitor.flashStartLoadTime);
            flashMonitor.flashVersion = getFlashVersion();
            flashMonitor.flashLoaded = 1;
        },
        dialogStart: function () {
            pageTracker._trackPageview('dp_addreview_add_upload_{city}_{category}'.substitute({
                city: D.data("cityEnName"),
                category: D.data("channel")
            }));
        },
        dialogComplete: function (numOfSelected, numOfQueued, numOfTotalInQueued) {
            if (numOfSelected > 0){
                picListBox.removeClass("Hide");
            }
            this.startUpload();
        },
        fileQueued: function (file) {
            var picBoxHtml = '<li id="{boxId}">'
                + '<div class="pic">'
                + '<div class="err" style="color:green;">'
                + '<p>等待上传...</p>'
                + '</div>'
                + '</div>'
                + '<div class="txt"><span class="progre"><span class="progre-cur" style="width:0%"></span><em>0%</em></span></div>'
                + '</li>',
            picBox = new Element("div").set("html", picBoxHtml.substitute({boxId:file.id})).getChildren()[0];
            picListBox.getElement('ul').grab(picBox);
            refreshPagingEnabled();
        },
        fileQueuedErr: function (file, err, message) {
            var box = new Element("div").set("html", '<li id="{boxId}"></li>'.substitute({boxId:file.id})).getChildren()[0];
            picListBox.getElement('ul').grab(box);
            refreshPagingEnabled();
            if (err == -110) {
                showErrorBox(file.id, '图片不能超过10M');
            } else if (err == -130) {
                showErrorBox(file.id, '文件格式不支持');
            } else if (err < 0) {
                showErrorBox(file.id, '上传失败，未知错误');
            }
        },
        uploadStart: function (file) {
            // 监控代码
            flashMonitor.startRequestTime = (+new Date());
        },
        uploadProgress: function (file, bytes, total) {
            // 监控代码
            flashMonitor.fileSize = total;
            if (bytes > 0) {
                var picBoxHtml = '<div class="txt">'
                    + '<span class="progre"><span class="progre-cur" style="width:{progress}%"></span><em>{progress}%</em></span>'
                    + '</div>'
                var picBox = picListBox.getElementById(file.id);
                picBox.set("html", picBoxHtml.substitute({progress:(100*bytes/total).toInt()}));
            }
        },
        showProcess: function (bytes, total) {
        },
        hideProcess: function () {
        },
        uploadSuccess: function (file, data, received) {
            var picSaveUrl = '/ajax/json/shoppic/album/updateInfo',
                data = JSON.parse(data),
                picBoxHtml = '<input type="hidden" name="picId" value="{picId}">'
                    + '<input type="hidden" name="url" value="{picOrigUrl}">'
                    + '<div class="pic"><img width="120" height="90" title="" src="{picUrl}" /></div>'
                    + '<div class="txt">'
                    + '<a class="input-tit" href="javascript:;">点击输入标题</a>'
                    + '<input class="ipt-tit Hide" type="text" value="" value-old="">'
                    + '</div>'
                    + '<a href="javascript:;" class="icon-close Hide"></a>',
                picBox = picListBox.getElementById(file.id);
            new AjaxReq({
                "url": picSaveUrl,
                "method": "post",
                "data": {
                    shopId: D.data("shopID"),
                    picIds: data.picID || 0
                },
                "onSuccess": function (res){
                    if(res.code == 200) {
                        var picData = res.msg[data.picID];
                        picBox.set("html", picBoxHtml.substitute({picId:picData.picId, picUrl:picData.url, picOrigUrl: data.url}));
                        initPicBox(file.id);
                    }else {
                        showErrorBox(file.id, "服务器端错误");
                    }
                },
                "onError": function (res){
                    showErrorBox(file.id, "服务器端错误");
                }
            }).send();

            // 监控代码
            flashMonitor.status = data.code;
            flashMonitor.requestTime = (+new Date()) - flashMonitor.startRequestTime;
        },
        uploadComplete: function (file) {
            this.startUpload();

        },
        uploadErr: function (file, error, message) {
            showErrorBox(file.id, "服务器端错误");

            // 监控代码
            flashMonitor.status = 500;
        }
    },

	swfuploadOptions = {

        file_size_limit: '10 MB',
        file_post_name: "dpfile",
        file_types: '*.jpg;*.gif;*.png;*.bmp',
        file_types_description: 'Image files',
        file_upload_limit: 100,
        file_queue_limit: 0,

        debug: false,

        assume_success_timeout: 0,

        button_style: 0, // button_style value is according to the flash button background sprite
        button_text: '',
        button_cursor: SWFUpload.CURSOR.HAND,
        button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,

        swfupload_loaded_handler: _Handlers.flashLoaded,
        file_dialog_start_handler: _Handlers.dialogStart,
        file_dialog_complete_handler: _Handlers.dialogComplete,
        file_queued_handler: _Handlers.fileQueued,
        file_queue_error_handler: _Handlers.fileQueuedErr,

        upload_start_handler: _Handlers.uploadStart,
        upload_progress_handler: _Handlers.uploadProgress,
        upload_error_handler: _Handlers.uploadErr,
        upload_success_handler: _Handlers.uploadSuccess,
        upload_complete_handler: _Handlers.uploadComplete
	},

    // webuploader配置项
    webUploadOptions = {
        file_size_limit: '10 MB',
        file_post_name: "dpfile",
        file_types: '*.jpg;*.gif;*.png;*.bmp',
        file_types_description: 'Image files',
        file_upload_limit: 100,
        file_queue_limit: 0,

        debug: false,

        assume_success_timeout: 0,

        button_style: 0, // button_style value is according to the flash button background sprite
        button_text: '',

        file_queued_handler: _Handlers.fileQueued,

        upload_start_handler: _Handlers.uploadStart,
        upload_error_handler: _Handlers.uploadErr,
        upload_success_handler: _Handlers.uploadSuccess,
        upload_complete_handler: _Handlers.uploadComplete
    },

    // minimun flash player version
    MIN_FLASH_VERSION = 9,

    checkFlash = function () {
        return window.swfobject && swfobject.getFlashPlayerVersion().major >= MIN_FLASH_VERSION;
    };

	var reviewFormNew = {
		initSwfUpload: function(swfCustomOptions) {
            initPaging();
            if (checkFlash()) {
                // 监控代码
                flashMonitor.flashStartLoadTime = (+new Date());
                new SWFUpload(D.mix(swfuploadOptions, swfCustomOptions));
            }
		},
        initWebUpload: function(webUploadCustomOptions){
            initPaging();
            // 监控代码
            flashMonitor.flashStartLoadTime = (+new Date());
            var options = D.mix(webUploadOptions, webUploadCustomOptions)
            D.WebUpload.init(options)
        },
        initQr: function() {
            initQRButton();
        },
        initCheckinTips: function() {
            handleCheckinTips();
        },
        initAllPicBox: function() {
            $$(".upload-pic li").each(function(item, index){
                initPicBox(item);
            });
            refreshPagingEnabled();
        }
	};

	D.reviewFormNew = reviewFormNew;
})(DP,window);