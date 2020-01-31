const { constructShortestRoute } = require('../utils');
module.exports = (db, startId, endId) => {
  return new Promise((resolve, reject) => {
    db.query("FOR v, e IN ANY SHORTEST_PATH @point1 TO @point2 Edges OPTIONS { weightAttribute: 'weight' } RETURN [v._key, e.weight]", {
      point1: `Points/${startId}`,
      point2: `Points/${endId}`,
    }).then(response => {
      const result = response._result;
      resolve(constructShortestRoute(result));
    }).catch(err => {
      console.error(err);
      reject(err);
    });
  });
}