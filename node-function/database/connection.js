const arangojs = require('arangojs');
const { DB_USERNAME, DB_PASSWORD, DB_URL, DB_ENCODED_CA = "", DB_NAME = "" } = require('../config');

const db = DB_ENCODED_CA === "" ? 
  new arangojs.Database({
    url: DB_URL,
    
  }) :
  new arangojs.Database({
    url: DB_URL,
    agentOptions: {ca: Buffer.from(DB_ENCODED_CA, "base64")},
    
  });
DB_NAME === "" ?
  console.log("Using default DB") :
  console.log(`Using DB:${DB_NAME}`); db.useDatabase(DB_NAME);
db.useBasicAuth(DB_USERNAME, DB_PASSWORD);

module.exports = db;