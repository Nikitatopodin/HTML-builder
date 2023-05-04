const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'secret-folder');

async function getFilesInfo() {
  try {
    const files = await fs.promises.readdir(dirPath);
    for (const file of files)
      fs.stat(
        path.join(dirPath, file),
        (err, stats) => {
          if (err) throw err;
          if (stats.blocks) {
            const name = file.slice(0, file.indexOf('.'));
            const ext = file.slice(file.lastIndexOf('.') + 1);
            const size = stats.size / 1000;
            console.log(`${name} - ${ext} - ${size}kb`);
          }
        });
  } catch (err) {
    console.error(err);
  }
}
getFilesInfo();