const express = require('express');

const CarsRouter = require('./routers/cars-router.js');

const server = express();

server.use(express.json());

server.use('/cars', CarsRouter);

server.get('/', (req, res) => {
    res.send('<h3>Detabase Schema Design!</h3>');
})

module.exports = server;