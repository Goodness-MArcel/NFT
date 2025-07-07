import express from 'express';
import pool from '../config/db.js';

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Upload NFT
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, description, price, category, owner, ownerEmail } = req.body;
    const file = req.file;

    const ext = path.extname(file.originalname);
    const newFileName = `${uuidv4()}${ext}`;
    const newPath = path.join('uploads', newFileName);
    fs.renameSync(file.path, newPath);

    const imageUrl = `/uploads/${newFileName}`;
    const imagePath = newPath;
    const fileSize = file.size;

    // Get user id (foreign key)
    const userResult = await pool.query('SELECT id FROM users WHERE uid = $1', [owner]);
    const owner_id = userResult.rows[0]?.id;

    const result = await pool.query(
      `INSERT INTO nfts (id, title, description, image_url, image_path, price, category, status, file_size, owner_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [
        uuidv4(),
        title,
        description,
        imageUrl,
        imagePath,
        price,
        category || 'Art',
        'Listed',
        fileSize,
        owner_id,
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's NFTs
router.get('/', async (req, res) => {
  const { owner } = req.query;
  try {
    const result = await pool.query(
      `SELECT n.*, u.username FROM nfts n 
       JOIN users u ON n.owner_id = u.id 
       WHERE u.uid = $1 
       ORDER BY n.created_at DESC`,
      [owner]
    );

    // Add backend domain to image path if needed
    const nftsWithFullImageUrl = result.rows.map(nft => {
      if (nft.image_url && !nft.image_url.startsWith('http')) {
        nft.image_url = `${process.env.BACKEND_URL}${nft.image_url}`;
      }
      return nft;
    });

    res.json(nftsWithFullImageUrl);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
