export {};
const mysql = require("mysql2");
let db;
try {
    db = mysql.createConnection({
    host: '127.0.0.1',
    port:'3306',
    user:'root',
    password: 'jy122385@',
    database:'gamemanager'
});
} catch (err) {
    console.error(err);
}
module.exports = db;