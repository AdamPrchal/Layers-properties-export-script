#target photoshop;
#include json2.js

myInput();
function inputWindows() {
    var myWindow = new Window("dialog", "Form");
    myWindow.add("statictext", undefined, "Page number:");
    var pageNumber = myWindow.add("edittext");
    myWindow.add("statictext", undefined, "Path to config.json:");
    var pathToJSON = myWindow.add("edittext");
    var findFile = myWindow.add("button", undefined, "Select config.json")

    pathToJSON.characters = 25;
    pathToJSON.active = true;
    var myButtonGroup = myWindow.add("group");
    var okButton = myButtonGroup.add("button", undefined, "OK");
    myButtonGroup.add("button", undefined, "Cancel");
    findFile.onClick = function () {
        var dialogPath = File.openDialog("Select config.json")
        pathToJSON.text = dialogPath.toString();
    }
    if (myWindow.show() == 1) {
        var loadedJSON = loadJSON(pathToJSON.text);
    } else {
        exit();
    }
    myWindow.show();
}

function loadJSON(pathToJSON) {
    var jsonFile = new File(pathToJSON);

    jsonFile.open("r+");
    var str = jsonFile.read();
    jsonFile.close();

    return JSON.parse(str);
}

