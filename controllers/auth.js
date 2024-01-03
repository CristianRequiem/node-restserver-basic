const { response, request } = require("express");
const bcryptjs = require('bcryptjs');
const { generateJWT } = require("../helpers/generate-jwt");
const { verifyGoogle } = require("../helpers/google-verify");
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

const googleSignIn = async(req = request, res = response) => {

    const { id_token } = req.body;

    try {
        
        const { name, email, img } = await verifyGoogle(id_token);

        let user = await User.findOne({ email });

        if (!user) {

            const data = {
                name,
                email,
                password: 'X',
                img,
                role: 'USER_ROLE',
                google: true
            };

            user = new User(data);
            await user.save();

        }

        if (!user.status) {
            return res.status(401).json({
                msg: 'User blocked. Talk to the administrator'
            });
        }

        const token = await generateJWT(user.id);

        res.json({
            user,
            token
        });

    } catch (error) {
        
        res.status(400).json({
            ok: false,
            msg: 'The token could not be verified'
        });
        
    }


}

module.exports = {
    login,
    googleSignIn
}