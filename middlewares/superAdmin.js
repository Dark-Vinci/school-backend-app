function superAdmin(req, res, next) {
    const power = req.body.power;
    if (power <= 6) {
        res.status(403).send('forbidden');
        return;
    } else {
        next()
    }
}

module.exports = superAdmin;