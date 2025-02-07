const express = require("express");
const AWS = require("aws-sdk");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// AWS DynamoDB Configuration (IAM Role)
AWS.config.update({ region: "us-east-1" });

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "Students";

// Student Registration (POST)
app.post("/register", (req, res) => {
    const { sid, sname, semail, spass } = req.body;
    if (!sid || !sname || !semail || !spass) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const params = {
        TableName: TABLE_NAME,
        Item: { sid, sname, semail, spass }
    };

    dynamoDB.put(params, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Student registered", sid });
    });
});

// Student Login (POST) – Simple Check
app.post("/login", (req, res) => {
    const { sid, spass } = req.body;
    if (!sid || !spass) {
        return res.status(400).json({ error: "Student ID and Password are required" });
    }

    const params = { TableName: TABLE_NAME, Key: { sid } };
    dynamoDB.get(params, (err, data) => {
        if (err || !data.Item) return res.status(400).json({ error: "Student not found" });
        if (data.Item.spass !== spass) return res.status(401).json({ error: "Incorrect password" });

        res.json({ message: "Login successful", student: data.Item });
    });
});

// Student Search (GET)
app.get("/search/:sid", (req, res) => {
    const params = { TableName: TABLE_NAME, Key: { sid: req.params.sid } };

    dynamoDB.get(params, (err, data) => {
        if (err || !data.Item) return res.status(404).json({ error: "Student not found" });
        res.json(data.Item);
    });
});

// Student Profile Update (PUT)
app.put("/update", (req, res) => {
    const { sid, sname, semail } = req.body;
    if (!sid || !sname || !semail) {
        return res.status(400).json({ error: "Student ID, Name, and Email are required" });
    }

    const params = {
        TableName: TABLE_NAME,
        Key: { sid },
        UpdateExpression: "set sname = :n, semail = :e",
        ExpressionAttributeValues: { ":n": sname, ":e": semail }
    };

    dynamoDB.update(params, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Profile updated" });
    });
});

// Delete Student (DELETE)
app.delete("/delete/:sid", (req, res) => {
    const params = { TableName: TABLE_NAME, Key: { sid: req.params.sid } };

    dynamoDB.delete(params, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Student deleted" });
    });
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
