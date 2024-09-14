import StockTransactions from '../models/StockTransactionModel.js';
import Products from '../models/ProductModel.js';

export const createStockTransaction = async (req, res) => {
  try {
    const { productId, quantity, type } = req.body; // Updated to use `type`

    console.log('Request body:', req.body);

    // Validate the request
    if (!productId || !quantity || !type) {
      return res.status(400).json({ msg: 'Product ID, quantity, and transaction type are required.' });
    }

    // Find the product by productId
    const product = await Products.findOne({ where: { uuid: productId } });
    if (!product) {
      return res.status(404).json({ msg: 'Product not found.' });
    }

    // Calculate new stock based on the transaction type
    let newStock;
    if (type === 'in') { // Updated to use `type`
      newStock = product.stock + quantity;
    } else if (type === 'out') { // Updated to use `type`
      newStock = product.stock - quantity;
      if (newStock < 0) {
        return res.status(400).json({ msg: 'Insufficient stock.' });
      }
    } else {
      return res.status(400).json({ msg: 'Invalid transaction type. Use "in" or "out".' });
    }

    // Update the product's stock
    await Products.update({ stock: newStock }, { where: { uuid: productId } });

    // Create a new stock transaction record
    await StockTransactions.create({
      productId,
      quantity,
      type, // Updated to use `type`
      date: new Date(),
    });

    res.status(201).json({ msg: 'Stock transaction created.' });
  } catch (error) {
    console.error('Error creating stock transaction:', error);
    res.status(500).json({ msg: 'Error creating stock transaction.', error: error.message });
  }
}; 

export const updateStockTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { productId, quantity, type } = req.body;

    console.log('Request body:', req.body);

    // Validate the request
    if (!productId || !quantity || !type) {
      return res.status(400).json({ msg: 'Product ID, quantity, and transaction type are required.' });
    }

    // Find the product and current stock transaction
    const product = await Products.findOne({ where: { uuid: productId } });
    const stockTransaction = await StockTransactions.findOne({ where: { uuid: id } });
    if (!product) {
      return res.status(404).json({ msg: 'Product not found.' });
    }
    if (!stockTransaction) {
      return res.status(404).json({ msg: 'Stock transaction not found.' });
    }

    // Calculate the adjustment needed
    const currentQuantity = stockTransaction.quantity;
    let newStock;
    if (type === 'in') {
      newStock = product.stock - (quantity - currentQuantity);
      if (newStock < 0) {
        return res.status(400).json({ msg: 'Insufficient stock.' });
      }
    } else if (type === 'out') {
      newStock = product.stock + (currentQuantity - quantity);
    } else {
      return res.status(400).json({ msg: 'Invalid transaction type. Use "in" or "out".' });
    }

    // Update the product's stock and the stock transaction
    await Products.update({ stock: newStock }, { where: { uuid: productId } });
    await StockTransactions.update({
      productId,
      quantity,
      type,
      date: new Date(),
    }, { where: { uuid: id } });

    res.status(200).json({ msg: 'Stock transaction updated.' });
  } catch (error) {
    console.error('Error updating stock transaction:', error);
    res.status(500).json({ msg: 'Error updating stock transaction.', error: error.message });
  }
};


export const getStockTransactions = async (req, res) => {
  try {
    const transactions = await StockTransactions.findAll({
      include: [{ model: Products, as: 'product' }]
    });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching stock transactions.', error: error.message });
  }
};

export const getStockTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await StockTransactions.findOne({
      where: { uuid: id },
      include: [{ model: Products, as: 'product' }]
    });
    if (!transaction) {
      return res.status(404).json({ msg: 'Stock transaction not found.' });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching stock transaction.', error: error.message });
  }
}

export const deleteStockTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await StockTransactions.findOne({ where: { uuid: id } });
    if (!transaction) {
      return res.status(404).json({ msg: 'Stock transaction not found.' });
    }

    // Find the product associated with the transaction
    const product = await Products.findOne({ where: { uuid: transaction.productId } });
    if (!product) {
      return res.status(404).json({ msg: 'Product not found.' });
    }

    // Adjust the stock based on the type of transaction
    let newStock;
    if (transaction.type === 'in') {
      newStock = product.stock - transaction.quantity;
    } else if (transaction.type === 'out') {
      newStock = product.stock + transaction.quantity;
    } else {
      return res.status(400).json({ msg: 'Invalid transaction type.' });
    }

    // Update the product's stock and delete the transaction
    await Products.update({ stock: newStock }, { where: { uuid: transaction.productId } });
    await StockTransactions.destroy({ where: { uuid: id } });

    res.status(200).json({ msg: 'Stock transaction deleted.' });
  } catch (error) {
    res.status(500).json({ msg: 'Error deleting stock transaction.', error: error.message });
  }
};
 
