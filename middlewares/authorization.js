import jwt from 'jsonwebtoken';

const authorization = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }
    return async (req, res, next) => {
        const token = req.headers['authorization']?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        try {
            const user = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); 
            if (roles.length && !roles.includes(user.role)) {
                return res.status(403).json({success:false, message: 'Access denied. You do not have the right permissions.' });
            }

            req.user = user;
            next();
        } catch (err) {
            return res.status(403).json({ message: 'Invalid token.' });
        }
    };
};

export default authorization;
