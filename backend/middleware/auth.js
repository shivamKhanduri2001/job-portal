const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.header.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token, access denied'});
    }
    try {
        const decoded =jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
}
const requireRole = (role) => {
    (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({message: 'Acess denied'});
        }
        next();
    }
}
module.exports = {auth, requireRole};