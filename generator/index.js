module.exports = (api, options, rootOptions) => {
  let rxLines = `\nimport VueShortkey from 'vue-shortkey';\n\nVue.use(VueShortkey);`;

  api.onCreateComplete(() => {
    // inject to main.js
    const fs = require('fs');
    const ext = api.hasPlugin('typescript') ? 'ts' : 'js';
    const mainPath = api.resolve(`./src/main.${ext}`);

    // get content
    let contentMain = fs.readFileSync(mainPath, {
      encoding: 'utf-8'
    });
    const lines = contentMain.split(/\r?\n/g).reverse();

    // inject import
    const lastImportIndex = lines.findIndex(line => line.match(/^import/));
    lines[lastImportIndex] += rxLines;

    // modify app
    contentMain = lines.reverse().join('\n');
    fs.writeFileSync(mainPath, contentMain, {
      encoding: 'utf-8'
    });
  });
};