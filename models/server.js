const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { dbConnection } = require('../database/config');
const userRouter = require('../routes/user');
const authRouter = require('../routes/auth');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 8080;
        this.usersPath = '/api/users';
        this.authPath = '/api/auth';

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

    }

    routes() {
        
        this.app.use(this.authPath, authRouter);
        this.app.use(this.usersPath, userRouter);

    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}`);
        });
    }

}

module.exports = Server;