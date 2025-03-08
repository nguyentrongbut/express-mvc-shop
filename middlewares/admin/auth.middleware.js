const jwt = require("jsonwebtoken");
const Account = require("../../models/account.model");
const { prefixAdmin } = require("../../config/system");

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

// Function to reissue a new access token
const refreshAccessToken = async (refreshToken, res) => {
    try {
        const decodedRefresh = jwt.verify(refreshToken, REFRESH_SECRET);
        const user = await Account.findOne({ _id: decodedRefresh.userId, refreshToken, deleted: false }).select("-password -refreshToken -deleted");

        if (!user) {
            res.clearCookie("refreshToken");
            return null;
        }

        const newAccessToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
        res.cookie("accessToken", newAccessToken, { maxAge: 3600000, httpOnly: true });

        return user;
    } catch (error) {
        console.error("Refresh Token Invalid:", error);
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return null;
    }
};

// Function to authenticate user from access token
const authenticateUser = async (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await Account.findOne({ _id: decoded.userId, deleted: false }).select("-password -refreshToken -deleted");
        return user ? user : null;
    } catch (error) {
        return error.name === "TokenExpiredError" ? "expired" : null;
    }
};

module.exports.requireAuth = async (req, res, next) => {
    let { accessToken, refreshToken } = req.cookies;

    let user = accessToken ? await authenticateUser(accessToken) : null;

    if (user === "expired" && refreshToken) {
        user = await refreshAccessToken(refreshToken, res);
    } else if (!user && refreshToken) {
        user = await refreshAccessToken(refreshToken, res);
    }

    if (!user) {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return res.redirect(`${prefixAdmin}/auth/signIn`);
    }

    res.locals.user = user;
    return next();
};
