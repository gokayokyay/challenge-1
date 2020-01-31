const { GRAPH_NAME, NODES_DOCUMENT_NAME, EDGES_DOCUMENT_NAME } = require('../config');

module.exports = {
  addPoint: async (db, node) => {
    try {
      const graph = db.graph(GRAPH_NAME);
      const collection = graph.vertexCollection(NODES_DOCUMENT_NAME);
      const { id, ...properties } = node;
      const doc = await collection.save({
        _key: id,
        ...properties,
      });
      return doc;
    } catch (err) {
      throw err;
    }
  },
  addEdges: async (db, edges) => {
    try {
      const graph = db.graph(GRAPH_NAME);
      const collection = graph.edgeCollection(EDGES_DOCUMENT_NAME);
      const res = await collection.import(edges);
      return res;
    } catch (err) {
      throw err;
    }
  },
}