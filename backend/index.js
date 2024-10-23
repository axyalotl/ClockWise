const app = require('./app'); // Import the app from app.js

// Use the PORT from .env, defaulting to 3003 if not specified
const PORT = process.env.PORT || 3003;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});