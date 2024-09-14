import express from 'express';
import {
    getProductCategories,
    getProductCategoryById,
    createProductCategory,
    updateProductCategory,
    deleteProductCategory
} from '../controllers/ProductCategories.js';
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/product-categories',verifyUser, getProductCategories);
router.get('/product-categories/:id',verifyUser, getProductCategoryById);
router.post('/product-categories',verifyUser, createProductCategory);
router.patch('/product-categories/:id',verifyUser, updateProductCategory);
router.delete('/product-categories/:id',verifyUser, deleteProductCategory);

export default router;