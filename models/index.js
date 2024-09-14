import Products from './ProductModel.js';
import ProductCategory from './ProductCategoryModel.js';
import Users from './UserModel.js';
import StockTransactions from './StockTransactionModel.js';
import Order from './OrderModel.js';
import OrderItem from './OrderItemModel.js';

// Define relationships
ProductCategory.hasMany(Products, { foreignKey: 'productCategoryId', sourceKey: 'uuid' });
Products.belongsTo(ProductCategory, { foreignKey: 'productCategoryId', targetKey: 'uuid', as: 'product_category' });

Users.hasMany(Products, { foreignKey: 'userId', sourceKey: 'uuid' });
Products.belongsTo(Users, { foreignKey: 'userId', targetKey: 'uuid' });

Products.hasMany(StockTransactions, { foreignKey: 'productId', sourceKey: 'uuid' });
StockTransactions.belongsTo(Products, { foreignKey: 'productId', targetKey: 'uuid' });

// Order and OrderItem relationships
Order.hasMany(OrderItem, { foreignKey: 'orderId', sourceKey: 'uuid' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', targetKey: 'uuid' });

Products.hasMany(OrderItem, { foreignKey: 'productId', sourceKey: 'uuid' });
OrderItem.belongsTo(Products, { foreignKey: 'productId', targetKey: 'uuid' });

export { Products, ProductCategory, Users, StockTransactions, Order, OrderItem };
