const express = require('express');
const router = express.Router();
const menuItem = require('./../models/menu');

// POST method to add menu item
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const newMenu = new menuItem(data);
    const response = await newMenu.save();
    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET method to get all menu items
router.get('/', async (req, res) => {
  try {
    const data = await menuItem.find();
    console.log('Data fetched successfully');
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Parameterized route to get menu items by taste type
router.get('/:tasteType', async (req, res) => {
  try {
    const tasteType = req.params.tasteType;

    if (['sweet', 'spicy', 'sour'].includes(tasteType)) {
      const response = await menuItem.find({ taste: tasteType });
      console.log('Response fetched');
      res.status(200).json(response);
    } else {
      res.status(400).json({ error: 'Invalid taste type' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
