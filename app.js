const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the folder where images will be stored
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Create a unique filename
    }
});

const upload = multer({ storage });

// Connect to MySQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'studentsdb' // Replace with your database name
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database');
});

// CREATE a new post with image upload
app.post('/posts', upload.single('image'), (req, res) => {
    const { title, content, categoryId, userId } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; // Get the image URL

    db.query(
        'INSERT INTO posts (title, content, imageUrl, categoryId, userId) VALUES (?, ?, ?, ?, ?)',
        [title, content, imageUrl, categoryId, userId],
        (err, result) => {
            if (err) {
                res.status(500).json({ error: 'Failed to create post' });
            } else {
                res.status(201).json({ message: 'Post created successfully', postId: result.insertId });
            }
        }
    );
});

// READ all posts
app.get('/posts', (req, res) => {
    db.query('SELECT * FROM posts', (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Failed to retrieve posts' });
        } else {
            res.status(200).json(results);
        }
    });
});

// READ a single post by ID
app.get('/posts/:postId', (req, res) => {
    const postId = req.params.postId;
    db.query('SELECT * FROM posts WHERE postId = ?', [postId], (err, results) => {
        if (err || results.length === 0) {
            res.status(404).json({ error: 'Post not found' });
        } else {
            res.status(200).json(results[0]);
        }
    });
});

// UPDATE a post by ID
app.put('/posts/:postId', upload.single('image'), (req, res) => {
    const postId = req.params.postId;
    const { title, content, categoryId, userId } = req.body;
    let imageUrl = req.body.imageUrl; // Use existing image URL if no new image uploaded

    // If a new image is uploaded, update the imageUrl
    if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
    }

    db.query(
        'UPDATE posts SET title = ?, content = ?, imageUrl = ?, categoryId = ?, userId = ? WHERE postId = ?',
        [title, content, imageUrl, categoryId, userId, postId],
        (err, result) => {
            if (err || result.affectedRows === 0) {
                res.status(404).json({ error: 'Post not found or failed to update' });
            } else {
                res.status(200).json({ message: 'Post updated successfully' });
            }
        }
    );
});

// DELETE a post by ID
app.delete('/posts/:postId', (req, res) => {
    const postId = req.params.postId;
    db.query('DELETE FROM posts WHERE postId = ?', [postId], (err, result) => {
        if (err || result.affectedRows === 0) {
            res.status(404).json({ error: 'Post not found or failed to delete' });
        } else {
            res.status(200).json({ message: 'Post deleted successfully' });
        }
    });
});

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
