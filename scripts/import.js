const fs = require('fs');
const importPoints = require('./importPoints');
const importEdges = require('./importEdges');
// const { db, addEdges, addPoint } = require('../database');
const { separatePoint } = require('../utils');

const argv = require('yargs')
  .option('f', {
    description: `File to import to ArangoDB. 
      File should be an array of RAW point data. 
      If you want to import processed data such as Edges, check out scripts/importEdges.js
    `,
    required: true,
    alias: 'file',
  })
  .showHelpOnFail(false, 'Invalid command. Please run with --help')
  .argv;

fs.readFile(argv.f, { encoding: 'utf8' }, (err, res) => {
  if (err) {
    throw err;
  } else {
    const json = JSON.parse(res);
    importRaw(json).then(console.log).catch(console.error);
  }
});

function importRaw(json) {
  return new Promise((resolve, reject) => {
    var counter = 0;
    var points = [];
    var edges = [];
    if(Array.isArray(json)){
      points = json.reduce((result, current) => {
        return result.concat(separatePoint(current).node);
      }, []);
      edges = json.reduce((result, current) => {
        return result.concat(separatePoint(current).edges);
      }, []);
    } else {
      points.push(separatePoint(json).node);
      edges.push(separatePoint(json).edges);
    }
    edges = edges.reduce((result, current) => {
      return result.concat(current);
    }, []);
    importPoints(points).then(() => {
      console.log("Imported points successfully!");
      counter++;
      if (counter < 1) resolve(true);
    }).catch(reject);
    importEdges(edges).then(() => {
      console.log("Imported edges successfully!");
      counter++;
      if (counter < 1) resolve(true);
    }).catch(reject);
  });
}

module.exports = importRaw;