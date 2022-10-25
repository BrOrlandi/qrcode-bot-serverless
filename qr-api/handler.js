const serverless = require('serverless-http');
const express = require('express');
const os = require('os');
const multer = require('multer');

const { readQrCodeFromFile, readQrCodeFromUrl } = require('./readQrCode');

const app = express();
const upload = multer({ dest: os.tmpdir() });

app.get('/', (req, res) => res.status(200).json({
  message: 'Hello from QR Code decode API, call /upload and send a multipart/form-data header with `file` param! Or just send an URL to /decode?url=<url here>',
}));

app.post('/upload', upload.single('file'), async (req, res) => {
  const { file } = req;

  console.log('FILE UPLOADED');
  console.log(file);
  try {
    const qrCodeResult = await readQrCodeFromFile(file.path);
    console.log('QR CODE RESULT:');
    console.log(qrCodeResult);

    res.status(200).json({
      result: qrCodeResult,
    });
  } catch (error) {
    console.log('ERROR');
    console.log(error);
    res.status(400).json({
      error: `No QR Code found on file: ${file.originalname}`,
    });
  }
});

app.get('/decode', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    res.status(400).json({
      error: 'Error: Missing url in query params.',
    });
    return;
  }

  console.log('FILE URL:');
  console.log(url);

  try {
    const qrCodeResult = await readQrCodeFromUrl(url);
    console.log('QR CODE RESULT:');
    console.log(qrCodeResult);

    res.status(200).json({
      result: qrCodeResult,
    });
    return;
  } catch (error) {
    console.log('ERROR');
    console.log(error);
    res.status(400).json({
      error: `Error processing file URL: ${url}`,
    });
  }
});

app.use((req, res) => res.status(404).json({
  error: 'Not Found',
}));

module.exports.handler = serverless(app);

if (process.env.NODE_ENV === 'development') {
  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
}
