/**
 * @author brucewar(wangjinlong)
 * @date 2016-02-02
 */
define(function(require, exports, module){
    var imagePreview = (function(){
        var instance;
        function getInstance(opt){
            opt = opt || {};
            if(!instance){
                instance = new ImagePreview(opt.src);
            }
            return instance;
        }
        function ImagePreview(src){
            this.src = src || '';
            this.$container = {};
            this.imgCSS = {};
            this.imgCSS90 = {};
            this.rotate = 0;
        }
        ImagePreview.prototype.render = function(){
            var self = this;
            var tmpl = [
                '<div class="image-preview" style="display:none;position: fixed;top: 0;left: 0;right: 0;bottom: 0;background-color: rgba(0,0,0,.9);z-index: 9999;text-align: center">' +
                '<div class="image-container" style="overflow-y:scroll;overflow-x: hidden;width: 700px;height: 700px;margin: auto;background-color: #fff;position: relative;top: 100px;">' +
                '<img style="margin: auto;width: 700px; height: auto" src="' + this.src + '">' +
                '<div style="position: fixed;width: inherit;background-color: rgba(0,0,0,.5);top: 770px;height: 30px;line-height: 30px;font-size: 20px;color: #fff;text-align: center;">' +
                '<span class="glyphicon glyphicon-repeat" style="cursor: pointer"></span>' +
                '<span class="glyphicon glyphicon-remove-circle" style="margin-left: 50px;width: 20px;height: 20px;color: #fff;font-size: 20px;line-height: 20px;cursor: pointer;"></span>' +
                '</div>' +
                '</div>' +
                '</div>'
            ];
            this.$container = $(tmpl.join(''));
            $('body').append(this.$container);
            this._refreshImgCSS(function(){
                self.$container.find('img').css(self.imgCSS);
            });
            this._bindEvent();
            return this.$container;
        };
        ImagePreview.prototype._bindEvent = function(){
            var self = this;
            $(document).delegate('.image-preview .glyphicon-repeat', 'click', function(e){
                self.rotate++;
                self.$container.find('img').css({
                    'transform': 'rotateZ(' + (self.rotate % 4) * 90 + 'deg)'
                }).css((self.rotate % 4) % 2 == 1 ? self.imgCSS90 : self.imgCSS);
            });
            $(document).delegate('.image-preview', 'click', function(e){
                if($(e.target).parents('.image-container').size() && !$(e.target).hasClass('glyphicon-remove-circle')){
                    return false;
                }
                self.hide();
            });
        };
        ImagePreview.prototype.setSrc = function(src){
            var self = this;
            this.src = src;
            this.rotate = 0;
            this._refreshImgCSS(function(){
                self.$container.find('img').attr('src', self.src).css({
                    'transform': 'rotateZ(0)'
                }).css(self.imgCSS);
            });
            return this.$container;
        };
        ImagePreview.prototype.getSrc = function(){
            return this.src;
        };
        ImagePreview.prototype._refreshImgCSS = function(cb){
            var imgTemp = new Image();
            var self = this;
            imgTemp.src = this.src;
            imgTemp.onload = function(){
                if(imgTemp.height < imgTemp.width){
                    // 图片高度小于宽度
                    var marginTemp = (700 - 700 * imgTemp.height / imgTemp.width) / 2;
                    self.imgCSS = {
                        'width': '700px',
                        'height': 'auto',
                        'margin-top': marginTemp + 'px'
                    };
                    this.imgCSS90 = {
                        'width': 'auto',
                        'height': '700px',
                        'margin-top': marginTemp + 'px'
                    };
                }else{
                    self.imgCSS = {
                        'width': '700px',
                        'height': 'auto',
                        'margin-top': 'auto'
                    };
                    self.imgCSS90 = {
                        'width': 'auto',
                        'height': '700px'
                    };
                }
                cb && cb();
            };
        };
        ImagePreview.prototype.hide = function(){
            this.$container.hide();
            return this.$container;
        };
        ImagePreview.prototype.show = function(){
            this.$container.show();
            return this.$container;
        };

        return {
            getInstance: getInstance
        };
    })();
    module.exports = imagePreview;
});