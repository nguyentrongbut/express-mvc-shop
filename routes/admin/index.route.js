const systemConfig = require('../../config/system');

const authMiddleware = require('../../middlewares/admin/auth.middleware');

const dashboardRouters = require('./dashboard.route');

const authRouters = require('./auth.route');

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin

    app.use(PATH_ADMIN + '/dashboard',
        authMiddleware.requireAuth,
        dashboardRouters)

    app.use(PATH_ADMIN + '/auth', authRouters)
}