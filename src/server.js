const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors()); // Enable CORS for all requests
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the 'public' directory

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Define routes
app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

// Import and use contact routes
const contactRouter = require('./routes/contact');
app.use('/api', contactRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unexpected error:', err.message); // Log unexpected errors
    res.status(500).json({ error: 'Internal Server Error' }); // Respond with a 500 error
});




// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
