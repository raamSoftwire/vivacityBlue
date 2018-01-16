const fs = require('fs');

const contents = fs.readFileSync('./moves.json');

console.log(JSON.parse(contents));