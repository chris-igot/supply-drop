const jwt = require('jsonwebtoken');

module.exports.authenticate = (req, res, next) => {
    jwt.verify(
        req.cookies.usertoken,
        process.env.SECRET_KEY_SUPPLYDROP,
        (err, payload) => {
            if (err) {
                res.status(401).json({ verified: false });
            } else {
                res.locals.payload = payload;
                next();
            }
        }
    );
};
