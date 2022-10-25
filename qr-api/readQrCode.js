const fs = require('fs');
const jsQR = require('jsqr');
const axios = require('axios');

const { getSync } = require('@andreekeberg/imagedata');

const getImageDataFromBuffer = getSync;

const readQrCodeFromBuffer = (buffer) => {
  const qrArray = getImageDataFromBuffer(buffer);
  const code = jsQR(qrArray.data, qrArray.width, qrArray.height);
  return code.data;
};

const readQrCodeFromFile = async (filePath) => {
  const qrcodeImage = fs.readFileSync(filePath, { encoding: 'base64' });
  const qrcodeBuffer = Buffer.from(qrcodeImage, 'base64');
  return readQrCodeFromBuffer(qrcodeBuffer);
};

const readQrCodeFromUrl = async (url) => {
  const response = await axios({ method: 'GET', url, responseType: 'arraybuffer' });
  const qrcodeBuffer = Buffer.from(response.data, 'binary');
  return readQrCodeFromBuffer(qrcodeBuffer);
};

module.exports = {
  readQrCodeFromFile,
  readQrCodeFromUrl,
};
