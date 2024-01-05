const { request, response } = require("express");
const { ObjectId } = require('mongoose').Types;
const { Category, Product, User } = require('../models');

const allowedCollections = [
    'category',
    'product',
    'role',
    'user'
];

const searchUsers = async (term, res = response) => {

    const isMongoID = ObjectId.isValid(term);

    if (isMongoID) {
        const user = await User.findById(term);
        return res.json({
            result: (user) ? [user] : []
        });
    }

    const regexp = new RegExp(term, 'i');

    const users = await User.find({
        $or: [
            { name: regexp },
            { email: regexp }
        ],
        $and: [{ status: true }]
    });

    res.json({
        result: users
    });

}

const searchCategories = async (term, res = response) => {

    const isMongoID = ObjectId.isValid(term);

    if (isMongoID) {
        const category = await Category.findById(term)
            .populate('user', 'name');
        return res.json({
            result: (category) ? [category] : []
        });
    }

    const regexp = new RegExp(term, 'i');

    const categories = await Category.find({ name: regexp, status: true })
        .populate('user', 'name');

    res.json({
        result: categories
    });

}

const searchProducts = async (term, res = response) => {

    const isMongoID = ObjectId.isValid(term);

    if (isMongoID) {
        const product = await Product.findById(term)
            .populate('category', 'name')
            .populate('user', 'name');
        return res.json({
            result: (product) ? [product] : []
        });
    }

    const regexp = new RegExp(term, 'i');

    const products = await Product.find({ name: regexp, status: true })
        .populate('category', 'name')
        .populate('user', 'name');;

    res.json({
        result: products
    });

}

const search = (req = request, res = response) => {

    const { collection, term } = req.params;

    if (!allowedCollections.includes(collection)) {
        return res.status(400).json({
            msg: `The allowed collections are: ${allowedCollections}`
        });
    }

    switch (collection) {
        case 'category':
            searchCategories(term, res);
            break;
        case 'product':
            searchProducts(term, res);
            break;
        case 'user':
            searchUsers(term, res);
            break;
        default:
            return res.status(500).json({
                msg: 'This operatin is not available yet'
            });
    }

}

module.exports = {
    search
};