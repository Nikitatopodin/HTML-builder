const { stat } = require('fs');
const { readdir } = require('fs/promises');
const { join } = require('path');

const dirPath = join(__dirname, 'secret-folder');

async function getFilesInfo() {
  try {
    const files = await readdir(dirPath);
    for (const file of files)
      stat(
        join(dirPath, file),
        (err, stats) => {
          if (err) throw err;
          if (stats.isFile()) {
            const name = file.slice(0, file.lastIndexOf('.'));
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