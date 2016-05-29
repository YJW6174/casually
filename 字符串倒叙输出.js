		var str = "are you kidding?";

		function daoxushuchu(str) {
			var temp = "";
			//alert(str.length);
			for (var i = 0; i < str.length; i++) {
				temp += str[str.length - i - 1];

			}
			return temp;
		}

		result = daoxushuchu(str);
	//	console.log(result);
		
		//字符串操作
		var str="123hello world!123";
		 str=str.substring(1,str.length-1);
		
		console.log(str)
        function rever(s){
            var len = s.len;
            var temp = [];
            var vowelArr = ['a','e','i','o','u'];
            for (var i = 0; i < len; i++) {
                if(vowelArr.indexOf(s[i]) != -1){
                    temp.unshift(s[i]);
                    s[i] = '#';
                }
            }
            console.log(temp);
        }
	
