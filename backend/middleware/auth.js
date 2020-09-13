const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, "RANDOM_TOKEN_AVAILABLE");
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            return res.status(404).json({ error : "User ID non valide" })
        }
        else {
            next();
        }
    }
    catch {
        res.status(401).json({ error : "Connexion non authorisée" });
    }
};