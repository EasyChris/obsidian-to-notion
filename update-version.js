// update package.json version
import fs from 'fs';

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

console.log(packageJson.version);


// get node args
const args = process.argv.slice(2);

packageJson.version = args[0];

console.log(packageJson.version);


// write package.json
fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));

// read manifest.json
const manifestJson = JSON.parse(fs.readFileSync('./manifest.json', 'utf8'));

manifestJson.version = args[0];

// write manifest.json
fs.writeFileSync('./manifest.json', JSON.stringify(manifestJson, null, 2));