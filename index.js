const express = require("express");
const app = express();
const dbconnection = require('./connection');

const PORT = 3000;
app.use(express.json());

app.get('/', (req, res) => {
    const data = {
      "Nama Toko": "TOKO SEMBAKO SINAR JAYA",
      "Pemilik": "AULIA PUTRI SALSABILA",
      "Nomor Telpon": "5025221281",
      "Cabang": "ITS SURABAYA",
    };
    res.json(data);
  });

app.get("/about", (req, res) => {
    const htmlResponse = `
        <html>
            <head>
                <title>ABOUT</title>
            </head>
            <body>
            <center>
                <h1>ABOUT</h1>
                <h3>TOKO SEMBAKO SINAR JAYA</h3>
                <p>Toko Sembako Sinar Jaya menyediakan berbagai macam kebutuhan pokok dan keperluan rumah tangga sejak tahun 1945.</p>
                <p>Toko ini didirikan oleh Ibu Aulia dan saat ini telah berkembang menjadi toko sembako terkemuka di wilayah sekitar.</p>
                <p>Kami menjual berbagai jenis produk sembako seperti beras, gula, minyak goreng, tepung, serta barang-barang kebutuhan rumah tangga lainnya.</p>
                <p>Saat ini, Toko Sembako Sinar Jaya memiliki 5 cabang yang tersebar di berbagai lokasi strategis di kota Besar.</p>
                <p>Dapatkan lebih banyak kemudahan melalui website resmi kami untuk mengecek ketersediaan produk yang berkualitas!</p>
            <center>
            </body>
        </html>
    `;
    res.send(htmlResponse);
});



// GET data dari MySQL
app.get("/db-mysql", (req, res) => {
    const querySql = 'SELECT *, IF(tersedia = 1, "True", "False") AS tersedia FROM produk';
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
    const querySql = `SELECT *, IF(tersedia = 1, "True", "False") AS tersedia FROM produk WHERE id = ${id}`;
    dbconnection.query(querySql, (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'There is an error', error: err });
        }
        if (rows.length === 0) {
            return res.status(404).json({
                "errors": {
                  "id": [
                    "Tidak ditemukan. Pastikan id yang anda masukkan benar!"
                  ]
                }
              }
              );
        }
        res.status(200).json({ data: rows[0] });
    });
});

// Create new data di MySQL
app.post("/db-mysql", (req, res) => {
    const { id, nama, harga, tersedia, stok, deskripsi } = req.body;

    const errors = {};
    if (!id) {
        errors.id = ['Data belum diisi'];
    }
    if (!nama) {
        errors.nama = ['Data belum diisi'];
    }
    if (!harga) {
        errors.harga = ['Data belum diisi'];
    }
    if (!tersedia) {
        errors.tersedia = ['Data belum diisi'];
    }
    if (!stok) {
        errors.stok = ['Data belum diisi'];
    }
    if (!deskripsi) {
        errors.deskripsi = ['Data belum diisi'];
    }

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
    }


    const querySql = 'INSERT INTO produk (id, nama, harga, tersedia, stok, deskripsi) VALUES (?, ?, ?, ?, ?, ?)';
    dbconnection.query(querySql, [id, nama, harga, tersedia, stok, deskripsi], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'There is an error', error: err });
        }
        res.status(201).json({ message: 'Data created successfully', data: { id, nama, harga, tersedia: tersedia ? "True" : "False", stok, deskripsi } });
    });
});

// Update data by id di MySQL
app.put("/db-mysql/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { nama, harga, tersedia, stok, deskripsi } = req.body;
    
    // Validasi angka id
    if (isNaN(id)) {
        return res.status(400).json({ message: 'id harus berupa angka' });
    }
    
    // Validasi apakah setiap field sudah diisi
    const errors = {};
    if (!nama) {
        errors.nama = ["Data belum diisi"];
    }
    if (!harga) {
        errors.harga = ["Data belum diisi"];
    }
    if (tersedia === undefined) {
        errors.tersedia = ["Data belum diisi"];
    }
    if (!stok) {
        errors.stok = ["Data belum diisi"];
    }
    if (!deskripsi) {
        errors.deskripsi = ["Data belum diisi"];
    }
    
    // Jika terdapat error, kembalikan respons dengan format yang sesuai
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
    }

    // Gunakan placeholder untuk mencegah serangan SQL injection
    const querySql = 'UPDATE produk SET nama=?, harga=?, tersedia=?, stok=?, deskripsi=? WHERE id=?';
    dbconnection.query(querySql, [nama, harga, tersedia, stok, deskripsi, id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'There is an error', error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({
                "errors": {
                  "id": [
                    "Tidak ditemukan. Pastikan id yang anda masukkan benar!"
                  ]
                }
              });
        }
        res.status(200).json({ message: 'Data updated successfully', data: { id, nama, harga, tersedia: tersedia ? "True" : "False", stok, deskripsi } });
    });
});


// Delete data by id di MySQL
app.delete("/db-mysql/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const querySql = `DELETE FROM produk WHERE id=${id}`;
    dbconnection.query(querySql, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'There is an error', error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({
                "errors": {
                  "id": [
                    "Tidak ditemukan. Pastikan id yang anda masukkan benar!"
                  ]
                }
              });
        }
        res.status(200).json({ message: 'Data deleted successfully' });
    });
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
