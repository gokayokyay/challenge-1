const fs = require('fs');
const { db, addEdges } = require('../database');

const argv = require('yargs')
  .option('f', {
    description: 'File to import to ArangoDB. File should be an edge object or an array of PROCESSED edge data.',
    required: true,
    alias: 'file',
  })
  .showHelpOnFail(false, 'Invalid command. Please run with --help')
  .argv;

if (argv['$0'] === __filename) {
  fs.readFile(argv.f, { encoding: 'utf8' }, (err, res) => {
    if (err) {
      throw err;
    } else {
      const json = JSON.parse(res);
      importEdges(json).then(() => {
        console.log('Done!');
      })
    }
  });
}

function importEdges(edges) {
  return new Promise((resolve, reject) => {
    addEdges(db, edges).then(resolve).catch(reject);
  })
}

module.exports = importEdges;