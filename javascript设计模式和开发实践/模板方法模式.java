/**
 * Created: yuanjunwen
 * on 9/28/16.
 */

// 模板方法模式是一种严重依赖抽象类的设计模式
// JavaScript 在语言层面并没有提供对抽象类的支持,我们也很难模拟抽象类的实现
// 抽象类不能实例化
// java 代码

public abstract class Beverage{
	final void init(){
		boilWater();
		brew();
		pourInCup();
		addCondiments();
	}

	void boilWater(){
		system.out.println('把水煮沸');
	}

	abstract void brew();
	abstract void addCondiments();
	abstract void pourInCup();

}

public class Coffe extends Beverage{
	@Override
	void brew(){
		System.out.println('用沸水冲泡咖啡');
	}

	@Override
	void pourInCup(){
		System.out.println('把咖啡倒进杯子')
	}

	@Override 
	void addCondiments(){
		System.out.println('加糖和牛奶');
	}
}

public class Tea extends Beverage{
	@Override
	void brew(){
		System.out.println('用沸水冲泡茶叶');
	}

	@Override
	void pourInCup(){
		System.out.println('把茶倒进杯子');
	}

	@Override
	void addCondiments(){
		System.out.println('加柠檬');
	}
}

 public class Test {
 	private static void prepareRecipe(Beverage Beverage){
 		beverage.init();
 	}

 	public static void main (String args[]){
 		Beverage coffe = new Beverage();
 		prepareRecipe(coffe);

 		Beverage tea = new Beverage();
 		prepareRecipe(tea);
 	}
 }


