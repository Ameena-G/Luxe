const express = require('express');
const router = express.Router();
const { Product } = require('../models');

// backend/src/routes/products.js
router.get('/', async (req, res) => {
  try {
    console.log('Received request with query:', req.query);
    const { category, search } = req.query;
    let filter = {};
    let searchResults = null;
    
    // Handle category filtering
    if (category === 'new-arrivals') {
      filter.isNew = true;
    } else if (category) {
      filter.category = category;
    }
    
    // Add search functionality
    if (search && search.trim() !== '') {
      const searchTerm = search.trim();
      console.log('Searching for:', searchTerm);
      const searchRegex = new RegExp(searchTerm, 'i');
      const searchFilter = {
        ...filter,
        $or: [
          { title: { $regex: searchRegex } },
          { brand: { $regex: searchRegex } },
          { description: { $regex: searchRegex } }
        ]
      };
      
      console.log('Search MongoDB filter:', JSON.stringify(searchFilter, null, 2));
      searchResults = await Product.find(searchFilter).lean();
      console.log(`Found ${searchResults.length} products matching search`);
      
      // If no exact matches found, get similar products by category
      if (searchResults.length === 0) {
        console.log('No exact matches found, fetching similar products...');
        // Try to extract category from title or brand search
        const similarFilter = {};
        
        // Get products from all categories as fallback
        const allCategoryProducts = await Product.find({}).lean();
        
        // If we had a category filter, prioritize those
        if (category && category !== 'new-arrivals') {
          filter.category = category;
          searchResults = await Product.find(filter).limit(10).lean();
        } else {
          searchResults = allCategoryProducts.slice(0, 10);
        }
        console.log(`Returning ${searchResults.length} similar products`);
      }
      
      return res.json(searchResults);
    }
    
    console.log('Final MongoDB filter:', JSON.stringify(filter, null, 2));
    
    const products = await Product.find(filter).lean();
    console.log(`Found ${products.length} products`);
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch products',
      message: err.message 
    });
  }
});

// GET single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// GET products by category
router.get('/category/:category', async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category });
    res.json(products);
  } catch (err) {
    console.error('Error fetching products by category:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

module.exports = router;
