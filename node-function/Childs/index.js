const { db } = require('../database');
const { omit } = require('../utils');
module.exports = async function (context, req) {
    // if (req.query.name || (req.body && req.body.name)) {
    //     context.res = {
    //         // status: 200, /* Defaults to 200 */
    //         body: "Hello " + (req.query.name || req.body.name)
    //     };
    // }
    // else {
    //     context.res = {
    //         status: 400,
    //         body: "Please pass a name on the query string or in the request body"
    //     };
    // }
    try {
        var childs = await db.query(`
            FOR p IN Points
                FILTER p.properties.isVisibleOnList == true
                RETURN {
                    id: p._key,
                    title: p.title,
                    description: p.description,
                    location: p.location
                }
        `);
        context.res = {
            headers: {
                "Content-Type":"application/json",
            },
            body: childs._result,
        }
    } catch (err) {
        context.res = {
            status: 500,
            body: err,
        };
    }
};