
console.log('build data');

const glob = require('glob');
const fs = require('fs-extra');
const path = require('path');

const demoPaths = glob.sync('**/index.html', {
  cwd: path.join(__dirname, '../../../src/components/')
});

const demos = demoPaths.map(demo => {
  return {
    name: demo.toLowerCase()
              .replace(/\\/g, ' ')
              .replace(/\//g, ' ')
              .replace(/ test/g, '')
              .replace(/ index.html/g, ''),
    url: '/src/components/' + demo.replace(/\\/g, '/')
  };
}).sort((a, b) => {
  if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
  if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
  return 0
});

const themePaths = glob.sync('**/*.css', {
  cwd: path.join(__dirname, '../../../src/themes/css/')
});


const themes = themePaths.map(theme => {
  return {
    name: theme.replace(/.css/g, ''),
    url: '/src/themes/css/' + theme
  };
}).sort((a, b) => {
  if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
  if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
  return 0
});


fs.ensureDirSync(path.join(__dirname, '../www/assets/'));

fs.writeJsonSync(path.join(__dirname, '../www/assets/data.json'), {
  demos: demos,
  themes: themes
});
