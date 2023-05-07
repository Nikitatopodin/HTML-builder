const { createReadStream, createWriteStream, stat, } = require('node:fs');
const { mkdir, readdir, copyFile, rm, readFile, writeFile, } = require('node:fs/promises');
const { join, resolve } = require('node:path');

const dirPath = join(__dirname, 'assets');
const newDirPath = join(__dirname, 'project-dist', 'assets');

const stylesDirPath = join(__dirname, 'styles');
const projectDirPath = join(__dirname, 'project-dist');

async function copyFiles(dirPath, newDirPath) {
  try {
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

          } else {
            await mkdir(dirPath, { recursive: true });
            dirPath = resolve(__dirname, 'assets', file);
            newDirPath = resolve(__dirname, 'project-dist', 'assets', file);
            await copyFiles(dirPath, newDirPath);
          }
        });
  } catch (err) {
    console.error(err);
  }
}
copyFiles(dirPath, newDirPath);

async function buildPage() {
  await mkdir(projectDirPath, { recursive: true });
  const stylesOutput = createWriteStream(resolve(projectDirPath, 'style.css'));
  try {
    const files = await readdir(stylesDirPath);
    for (const file of files)
      stat(
        join(stylesDirPath, file),
        (err, stats) => {
          const extension = file.slice(file.lastIndexOf('.') + 1);
          if (err) throw err;
          if (stats.isFile() && extension === 'css') {
            const stylesInput = createReadStream(resolve(stylesDirPath, file));
            stylesInput.pipe(stylesOutput);
          }
        });
  } catch (err) {
    console.error(err);
  }

  const componentsDir = join(__dirname, 'components');

  try {
    const template = await readFile(resolve(__dirname, 'template.html'), 'utf-8', (err, data) => {
      if (err) throw err;
      return data;
    });

    await writeFile(resolve(projectDirPath, 'index.html'), template.toString(), 'utf-8', (err) => {
      if (err) throw err;
    });


    const components = await readdir(componentsDir);
    for (const component of components) {
      const componentContent = await readFile(resolve(componentsDir, component), 'utf-8', (err, data) => {
        if (err) throw err;
        return data;
      });
      const indexHTML = await readFile(resolve(projectDirPath, 'index.html'), 'utf-8', (err, data) => {
        if (err) throw err;
        return data;
      });
      const replaced = indexHTML.replace(`{{${component.slice(0, component.lastIndexOf('.'))}}}`, componentContent);
      await writeFile(resolve(projectDirPath, 'index.html'), replaced, 'utf-8', (err) => {
        if (err) throw err;
      });
    }

  } catch (err) {
    console.error(err);
  }
}

buildPage();