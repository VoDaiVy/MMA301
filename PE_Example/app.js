var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var connectDB = require('./db');

var users = require('./src/routes/users');
var cars = require('./src/routes/cars');
var bookings = require('./src/routes/bookings');
var contracts = require('./src/routes/contracts');

var app = express();

connectDB();

require('./src/models/User');
require('./src/models/Car');
require('./src/models/Booking');
require('./src/models/Contract');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/v1/users', users);
app.use('/api/v1/cars', cars);
app.use('/api/v1/bookings', bookings);
app.use('/api/v1/contracts', contracts);

module.exports = app;
