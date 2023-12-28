const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { dbConnection } = require('../database/config');
const router = require('../routes/user');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 8080;
        this.usersPath = '/api/users';

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
        
        this.app.use(this.usersPath, router);

    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}`);
        });
    }

}

module.exports = Server;