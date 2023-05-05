const { createReadStream, createWriteStream, stat } = require('node:fs');
const { readdir } = require('node:fs/promises');
const { join, resolve } = require('node:path');

const stylesDirPath = join(__dirname, 'styles');
const projectDirPath = join(__dirname, 'project-dist');


async function readDir() {
  const output = createWriteStream(resolve(projectDirPath, 'bundle.css'));
  try {
    const files = await readdir(stylesDirPath);
    for (const file of files)
      stat(
        join(stylesDirPath, file),
        (err, stats) => {
          const extension = file.slice(file.lastIndexOf('.') + 1);
          if (err) throw err;
          if (stats.isFile() && extension === 'css') {
            const input = createReadStream(resolve(stylesDirPath, file));
            input.pipe(output);
          }
        });
  } catch (err) {
    console.error(err);
  }

}

readDir();