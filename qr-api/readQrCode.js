const fs = require('fs');
const jsQR = require('jsqr');

const { getSync } = require('@andreekeberg/imagedata');

const getImageDataFromBuffer = getSync;

const readQrCode = async (file) => {
  const qrcodeImage = fs.readFileSync(file.path, { encoding: 'base64' });
  const qrcodeBuffer = Buffer.from(qrcodeImage, 'base64');
  const qrArray = getImageDataFromBuffer(qrcodeBuffer);
  const code = jsQR(qrArray.data, qrArray.width, qrArray.height);
  return code.data;
};

module.exports = readQrCode;
