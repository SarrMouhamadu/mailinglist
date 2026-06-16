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
app.post('/api/pre-orders', async (req, res) => {
  const { 
    fullName, 
    whatsapp, 
    package, 
    vehicleCount, 
    vehicleTypes, 
    startType, 
    startDate, 
    source 
  } = req.body;
  
  try {
    const text = `
      INSERT INTO pre_orders 
      (full_name, whatsapp, package, vehicle_count, vehicle_types, start_type, start_date, source)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const values = [
      fullName, 
      whatsapp, 
      package, 
      vehicleCount, 
      JSON.stringify(vehicleTypes), 
      startType, 
      startDate || null, 
      source || 'KAI_SUMMIT_2026'
    ];
    
    const result = await db.query(text, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting pre-order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/pre-orders', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM pre_orders ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching pre-orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});
