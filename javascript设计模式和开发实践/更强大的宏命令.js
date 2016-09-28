var MacroCommand = function() {
    return {
        commandList: [],
        add: function(command) {
            this.commandList.push(command);
        },
        execute: function() {
            for (var i = 0, command; command = this.commandList[i++];) {
                command.execute();
            }
        }
    }
};

var openCommand = {
	execute: function(){
		console.log('打开空调');
	}
};

var openTvCommand = {
	execute: function(){
		console.log('打开电视');
	}
};

var openSoundCommand = {
	execute: function(){
		console.log('打开音响');
	}
};

var macroCommand1 = MacroCommand();
macroCommand1.add(openTvCommand);
macroCommand1.add(openSoundCommand);

var closeDoorCommand = {
	execute: function(){
		console.log('关门')
	}
};

var openPcCommand = {
	execute: function(){
		console.log('开电脑')
	}
};

var openQQCommand = {
	execute: function(){
		console.log('打开 QQ');
	}
};

var macroCommand2 = MacroCommand();
macroCommand2.add(closeDoorCommand);
macroCommand2.add(openTvCommand);
macroCommand2.add(openQQCommand);


var macroCommand = MacroCommand();
macroCommand.add(openCommand);
macroCommand.add(macroCommand1);
macroCommand.add(macroCommand2);

var setCommand = (function(command){
	//document.getElementById('button').onclick = function(){
		command.execute();
//	}
})(macroCommand);