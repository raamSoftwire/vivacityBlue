const fs = require('fs');
const moveArray = JSON.parse(fs.readFileSync('./moves.json')).moves;

console.log(moveArray);