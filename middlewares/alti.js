function ultimateAdmin(req, res, next) {
    const power = req.body.power;
    if (power < 10) {
        res.status(403).send('forbidden');
        return;
    } else {
        next()
    }
}

module.exports = ultimateAdmin;