module.exports = {
  db: require('./connection'),
  initialize: require('./initialize'),
  addPoint: require('./populate').addPoint,
  addEdges: require('./populate').addEdges,
  shortestPath: require('./shortestPath'),
};