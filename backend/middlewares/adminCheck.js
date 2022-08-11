module.exports.adminCheck = (req, res, next) => {
    const userTokenData = res.locals.payload;

    if (userTokenData.roles.includes('administrator')) {
        next();
    } else {
        res.sendStatus(403);
    }
};
