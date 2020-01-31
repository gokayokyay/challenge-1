const { GRAPH_NAME, NODES_DOCUMENT_NAME, EDGES_DOCUMENT_NAME, DB_REPLICATION_FACTOR = 1 } = require('../config');

module.exports = db => {
  return new Promise(async (resolve) => {
    try {
      const graph = db.graph(GRAPH_NAME);
      if (await graph.exists()) {
        resolve(graph);
      } else {
        const info = await graph.create({
          edgeDefinitions: [{
            collection: EDGES_DOCUMENT_NAME,
            from: [NODES_DOCUMENT_NAME],
            to: [NODES_DOCUMENT_NAME],
          }],
          options: {
            replicationFactor: DB_REPLICATION_FACTOR,
          },
        });
        resolve(info);
      }
    } catch (err) {
      throw err;
    }
  });
}