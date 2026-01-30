const express = require('express');
const router = express.Router();
const { Order } = require('../models');
const axios = require('axios');

const CASHFREE_API_URL = 'https://sandbox.cashfree.com/pg';
const APP_ID = process.env.CASHFREE_APP_ID;
const SECRET_KEY = process.env.CASHFREE_SECRET_KEY;

// Generate unique order ID
function generateOrderId() {
  return 'ORD_' + Date.now().toString();
}

/**
 * CREATE PAYMENT ORDER
 */
router.post('/create-order', async (req, res) => {
  try {
    const { items, customer, address, email, phone } = req.body;

    // Validate items
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must include items' });
    }

    // Validate Cashfree credentials
    if (!APP_ID || !SECRET_KEY) {
      console.error('Missing Cashfree credentials');
      return res.status(500).json({
        error: 'Payment gateway not configured'
      });
    }

    // Calculate total
    let total = 0;
    for (const item of items) {
      const qty = Number(item.quantity) || 1;
      total += Number(item.price) * qty;
    }

    // Add 10% tax
    const tax = total * 0.1;
    const grandTotal = Math.round((total + tax) * 100) / 100;

    const orderId = generateOrderId();

    // Save order in DB
    const order = new Order({
      orderId,
      items,
      customer,
      email,
      phone,
      address,
      paymentMethod: 'cashfree',
      total: grandTotal,
      status: 'pending'
    });

    await order.save();

    console.log('Order saved:', orderId);

    // Prepare Cashfree request
    const cashfreeRequest = {
      order_id: orderId,
      order_amount: grandTotal,
      order_currency: 'INR',
      customer_details: {
        customer_id: `CUST_${Date.now()}`,
        customer_email: email || 'test@example.com',
        customer_phone: phone || '9000000000'
      },
      order_meta: {
        return_url: `http://localhost:8080/?view=payment-success&order_id=${orderId}`
      }
    };

    // Call Cashfree API
    const response = await axios.post(
      `${CASHFREE_API_URL}/orders`,
      cashfreeRequest,
      {
        headers: {
          'x-api-version': '2023-08-01',
          'x-client-id': APP_ID,
          'x-client-secret': SECRET_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Cashfree response:', response.data);

    // 🔴 IMPORTANT FIX:
    // Return EXACT key name expected by Cashfree SDK
    res.json({
      success: true,
      orderId,
      payment_session_id: response.data.payment_session_id
    });

  } catch (err) {
    console.error('Create order error:', err.response?.data || err.message);

    res.status(400).json({
      error: err.response?.data?.message || 'Failed to create payment order'
    });
  }
});

/**
 * VERIFY PAYMENT (OPTIONAL MANUAL CHECK)
 */
router.post('/verify-payment', async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'Order ID required' });
    }

    const dbOrder = await Order.findOne({ orderId });
    if (!dbOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const response = await axios.get(
      `${CASHFREE_API_URL}/orders/${orderId}`,
      {
        headers: {
          'x-api-version': '2023-08-01',
          'x-client-id': APP_ID,
          'x-client-secret': SECRET_KEY
        }
      }
    );

    const status = response.data.order_status;

    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      {
        status: status === 'PAID' ? 'completed' : 'failed',
        paymentId: response.data.cf_payment_id
      },
      { new: true }
    );

    res.json({
      success: status === 'PAID',
      status,
      order: updatedOrder
    });

  } catch (err) {
    console.error('Verify payment error:', err.response?.data || err.message);

    res.status(400).json({
      error: err.response?.data?.message || 'Payment verification failed'
    });
  }
});

/**
 * CASHFREE WEBHOOK (FOR REAL-TIME STATUS)
 */
router.post('/webhook', async (req, res) => {
  try {
    const { order_id, payment_status } = req.body;

    await Order.findOneAndUpdate(
      { orderId: order_id },
      { status: payment_status === 'SUCCESS' ? 'completed' : 'failed' }
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Webhook error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
