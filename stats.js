// stats.js
//file for counting total number of command uses
const fs = require('fs');
const path = require('path');

const statsFile = path.join(__dirname, 'stats.txt');

function readCommandCount() {
    if (!fs.existsSync(statsFile)) {
        fs.writeFileSync(statsFile, 'commands: 0', 'utf8');
    }
    const content = fs.readFileSync(statsFile, 'utf8').trim();
    const match = content.match(/commands:\s*(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
}

function incrementCommandCount() {
    const current = readCommandCount();
    const newCount = current + 1;
    fs.writeFileSync(statsFile, `commands: ${newCount}`, 'utf8');
    return newCount;
}

module.exports = { readCommandCount, incrementCommandCount };
