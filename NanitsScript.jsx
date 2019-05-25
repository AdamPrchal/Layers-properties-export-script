#target photoshop
#include json2.js

var LANGUAGE_MAP = {
    'CZE': 'cz',
    'ENG': 'en'
};

var myJSON = File.openDialog("Selection prompt");
myJSON = myJSON.toString();
var documentHeight = app.activeDocument.height; // Zjištění výšky souboru
var groups = ["Lettering", "Parallax"];
var obj = loadJSON(myJSON);

// {
//     "src": "./par/img/kxmNiIqNwwNq8gJzsChr",
//     "size": {
//         "x": 1185,
//         "y": 1239
//     },
//     "position": {
//         "x": 136,
//         "y": 634
//     },
//     "offset": {
//         "top": 3000,
//         "bottom": 4239
//     },
//     "speed": 200,
//     "direction": 1,
//     "layerIndex": 2
// }
var imgArray = [];
var langArray = {};

for (var i = 0; i <= (groups.length - 1); i++) {
    var specificGroup = app.activeDocument.layerSets.getByName(groups[i]);
    if (specificGroup.name == "Lettering") {
        for (var lang = 0; lang <= (specificGroup.layers.length - 1); lang++) {
            var specificLayerLettering = specificGroup.layers[lang];
            for (var y = 0; y <= (specificLayerLettering.layers.length - 1); y++) {
                var specificSublayer = specificLayerLettering.layers[y];
                var correctLangName = LANGUAGE_MAP[specificGroup.layers[lang].name];
                var currentLang = {
                    "src": "./par/lang/" + correctLangName + '/' + specificSublayer.name,
                    "size": {
                        "x": getLayerWidth(specificSublayer),
                        "y": getLayerHeight(specificSublayer)
                    },
                    "position": {
                        "x": specificSublayer.bounds[0].as("px"),
                        "y": specificSublayer.bounds[1].as("px")
                    },
                    "offset": {
                        "top": 3000,
                        "bottom": 3000 + specificSublayer.bounds[3].as("px")
                    },
                    "speed": 1,
                    "direction": 1,
                    "layerIndex": 1
                };
                langArray[correctLangName] ? langArray[correctLangName].unshift(currentLang) : langArray[correctLangName] = [currentLang];
            }
        }
    }
    else {
        for (var z = 0; z <= (specificGroup.layers.length - 1); z++) {
            var specificLayerParallax = specificGroup.layers[z];
            var currentPar = {
                "src": "./par/img/" + specificLayerParallax.name,
                "size": {
                    "x": getLayerWidth(specificLayerParallax),
                    "y": getLayerHeight(specificLayerParallax)
                },
                "position": {
                    "x": specificLayerParallax.bounds[0].as("px"),
                    "y": specificLayerParallax.bounds[1].as("px")
                },
                "offset": {
                    "top": 3000,
                    "bottom": 3000 + specificLayerParallax.bounds[3].as("px")
                },
                "speed": 1,
                "direction": 1,
                "layerIndex": 1
            };
            imgArray.unshift(currentPar);
        }
    }
}

obj.par.img = imgArray;
obj.par.lang = langArray;

var file = new File(Folder.desktop + "/out.json"); // Vytvoření .txt souboru na ploše
file.open("w", "TEXT", "????");
file.writeln(JSON.stringify(obj));
file.close();

function loadJSON(pathToJSON) {
    var jsonFile = new File(pathToJSON);

    jsonFile.open("r+");
    var str = jsonFile.read();
    jsonFile.close();

    return JSON.parse(str);
}

function getLayerWidth(layer) {
    return Math.floor(layer.bounds[2].as("px") - layer.bounds[0].as("px"));
}

function getLayerHeight(layer) {
    return Math.floor(layer.bounds[3].as("px") - layer.bounds[1].as("px"));
}