'use strict';

module.exports = (client) => {

    var app = require('./website.js');

    require('greenlock-express')
    .init({
        packageRoot: process.cwd(),

        maintainerEmail: "jurgenjacobsen2005@gmail.com",

        configDir: './greenlock.d',

        cluster: false
    })
    .serve(app);
}