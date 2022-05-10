const child_process = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const tasks = {
  'init': () => {
    const plugins = [];
    fs.readdirSync(path.join(__dirname, 'src/plugins')).forEach(dir => {
      if (dir.startsWith('!')) return;
      console.log(`[FOUND] ${dir}`);
      plugins.push(dir);
      const dirPath = path.join(__dirname, 'src/plugins', dir);
      const initPath = path.join(dirPath, 'init.js');
      const pkgPath = path.join(dirPath, 'package.json');
      if (fs.existsSync(pkgPath)) {
        const pkg = require(pkgPath);
        if (pkg.dependencies || pkg.devDependencies) {
          const res = child_process.execSync('npm i', { cwd: dirPath });
          console.log(res.toString());
        }
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
  },
  'start-plugins': () => {
    fs.readdirSync(path.join(__dirname, 'src/plugins')).forEach(dir => {
      if (dir.startsWith('!')) return;
      const dirPath = path.join(__dirname, 'src/plugins', dir);
      const pkgPath = path.join(dirPath, 'package.json');
      if (!fs.existsSync(pkgPath)) return;
      const pkg = require(pkgPath);
      const name = pkg.name || dir;
      if (!pkg.scripts || !pkg.scripts.start) return;
      const npm = os.platform() === 'win32' ? 'npm.cmd' : 'npm';
      const cp = child_process.spawn(npm, ['start'], { cwd: dirPath });
      cp.stdout.on('data', data => console.log(`${name}:`, data.toString().replace(/\n$/, '')));
      cp.stderr.on('data', data => console.error(`${name}:`, data.toString().replace(/\n$/, '')));
    });
  },
};

if (tasks[process.argv[2]]) tasks[process.argv[2]]();
