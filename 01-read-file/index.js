const { createReadStream } = require('fs');
const { join } = require('path');

const filePath = join(__dirname, 'text.txt');

const readableStream = createReadStream(filePath, 'utf-8');
readableStream.on('data', chunk => console.log(chunk));