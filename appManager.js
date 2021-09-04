

module.exports = function (app) {
    require('./startup/logging')();
    require('./startup/config')();
    require('./startup/joi')();
    require('./startup/routes')(app);
    require('./startup/db')();
}