const { request, response } = require("express");
const { Product } = require('../models');

const getProducts = async (req = request, res = response) => {

    const { limit = 5, from = 0 } = req.query;
    const query = { status: true };

    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .skip(parseInt(from))
            .limit(parseInt(limit))
            .populate('user', 'name')
            .populate('category', 'name')
    ]);

    res.json({
        total,
        products
    });

}

const getProductByID = async (req = request, res = response) => {

    const { id } = req.params;
    const product = await Product.findById(id).populate('user', 'name').populate('category', 'name');

    if (!product.status) {
        return res.status(400).json({
            msg: `The product with ID ${id} is deactivated`
        });
    }

    res.json(product);

}

const createProduct = async (req = request, res = response) => {

    let { name, price, category, description, available } = req.body;
    name = name.toUpperCase();
    const productDB = await Product.findOne({ name });

    if (productDB) {
        return res.status(400).json({
            msg: `The product ${name} already exists in the DB`
        });
    }

    const user = req.user._id;
    price = price || 0;
    available = available == undefined ? true : available;
    const data = {
        name,
        price,
        category,
        description,
        available,
        user
    };

    const product = new Product(data);

    await product.save();

    return res.status(201).json(product);

}

const updateProduct = async (req = request, res = response) => {

    const { id } = req.params;
    const productDB = await Product.findById(id);

    if (!productDB.status) {
        return res.status(401).json({
            msg: `The product with ID ${id} is deactivated in the DB`
        });
    }

    const user = req.user._id;
    let { name, price, category, description, available } = req.body;
    name = name.toUpperCase();
    price = price || 0;
    available = available == undefined ? true : available;
    const data = {
        name,
        price,
        category,
        description,
        available,
        user
    };

    const product = await Product.findByIdAndUpdate(id, data, { new: true });

    res.json(product);

}

const deleteProduct = async (req = request, res = response) => {

    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(id, { status: false }, { new: true });

    res.json(product);

}

module.exports = {
    getProducts,
    getProductByID,
    createProduct,
    updateProduct,
    deleteProduct
}