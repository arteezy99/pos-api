import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Products from "./ProductModel.js";

const {DataTypes} = Sequelize;

const ProductCategory = db.define('product_categories',{
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
        validate:{
            notEmpty: true
        }
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
            len: [3, 100]
        }
    },
    description:{
        type: DataTypes.TEXT,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    }
});

export default ProductCategory;