const Role = require('../models/role');
const User = require('../models/user');

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
    const userExists = await User.findById( id );

    if (!userExists) {
        throw new Error(`The user with ID ${id} does not exist in the DB`);
    }
}

module.exports = {
    isValidRole,
    checkEmailExists,
    userExistsById
}