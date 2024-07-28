const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS

// Set up multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Test route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use(cors());
// Remove background route
app.post('/remove-bg', upload.single('image_file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const formData = new FormData();
    formData.append('size', 'auto');
    formData.append('image_file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
      headers: {
        'X-Api-Key': process.env.REMOVE_BG_API_KEY,
        ...formData.getHeaders()
      },
      responseType: 'arraybuffer'
    });

    if (response.status === 200) {
      res.set('Content-Type', 'image/png');
      res.send(response.data);
    } else {
      res.status(response.status).send(response.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while processing the image.');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
