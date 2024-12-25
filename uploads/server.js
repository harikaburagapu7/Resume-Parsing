const express = require('express');
const multer = require('multer');
const pdf = require('pdf-parse');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// Serve static files from the public directory
app.use(express.static('public'));

// Endpoint to handle file upload
app.post('/upload', upload.single('resumeFile'), (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.file.filename);

    // Read the PDF file
    pdf(req.file.buffer).then(data => {
        res.json({
            similarity_score: Math.random(), // Replace with actual similarity score calculation
            extracted_text: data.text
        });
    }).catch(err => {
        res.status(500).json({ error: 'Failed to parse PDF' });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
