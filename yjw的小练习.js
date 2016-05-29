		//1.去空格
		var reg = /\s+/g;
		var strRemoveSpace = "afda afdfa fafe faf";
		var strRemoveSpaceResult = strRemoveSpace.replace(reg, ";");
		console.log(Array.isArray(strRemoveSpaceResult.split(";"))); //Array.isArray()只支持 ie9+
		console.log() //typeof strRemoveSpaceResult);
			//2.添加数组的值；
		var color = ['red', 'blue', 'yellow'];
		color[color.length] = 'green';
		console.log(color);
		//3.数组排序；
		//1.简单排序
		var values = [1, 9, 3, 14, 56, 13, 7];
		console.log(values.sort()); //返回[1, 13, 14, 3, 56, 7, 9]；通过字符串比较
		//2.通过数值比较
		function compareByNum(value1, value2) {
			if (value1 < value2) {
				return -1;
			} else {
				return 1;
			}
		}
		console.log(values.sort(compareByNum));
		//3.排序 对象
		function createComparisonFunction(name) {
			return function (obj1, obj2) {
				var value1 = obj1[name];
				var value2 = obj2[name];
				if (value1 < value2) {
					return -1;
				} else {
					return 1;
				}
			}
		}
		var data = [{
			name: "zhang",
			age: 12
		}, {
			name: "alice",
			age: 21
		}, {
			name: "blue",
			age: 16
		}];
		console.log(data.sort(createComparisonFunction("name")));
		console.log(data.sort(createComparisonFunction("age")));
		//4.判断回文字符串
		str1 = "123454321";
		str2 = "afaabafa";

		function isHuiwen(str) {
			var strlen = str.length;
			var middle = Math.floor(strlen / 2);
			for (var i = 0; i < middle; i++) {
				if (str.charAt(i) == str.charAt(strlen - 1 - i)) {
					console.log(str.charAt(i) + ";" + str.charAt(strlen - 1 - i));
				} else {
					return false
				}
			}
			return true;
		}
		console.log(isHuiwen(str1));
		console.log(isHuiwen(str2));
		//5.正则练习
		var str = "abc,afa,frg,bbc.faf,cbc";
		var reg = /[abc]bc/g;
		console.log(str.replace(reg, "word ($1) "));
		//6.一定范围内的随机数  Math.Random  大于等于0 小于1；
		function selectFrom(low, up) {
			var choice = up - low + 1;
			return Math.floor(Math.random() * choice + low);
			//low+Math.random()*(up-low+1);
		}
		//7.递归
		function factorial(num) {
			if (num <= 1) {
				return 1;
			} else {
				return num * arguments.callee(num - 1);
			}
		}
		console.log(factorial(5));
		//严格模式下的递归
		var factorial = (function f(num) {
			if (num <= 1) {
				return 1;
			} else {
				return num * f(num - 1);
			}
		})

		//8.闭包
		function createFunction() {
			var arr = new Array();
			for (var i = 0; i < 10; i++) {
				arr[i] = function () {
					return i;
				};

				//				arr[i]=function (num){
				//					return function(){
				//						return num
				//					}
				//				}(i)

			}

			return arr;

		}
		console.log(createFunction());
		//9.模仿块级作用域
		(function () {})()
		//10.访问器属性
		var book = {
			_year: 2004,//_year 下划线 表示只能通过对象方法访问的属性
			edition: 1
		};
		Object.defineProperty(book, "year", {
					get: function () {
						return this._year;
					},
					set: function (newValue) {
						this._year = newValue;
						this.edition += newValue - 2004;
					}
		});
		book.year=2005;
		console.log("book:"+book.edition);
		//window.top
		//查询字符串参数
		function getQueryStringArgs(){
			var qs=(location.search.length > 0)? location.search.substring(1):"",
			 args={},
			 items=qs.length>0?qs.split("&"):[];
			 item=null;
			 name=null;
			 value=null;
			 for (var i=0;i<items.length;i++){
			 	item=items[i].split("=");
			 	name=decodeURIComponent(item[0]);
			 	value=decodeURIComponent(item[1]);
			 	if (name.length) {
			 		args[name]=value;
			 	}

			 }
			 return args;

		}
