const { Category } = require('../models');
const { Role } = require('../models');
const { User } = require('../models');
const { Product } = require('../models');

const isValidRole = async (role = '') => {

    const roleExists = await Role.findOne({ role });

    if (!roleExists) {
        throw new Error(`${role} is not a valid role`);
    }

}

const checkEmailExists = async (email = '') => {

    const emailExists = await User.findOne({ email });

    if (emailExists) {
        throw new Error(`The ${email} already exists in the DB`);
    }

}

const userExistsById = async (id) => {

    const userExists = await User.findById(id);

    if (!userExists) {
        throw new Error(`The user with ID ${id} does not exist in the DB`);
    }

}

const checkCategoryExists = async (id) => {

    const categoryExists = await Category.findById(id);

    if (!categoryExists) {
        throw new Error(`The category with ID ${id} does not exist in the DB`);
    }

}

const checkProductExists = async (id) => {

    const productExists = await Product.findById(id);

    if (!productExists) {
        throw new Error(`The product with ID ${id} does not exist in the DB`);
    }

}

module.exports = {
    isValidRole,
    checkEmailExists,
    userExistsById,
    checkCategoryExists,
    checkProductExists
}