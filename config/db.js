require('dotenv').config();
const mysql = require('mysql2/promise');

async function dbConnection() {
return await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'employee_db'
})
}

module.exports = dbConnection;