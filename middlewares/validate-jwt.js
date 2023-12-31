const { response, request } = require("express");
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validateJWT = async(req = request, res = response, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'There is no valid token'
        });
    }

    try {   
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const user = await User.findById(uid);

        if (!user) {
            return res.status(401).json({
                msg: 'Invalid token - User does not exist in the DB'
            });
        }

        if (!user.status) {
            return res.status(401).json({
                msg: 'Invalid token - Inactive user'
            });
        }

        req.user = user;

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Invalid token'
        });
    }

}

module.exports = {
    validateJWT
}