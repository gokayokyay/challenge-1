const fs = require('fs');
const { db, addPoint } = require('../database');

const argv = require('yargs')
  .option('f', {
    description: 'File to import to ArangoDB. File should be an array of PROCESSED point data.',
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
      importPoints(json).then(() => {
        console.log('Done!');
      })
    }
  });  
}

function importPoints(pts) {
  return new Promise((resolve, reject) => {
    let points = [];
    if (!Array.isArray(pts)) {
      points.push(pts);
    } else {
      points = pts;
    }
    points.forEach((val, index, arr) => {
      addPoint(db, val).catch(err => {
        reject(err);
        throw err;
      });
      if (index === arr.length -1) {
        resolve();
      }
    });
  })
}

module.exports = importPoints;