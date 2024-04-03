const {createPool} = require('mysql');

// buat konfigurasi koneksi
const pool = createPool({
    host: 'localhost', //127.0.0.1
    user: 'root',
    password: '',
    database: 'testapi',
    connectionLimit: 10
});

module.exports = pool;
