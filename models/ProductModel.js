import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";
import ProductCategory from "./ProductCategoryModel.js";

const { DataTypes } = Sequelize;

const Products = db.define('product', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 100]
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    imgUrl: {
        type: DataTypes.TEXT,  
        allowNull: false,
        validate: {
            notEmpty: true
        },
        get() {
            const value = this.getDataValue('imgUrl');
            return value ? value.split(',') : [];  
        },
        set(val) {
            if (Array.isArray(val)) {
                this.setDataValue('imgUrl', val.join(','));
            } else {
                this.setDataValue('imgUrl', val); 
            }
        }
    },    
    productCategoryId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'product_categories', 
          key: 'uuid'
        }
    },
    userId: {
        type: DataTypes.STRING(36), // UUIDs are typically 36 characters long
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
}, {
    freezeTableName: true
});

export default Products;
