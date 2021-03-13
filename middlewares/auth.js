const jwt = require('jsonwebtoken');
const config = require("config")
module.exports = function (req, res, next) {

    const token = req.headers['x-auth-token'];
    if (!token) return  res.status(401).send("Access denied. No token  provided.Please login")

    try {
        req.user = jwt.verify(token, config.get("jwtPrivateKey"));
        next()
    } catch (ex) {
        console.log(ex);
        return res.status(400).send("Invalid token.Please login")

    }


}
