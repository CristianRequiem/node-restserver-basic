const { response, request } = require("express");
const { Category } = require('../models');

const getCategories = async (req = request, res = response) => {

    const { limit = 5, from = 0 } = req.query;
    const query = { status: true };

    const [total, categories] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
            .skip(parseInt(from))
            .limit(parseInt(limit))
            .populate('user', 'name')
    ]);

    res.json({
        total,
        categories
    });

}

const getCategoryByID = async (req = request, res = response) => {

    const { id } = req.params;
    const category = await Category.findById(id).populate('user', 'name');

    if (!category.status) {
        return res.status(400).json({
            msg: `The category with ID ${id} is deactivated`
        });
    }

    res.json(category);

}

const createCategory = async (req = request, res = response) => {

    const name = req.body.name.toUpperCase();
    const categoryDB = await Category.findOne({ name });

    if (categoryDB) {
        return res.status(400).json({
            msg: `The category ${name} already exists in the DB`
        });
    }

    const data = {
        name,
        user: req.user._id
    };

    const category = new Category(data);

    await category.save();

    res.status(201).json(category);

}

const updateCategory = async (req = request, res = response) => {

    const { id } = req.params;
    const name = req.body.name.toUpperCase();
    const categoryDB = await Category.findOne({ name });

    if (categoryDB) {
        return res.status(400).json({
            msg: `The category ${name} you want to update already exists in the DB`
        });
    }

    const data = {
        name,
        user: req.user._id
    };

    const updatedCategory = await Category.findByIdAndUpdate(id, data, { new: true });

    res.json(updatedCategory);

}

const deleteCategory = async (req = request, res = response) => {

    const { id } = req.params;

    const category = await Category.findByIdAndUpdate(id, { status: false }, { new: true });

    res.json(category);

}

module.exports = {
    getCategories,
    getCategoryByID,
    createCategory,
    updateCategory,
    deleteCategory
}