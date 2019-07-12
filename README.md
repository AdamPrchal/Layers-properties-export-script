# Layers-properties-export-script

Layers-properties-export-script is a Photoshop script for exporting layers properties (position and size) and saving them into Nanits Composer's config file of comic book project.

## Installation
Copy `[AP] Export to config.jsx` and `json2.js` to:`...Adobe\Adobe Photoshop [YOUR VERSION]\Presets\Scripts\` and restart Photoshop.

## Requirements - IMPORTANT :fire:

- Comic book project created with Composer

- Background layer already imported in the Composer

- Added languages in Composer **(but leave those empty)**
- Exported layers copied to folders
  - Parallax - `...\[COMICBOOK FOLDER]\par\img\`
  - Lettering - `...\[COMICBOOK FOLDER]\par\lang\cz|en|es\`
- Back up your original `config.json` just for a case

## How to use 

1. Check if your PSB is arranged same way [CUTTING TEMPLATE](https://drive.google.com/file/d/1mNy_khdUNIUAA_FrlTGaM6qN0cuRLKDV/view) is
2. File -> Scripts -> [AP] Export to config
3. Write page/file number 
4. Check "Last page" checkbox if it's last page/file (or only page)
5. Using "Select config.json" find `config.json` in comic book folder you have created with Composer
6. Click "Ok"
7. Wait until "Export completed successfully" shows up
8. On your desktop there should be new `config.json`, copy it to comic book folder and replace the old one
9. Open Composer and check if it worked :100:

## How it works

After running this script and selecting `config.json` all layers properties are added to `config.json`. That means you don't have to place parallax and lettering layers into Nanits Composer manually. You only need to put layers exported as PNG images into `par\img` and `\par\lang\cz|en|es\  `folder of your project. 

