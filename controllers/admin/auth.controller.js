const { prefixAdmin } = require('../../config/system');

// [GET] /admin/auth/login
module.exports.login = async (req, res) => {
    res.render(`admin/pages/auth/login`, {
        titlePage: 'Login | Sztruyen'
    })
}