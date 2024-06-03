const express = require('express');
const multer = require('multer');
const path = require('path');
const { analyzeRecording } = require('./utils/aiAnalysis');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to handle file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Define a route for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Define your API route for analyzing recordings
app.post('/api/analyze', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const result = await analyzeRecording(req.file);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error analyzing recording:', error);
    res.status(500).json({ error: 'Failed to analyze the recording' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
