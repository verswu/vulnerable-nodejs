'use strict';

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
require('dotenv').config()
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
//const bodyParser = require('body-parser');

const PORT = 8080;

//App
const app = express();
app.use(favicon(__dirname + '/assets/favicon.ico'));
app.use("/static", express.static('./static/'));
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/static/index.html'));
});

app.post('/send-messages', (req, res, callback) => {
    const phoneNumbers = req.body.recipients.split(',').map((x) => x.trim());
    const { message, passcode } = req.body;
    if (passcode !== process.env.PASSCODE) {
        res.statusMessage = 'Invalid passcode';
        res.status(401).end();
        return callback(null, {});
    } else {
        const allMessageRequests = phoneNumbers.map((to) => {
            return client.messages
                .create({
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to,
                    body: message,
                })
                .then((msg) => {
                    res.statusMessage = 'SMS sent';
                    res.status(200).end();
                    return { success: true, sid: msg.sid };
                })
                .catch((err) => {
                    return { success: false, error: err.message };
                })
        });
        Promise.all(allMessageRequests)
            .then((result) => {
                return callback(null, { result });
            })
            .catch((err) => {
                console.error(err);
                return callback('Failed to fetch messages');
            });
    }
});

app.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}/`);
});

