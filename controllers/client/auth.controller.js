const Account = require("../../models/account.model");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

// .env variable
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

// [GET] /auth/signIn
module.exports.signIn = async (req, res) => {
    res.render("client/pages/auth/signIn", {
        titlePage: "Sign In | Sztruyen"
    });
}

// Sign in

// [POST] /auth/signIn
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

        res.redirect(`/`);
    } catch (error) {
        res.render(`client/pages/auth/signIn`, {
            titlePage: "Sign In | Sztruyen",
            error: "An error occurred while logging in!"
        });
    }
}

// [POST] /auth/refresh-token
module.exports.refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.redirect(`/auth/signIn`);
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
            return res.redirect(`/auth/signIn`);
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
        res.redirect(`/auth/signIn`);
    }
}

// End Sign in

// Sign up

// [GET] /auth/signUp
module.exports.signUp = async (req, res) => {
    res.render("client/pages/auth/signUp", {
        titlePage: "Sign Up | Sztruyen"
    });
}

// [POST] /auth/signUp
module.exports.signUpPost = async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await Account.findOne({
        email: email,
        deleted: false
    })

    if (existingUser) {
        req.flash("error", "Email already exists!")
        return res.redirect("back");
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user with a hashed password
        const newUser = new Account({
            fullName: name,
            email: email,
            password: hashedPassword
        })
        
        await newUser.save();
        
        // Create tokens
        const accessToken = jwt.sign(
            {   userId: newUser.id  },
            JWT_SECRET,
            { expiresIn: '1h' }
        )
        
        const refreshToken = jwt.sign(
            {   userId: newUser.id  },
            JWT_SECRET,
            { expiresIn: '7d' }
        )

        // Save refresh token
        newUser.refreshToken = refreshToken;
        await newUser.save()

        // Set cookies
        res.cookie('accessToken', accessToken, { maxAge: 3600000 });
        res.cookie('refreshToken', refreshToken, { maxAge: 604800000 });

        res.redirect("/");
    } catch (error) {
        res.redirect("/auth/signUp");
    }
}
// End Sign up

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

    res.redirect(`/auth/signIn`);
}

// End Log out
