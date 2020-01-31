const { initialize, addEdges, addPoint, db, shortestPath } = require('../database');

module.exports = async function (context, req) {
    // context.log('HTTP.');
    initialize(db);
    if (req.query.from && req.query.to) {
        try {
            const body = await shortestPath(db, req.query.from, req.query.to);
            context.res = {
                // status: 200, /* Defaults to 200 */
                headers: {
                    "Content-Type":"application/json",
                },
                body,
            };
        } catch (err) {
            context.res = {
                status: 500,
                body: err
            };
        }
    } else {
        context.res = {
            status: 400,
            body: "Please pass from and to queries.",
        };
    }
};