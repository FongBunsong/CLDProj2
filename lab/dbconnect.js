const AWS = require("aws-sdk");
require("dotenv").config();

AWS.config.update({
  region: "us-east-1", // Change according to your region
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY, 
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports = dynamoDB; 
