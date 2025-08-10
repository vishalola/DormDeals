const UserToken = require("../models/userToken");
const jwt = require("jsonwebtoken");

const verifyRefreshToken = async (refreshToken) => {
    try {
        const privateKey = process.env.JWTREFRESHPK; // Must match generation key
        
        if (!privateKey) {
            throw { error: true, message: "Server configuration error" };
        }

        const tokenFound = await UserToken.findOne({ token: refreshToken });
        
        if (!tokenFound) {
            throw { error: true, message: "Invalid session - please login again" };
        }

        const tokenDetails = jwt.verify(refreshToken, privateKey);
        return {
            tokenDetails,
            error: false,
            message: "Valid refresh token"
        };
    } catch (error) {
        console.error("Refresh token verification error:", error);
        throw { 
            error: true, 
            message: error.message || "Invalid refresh token",
            expired: error.name === 'TokenExpiredError'
        };
    }
};

module.exports = verifyRefreshToken;