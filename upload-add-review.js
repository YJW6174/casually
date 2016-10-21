(function (D) {

    var monitorParams = {};

    monitorParams.queue = [];

    function toQuery(obj) {
        var e = encodeURIComponent;
        var query = [];
        for (var key in obj) {
            if (obj[key]) {
                query.push(key + "=" + e(obj[key]));
            }
        }
        return query.join("&");
    };

    // 监控
    function perfMonitor(ec) {
        var now = new Date();
        var url = "http://114.80.165.63/broker-service/api/single?" + toQuery({
                v: 1,
                tu: "pic-upload-qcloud",
                ts: +monitorParams.sendTime,
                d: now - monitorParams.sendTime,
                hs: ec,
                ec: ec
            });
        var img = new Image();
        monitorParams.queue.push(img);
        img.onerror = function () {
            var index = monitorParams.queue.indexOf(img);
            monitorParams.queue.splice(index, 1);
        };//防止img对象提前被回收
        img.src = url;
    };//通过img发送一个请求

    function init(options) {

        var swf_url = options.swf_url,
            buttonID = options.button_placeholder_id,
            sign = options.sign,
            buttonWidth = options.button_width,
            buttonHeight = options.button_height,
            url = options.upload_url,
            buttonText = options.button_text && options.button_text.length > 0 ? options.button_text : '电脑传图',
            post_params = options.post_params,
            $ = jQuery,
            shopID = DP.data('shopID'),
            sourcePicIds = [];// 已经有的picId
        $("input[name='picId']").each(function () {
            var pidId = $(this).val();
            if (pidId && typeof pidId !== 'undefined') {
                sourcePicIds.push(pidId);
            }
        });

        // 浏览器支持传图组件 替换传图按钮
        if (WebUploader.Uploader.support()) {
            var cNode = $('#' + buttonID);

            //
            var nNode = $("<div></div>", {"id": buttonID});
            cNode.replaceWith(nNode);
        }


        // 实例化图片上传组价
        var uploader = WebUploader.create({

            fileVal: 'FileContent',

            pick: {
                id: '#' + buttonID,
                label: buttonText
            },
            // 暂不支持dnd
            //dnd: '#uploader .queueList',
            // 暂不支持复制粘贴
            //paste: document.body,

            accept: {
                title: 'Images',
                extensions: 'gif,jpg,jpeg,bmp,png',
                mimeTypes: 'image/*'
            },

            compress: false, // 是否缩放后上传

            // swf文件路径
            swf: swf_url,

            disableGlobalDnd: true,

            // 选择文件后自动开始上传
            auto: true,

            // 是否去重
            duplicate: true,

            runtimeOrder: 'html5,flash',

            // 暂不支持文件分片
            chunked: false,

            sign: sign,

            url: url,

            server: '',

            fileNumLimit: 300,
            fileSizeLimit: 200 * 1024 * 1024,        // 200 M
            fileSingleSizeLimit: 10 * 1024 * 1024    // 10 M
        });


        uploader.onFileQueued = function (file) {
            disableSubmit();

            $('div.upload-pic-box div.upload-pic').removeClass('Hide')
            // 上传中 事件
            //addFile(file);
            var picBoxHtml = [
                '<li id="' + file.id + '">',
                '<input type="hidden" data-id="0">',
                '<div class="pic">',
                '<div class="err" style="color:green;">',
                '<p>等待上传...</p>',
                '</div>',
                '</div>',
                '<div class="txt"><span class="progre"><span class="progre-cur" style="width:0%"></span><em>0%</em></span></div>',
                '</li>'
            ].join('');

            $('div.upload-pic ul.s-item').append($(picBoxHtml));

            refreshPaginate();
        };

        uploader.onUploadStart = function (file) {
            monitorParams.sendTime = new Date();
        };

        uploader.onUploadBeforeSend = function (object, data, headers) {
            //
        };

        uploader.onUploadSuccess = function (file, response) {

            var fileFlag = $('#' + file.md5);
            if (fileFlag.length > 0) {
                enableSubmit();

                return;
            }
            // 上传成功后修改成功后的图标
            addFile(file);
            // 上传成功
            if (response.code == 0) {
                var infos = response.data.info;
                if (infos.length > 0) {
                    var info = infos[0];
                    var height = info[0].height;
                    var width = info[0].width;
                    buildPicRelation(file, width, height);
                }
            } else {
                buildPicRelation(file, 0, 0);
            }

            perfMonitor(200)
        };

        uploader.onUploadError = function (file, reason) {
            var fileFlag = $('#' + file.md5);
            if (fileFlag.length > 0) {
                // 删除已经添加的图片
                $('#' + file.id).remove();
                enableSubmit();
                try {
                    //医美传重复图片要求弹提示
                    if(!!DP.data('medical') && DP.data('medical') == 1){
                        new Prompt().alert('已有重复图片');
                    }
                }catch(e){
                    console.log(e);
                }

                return;
            }
            // 上传失败
            if (reason.code == -1886) {
                addFile(file);
                buildPicRelation(file, 0, 0);
            } else {
                showErrorBox(file.id, '服务器错误!')
            }

            if (reason.code) {
                perfMonitor(reason.code)
            }

        };

        function disableSubmit() {
            var submit = $('#J_review-submit');
            submit.css('background-color', '#F3F3F3');
            submit.attr('disabled', "true");
        }

        function enableSubmit() {
            var dataFlag = $('div.upload-pic-box div.upload-pic input[data-id="0"]');
            if (dataFlag.length > 0) {
                return;
            }
            var submit = $('#J_review-submit');
            submit.css('background-color', '#ff8f1f');
            submit.removeAttr("disabled");
        }

        function addFile(file) {

            var src = file.url || '', picId = file.picId, md5 = file.md5;
            var box = [
                '<input type="hidden" data-id="0">',
                '<input data-type="new" type="hidden" name="picId" value="' + picId + '"/>',
                '<input id="' + md5 + '" type="hidden" name="url" value="' + md5 + '"/>',
                '<div class="pic"><img width="120" height="90" title="" src="' + src + '" /></div>',
                '<div class="txt">',
                '<a class="input-tit" href="javascript:void(0);">点击输入标题</a>',
                '<input class="ipt-tit Hide" type="text" value="" value-old="">',
                '</div>',
                '<a href="javascript:void(0);" class="icon-close Hide"></a>'
            ].join('');
            var picBoxHtml = $(box);

            $('#' + file.id).html(picBoxHtml);
            //$('div.upload-pic ul.s-item').append(picBoxHtml);
            // 点击输入标题按钮
            $('.input-tit').on({
                click: function (e) {
                    var target = e.tatget;
                    $(target).addClass('Hide')
                    var input = $(this).next();
                    input.removeClass('Hide');
                    input.focus();
                    input.select();
                }
            });
            $('.ipt-tit').on({
                keyup: function (e) {
                    if (e.key == 'enter') {
                        saveTitle(e);
                    }
                },
                change: function (e) {
                    saveTitle(e)
                }
            });
        }

        function buildPicRelation(file, width, height) {
            $.ajax({
                url: '/ajax/json/piccenterweb/buildPicRelation',
                data: {
                    url: file.md5,
                    width: width,
                    height: height,
                    shopId: shopID
                },
                success: function (res) {
                    if (res.code == 200) {
                        var data = res.data
                        var picId = data.picId;
                        
                        uploadSuccess(file, data.url, picId)
                    } else {
                        showErrorBox(file.id, "服务器错误!")
                    }
                },
                error: function (res) {
                    showErrorBox(file.id, "服务器错误!")
                }
            });
        }

        function uploadSuccess(file, src, picId) {

            var picBox = $('#' + file.id);
            picBox.find('img').attr('src', src);
            picBox.find('input[name="picId"]').val(picId);
            picBox.find('input[name="url"]').val(file.md5);
            picBox.find('input[data-id="0"]').attr('data-id', 1);

            triggerHide(file.id, '.icon-close');

            enableSubmit();

        }

        function showErrorBox(fileId, msg) {

            var error = [
                '<input type="hidden" data-id="1">',
                '<div class="pic">',
                '<div class="err">',
                '<p><i class="icon-close"></i>上传失败！</p>',
                '<p>' + msg + '</p>',
                '</div>',
                '</div>',
                '<a href="javascript:void(0);" class="icon-close J_close_btn Hide"></a>'
            ].join('')
            $('#' + fileId).html($(error));

            triggerHide(fileId, '.J_close_btn');
            enableSubmit();


        }

        function triggerHide(fileId, closeClass) {
            // 图片右上角 关闭按钮
            $('#' + fileId).on({
                    mouseenter: function () {
                        $(this).find(closeClass).removeClass('Hide')
                    },
                    mouseleave: function () {
                        $(this).find(closeClass).addClass('Hide')
                    }
                }
            )

            // 关闭按钮的点击事件
            $(closeClass).on({
                click: function (e) {
                    var pLi = $(this).parents('li[id="' + fileId + '"]');
                    var picId = pLi.find('input[name="picId"]').val();
                    pLi.remove();
                    refreshPaginate();
                    var items = $('ul.s-item li')
                    if (!items || items.length == 0) {
                        $('div.upload-pic-box div.upload-pic').addClass('Hide')
                    }
                    // 删除图片，腾讯云未提供接口，暂时不能物理删除
                    $.post('/ajax/json/shoppic/picture/delete', {picIds: picId,from:location.href,cause:"用户自删"})
                }
            })
        }

        function saveTitle(e) {
            var target = e.target;
            var title = $(target).val() || '';
            var oldTitle = $(target).attr('value-old');
            var picId = $(target).parents('li').children('input[name="picId"]').val();
            var picMd5 = $(target).parents('li').children('input[name="url"]').val();
            var url = '/ajax/json/piccenterweb/title'

            if (title != '' && title != oldTitle) {
                $.post(url, {title: title, picId: picId}, function (res) {
                    //console.log("savetitle", res)
                })
            }

            $(target).addClass('Hide').attr('value-old', title);
            $(target).prev().removeClass('Hide').text(title);
        };


        // 左右滑动按钮
        function refreshPaginate() {
            var picContainer = $('.upload-pic');

            var left = picContainer.find('ul').css('left');

            var fromLeft = left.substring(0, left.length - 2);
            fromLeft = parseInt(fromLeft);

            if (fromLeft == 0) {
                picContainer.find('a.prev').addClass('p-disb');
            } else {
                picContainer.find('a.prev').removeClass('p-disb');
            }
            if (fromLeft.abs() + 140 * 4 >= 140 * picContainer.find('ul').children().length) {
                picContainer.find('a.next').addClass('n-disb');
            } else {
                picContainer.find('a.next').removeClass('n-disb');
            }
        }


        // 删除pic
        function delOnePic(ids,from,cause, callback) {
            var url = "/ajax/json/shoppic/picture/delete";
            if (ids.length > 0) {
                $.ajax({
                    url: url,
                    data: {picIds: ids,from:from,cause:cause},
                    async: false,
                    type: 'post',
                    success: function (res) {
                        if (res.code == 200) {
                            if (callback) {
                                callback();
                            }
                        }
                    },
                    error: function () {
                    }
                })
            }
        }

        //var baseHref = 'shop/' + shopID + '/review';
        var baseHref = '/review';
        if (location.href.indexOf(baseHref) > 0) {
            var root = window;
            var r = D.reviewForm;
            r.leaveConfirm = true;
            root.onbeforeunload = function (e) {
                e = e || root.event;
                if (r.leaveConfirm) {
                    if (D.data('needAutoSaved')) {
                        return "您的草稿已保存……";
                    } else {
                        return "您的修改尚未提交……";
                    }
                }
            }
            // 点击刷新,关闭 按钮触发的事件在这里
            root.onunload = function () {
                if (r.leaveConfirm) {
                    var picIds = [];
                    // 需求:只删除新添加的图片,进页面时load的图片不删除
                    $("input[data-type='new']").each(function () {
                        var picId = $(this).val();
                        // id存在，并且sourceId中不存在
                        if (picId && typeof picId !== 'undefined' && sourcePicIds.indexOf(picId) == -1) {
                            picIds.push(picId);
                        }
                    });
                    if (picIds.length > 0) {
                        delOnePic(picIds.join(","),location.href,"用户关闭或刷新页面")
                    }
                }
            }
        }


    }

    var _WebUpload = {
        init: init
    }

    D.WebUpload = _WebUpload
})(DP);