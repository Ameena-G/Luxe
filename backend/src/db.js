const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

function readJSON(filePath, defaultVal) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultVal || [], null, 2));
      return defaultVal || [];
    }
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('readJSON error:', err);
    return defaultVal || [];
  }
}

function writeJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('writeJSON error:', err);
  }
}

const productsFile = path.join(dataDir, 'products.json');
const ordersFile = path.join(dataDir, 'orders.json');

module.exports = {
  getProducts: () => readJSON(productsFile, []),
  saveProducts: (arr) => writeJSON(productsFile, arr),
  getOrders: () => readJSON(ordersFile, []),
  saveOrders: (arr) => writeJSON(ordersFile, arr),
};
