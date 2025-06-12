require('dotenv').config();
const express = require('express');
const multer = require('multer');
const CryptoJS = require('crypto-js');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Setup upload folder
const upload = multer({ dest: 'uploads/' });
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
if (!fs.existsSync('encrypted')) fs.mkdirSync('encrypted');

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Enkripsi endpoint
app.post('/encrypt', upload.single('file'), (req, res) => {
  try {
    const fileBuffer = fs.readFileSync(req.file.path);
    const encrypted = CryptoJS.AES.encrypt(
      fileBuffer.toString('base64'),
      process.env.SECRET_KEY
    ).toString();

    const encryptedPath = `encrypted/${req.file.originalname}.enc`;
    fs.writeFileSync(encryptedPath, encrypted);

    fs.unlinkSync(req.file.path); // Hapus file original

    res.json({ 
      success: true,
      encryptedFile: encryptedPath 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deskripsi endpoint
app.post('/decrypt', express.text(), (req, res) => {
  try {
    const bytes = CryptoJS.AES.decrypt(req.body, process.env.SECRET_KEY);
    const decrypted = Buffer.from(bytes.toString(CryptoJS.enc.Utf8), 'base64');

    res.setHeader('Content-Type', 'application/octet-stream');
    res.send(decrypted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});