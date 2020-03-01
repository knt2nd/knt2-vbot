const child_process = require('child_process');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const plugins = [];

fs.readdirSync(path.join(__dirname, 'src/plugins')).forEach(dir => {
  if (dir.startsWith('!')) return;
  console.log(`[FOUND] ${dir}`);
  plugins.push(dir);
  const dirPath = path.join(__dirname, 'src/plugins', dir);
  const initPath = path.join(dirPath, 'init.js');
  if (fs.existsSync(path.join(dirPath, 'package.json'))) {
    process.chdir(dirPath);
    console.log(child_process.execSync('npm i').toString());
  }
  if (fs.existsSync(initPath)) require(initPath);
});

let script = plugins.map((p, i) => `import p${i} from '../src/plugins/${p}';`).join('\n');
script += '\n\nexport default [';
script += plugins.map((p, i) => `p${i}`).join(', ');
script += '];\n';

if (!fs.existsSync(path.join(__dirname, 'temp/'))) {
  fs.mkdirSync(path.join(__dirname, 'temp/'));
}
fs.writeFileSync(path.join(__dirname, 'temp/plugins.js'), script);
console.log('[CREATED] plugins.js:', plugins.join(', '));

axios
  .get('https://raw.githubusercontent.com/discordjs/discord.js/webpack/discord.stable.js')
  .then(res => {
    fs.writeFileSync(path.join(__dirname, 'temp/discord.js'), res.data);
    console.log('[CREATED] discord.js');
    console.log('[CONGRATS] All the procedures are done successfully');
  });
