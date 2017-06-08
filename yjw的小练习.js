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
		});

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
		(function () {})();
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

            function getStyle(obj,name){
        if (obj.currentStyle) {
            return obj.currentStyle[name];
        }
        else
        {
            return getComputedStyle(obj,false)[name];
        }
    }
//json
//startMove(oDiv,{height:400,width:400})    
function startMove(obj,json,fnEnd){
        clearInterval(obj.timer);
        obj.timer=setInterval(function(){
            var bStop=true;
            //-----------------取出当前的值
            for (var attr in json)
            {
            var cur=0;
            if (attr=='opacity') {
                cur=Math.round(parseFloat(getStyle(obj,attr)*100));
            }
            else{
                cur=parseInt(getStyle(obj,attr));
            }

            //------------------速度
            var speed=(json[attr]-cur)/6;
            speed=speed>0?Math.ceil(speed):Math.floor(speed);

            if (cur!=json[attr]) {
                bStop==false;
            };

            //判断是否达到目标值
                        if (cur==json[attr]) {
                            clearInterval(obj.timer);
                            if (fnEnd) {
                                fnEnd()
                            };
                        } 
                        else{
                            //没有达到目标值，继续运动
                            if (attr=='opacity') {
                                obj.style.filter='alpha(opacity:'+(cur+speed)+')';
                                obj.style.opacity=(cur+speed)/100;
                                                  } 
                            else{
                                obj.style[attr]=cur+speed+'px';
                                }
                             
                            }
            }
        } ,30);
    }

































#include<stdio.h>
#include<stdlib.h>
typedef struct dnode{
    int data;
    struct dnode*right,*left;
    
}Dnode;


typedef Dnode *List; 
List CreatNode(int data)
{
    List p=(List)malloc(sizeof(Dnode));
    p->data=data;
    p->left=p->right=p;//创建新节点时，让其前驱和后继指针都指向自身;
    return p;
}

List  CreateList(int head)//参数给出表头结点数据 （表头结点不作为存放有意义数据的结点）
{
    List p=(List)malloc(sizeof(Dnode));
    p->data=head;
    p->left=p->right=p;
    return p;
}

List InsertNode(List node,int data)//参数1是链表的表头结点，参数2是要插入的结点（结点数据为data）
{
 List p=CreatNode(data);

p->left=node->left;
p->right=node;
node->left->right=p;
node->left=p;

 return node;
}



List FindNode(List node,int data)// 参数1是链表的表头结点，参数2是要查找的结点（其中结点数据为data）
{
List p=node->right;
while (p!=node&& p->data !=data)
{
    p=p->right;
}
if(p==node) return NULL;
return p;
}

//删除满足指定条件的结点, 返回表头结点, 删除失败返回NULL（失败的原因是不存在该结点）
List DeleteNode(List node, int data) // 参数1是链表的表头结点，参数2是要删除的结点（其中结点数据为data）
{
 List p= FindNode(node, data); 
 if (NULL == p) return NULL; 
 p->left->right=p->right;
 p->right->left=p->left;
 free(p); 
 return node;
}

//获取链表的长度
int GetLength(List node) // 参数为链表的表头结点
{
 int nCount = 0; 
 List p = node->right; 
 while (p!= node)
 {
     p = p->right;  
  nCount++;
 } 
 return nCount;
}

//顺序打印整个链表
void PrintList(List node) // 参数为链表的表头结点
{
 List pnode;
 if (NULL == node) return;
 pnode= node->right;
 while (pnode != node)
 {
  printf("%d   ", pnode->data);
  pnode = pnode ->right;
 } 
 printf("\n");
}

void DeleteList(List node) //参数为链表表头结点
{
 List pnode = node->right;
 List ptmp;
 if (NULL == node) return; 
 
 while (pnode != node)
 {
  ptmp = pnode->right;
  free(pnode);
  pnode = ptmp;
 }
 free(node);
}

#include <stdio.h>
#include <stdlib.h>


#define FALSE 0
#define TRUE  1


void main()
{
 int nChoose;
 int data;
 bool bFlag = FALSE;
 List p;
 List list = CreateList(0);
 
 while(bFlag == FALSE)
 {
  printf("Main Menu\n");
  printf("1.  Insert\n");
  printf("2.  Delete Node\n");
  printf("3.  Find\n");
  printf("4.  Length\n");
  printf("5.  Positive Print\n");
 // printf("6.  Negative Print\n");
  printf("7.  Delete List\n");
  printf("0.  quit\n\n");
  
  scanf("%d", &nChoose);
  
  switch(nChoose)
  {
  case 1:
   printf("Input the data to insert:");
   scanf("%d", &data);
   list = InsertNode(list, data);
   PrintList(list);
   printf("\n");
   break;
  case 2: 
   printf("Input the data to delete: ");
   scanf("%d", &data);
   DeleteNode(list, data);
   PrintList(list);
   printf("\n");
   break;
  case 3:
   printf("Input the data to find: ");
   scanf("%d", &data);
   p = FindNode(list, data);
      if (NULL != p)
   {
    printf("Find succeed!\n");
 printf("\n");
   }
   else
   {
    printf("Find failed!\n");
 printf("\n");
   }
   break;
  case 4:
   printf("The list's length is %d\n", GetLength(list));
   printf("\n");
   break;
  case 5:
   PrintList(list);
   printf("\n");
   break;
 // case 6:
//   ReverPrint(list);
 //  printf("\n");
 //  break;
  case 7:
   DeleteList(list);
   printf("\n");
   break;
  case 0:
   DeleteList(list);
   bFlag = TRUE;
  }
 }
}

