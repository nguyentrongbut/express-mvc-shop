const Account = require("../../models/account.model");
const jwt = require("jsonwebtoken");
const { prefixAdmin } = require('../../config/system');
const bcrypt = require('bcrypt');

// .env variable
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET; 

// [GET] /admin/auth/signIn
module.exports.signIn = async (req, res) => {
    res.render("admin/pages/auth/signIn", {
        titlePage: "Sign In | Sztruyen"
    });
}

// Sign in

// [POST] /admin/auth/signIn
module.exports.signInPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await Account.findOne({
        email: email,
        deleted: false
    });

    if (!user) {
        req.flash("error", "Wrong email or password. Please try again!")
        return res.redirect("back");
    }

    try {
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            req.flash("error", "Wrong email or password. Please try again!")
            return res.redirect("back");
        }

        // Create access token
        const accessToken = jwt.sign(
            { userId: user.id },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Create refresh token
        const refreshToken = jwt.sign(
            { userId: user.id },
            REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        // Save refresh token in database
        user.refreshToken = refreshToken;
        await user.save();

        // Save tokens in cookie
        res.cookie('accessToken', accessToken, { maxAge: 3600000 }); // 1 h
        res.cookie('refreshToken', refreshToken, { maxAge: 604800000 }); // 7 day

        res.redirect(`${prefixAdmin}/dashboard`);
    } catch (error) {
        res.render(`${prefixAdmin}/pages/auth/signIn`, {
            titlePage: "Sign In | Sztruyen",
            error: "An error occurred while logging in!"
        });
    }
}

// [POST] /admin/auth/refresh-token
module.exports.refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.redirect(`${prefixAdmin}/auth/signIn`);
    }

    try {
        // Verify refresh token
        const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
        
        // Find user with refresh token
        const user = await Account.findOne({
            _id: decoded.userId,
            refreshToken: refreshToken
        });

        if (!user) {
            return res.redirect(`${prefixAdmin}/auth/signIn`);
        }

        // Create new access token
        const newAccessToken = jwt.sign(
            { userId: user.id },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Update cookie
        res.cookie('accessToken', newAccessToken, { maxAge: 3600000 });
        
        // Redirect referent page
        res.redirect("back");

    } catch (error) {
        res.redirect(`${prefixAdmin}/auth/signIn`);
    }
}

// End Sign in

// Log out

// [GET] /admin/auth/signIn
module.exports.logout = async (req, res) => {
    // Delete refresh token in database
    const userId = req.cookies.userId;
    if(userId) {
        await Account.findByIdAndUpdate(userId, {
            refreshToken: null
        });
    }
    // Delete cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.clearCookie("userId");
    
    res.redirect(`${prefixAdmin}/auth/signIn`);
}

// End Log out