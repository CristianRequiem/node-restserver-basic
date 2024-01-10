const { v4: uuidv4 } = require('uuid');
const path = require('path');

const uploadFile = (files, validExtensions = ['jpg', 'jpeg', 'gif', 'png'], folder = '') => {

    return new Promise((resolve, reject) => {

        const { file } = files;
        const fileSplitedName = file.name.split('.');
        const extension = fileSplitedName[fileSplitedName.length - 1];

        if (!validExtensions.includes(extension)) {
            return reject(`${extension} is not a valid file extension - ${validExtensions}`);
        }

        const tempName = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', folder, tempName);

        file.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
            }

            resolve(tempName);
        });

    });

}

module.exports = {
    uploadFile
}