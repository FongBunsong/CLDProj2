const studentSchema = {
    TableName: "Students",
    KeySchema: [{ AttributeName: "sid", KeyType: "HASH" }],
    AttributeDefinitions: [{ AttributeName: "sid", AttributeType: "S" }],
    ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
  };
  
  module.exports = studentSchema;
  

