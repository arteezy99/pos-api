import express from 'express';
import { 
    createStockTransaction, 
    updateStockTransaction,
    getStockTransactions,
    getStockTransactionById,
    deleteStockTransaction, 
} from '../controllers/StockTransaction.js';
import { adminOnly, verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.post('/stock-transaction', verifyUser, createStockTransaction);
router.get('/stock-transactions', verifyUser, getStockTransactions);
router.get('/stock-transaction/:id', verifyUser, getStockTransactionById);
router.patch('/stock-transaction/:id', adminOnly, verifyUser, updateStockTransaction);
router.delete('/stock-transaction/:id', adminOnly, verifyUser, deleteStockTransaction);

export default router;
