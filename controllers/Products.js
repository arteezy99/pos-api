import Product from "../models/ProductModel.js";
import ProductCategory from "../models/ProductCategoryModel.js";
import User from "../models/UserModel.js";
import {Op} from "sequelize";

export const getProducts = async (req, res) =>{
    try {
        let response;
        if(req.role === "admin"){
            response = await Product.findAll({
                attributes:['uuid','name', 'description','price','stock', 'imgUrl', 'createdAt', 'updatedAt'],
                include:[{
                    model: User,
                    attributes:['firstName', 'lastName' ,'email']
                },
                {
                    model: ProductCategory, 
                    as: 'product_category',
                    attributes: ['name'],
                }]
            });
        }else{
            response = await Product.findAll({
                attributes:['uuid','name', 'description','price','stock', 'imgUrl', 'createdAt', 'updatedAt'],
                where:{
                    userId: req.userId
                },
                include:[{
                    model: User,
                    attributes:['firstName', 'lastName' ,'email']
                }
                ,{
                    model: ProductCategory, 
                    as: 'product_category',
                    attributes: ['uuid', 'name'],
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getProductById = async(req, res) =>{
    try {
        const product = await Product.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!product) return res.status(404).json({msg: "Data tidak ditemukan"});
        let response;
        if(req.role === "admin"){
            response = await Product.findOne({
                attributes:['uuid','name', 'description','price','stock', 'imgUrl', 'createdAt', 'updatedAt'],
                where:{
                    id: product.id
                },
                include:[{
                    model: User,
                    attributes:['firstName', 'lastName' ,'email']
                },
                {
                    model: ProductCategory, 
                    as: 'product_category',
                    attributes: ['uuid', 'name'],
                }]
            });
        }else{
            response = await Product.findOne({
                attributes:['uuid','name', 'description','price','stock', 'ProductCategoryId', 'imgUrl', 'createdAt', 'updatedAt'],
                where:{
                    [Op.and]:[{id: product.id}, {userId: req.userId}]
                },
                include:[{
                    model: User,
                    attributes:['firstName', 'lastName' ,'email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, productCategoryId, imgUrl } = req.body; 

         // Debugging: Log the received imgUrls to ensure it's correctly received
         console.log('Received imgUrls:', imgUrl);

         // Convert imgUrls array to string if it's an array
         const imgUrls = Array.isArray(imgUrl) ? imgUrl.join(',') : imgUrl;
 
         // Debugging: Log the final imgUrl to ensure it's properly transformed
         console.log('Final imgUrl:', imgUrl);

        await Product.create({
            name,
            description,
            price,
            stock,
            productCategoryId,            
            userId: req.userId,
            imgUrl: imgUrls
        });

        res.status(201).json({ msg: "Product Created Successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!product) return res.status(404).json({ msg: "Product not found" });

        const { name, description, price, stock, productCategoryId, imgUrl } = req.body;

        // Debugging: Log the received imgUrl to ensure it's correctly received
        console.log('Received imgUrl:', imgUrl);

        // Convert imgUrl array to string if it's an array
        const formattedImgUrl = Array.isArray(imgUrl) ? imgUrl.join(',') : imgUrl;

        // Debugging: Log the final formatted imgUrl to ensure it's properly transformed
        console.log('Final imgUrl:', formattedImgUrl);
        
        await product.update({
            name,
            description,
            price,
            stock,
            productCategoryId,
            imgUrl: formattedImgUrl // Ensure you're updating with the formatted imgUrl
        });

        res.status(200).json({ msg: "Product Updated Successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};


export const deleteProduct = async(req, res) =>{
    try {
        const product = await Product.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!product) return res.status(404).json({msg: "Data tidak ditemukan"});
        const {name, price} = req.body;
        if(req.role === "admin"){
            await Product.destroy({
                where:{
                    id: product.id
                }
            });
        }else{
            if(req.userId !== product.userId) return res.status(403).json({msg: "Akses terlarang"});
            await Product.destroy({
                where:{
                    [Op.and]:[{id: product.id}, {userId: req.userId}]
                }
            });
        }
        res.status(200).json({msg: "Product deleted successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}