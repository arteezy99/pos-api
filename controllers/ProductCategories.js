import ProductCategory from "../models/ProductCategoryModel.js"

export const getProductCategories = async (req, res) =>{
    try {
        const categories = await ProductCategory.findAll();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
};

export const getProductCategoryById = async (req, res) =>{
    try {
        const category = await ProductCategory.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!category) return res.status(404).json({msg: "Data tidak ditemukan"});
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
};

export const createProductCategory = async (req, res) =>{
    try {
        const {name, description} = req.body;
        const category = await ProductCategory.create({
            name,
            description
        });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
};

export const updateProductCategory = async (req, res) =>{
    try {
        const category = await ProductCategory.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!category) return res.status(404).json({msg: "Data tidak ditemukan"});
        const {name, description} = req.body;
        await category.update({
            name,
            description
        });
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
};

export const deleteProductCategory = async (req, res) =>{
    try {
        const category = await ProductCategory.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!category) return res.status(404).json({msg: "Data tidak ditemukan"});
        await category.destroy();
        res.status(200).json({msg: "Data berhasil dihapus"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
};