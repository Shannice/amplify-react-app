const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const express = require('express');
const bodyParser = require('body-parser');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');

const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

const bucketName = 'aws-conversation-agent-data-frankfurt';

// Generate pre-signed URL for upload
app.get('/upload', async (req, res) => {
  const objectKey = `recordings/${Date.now()}.webm`;
  const expirationTime = 3600; // 1 hour

  const uploadParams = {
    Bucket: bucketName,
    Key: objectKey,
    Expires: expirationTime,
    ContentType: 'audio/webm',
    ACL: 'bucket-owner-full-control',
  };

  try {
    const uploadURL = await s3.getSignedUrlPromise('putObject', uploadParams);
    res.json({ uploadURL, objectKey });
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    res.status(500).json({ error: 'Failed to generate pre-signed URL' });
  }
});

// List objects in the bucket
app.get('/list', async (req, res) => {
  const params = {
    Bucket: bucketName,
    Prefix: 'aca_summary/',
  };

  try {
    const data = await s3.listObjectsV2(params).promise();
    res.json(data.Contents);
  } catch (error) {
    console.error('Error listing objects:', error);
    res.status(500).json({ error: 'Failed to list objects' });
  }
});

// Get object content
app.get('/read/:key', async (req, res) => {
  const params = {
    Bucket: bucketName,
    Key: `aca_summary/${req.params.key}`,
  };

  try {
    const data = await s3.getObject(params).promise();
    res.json({ content: data.Body.toString('utf-8') });
  } catch (error) {
    console.error('Error reading object:', error);
    res.status(500).json({ error: 'Failed to read object' });
  }
});

app.listen(3000, function() {
  console.log("App started")
});

module.exports = app;