const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
require('dotenv').config();

const { dbConnection } = require('../database/config');
const userRouter = require('../routes/user');
const authRouter = require('../routes/auth');
const categoryRouter = require('../routes/category');
const productRouter = require('../routes/product');
const searchRouter = require('../routes/search');
const uploadRouter = require('../routes/upload');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 8080;

        this.paths = {
            auth: '/api/auth',
            categories: '/api/category',
            search: '/api/search',
            uploads: '/api/upload',
            users: '/api/user',
            products: '/api/product'
        };

        // Start DB
        this.connectDb();

        // Middlewares
        this.middlewares();

        // Routes
        this.routes();
    }

    async connectDb() {
        await dbConnection();
    }

    middlewares() {
        // CORS
        this.app.use(cors());

        // Parser
        this.app.use(express.json());

        // Puclic
        this.app.use(express.static('public'));

        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));

    }

    routes() {

        this.app.use(this.paths.auth, authRouter);
        this.app.use(this.paths.categories, categoryRouter);
        this.app.use(this.paths.search, searchRouter);
        this.app.use(this.paths.uploads, uploadRouter);
        this.app.use(this.paths.users, userRouter);
        this.app.use(this.paths.products, productRouter);

    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}`);
        });
    }

}

module.exports = Server;