const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db'); // initialize db

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
const recommendationsRouter = require('./routes/recommendations');
app.use('/api/recommendations', recommendationsRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Wishlist Wizard Backend is running' });
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
