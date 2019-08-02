
#target photoshop
#include 'json2.js'


var usedID = [];
var letteringGroup = app.activeDocument.layerSets.getByName('Lettering').layerSets;


/* Object for making operations with layer groups easier */
var groups = {
    'lang': {
        //'en': app.activeDocument.layerSets.getByName('Lettering').layerSets.getByName('ENG').layers,
        //'cz': app.activeDocument.layerSets.getByName('Lettering').layerSets.getByName('CZE').layers,
        //'sfx': app.activeDocument.layerSets[0].layerSets.getByName('SFX').layers
    },
    'img': app.activeDocument.layerSets.getByName('Parallax').layers
}

function main() {
    try {
        detectLanguages();
        var inputData = inputWindow();  // UI interface
        inputData;
        const loadedJSON = inputData[0] // Loaded and parsed config.json
        const page = inputData[1];      // Page/PSB number 
        const lastPage = inputData[2];  // Bool if active page/PSB is the last one
        const folderPath = inputData[3].substring(0, inputData[3].length - 12);
        //const topOffset = getTopOffset(loadedJSON, page, lastPage); // Gets top offset for layers in case of having multiple PSB files

        var fileBackup = new File(Folder.desktop + "/config-backup.json");   // Creates .json file on Desktop
        fileBackup.open("w", "TEXT", "????");                                // Opens file for editing
        fileBackup.writeln(JSON.stringify(loadedJSON, null, "\t"));          // Stringify and formats object data into file
        fileBackup.close();

        importImgLayers(loadedJSON);    // Insert each parallax layer properties into object
        importLangLayers(loadedJSON);   // Insert each lettering layer properties into object

        var file = new File(folderPath + "/config.json");       // Creates .json file on Desktop
        file.open("w", "TEXT", "????");                         // Opens file for editing
        file.writeln(JSON.stringify(loadedJSON, null, "\t"));   // Stringify and formats object data into file
        file.close();                                           // Closes file
        alert("Export completed successfully");

        /* Functions */

        function importLangLayers(activeJSON) {
            var langKeys = getKeysWithoutObjectKeysSupport(groups.lang);
            for (var i = 0; i <= (langKeys.length - 1); i++) {
                var activeLang = langKeys[i];
                for (var y = 0; y <= (groups.lang[activeLang].length - 1); y++) {
                    var currentLayer = groups.lang[activeLang][y];
                    var fileID = generateRandomString();
                    var aFile = File(folderPath + "\\par\\lang\\" + activeLang + '\\' + currentLayer.name + ".png");
                    aFile.rename(fileID + ".png");
                    var currentLayerObject = {
                        "src": ".\\par\\lang\\" + activeLang + '\\' + fileID,
                        "size": {
                            "x": getLayerWidth(currentLayer),
                            "y": getLayerHeight(currentLayer)
                        },
                        "position": {
                            "x": currentLayer.bounds[0].as("px"),
                            "y": currentLayer.bounds[1].as("px") //+ topOffset
                        },
                        "offset": {
                            "top": activeJSON.metadata.projectWidth,
                            "bottom": activeJSON.metadata.projectWidth + getLayerHeight(currentLayer)
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
                var fileID = generateRandomString();
                var aFile = File(folderPath + "\\par\\img\\" + currentLayer.name + ".png");
                aFile.rename(fileID + ".png");
                var currentLayerObject = {
                    "src": ".\\par\\img\\" + fileID,
                    "size": {
                        "x": getLayerWidth(currentLayer),
                        "y": getLayerHeight(currentLayer)
                    },
                    "position": {
                        "x": currentLayer.bounds[0].as("px"),
                        "y": currentLayer.bounds[1].as("px") //+ topOffset
                    },
                    "offset": {
                        "top": activeJSON.metadata.projectWidth,
                        "bottom": activeJSON.metadata.projectWidth + getLayerHeight(currentLayer)
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
            /*myWindow.add("statictext", undefined, "Page number:");
             var pageNumber = myWindow.add("edittext");
             var lastPage = myWindow.add("checkbox", undefined, "Last page"); */
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
                return [loadedJSON, 0, 0, pathToJSON.text];
            } else {
                return;
            }
            myWindow.show();
        }

        function generateRandomString() {
            const length = 20;
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < length; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            var n = false;

            for (var i = 0; i < usedID.length; i++) {
                if (text == usedID[i]) n = true;
            }

            if (n == false) {

                usedID.push(text);
                return text;
            }
            else {
                generateRandomString();
            }

        }

        function loadJSON(pathToJSON) {
            var jsonFile = new File(pathToJSON);

            jsonFile.open("r+");
            var str = jsonFile.read();
            jsonFile.close();

            return JSON.parse(str);
        }

        function getTopOffset(activeJSON, PSB, isLast) {
            var offset;

            if (PSB == 1) {
                var height = [];
                height.push(app.activeDocument.height.as("px"));
                activeJSON.metadata.pagesHeights = height;
                offset = 0;
            }
            else if (PSB >= 2) {
                const arr = activeJSON.metadata.pagesHeights;
                var arrSum = 0;
                for (var i = 0; i < arr.length; i++)
                    arrSum = arrSum + arr[i];
                activeJSON.metadata.pagesHeights.push(app.activeDocument.height.as("px"));
                offset = arrSum;
            }

            if (isLast == true)
                delete activeJSON.metadata.pagesHeights;

            return offset;
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

        function detectLanguages() {
            for (var i = 0; i < letteringGroup.length; i++) {
                var langName = letteringGroup[i].name;
                if (langName == "ENG") groups.lang.en = letteringGroup.getByName(langName).layers;
                if (langName == "CZE") groups.lang.cz = letteringGroup.getByName(langName).layers;
                if (langName == "GER") groups.lang.de = letteringGroup.getByName(langName).layers;
                if (langName == "ESP") groups.lang.es = letteringGroup.getByName(langName).layers;
            }
        }

        function getLayerWidth(layer) {
            return Math.floor(layer.bounds[2].as("px") - layer.bounds[0].as("px"));
        }

        function getLayerHeight(layer) {
            return Math.floor(layer.bounds[3].as("px") - layer.bounds[1].as("px"));
        }

    } catch (e) {

        if (e.number == 9999) {

            return;
        }
    }

};

main();

