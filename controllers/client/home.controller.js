// [GET] /admin/home
module.exports.home = (req, res) => {
    res.render('client/pages/home/index', {
        titlePage: 'Home | Sztruyen',
    })
}