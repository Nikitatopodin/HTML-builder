const { mkdir, readdir, copyFile, rm } = require('node:fs/promises');
const { stat } = require('node:fs');
const { join } = require('node:path');



async function copyFiles() {
  try {
    const newDirPath = join(__dirname, 'files-copy');
    const dirPath = join(__dirname, 'files');

    await mkdir(newDirPath, { recursive: true });
    const files = await readdir(dirPath);
    const filesCopy = await readdir(newDirPath);

    for (const file of files)
      stat(
        join(dirPath, file),
        async (err, stats) => {
          if (err) throw err;
          if (stats.isFile()) {
            for (const copy of filesCopy) {
              if (!files.includes(copy)) {
                await rm(join(newDirPath, copy));
              }
            }
            await copyFile(join(dirPath, file), join(newDirPath, file));
          }
        });
  } catch (err) {
    console.error(err);
  }
}
copyFiles();