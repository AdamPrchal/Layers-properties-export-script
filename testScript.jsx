#target photoshop
#include json2.js

// Object for making operations with layer groups easier
var groups = {
    'lang': {
        'en': app.activeDocument.layerSets.getByName('Lettering').layerSets.getByName('ENG').layers,
        'cz': app.activeDocument.layerSets.getByName('Lettering').layerSets.getByName('CZE').layers,
        //'sfx': app.activeDocument.layerSets[0].layerSets.getByName('SFX').layers
    },
    'img': app.activeDocument.layerSets.getByName('Parallax').layers
}

// Loads 'config.json' from selected project folder and saves its data into 'loadedJSON' variable

// TODO: Add page height to object or increment it if it is already set 
var loadedJSON = inputWindow();
loadedJSON;


importImgLayers(loadedJSON);
importLangLayers(loadedJSON);

var file = new File(Folder.desktop + "/out.json"); // Creats .json file on Desktop
file.open("w", "TEXT", "????");
file.writeln(JSON.stringify(loadedJSON, null, "\t"));
file.close();

function importLangLayers(activeJSON) {
    var langKeys = getKeysWithoutObjectKeysSupport(groups.lang);
    for (var i = 0; i <= (langKeys.length - 1); i++) {
        var activeLang = langKeys[i];
        for (var y = 0; y <= (groups.lang[activeLang].length - 1); y++) {
            var currentLayer = groups.lang[activeLang][y];
            var currentLayerObject = {
                "src": ".\\par\\lang\\" + activeLang + '\\' + currentLayer.name,
                "size": {
                    "x": getLayerWidth(currentLayer),
                    "y": getLayerHeight(currentLayer)
                },
                "position": {
                    "x": currentLayer.bounds[0].as("px"),
                    "y": currentLayer.bounds[1].as("px")
                },
                "offset": {
                    "top": activeJSON.metadata.projectWidth,
                    "bottom": activeJSON.metadata.projectWidth + currentLayer.bounds[3].as("px")
                },
                "speed": 0,
                "direction": 1,
                "layerIndex": 55
            };
            activeJSON.par.lang[activeLang].unshift(currentLayerObject);
        }
    }
}

function importImgLayers(activeJSON) {
    for (var i = 0; i <= (groups.img.length - 1); i++) {
        var currentLayer = groups.img[i];
        var currentLayerObject = {
            "src": ".\\par\\img\\" + currentLayer.name,
            "size": {
                "x": getLayerWidth(currentLayer),
                "y": getLayerHeight(currentLayer)
            },
            "position": {
                "x": currentLayer.bounds[0].as("px"),
                "y": currentLayer.bounds[1].as("px")
            },
            "offset": {
                "top": activeJSON.metadata.projectWidth,
                "bottom": activeJSON.metadata.projectWidth + currentLayer.bounds[3].as("px")
            },
            "speed": 0,
            "direction": 1,
            "layerIndex": 1
        };
        activeJSON.par.img.unshift(currentLayerObject);
    }
}

function inputWindow() {
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
        return loadedJSON;
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

function getTopOffset(activePSB) {

}

function getKeysWithoutObjectKeysSupport(associativeArrayObject) {
    var arrayWithKeys = [], associativeArrayObject;
    for (key in associativeArrayObject) {
        // Avoid returning these keys from the Associative Array that are stored in it for some reason
        if (key !== undefined && key !== "toJSONString" && key !== "parseJSON") {
            arrayWithKeys.push(key);
        }
    }
    return arrayWithKeys;
}

function getLayerWidth(layer) {
    return Math.floor(layer.bounds[2].as("px") - layer.bounds[0].as("px"));
}

function getLayerHeight(layer) {
    return Math.floor(layer.bounds[3].as("px") - layer.bounds[1].as("px"));
}




