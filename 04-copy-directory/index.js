const { mkdir, readdir, copyFile } = require('node:fs/promises');
const { stat } = require('node:fs');
const { join } = require('node:path');



async function copyFiles() {
  try {
    const newDirPath = join(__dirname, 'files-copy');
    const dirPath = join(__dirname, 'files');
    await mkdir(newDirPath, { recursive: true });
    const files = await readdir(dirPath);

    for (const file of files)
      stat(
        join(dirPath, file),
        async (err, stats) => {
          if (err) throw err;
          if (stats.isFile()) {
            await copyFile(join(dirPath, file), join(newDirPath, file));
          }
        });

  } catch (err) {
    console.error(err);
  }
}
console.log(copyFiles());