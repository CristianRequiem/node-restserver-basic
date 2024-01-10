const { request, response } = require('express');
const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { uploadFile: uploadFileHelper } = require('../helpers');
const { Product, User } = require('../models');

const uploadFile = async (req = request, res = response) => {

    try {

        const fileName = await uploadFileHelper(req.files, undefined, 'imgs');

        res.json({ fileName });

    } catch (msg) {

        res.status(400).json({ msg });

    }


}

const updateImage = async (req = request, res = response) => {

    const { collection, id } = req.params;
    let model;

    switch (collection) {
        case 'user':
            model = await User.findById(id);

            if (!model) {
                return res.status(400).json({
                    msg: `The user with ID ${id} does not exist in the DB`
                });
            }
            break;

        case 'product':
            model = await Product.findById(id);

            if (!model) {
                return res.status(400).json({
                    msg: `The product with ID ${id} does not exist in the DB`
                });
            }
            break;

        default:
            return res.status(500).json({ msg: 'Unavailable service' });
    }

    if (model.img) {
        const imagePath = path.join(__dirname, '../uploads', collection, model.img);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    }

    const fileName = await uploadFileHelper(req.files, undefined, collection);
    model.img = fileName;

    await model.save();

    res.json({ model });

}

const updateImageCloudinary = async (req = request, res = response) => {

    const { collection, id } = req.params;
    let model;

    switch (collection) {
        case 'user':
            model = await User.findById(id);

            if (!model) {
                return res.status(400).json({
                    msg: `The user with ID ${id} does not exist in the DB`
                });
            }
            break;

        case 'product':
            model = await Product.findById(id);

            if (!model) {
                return res.status(400).json({
                    msg: `The product with ID ${id} does not exist in the DB`
                });
            }
            break;

        default:
            return res.status(500).json({ msg: 'Unavailable service' });
    }

    if (model.img) {
        const nameArr = model.img.split('/');
        const name = nameArr[nameArr.length - 1];
        const [public_id] = name.split('.');
        cloudinary.uploader.destroy(public_id);
    }

    const { tempFilePath } = req.files.file;

    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

    model.img = secure_url;

    await model.save();

    res.json({ model });

}

const showImage = async (req = request, res = response) => {

    const { collection, id } = req.params;
    let model;
    let imagePath = '';

    switch (collection) {
        case 'user':
            model = await User.findById(id);

            if (!model) {
                return res.status(400).json({
                    msg: `The user with ID ${id} does not exist in the DB`
                });
            }
            break;

        case 'product':
            model = await Product.findById(id);

            if (!model) {
                return res.status(400).json({
                    msg: `The product with ID ${id} does not exist in the DB`
                });
            }
            break;

        default:
            return res.status(500).json({ msg: 'Unavailable service' });
    }

    if (model.img) {
        imagePath = path.join(__dirname, '../uploads', collection, model.img);
        if (fs.existsSync(imagePath)) {
            return res.sendFile(imagePath);
        }
    }

    imagePath = path.join(__dirname, '../assets/no-image.jpg');

    res.sendFile(imagePath);

}

const showImageCloudinary = async (req = request, res = response) => {

    const { collection, id } = req.params;
    let model;

    switch (collection) {
        case 'user':
            model = await User.findById(id);

            if (!model) {
                return res.status(400).json({
                    msg: `The user with ID ${id} does not exist in the DB`
                });
            }
            break;

        case 'product':
            model = await Product.findById(id);

            if (!model) {
                return res.status(400).json({
                    msg: `The product with ID ${id} does not exist in the DB`
                });
            }
            break;

        default:
            return res.status(500).json({ msg: 'Unavailable service' });
    }

    if (model.img) {
        return res.json({url: model.img});
    }

    const imagePath = path.join(__dirname, '../assets/no-image.jpg');

    res.sendFile(imagePath);

}

module.exports = {
    uploadFile,
    updateImage,
    updateImageCloudinary,
    showImage,
    showImageCloudinary
}