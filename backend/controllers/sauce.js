const Sauce = require("../models/sauce");
const fs = require("fs");

//Regex pour la vérification des données
const inputRegex = /^[^\s@&"()!_$*€£`+=\/;?#<>]*[A-Za-z]{3,}/;

exports.createSauce = (req, res, next) => {
    console.log(req.body);
    const sauceObject = JSON.parse(req.body.sauce);
    sauceObject.dislikes = 0;
    sauceObject.likes = 0;

    const filename = req.file.filename;
    console.log(sauceObject);
    const sauce = new Sauce ({
        ...sauceObject,
        imageUrl : `${req.protocol}://${req.get("host")}/images/${filename}`
    });
    // On vérifie les données pour la création d'une sauce avec la Regex avant de la sauvegardée
    console.log(inputRegex.test(sauce.name && sauce.manufacturer && sauce.description && sauce.mainPepper));
    if (inputRegex.test(sauce.name && sauce.manufacturer && sauce.description && sauce.mainPepper) === true && sauce.heat >= 1 && sauce.heat <= 10) {
        sauce.save()
            .then(() => res.status(201).json({ message : "Sauce enregistrée" }))
            .catch(() => res.status(400).json({ error : "Erreur dans l'enregistrement, sauce non enregistrée" }))
    }
    // Si les conditions ne sont pas remplies, on supprime l'image envoyée
    else {
        return fs.unlink(`images/${filename}`, () => {
            res.status(400).json({ error : "Erreur dans l'entrée des données, veuillez rentrer des informations pertinantes" })
        })
    }
};

exports.modifySauce = (req, res, next) => {

        Sauce.findOne({ _id : req.params.id })
            .then(sauce => {
                // On vérifie que la sauce appartient à l'user avant de la modifier
                if (res.locals.userId === sauce.userId) {

                    // Si on transmets juste une image sans les autres informations requises, on renvoie une erreur et on supprime l'image
                    if (req.file && req.body.sauce === undefined) {
                        const filename = req.file.filename;
                        fs.unlink(`images/${filename}`, () => {
                            return res.status(400).json({ error : "Erreur dans la requête req.body.sauce" })
                        })
                    }
                    else {
                        const sauceObject = req.file ?
                        {
                            ...JSON.parse(req.body.sauce),
                            imageUrl : `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
                        }  : { ...req.body };
                        console.log(sauceObject, req.body.name);
                        console.log(inputRegex.test(sauceObject.name));
                        // On vérifie les données modifiées avec la Reg ex puis on envoie les modifications
                        if (inputRegex.test(sauceObject.name) && inputRegex.test(sauceObject.manufacturer) && inputRegex.test(sauceObject.description) && inputRegex.test(sauceObject.mainPepper) === true && sauceObject.heat >= 1 && sauceObject.heat <= 10) {
                            // On vérifie si il y a une nouvelle image et si oui on supprime l'ancienne
                            if (req.file) {
                                const filename = sauce.imageUrl.split("/images/")[1];
                                fs.unlink(`images/${filename}`, () => {
                                    res.status(200).json({ message : "Ancienne image supprimée" })
                                })
                            }
                            
                            Sauce.updateOne({ _id : req.params.id }, { ...sauceObject, _id : req.params.id })
                                .then(() => res.status(200).json({ message : "Sauce modifiée" }))
                                .catch(error => res.status(400).json({ error }))
                        }
                        else {
                            const filename = req.file.filename;
                            fs.unlink(`images/${filename}`, () => {
                                return res.status(400).json({ error : "Erreur dans l'entrée des données, veuillez rentrer des informations pertinantes" })
                            })
                        }
                    }
                }
                else {
                    return res.status(404).json({ message : "Vous ne pouvez pas modifier une Sauce qui ne vous appartient pas"})
                }
            })
            .catch(error => res.status(500).json({ error }))
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id : req.params.id })
        .then(sauce => {
            // On vérifie que la sauce appartient à l'user avant de la supprimer
            if (res.locals.userId === sauce.userId) {
                const filename = sauce.imageUrl.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id : req.params.id })
                        .then(() => res.status(200).json({ message : "Sauce supprimée" }))
                        .catch(error => res.status(400).json({ error }))
                })
            }   
            else {
                res.status(404).json({ message : "Vous ne pouvez pas supprimer cette sauce" })
            }
        })
        .catch(error => res.status(500).json({ error }))
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id : req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(() => res.status(400).json({ error : "Erreur ID dans l'URL : " + req.url}))
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }))
};

exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id : req.params.id })
        .then(
            (sauce) => {
                console.log(req.body, req.body.sauce)
                if (req.body.like === 1) {
                    if (sauce.usersLiked.includes(req.body.userId)) {
                        return res.status(400).json({ message : "Impossible d'ajouter plusieurs Like" })
                    }
                    else {
                        sauce.likes +=1;
                        sauce.usersLiked.push(req.body.userId);
                    }
                }
                
                else if (req.body.like === -1) {
                    if (sauce.usersLiked.includes(req.body.userId)) {
                        return res.status(400).json({ message : "Impossible d'ajouter plusieurs Dislike" })
                    }
                    else {
                    sauce.dislikes +=1;
                    sauce.usersDisliked.push(req.body.userId);
                    }
                }

                else if (req.body.like === 0) {
                    if (sauce.usersLiked.includes(req.body.userId)) {
                        sauce.likes -=1;
                        sauce.usersLiked = sauce.usersLiked.filter(item => item !== req.body.userId);
                    }
                    else if (sauce.usersDisliked.includes(req.body.userId)) {
                        sauce.dislikes -=1;
                        sauce.usersDisliked = sauce.usersDisliked.filter(item => item !== req.body.userId);
                    }
                }

                else if (req.body.like === undefined) {
                    return res.status(400).json({ message : "Le corps de la requête est vide" })
                }
                sauce.save()
                    .then(() => res.status(201).json({ message : "Like/Dislike mis à jour" }))
                    .catch(error => res.status(400).json({ error }))
            })
        .catch(error => res.status(500).json({ error }));  
};