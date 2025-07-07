import express from 'express';
import pool from '../config/db.js';

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Get user profile by UID
router.get('/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const result = await pool.query('SELECT * FROM users WHERE uid = $1', [uid]);

    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });

    const user = result.rows[0];

    // Add full URL to avatar and coverImage if they exist
    if (user.avatar && !user.avatar.startsWith('http')) {
      user.avatar = `${process.env.BACKEND_URL}${user.avatar}`;
    }

   if (user.cover_image && !user.cover_image.startsWith('http')) {
  user.cover_image = `${process.env.BACKEND_URL}${user.cover_image}`;
}


    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create or update user profile
router.put('/:uid', async (req, res) => {
  const { uid } = req.params;
  const { email, name, username, bio, location, website, twitter, instagram } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO users (uid, email, name, username, bio, location, website, twitter, instagram)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (uid) DO UPDATE SET
         name = EXCLUDED.name,
         username = EXCLUDED.username,
         bio = EXCLUDED.bio,
         location = EXCLUDED.location,
         website = EXCLUDED.website,
         twitter = EXCLUDED.twitter,
         instagram = EXCLUDED.instagram,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [uid, email, name, username, bio, location, website, twitter, instagram]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload profile image (avatar/cover)
router.post('/upload-image', upload.single('file'), async (req, res) => {
  try {
    const { type, uid } = req.body;
    const file = req.file;

    const ext = path.extname(file.originalname);
    const newFileName = `${type}-${uuidv4()}${ext}`;
    const newPath = path.join('uploads', newFileName);
    fs.renameSync(file.path, newPath);

    const imageUrl = `/uploads/${newFileName}`;
    const column = type === 'avatar' ? 'avatar' : 'cover_image';

    await pool.query(`UPDATE users SET ${column} = $1, updated_at = CURRENT_TIMESTAMP WHERE uid = $2`, [
      imageUrl,
      uid,
    ]);

    res.json({ url: imageUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// create a new user

// Create user on signup (called from frontend after Firebase Auth)
router.post('/', async (req, res) => {
    console.log('Received request to create user:', req.body);
  const { uid, email, username } = req.body;

  if (!uid || !email || !username) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await pool.query(
      `INSERT INTO users (uid, email, username)
       VALUES ($1, $2, $3)
       ON CONFLICT (uid) DO NOTHING`,
      [uid, email, username]
    );
    res.status(201).json({ message: 'User created in DB' });
  } catch (err) {
    console.error('Error inserting user:', err);
    res.status(500).json({ error: 'Database error' });
  }
});



export default router;