const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 5005;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Schema for File model
const fileSchema = new mongoose.Schema({
  title: String,
  filename: String,
  subtitle: String,
  review: String
});
const File = mongoose.model('File', fileSchema);

// Use the cors middleware
app.use(cors());

// API endpoint to get the last entry from the database
app.get('/api/last-entry', async (req, res) => {
  try {
    const lastEntry = await File.findOne().sort({ _id: -1 });
    res.json(lastEntry);
  } catch (error) {
    console.error('Error fetching last entry: ', error);
    res.status(500).json({ error: 'Failed to fetch last entry' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
