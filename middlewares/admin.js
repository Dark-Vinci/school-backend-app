function admin (req, res, next) {
    const user = req.user;
    if (!user.power) {
        res.status(403).send('forbidden');
        return;
    } else {
        next();
    }
}

module.exports = admin;