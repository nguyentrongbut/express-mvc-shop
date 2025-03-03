const systemConfig = require('../../config/system');

const dashboardRouters = require('./dashboard.route');

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin

    app.use(PATH_ADMIN + '/dashboard', dashboardRouters)

}