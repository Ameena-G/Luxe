const express = require('express');
const router = express.Router();
const { Subscriber } = require('../models');

// Subscribe to newsletter
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
    }

    // Check if email already exists
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return res.status(200).json({ 
        success: true, 
        message: 'You are already subscribed to our newsletter!',
        isAlreadySubscribed: true
      });
    }

    // Create new subscriber
    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    res.status(201).json({ 
      success: true, 
      message: 'Thank you for subscribing to our newsletter!',
      isAlreadySubscribed: false
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to subscribe. Please try again later.' 
    });
  }
});

module.exports = router;
