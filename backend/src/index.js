const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const paymentsRouter = require('./routes/payments');
const subscriptionsRouter = require('./routes/subscriptions');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/luxe-accessories';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/subscriptions', subscriptionsRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Luxe Accessory Haven backend' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Luxe backend listening on http://localhost:${PORT}`);
});
