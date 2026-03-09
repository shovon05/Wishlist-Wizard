require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./config/db'); // initialize db

const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Test root route
app.get("/", (req, res) => {
  res.send("Wishlist Wizard API is running");
});

// Routes
const recommendationsRouter = require('./routes/recommendations');
app.use('/api/recommendations', recommendationsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Wishlist Wizard Backend is running'
  });
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});