const copyfiles = require("copyfiles");

const ddd = [
  { inputFolder: './schematics/*/schema.json', outputFolder: './lib/' },
  { inputFolder: './schematics/*/files/**', outputFolder: './lib/' },
  { inputFolder: './schematics/collection.json', outputFolder: './lib/' },
]

for (const { inputFolder, outputFolder } of ddd) {
  copyfiles([inputFolder, outputFolder], {}, (err) => {
    if (err) {
      console.log("Error occurred while copying", err);
    }
    console.log("folder(s) copied to destination");
  });
}