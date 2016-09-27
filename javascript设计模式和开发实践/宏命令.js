var closeDoorCommand = {
    execute: function() {
        console.log('关门');
    }
}

var openPcCommand = {
    execute: function() {
        console.log('开电脑');
    }
}

var oepnQQCommand = {
    execute: function() {
        console.log('登录 QQ');
    }
}

//定义宏对象 macroCommand
var MacroCommand = function() {
    return {
        commandList: [],
        add: function(command) {
            this.commandList.push(command)
        },
        execute: function() {
            for (var i = 0, command; command = this.commandList[i++];) {
                command.execute();
            }
        }
    }
};

var macroCommand = MacroCommand();
macroCommand.add(closeDoorCommand);
macroCommand.add(openPcCommand);
macroCommand.add(oepnQQCommand);

macroCommand.execute();


