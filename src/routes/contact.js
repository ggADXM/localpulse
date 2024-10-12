const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
require('dotenv').config(); // Load environment variables from .env

// Helper function to encode data
function encodeData(data) {
    return Buffer.from(data).toString('base64');
}

// Helper function to decode data
function decodeData(data) {
    return Buffer.from(data, 'base64').toString('utf-8');
}

// POST route for contact form submissions (same as before)
router.post('/contact', (req, res) => {
    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    // Encode and log the form data
    const logEntry = `Name: ${name}\nEmail: ${email}\nMessage: ${message}\n-------------------\n`;
    const encodedLogEntry = encodeData(logEntry);

    const logFilePath = path.join(__dirname, '..', 'logs', 'contact_submissions.txt');

    fs.appendFile(logFilePath, encodedLogEntry + '\n', (err) => {
        if (err) {
            console.error('Error logging form submission:', err);
            return res.status(500).json({ error: 'Internal Server Error. Please try again later.' });
        }

        console.log('Form submission logged and encoded successfully.');
        return res.status(200).json({ message: 'Message logged and encoded successfully!' });
    });
});

// GET route to decode and view the log file contents, password-protected
router.get('/view-submissions', (req, res) => {
    const userPassword = req.query.password;

    // Check if the correct password is provided via query string
    if (userPassword !== process.env.DECODE_PASSWORD) {
        return res.status(401).json({ error: 'Unauthorized. Incorrect password.' });
    }

    const logFilePath = path.join(__dirname, '..', 'logs', 'contact_submissions.txt');

    // Read the log file
    fs.readFile(logFilePath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading log file:', err);
            return res.status(500).json({ error: 'Internal Server Error. Please try again later.' });
        }

        // Decode each entry and join them into a readable string
        const decodedEntries = data.split('\n').map(entry => decodeData(entry)).join('\n');
        
        // Display the decoded entries
        res.send(`<pre>${decodedEntries}</pre>`);
    });
});

module.exports = router;
