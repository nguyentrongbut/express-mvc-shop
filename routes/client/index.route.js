const authRouters = require('./auth.route');
const homeRouters = require('./home.route')

const authMiddleware = require('../../middlewares/client/auth.middleware');

module.exports = (app) => {
    app.use('/auth', authRouters)
    app.use('/',
        authMiddleware.requireAuth,
        homeRouters)
}