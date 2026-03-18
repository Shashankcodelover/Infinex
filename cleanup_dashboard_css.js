const fs = require('fs');
const path = require('path');

function removeLines(filepath, ranges) {
    if (!fs.existsSync(filepath)) {
        console.log(`File not found: ${filepath}`);
        return;
    }
    
    let content = fs.readFileSync(filepath, 'utf8');
    const isCrLf = content.includes('\r\n');
    const lines = isCrLf ? content.split('\r\n') : content.split('\n');
    
    let sortedRanges = ranges.sort((a, b) => b[0] - a[0]);
    
    for (let r of sortedRanges) {
        let start = r[0] - 1;
        let end = r[1] - 1;
        let count = end - start + 1;
        console.log(`Removing lines ${r[0]}-${r[1]} from ${filepath}`);
        lines.splice(start, count);
    }
    
    const separator = isCrLf ? '\r\n' : '\n';
    fs.writeFileSync(filepath, lines.join(separator), 'utf8');
    console.log(`Updated ${filepath}`);
}

const baseDir = 'c:\\Users\\Preetham.j\\Desktop\\My-Stufs\\startup-proj\\sup-frontend\\dashboard';

removeLines(
    path.join(baseDir, 'dashboard.css'),
    [[198, 205]]
);
