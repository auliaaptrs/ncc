const express = require("express");
const app = express();
const dbconnection = require('./connection');

const PORT = 3000;
// Middleware untuk mem-parsing body request
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello Camin-Camin NCC!");
});

app.get("/page1", (req, res) => {
    res.send("Hello from page 1");
});

app.get("/page2", (req, res) => {
    res.send("Hello from page 2");
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
    const { nama, asal, angkatan } = req.body;
    const querySql = `INSERT INTO biodata (nama, asal, angkatan) VALUES ('${nama}', '${asal}', ${angkatan})`;
    dbconnection.query(querySql, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'There is an error', error: err });
        }
        res.status(201).json({ message: 'Data created successfully', data: { id: result.insertId, nama, asal, angkatan } });
    });
});

// Update data by id di MySQL
app.put("/db-mysql/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { nama, asal, angkatan } = req.body;
    const querySql = `UPDATE biodata SET nama='${nama}', asal='${asal}', angkatan=${angkatan} WHERE id=${id}`;
    dbconnection.query(querySql, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'There is an error', error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Data not found' });
        }
        res.status(200).json({ message: 'Data updated successfully', data: { id, nama, asal, angkatan } });
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
