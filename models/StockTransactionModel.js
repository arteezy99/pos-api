import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Products from "./ProductModel.js";

const { DataTypes } = Sequelize;

const StockTransactions = db.define('stock_transactions', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    productId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Products, 
            key: 'uuid'
        }
    },
    type: {
        type: DataTypes.ENUM('in', 'out'),  // 'in' for stock-in, 'out' for stock-out
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
    freezeTableName: true,
    timestamps: false
});

export default StockTransactions;
