const bcryptjs = require('bcryptjs');
const User = require('../models/user');

const getUser = async (req, res) => {

    const { limit = 5, from = 0 } = req.query;
    const query = { status: true };

    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip(parseInt(from))
            .limit(parseInt(limit))
    ]);

    res.json({
        total,
        users
    });
}

const postUser = async (req, res) => {

    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });

    // Encrypt password
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    // Save to DB
    await user.save();

    res.status(201).json(user);
}

const putUser = async (req, res) => {
    const { id } = req.params;
    const { _id, password, google, email, ...rest } = req.body;

    if (password) {
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, rest);

    res.json(user);
}

const deleteUser = async(req, res) => {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(id, {status: false});

    res.json(user);
}

module.exports = {
    getUser,
    postUser,
    putUser,
    deleteUser
}