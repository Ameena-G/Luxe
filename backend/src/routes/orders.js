const express = require('express');
const router = express.Router();
const { Product, Order } = require('../models');

router.post('/', async (req, res) => {
  try {
    const { items, customer, address, paymentMethod } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must include items' });
    }

    let total = 0;
    const lineItems = [];
    for (const it of items) {
      const prod = await Product.findById(it.id);
      if (!prod) throw new Error('Product not found: ' + it.id);
      const qty = Number(it.quantity) || 1;
      total += prod.price * qty;
      lineItems.push({
        id: prod._id,
        title: prod.title,
        price: prod.price,
        quantity: qty,
      });
    }

    const order = new Order({
      items: lineItems,
      customer: customer || null,
      address: address || null,
      paymentMethod: paymentMethod || null,
      total,
      status: 'created',
    });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error('create order error', err);
    res.status(400).json({ error: err.message || 'Could not create order' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error('Error fetching order:', err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

module.exports = router;
