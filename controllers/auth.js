const { response, request } = require("express");
const bcryptjs = require('bcryptjs');
const { generateJWT } = require("../helpers/generate-jwt");
const User = require('../models/user');

const login = async(req = request, res = response) => {

    const { email, password } = req.body;

    try {
        // Check if email exists
        const user = await User.findOne({email});

        if (!user) {
            return res.status(400).json({
                msg: 'User / Password incorrect - E-mail'
            });
        }

        // Check if user is active
        if (!user.status) {
            return res.status(400).json({
                msg: 'User / Password incorrect - Status: false'
            });
        }

        // Check password
        const validPassword = bcryptjs.compareSync(password, user.password);

        if (!validPassword) {
            return res.status(400).json({
                msg: 'User / Password incorrect - Password'
            });
        }

        // Create JWT
        const token = await generateJWT(user.id);

        res.json({
            msg: 'Login OK',
            user,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Something went wrong'
        });
    }


}

module.exports = {
    login
}