import jwt from 'jsonwebtoken';
const isAuth = async (req, res, next) => {
    try {

        const token = req.cookies?.token;
        if (!token) {

            return res.status(401).json({ message: "Unauthorized - No token provided" });
        }
        let decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;

        next();
    }
    catch (error) {

        res.status(401).json({ message: `Unauthorized - Invalid token : ${error.message}` });

    }
}
export default isAuth;
