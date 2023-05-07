const { createWriteStream, appendFile } = require('fs');
const path = require('path');
const { stdin: input, stdout: output } = require('process');
const readline = require('node:readline');

const filePath = path.join(__dirname, 'text.txt');
const rl = readline.createInterface({ input, output });

createWriteStream(filePath);

output.write('Введите текст, который хотите добавить, или exit, если хотите закончить\n');

rl.on('line', (input) => {
  if (input.trim() === 'exit') {
    console.log('Всего Вам доброго!');
    process.exit();
  }
  appendFile(
    filePath,
    input + '\n',
    err => {
      if (err) throw err;
    }
  );
});
rl.on('SIGINT', () => {
  console.log('Всего Вам доброго!');
  process.exit();
});