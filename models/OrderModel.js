import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Order = db.define("Order", {
    uuid: {
        type: DataTypes.STRING(36), // UUIDs are typically 36 characters long
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    },
    userId: {
        type: DataTypes.STRING(36), // Adjust the size if needed
        allowNull: false,
        references: {
            model: 'users',
            key: 'uuid'
        }
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    indexes: [
        { fields: ['userId'] } // specify indexes explicitly to manage them better
    ]
});

export default Order;
