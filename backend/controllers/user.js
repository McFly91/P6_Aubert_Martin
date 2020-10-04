const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const Cryptr = require("cryptr");
const cryptr = new Cryptr("secret");

exports.signup = (req, res, next) => {

    let emailRegex = /^[^@&"()!_$*€£`+=\/;?#<>]+([A-Za-z]|[^<>()\[\]\\\/,;:\s@]){3,}\@([A-Za-z]|[^<>()\[\]\\\/,;:\s@]){3,}\.([A-Za-z]|[^<>()\[\]\\\/.,;:\s@])[^@&"()!_$*€£`+=\/;?#<>]+$/;
    let passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/;
    let decryptedEmails = [];

    User.find()
        .then(
            users => {
                users.forEach(user => {
                    let decryptedEmail = cryptr.decrypt(user.email);
                    decryptedEmails.push(decryptedEmail);
                })
            console.log(decryptedEmails);

            if (decryptedEmails.includes(req.body.email) === false) {
                if (emailRegex.test(req.body.email) === true && passwordRegex.test(req.body.password) === true && decryptedEmails.includes(req.body.email) === false) {
                    bcrypt.hash(req.body.password, 10)
                        .then(
                            hash => {
                                const user = new User ({
                                    email : req.body.email,
                                    password : hash
                                })
                            
                            user.email = cryptr.encrypt(user.email);
                            user.save()
                            .then(() => res.status(201).json({ message: "Utilisateur créé" }), console.log("user :" + user.email))
                            .catch(error => res.status(400).json({ error }))
                        })
                        .catch(error => res.status(500).json({ error }))
                }
                else if (emailRegex.test(req.body.email) === false) {
                    return res.status(401).json({ error : "Email incorrect !"})
                }
                else if (passwordRegex.test(req.body.password) === false) {
                    return res.status(401).json({ error : "Veuillez entrer un mot de passe contenant au moins 6 caractères dont 1 majuscule, 1 minuscule, 1 chiffre et 1 des caractères spéciaux !" })
                }
            }
            else {
                return res.status(400).json({ message : "Veuillez réessayer avec une autre adresse"})
            }
        })
        .catch(error => res.status(500).json({ error }))
};

exports.login = (req, res, next) => {

    let decryptedEmails = [];

    User.find()
        .then(
            users => {
                users.forEach(user => {
                    let decryptedEmail = cryptr.decrypt(user.email);
                    decryptedEmails.push(decryptedEmail);
                })
                if (decryptedEmails.includes(req.body.email) === true) {
                    bcrypt.compare(req.body.password, users.password)
                        .then(
                            valid => {
                                if (!valid) {
                                    res.status(401).json({ error : "Email ou mot de passe incorrect" });
                                }
                                res.status(200).json({
                                    userId: users._id,
                                    token: jwt.sign(
                                        {userId: users._id},
                                        "X19l0zgz9HsOxMGq1qK5tdH9",
                                        {expiresIn: "24h"}
                                    )
                                })
                        })
                        .catch(error => res.status(500).json({ error }))
                }
                else {
                    return res.status(401).json({ error : "Utilisateur non trouvé" });
                }
                console.log(decryptedEmails, req.body.email, decryptedEmails.includes(req.body.email));
            })
        .catch(error => res.status(500).json({ error }))
};