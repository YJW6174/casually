/*
. 匹配除了换行符以外的任意单个字符 要匹配"." 使用"\."
[] 字符集合[0-9],[^0-9] ^的效果作用于给定字符集合里的所有字符或字符区间,而不是仅限于紧跟在^后面的字符
    在字符集合中,像 '.' '+' 这样的元字符,可以不需要转义
匹配空格
\f 换页符
\n 换行符
\r 回车符 return windows 系统\r\n
\t 制表符
\v 垂直制表符

匹配数字
\d 任何一个数字字符
\D 任何一个非数字字符

匹配数字,字母,下划线
\w 数字.字母,下划线
\W 非数字,字母,下划线

匹配空白字符
\s 任何一个空白字符
\S 任何一个非空白字符

匹配16进制或者8进制
\x0A 16进制用前缀\x 表示
\011 8进制用前缀\0 表示

量词
+,匹配一个或多个{1,}
*,匹配0个或多个{0,}
?,匹配0个或1个{0,1}

懒惰型元字符
*?
+?
{n,}?

位置匹配
\b 单词边界
\B 非单词边界
^ 字符串边界开头
$ 字符串边界结尾
(?m) 分行匹配模式,很多不支持

子表达式
()
| 或

/1

前后查找
?=
?<=
PS:

 "\" 元字符,表示这个字符有特殊含义,不是它本身
 "." 元字符
 "[,]" 元字符,表示这个字符有特殊含义,不是它本身,需要用\[ 来匹配它

 .*? 懒惰型匹配任意字符的任意个数


 QUESTION:
 /[0-100]/g 匹配的是啥
 */




var re = /\d+/g;
var str = 'cde       1243Aa er56 fg';
var re2 = /\S+/g;
console.log(str.match(re)); // [ '12', '23' ]
console.log(str.match(re2)); // [ 'cde', 'ddd', '12de', 'cd23df', 'fg' ]
console.log(str);
//string.match 返回满足匹配的数组;

var re = /\d/;
var str = 'cdeAa er56    fg';
console.log(str.search(re))
    //返回str中匹配的位置,如果没有是-1
    //QUESTION:STRING 有 match  方法,数组有吗?

var re = /^\w+@[a-z0-9]+\.[a-z]+$/i;
//邮箱校验
var re = /\s+/g;
console.log(str.replace(re, '')); //去空格
console.log(str);

//匹配24小时制时间
function validateTime(time) {
    console.log(time)
    var reg = /^((0?|1)([0-9])|(2[0-3])):(([0-5])([0-9]))$/g;
    res = reg.test(time); //regex here.test(time)
    return res
}