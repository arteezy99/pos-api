import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Order from "./OrderModel.js";
import Products from "./ProductModel.js";

const { DataTypes } = Sequelize;

const OrderItem = db.define("OrderItem", {
    orderId: {
        type: DataTypes.STRING(36), // Adjust the size if needed
        allowNull: false,
        references: {
            model: Order,
            key: 'uuid'
        }
    },
    productId: {
        type: DataTypes.STRING(36), // Adjust the size if needed
        allowNull: false,
        references: {
            model: Products, 
            key: 'uuid'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

export default OrderItem;
