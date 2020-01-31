const { separatePoint, exportJSON } = require('./utils');
const { initialize, addEdges, addPoint, db, shortestPath } = require('./database');
const poi = require('./poi2.json');


// const { node, edges } = separatePoint(poi);

// // exportJSON(node, 'asd.json');
// exportJSON(edges, 'ss.json');

// addPoint(require('./database').db, node);
// addEdges(require('./database').db, edges);


const arangojs = require("arangojs");
const aql = arangojs.aql;

// db.query(aql`
//   FOR v, e
//     IN OUTBOUND SHORTEST_PATH
//     'Points/0867185c-2eb7-4a76-8596-c14f74a4acb1' TO 'Points/d20bd53e-361e-48fb-944f-dcdbf3e8defd'
//     Edges
//     OPTIONS {
//       weightAttribute: 'weight'
//     }
//     RETURN [v._key, e.weight]
// `).then(console.log);

shortestPath(db, '0867185c-2eb7-4a76-8596-c14f74a4acb1', '3620bd53e-361e-48fb-944f-dcdbf3e8defd');
// db.collection('Points').exists().then(console.log)
const startId = '0867185c-2eb7-4a76-8596-c14f74a4acb1';
const endId = '3620bd53e-361e-48fb-944f-dcdbf3e8defd';



// initialize(db);