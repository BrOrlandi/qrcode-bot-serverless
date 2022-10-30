require('dotenv');
const AWS = require('aws-sdk');
const express = require('express');
const serverless = require('serverless-http');
const QRCode = require('qrcode');
const fs = require('fs');
const os = require('os');

const app = express();

const { USERS_TABLE } = process.env;
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

app.use(express.json());

app.get('/users/:userId', async (req, res) => {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: req.params.userId,
    },
  };

  try {
    const { Item } = await dynamoDbClient.get(params).promise();
    if (Item) {
      const { userId, name } = Item;
      res.json({ userId, name });
    } else {
      res
        .status(404)
        .json({ error: 'Could not find user with provided "userId"' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Could not retreive user' });
  }
});

app.post('/users', async (req, res) => {
  const { userId, name } = req.body;
  if (typeof userId !== 'string') {
    res.status(400).json({ error: '"userId" must be a string' });
  } else if (typeof name !== 'string') {
    res.status(400).json({ error: '"name" must be a string' });
  }

  const params = {
    TableName: USERS_TABLE,
    Item: {
      userId,
      name,
    },
  };

  try {
    await dynamoDbClient.put(params).promise();
    res.json({ userId, name });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Could not create user' });
  }
});

app.post('/generate-qr-code', async (req, res) => {
  const { content } = req.body;
  if (typeof content !== 'string') {
    res.status(400).json({ error: '\'content\' must be a string' });
    return;
  }

  const filePath = `${os.tmpdir()}/qrcode-${Date.now()}.png`;
  await QRCode.toFile(filePath, content, {
    margin: 1,
  });

  const contents = fs.readFileSync(filePath, { encoding: 'base64' });
  res.json({ result: contents });
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
