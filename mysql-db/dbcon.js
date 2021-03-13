const mysql = require("mysql2")
const pool = mysql.createPool({host:'172.25.33.141', user: 'mme',password:'mme', database: 'mme2_KPI'});
module.exports = pool.promise();