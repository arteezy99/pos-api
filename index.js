import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/Database.js";
import UserRoute from "./routes/UserRoute.js";
import ProductRoute from "./routes/ProductRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import ProductCategoryRoute from "./routes/ProductCategoryRoute.js";
import StockTransactionRoute from './routes/StockTransactionRoute.js';
import OrderRoute from './routes/OrderRoute.js';
import './models/index.js';

dotenv.config();

const app = express();

// app.use(cors({
//     credentials: false,
//     origin: 'http://localhost:3000'
// }));

app.use(express.json());

app.use("/api", UserRoute);
app.use("/api", ProductRoute);
app.use("/api/auth", AuthRoute);
app.use("/api", ProductCategoryRoute);
app.use('/api', StockTransactionRoute);
app.use('/api', OrderRoute);

app.get("/", (req, res) => {
    res.send("Welcome to the POS system API!");
});

app.listen(process.env.APP_PORT || 3001, ()=> {
    console.log('Server up and running on port ' + process.env.APP_PORT || 3001);
});

(async () => {
    try {
        await db.authenticate();
        console.log('Connection has been established successfully.');

        await db.sync({ alter: true }); // This will automatically create tables if they don't exist
        console.log('All models were synchronized successfully.');

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

