import express from 'express';
import { 
    createOrder,
    getOrderById,
    getAllOrders,
    updateOrder,
    deleteOrder
} from '../controllers/Orders.js';
import { adminOnly, verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.post('/orders', verifyUser, createOrder);
router.get('/orders/:id', verifyUser, getOrderById);
router.get('/orders', verifyUser, getAllOrders);
router.patch('/orders/:id', verifyUser, updateOrder);
router.delete('/orders/:id', adminOnly, verifyUser, deleteOrder);

export default router;