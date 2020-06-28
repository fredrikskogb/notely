const homedir = require('os').homedir();
const fs = require('fs');

function readHomeDir() {
    const homedirContent = fs.readdirSync(homedir);
    const cleanDir = homedirContent.filter(dirItem => !dirItem.startsWith('.'));
    return cleanDir;
}

module.exports = {
    readHomeDir
}