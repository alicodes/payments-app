const express = require('express');
const path = require('path');

const app = express();

// Serve static files from the Angular dist directory
app.use(express.static(path.join(__dirname, './dist/client/browser/index.html')));

// Redirect all requests to the Angular index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './dist/client/browser/index.html'));
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});