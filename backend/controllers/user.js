const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.signup = (req, res, next) => {

    let emailRegex = /([A-Za-z]|[^<>()\[\]\\\/,;:\s@]){3,}\@([A-Za-z]|[^<>()\[\]\\\/,;:\s@]){3,}\.([A-Za-z]|[^<>()\[\]\\\/.,;:\s@]){2,}/;
    let passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/;
    
    if (emailRegex.test(req.body.email) === true && passwordRegex.test(req.body.password) === true) {
    bcrypt.hash(req.body.password, 10)
        .then(
            hash => {
                const user = new User ({
                    email : req.body.email,
                    password : hash
                })
            user.save()
            .then(() => res.status(201).json({message: "Utilisateur créé" }))
            .catch(error => res.status(400).json({error}))
        })
        .catch(error => res.status(500).json({error}))
    }
    else if (emailRegex.test(req.body.email) === false) {
        throw new Error("Email incorrect !");
    }
    else if (passwordRegex.test(req.body.password) === false) {
        throw new Error("Veuillez entrer un mot de passe contenant au moins 6 caractères dont 1 majuscule, 1 minuscule, 1 chiffre et 1 des caractères spéciaux !");
    }
};

exports.login = (req, res, next) => {
    User.findOne({ email : req.body.email })
        .then(
            user => {
                console.log("Login");
                if (!user) {
                    return res.status(401).json({error: "Utilisateur non trouvé"});
                }
                bcrypt.compare(req.body.password, user.password)
                    .then(
                        valid => {
                            if (!valid) {
                                return res.status(401).json({error: "Email ou mot de passe incorrect"});
                            }
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign(
                                    {userId: user._id},
                                    "RANDOM_TOKEN_AVAILABLE",
                                    {expiresIn: "24h"}
                                )
                            });
                    })
                    .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
};