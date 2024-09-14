import { Order, OrderItem, Products } from "../models/index.js";
import db from "../config/Database.js";
// Create Order
export const createOrder = async (req, res) => {
  const { userId, items } = req.body; // Expecting items to be an array of { productId, quantity }
  const t = await db.transaction(); // Start a transaction

  try {
    // Check each item's stock from Products model
    for (const item of items) {
      const product = await Products.findOne({ where: { uuid: item.productId } });

      if (!product) {
        return res.status(404).json({ message: `Product with id ${item.productId} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for product: ${product.name}` });
      }
    }

    // Create the order
    const newOrder = await Order.create({
      userId,
      date: new Date(),
    }, { transaction: t });

    // Create order items and adjust product stock
    for (const item of items) {
      await OrderItem.create({
        orderId: newOrder.uuid,
        productId: item.productId,
        quantity: item.quantity
      }, { transaction: t });

      // Deduct the stock after validating
      const product = await Products.findOne({ where: { uuid: item.productId } });
      product.stock -= item.quantity;
      await product.save({ transaction: t });
    }

    // Commit the transaction if everything is successful
    await t.commit();

    res.status(201).json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    // Rollback the transaction in case of error
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
};

// Get Order by ID
export const getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findOne({
      where: { uuid: id },
      include: OrderItem
    });

    if (!order) {
      return res.status(404).json({ message: `Order with id ${id} not found` });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get order", error: error.message });
  }
};

// Get All Orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: OrderItem
    });

    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get orders", error: error.message });
  }
};

// Update Order by ID
export const updateOrder = async (req, res) => {
  const { id } = req.params; // Order UUID
  const { items } = req.body; // Expecting items to be an array of { productId, quantity }
  const t = await db.transaction(); // Start a transaction

  try {
    // Find the existing order and its items
    const existingOrder = await Order.findOne({
      where: { uuid: id },
      include: OrderItem,
    });

    if (!existingOrder) {
      return res.status(404).json({ message: `Order with id ${id} not found` });
    }

    // Step 1: Reverse the stock for existing items (return stock to products)
    for (const orderItem of existingOrder.OrderItems) {
      const product = await Products.findOne({ where: { uuid: orderItem.productId } });
      if (product) {
        product.stock += orderItem.quantity; // Return stock
        await product.save({ transaction: t });
      }
    }

    // Step 2: Validate stock for new items
    for (const item of items) {
      const product = await Products.findOne({ where: { uuid: item.productId } });

      if (!product) {
        return res.status(404).json({ message: `Product with id ${item.productId} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for product: ${product.name}` });
      }
    }

    // Step 3: Update the order items
    await OrderItem.destroy({ where: { orderId: existingOrder.uuid }, transaction: t }); // Remove old items

    for (const item of items) {
      await OrderItem.create({
        orderId: existingOrder.uuid,
        productId: item.productId,
        quantity: item.quantity
      }, { transaction: t });

      // Deduct stock for new items
      const product = await Products.findOne({ where: { uuid: item.productId } });
      product.stock -= item.quantity;
      await product.save({ transaction: t });
    }

    // Commit the transaction if everything is successful
    await t.commit();

    res.status(200).json({ message: "Order updated successfully", order: existingOrder });
  } catch (error) {
    // Rollback the transaction in case of error
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: "Failed to update order", error: error.message });
  }
};

// Delete Order by ID
export const deleteOrder = async (req, res) => {
  const { id } = req.params; // Order UUID
  const t = await db.transaction(); // Start a transaction

  try {
    // Find the existing order and its items
    const existingOrder = await Order.findOne({
      where: { uuid: id },
      include: OrderItem,
    });

    if (!existingOrder) {
      return res.status(404).json({ message: `Order with id ${id} not found` });
    }

    // Step 1: Return the stock for the existing items
    for (const orderItem of existingOrder.OrderItems) {
      const product = await Products.findOne({ where: { uuid: orderItem.productId } });
      if (product) {
        product.stock += orderItem.quantity; // Return the stock
        await product.save({ transaction: t });
      }
    }

    // Step 2: Delete order items associated with the order
    await OrderItem.destroy({ where: { orderId: existingOrder.uuid }, transaction: t });

    // Step 3: Delete the order itself
    await Order.destroy({ where: { uuid: id }, transaction: t });

    // Commit the transaction if everything is successful
    await t.commit();

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    // Rollback the transaction in case of error
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: "Failed to delete order", error: error.message });
  }
};

