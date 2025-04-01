const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files from root directory
app.use(express.static('.'));

// Handle all routes by serving index.html
app.get('*', (req, res) => {
    res.sendFile('index.html', { root: '.' });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});