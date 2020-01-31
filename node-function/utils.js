const fs = require('fs');

const { NODES_DOCUMENT_NAME } = require('./config');

function separatePoint(point) {
  if(typeof point !== "object") throw new Error(`"separatePoint" function expects an object`);
  else if (!point.hasOwnProperty('navigation')) throw new Error(`"separatePoint" function's argument doesn't contain navigation property`);
  const node = omit(point, 'navigation');
  const navigation = omit(point['navigation'], 'properties');
  node['properties'] = point['navigation']['properties'];
  const edges = constructEdges(navigation, node.id);
  return {
    node,
    edges,
  };
}

function omit(obj, omitKey) {
  // See https://jsperf.com/omit-key/25
  // Used it this way then Object.assign because it's more performant
  if (Object.keys(obj).length === 0) throw new Error(`Omit function expects not empty object!`);
  else if(typeof obj !== "object" || obj === null) throw new Error(`Omit function's first argument expects an object`);
  return Object.keys(obj).reduce((result, key) => {
     if(key !== omitKey) {
        result[key] = obj[key];
     }
     return result;
  }, {});
}

function constructEdges(navigation, pointId) {
  if(typeof navigation !== "object") throw new Error(`"navigation" parameter must be an object.`);
  else if (!navigation.hasOwnProperty('segments')) throw new Error(`"navigation" parameter must own "segments" property.`);
  else if (pointId === null || pointId === "" || typeof pointId === 'undefined') throw new Error(`"pointId" property mustn't be empty/null`);
  const { segments } = navigation;
  return segments.reduce((result, current) => {
    result.push({
      _from: `${NODES_DOCUMENT_NAME}/${pointId}`,
      _to: `${NODES_DOCUMENT_NAME}/${current.id}`,
      weight: current.weight,
      mapWeight: current.mapWeight,
    });
    // result.push({
    //   _from: `${NODES_DOCUMENT_NAME}/${current.id}`,
    //   _to: `${NODES_DOCUMENT_NAME}/${pointId}`,
    //   weight: current.weight,
    //   mapWeight: current.mapWeight,
    // });
    return result;
  }, []);
}

function exportJSON(json, path) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, JSON.stringify(json, null, 2), err => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    })
  });
}

function constructShortestRoute(routeArray) {
  if (!Array.isArray(routeArray)) throw new Error(`"constructShortestRoute"
  Internal database error. Check database connection.`);
  else if (routeArray.length === 0) throw new Error(`"constructShortestRoute" 
    either there is no possible route to desired point
    or point id is incorrect!`);
  // Have chosen "for" loop over map/reduce/forEach to keep performance high.
  let totalDist = 0;
  for (var i = 0; i < routeArray.length - 1; i++) {
    routeArray[i][1] = routeArray[i + 1][1];
    totalDist += routeArray[i][1];
  }
  routeArray[routeArray.length - 1].pop();
  return {
    "dist": totalDist,
    "route": routeArray,
  };
}

module.exports.separatePoint = separatePoint; 
module.exports.omit = omit;
module.exports.constructEdges = constructEdges;
module.exports.exportJSON = exportJSON;
module.exports.constructShortestRoute = constructShortestRoute;