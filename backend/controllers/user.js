const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const Cryptr = require("cryptr");
const cryptr = new Cryptr("secret");

exports.signup = (req, res, next) => {

    let emailRegex = /^[^@&"()!_$*€£`+=\/;?#<>]+([A-Za-z]|[^<>()\[\]\\\/,;:\s@]){3,}\@([A-Za-z]|[^<>()\[\]\\\/,;:\s@]){3,}\.([A-Za-z]|[^<>()\[\]\\\/.,;:\s@])[^@&"()!_$*€£`+=\/;?#<>]+$/;
    let passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/;
    
    if (emailRegex.test(req.body.email) === true && passwordRegex.test(req.body.password) === true) {
    
    let encryptedEmail = cryptr.encrypt(req.body.email);
    res.locals.decryptEmail = cryptr.decrypt(encryptedEmail),

    /*let decryptedEmail = CryptoJS.AES.encrypt(req.body.email, "secret");
    let decryptedEmail = CryptoJS.AES.decrypt(encryptedEmail, "secret");
    let originalEmail = decryptedEmail.toString(CryptoJS.enc.Utf8);*/

    bcrypt.hash(req.body.password, 10)
        .then(
            hash => {
                const user = new User ({
                    email : encryptedEmail,
                    password : hash
                })
                
            user.save()
            .then(() => res.status(201).json({ message: "Utilisateur créé" }), 
                res.locals.encryptedEmail = encryptedEmail,
                res.locals.decryptEmail = cryptr.decrypt(res.locals.encryptedEmail),
                console.log("user" + user.email, "locals" + res.locals.encryptedEmail, "decrypt" + res.locals.decryptEmail))
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
};

exports.login = (req, res, next) => {

    /*let decryptedEmail = CryptoJS.AES.decrypt(res.locals.encryptedEmail, key128Bits);
    let originalEmail = decryptedEmail.toString(CryptoJS.enc.Utf8);*/
    console.log(res.locals.decryptEmail);
    const originalEmail = res.locals.decryptEmail;
    
    User.email = originalEmail;

    User.findOne({ email : req.body.email })
        .then(
            user => {
                
                console.log("Login", User.email, req.body.email, salt);
                if (!user) {
                    return res.status(401).json({ error : "Utilisateur non trouvé" });
                }
                bcrypt.compare(req.body.password, user.password)
                    .then(
                        valid => {
                            let testPassword = 0;
                            while (!valid) {
                                if (testPassword === 5) {
                                    return res.status(401).json({ error : "Nombre de tentative atteint, veuillez réessayer dans" })
                                }
                                else {
                                    testPassword++;
                                    return res.status(401).json({ error : "Email ou mot de passe incorrect" });
                                }
                            }
                            
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign(
                                    {userId: user._id},
                                    "X19l0zgz9HsOxMGq1qK5tdH9",
                                    {expiresIn: "24h"}
                                )
                            })
                    })
                    .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
};