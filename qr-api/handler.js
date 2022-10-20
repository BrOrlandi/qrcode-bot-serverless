const serverless = require('serverless-http');
const express = require('express');
const os = require('os');
const multer = require('multer');

const readQrCode = require('./readQrCode');

const app = express();
const upload = multer({ dest: os.tmpdir() });

app.get('/', (req, res) => res.status(200).json({
  message: 'Hello from root!',
}));

app.post('/upload', upload.single('file'), async (req, res) => {
  const { file } = req;

  console.log(file);
  try {
    const qrCodeResult = await readQrCode(file);
    console.log(qrCodeResult);

    res.status(200).json({
      result: qrCodeResult,
    });
  } catch (error) {
    console.log(error);
  }
});

app.use((req, res) => res.status(404).json({
  error: 'Not Found',
}));

module.exports.handler = serverless(app);

// app.listen(3000, () => {
//   console.log('Listening on port 3000');
// });
