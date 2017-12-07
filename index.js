#!/usr/bin/env node

const fs = require("fs");
const from = process.argv[2];
const to = process.argv[3];

function formatName(name) {
    return name.replace(/-/ig, "_").toLowerCase();
}

function doTransform(imageset) {
    let files = fs.readdirSync(imageset);
    files.forEach(it => {
        if (it.endsWith("@2x.png")) {
            fs.createReadStream(imageset + "/" + it).pipe(fs.createWriteStream(to + "/drawable-xhdpi/" + formatName(imageset.split("/").pop().replace(".imageset", "")) + ".png"));
        }
        else if (it.endsWith("@3x.png")) {
            fs.createReadStream(imageset + "/" + it).pipe(fs.createWriteStream(to + "/drawable-xxhdpi/" + formatName(imageset.split("/").pop().replace(".imageset", "")) + ".png"));
        }
    })
}

function doSearch(path) {
    try {
        let files = fs.readdirSync(path);
        files.forEach(it => {
            if (it.endsWith(".imageset")) {
                doTransform(path + "/" + it);
            }
            else if (it.indexOf(".") < 0) {
                doSearch(path + "/" + it);
            }
        });
    } catch (error) { }
}

if (from === undefined || to === undefined) {
    console.error("Usage >>> transform-xcassets-drawable xcassetsDIR resDIR")
}
else {
    if (!fs.existsSync(to + "/drawable-xhdpi")) {
        fs.mkdirSync(to + "/drawable-xhdpi")
    }
    if (!fs.existsSync(to + "/drawable-xxhdpi")) {
        fs.mkdirSync(to + "/drawable-xxhdpi")
    }
    doSearch(from);
}
// console.log(process.argv)