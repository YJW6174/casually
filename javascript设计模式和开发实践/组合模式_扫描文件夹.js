/**
 * Created: yuanjunwen
 * on 9/28/16.
 */

/****** Folder **********/
var Folder = function (name) {
    "use strict";
    this.name = name;
    this.files = [];
};

Folder.prototype.add = function (file) {
    "use strict";
    this.files.push(file);

};

Folder.prototype.scan = function () {
    "use strict";
    console.log('开始扫描文件夹:' + this.name);
    for (var i = 0, file, files = this.files; file = files[i++];) {
        file.scan();
    }
};

/********* File ***********/
var File = function(name){
    "use strict";
    this.name = name;
};

File.prototype.add = function(){
    "use strict";
    throw new Error('文件下不能添加文件夹');
};

File.prototype.scan = function(){
    "use strict";
    console.log('开始扫描文件:' + this.name);
};

/*** 创建文件对象和文件夹对象,让他们组成树结构 ******/

var folder = new Folder('学习资料0');
var folder1 = new Folder('javascript-1');
var folder2 = new Folder('jquery-2');

var file1 = new File('javascript 设计模式与开发实践');
var file2 = new File('精通JQUERY');
var file3 = new File('重构与模式');

folder1.add(file1);
folder2.add(file2);

folder.add(folder1);
folder.add(folder2);
folder.add(file3);

/***** 继续添加文件和文件夹 ****/
var folder3 = new Folder('Nodejs-3');
var file4 = new File('深入浅出nodejs');
folder3.add(file4);

var file5 = new File('javascript语言精粹');

folder.add(folder3);
folder.add(file5);


folder.scan();
