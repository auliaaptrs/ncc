const express = require("express");
const app = express();
const dbconnection = require('./connection');

const PORT = 3000;
app.use(express.json());

app.get("/", (req, res) => {
    const htmlResponse = `
        <html>
            <head>
                <title>Homepage</title>
            </head>
            <body>
                <center>
                    <h1>HALO NCC!</h1>
                    <a href="/about">LETSGO!</a>
                </center>
            </body>
        </html>
    `;
    res.send(htmlResponse);
});

app.get("/about", (req, res) => {
    const htmlResponse = `
        <html>
            <head>
                <title>ABOUT</title>
            </head>
            <body>
                <h1>ABOUT</h1>
                <h3>Perkenalkan..</h3>
                <h3>Saya Aulia Putri Salsabila</h3>
                <h3>Asal Jakarta</h3>
                <h3>Angkatan 2022</h3>
                
            </body>
        </html>
    `;
    res.send(htmlResponse);
});


// GET data dari MySQL
app.get("/db-mysql", (req, res) => {
    const querySql = 'SELECT * FROM biodata';
    dbconnection.query(querySql, (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'There is an error', error: err });
        }
        res.status(200).json({ data: rows });
    });
});

// GET data by id dari MySQL
app.get("/db-mysql/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const querySql = `SELECT * FROM biodata WHERE id = ${id}`;
    dbconnection.query(querySql, (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'There is an error', error: err });
        }
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Data not found' });
        }
        res.status(200).json({ data: rows[0] });
    });
});

// Create new data di MySQL
app.post("/db-mysql", (req, res) => {
    const { id, Nama, Asal, Angkatan } = req.body;
    // Periksa apakah semua field yang dibutuhkan ada dalam body request
    if (!id || !Nama || !Asal || !Angkatan) {
        return res.status(400).json({ message: 'ID, Nama, asal, dan angkatan harus diisi' });
    }

    // Gunakan placeholder untuk mencegah serangan SQL injection
    const querySql = 'INSERT INTO biodata (id, Nama, Asal, Angkatan) VALUES (?, ?, ?, ?)';
    dbconnection.query(querySql, [id, Nama, Asal, Angkatan], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'There is an error', error: err });
        }
        res.status(201).json({ message: 'Data created successfully', data: { id, Nama, Asal, Angkatan } });
    });
});




// Update data by id di MySQL
app.put("/db-mysql/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { Nama, Asal, Angkatan } = req.body;
    // Validasi angka id
    if (isNaN(id)) {
        return res.status(400).json({ message: 'ID harus berupa angka' });
    }
    // Periksa apakah Nama, Asal, dan Angkatan ada dalam body request
    if (!Nama || !Asal || !Angkatan) {
        return res.status(400).json({ message: 'Nama, Asal, dan Angkatan harus diisi' });
    }
    // Gunakan placeholder untuk mencegah serangan SQL injection
    const querySql = 'UPDATE biodata SET Nama=?, Asal=?, Angkatan=? WHERE id=?';
    dbconnection.query(querySql, [Nama, Asal, Angkatan, id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'There is an error', error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Data not found' });
        }
        res.status(200).json({ message: 'Data updated successfully', data: { id, Nama, Asal, Angkatan } });
    });
});

// Delete data by id di MySQL
app.delete("/db-mysql/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const querySql = `DELETE FROM biodata WHERE id=${id}`;
    dbconnection.query(querySql, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'There is an error', error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Data not found' });
        }
        res.status(200).json({ message: 'Data deleted successfully' });
    });
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
