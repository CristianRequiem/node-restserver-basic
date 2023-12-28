const mongoose = require('mongoose');

const dbConnection = async() => {

    try {

        await mongoose.connect(process.env.MONGODB_CNN, {
            serverSelectionTimeoutMS: 30000
        });

        console.log('Data base online');
        
    } catch (error) {
        
        console.log(error);
        throw new Error('Error starting the data base');

    }

}

module.exports = {
    dbConnection
}