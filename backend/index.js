require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/api/visitors', async (req, res) => {
  const { first_name, last_name, email, phone, whatsapp, organization, position, profile } = req.body;
  
  try {
    const text = `
      INSERT INTO visitors (first_name, last_name, email, phone, whatsapp, organization, position, profile)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const values = [
      first_name, 
      last_name, 
      email || null, 
      phone || null, 
      whatsapp || null, 
      organization || null, 
      position || null, 
      profile || null
    ];
    
    const result = await db.query(text, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting visitor:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/visitors', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM visitors ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching visitors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});
