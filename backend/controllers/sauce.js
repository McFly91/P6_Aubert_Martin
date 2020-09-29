const Sauce = require("../models/sauce");
const fs = require("fs");

let inputGloabalRegex = /^[^@&"()!_$*€£`+=\/;?#<>]+[A-Za-z]{2,}\ [A-Za-z0-9]{2,}[^@&"()!_$*€£`+=\/;?#<>]+$/;
let inputManufacturerRegex = /^[^@&"()!_$*€£`+=\/;?#<>]+[A-Za-z]{2,}[^@&"()!_$*€£`+=\/;?#<>]+$/;

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    sauceObject.dislikes = 0;
    sauceObject.likes = 0;

    const filename = req.file.filename;

    const sauce = new Sauce ({
        ...sauceObject,
        imageUrl : `${req.protocol}://${req.get("host")}/images/${filename}`
    });
    // On vérifie les données pour la création d'une sauce avec la Regex avant de la sauvegardée
    if (inputGloabalRegex.test(sauce.name && sauce.description && sauce.mainPepper) === true && inputManufacturerRegex.test(sauce.manufacturer) === true) {
        sauce.save()
            .then(() => res.status(201).json({ message : "Sauce enregistrée" }))
            .catch(() => res.status(400).json({ error : "Erreur dans l'enregistrement, sauce non enregistrée" }))
    }
    // Si les conditions ne sont pas remplies, on supprime l'image envoyée
    else {
        fs.unlink(`images/${filename}`, () => {
            res.status(400).json({ error : "Erreur dans l'entrée des données, veuillez rentrer des informations pertinantes" })
        })
    }
};

exports.modifySauce = (req, res, next) => {
    // Si on transmets juste une image sans les autres informations requises, on renvoie une erreur et on supprime l'image
    if (req.file && req.body.sauce === undefined) {
        const filename = req.file.filename;
        fs.unlink(`images/${filename}`, () => {
            res.status(400).json({ error : "Erreur dans la requête 'req.body.sauce'" })
        })
    }
    else {
        const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl : `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
        }  : { ...req.body };

        Sauce.findOne({ _id : req.params.id })
            .then(sauce => {
                // On vérifie que la sauce appartient à l'user avant de la modifier
                if (res.locals.userId === sauce.userId) {
                    // On vérifie si il y a une nouvelle image et si oui on supprime l'ancienne
                    if (req.file) {
                        const filename = sauce.imageUrl.split("/images/")[1];
                        fs.unlink(`images/${filename}`, () => {
                            res.status(200).json({ message : "Ancienne image supprimée" })
                        })
                    }
                    // On vérifie les données modifiées avec la Regex puis on envoie les modifications
                    if (inputGloabalRegex.test(sauce.name && sauce.description && sauce.mainPepper) === true && inputManufacturerRegex.test(sauce.manufacturer) === true) {
                        Sauce.updateOne({ _id : req.params.id }, { ...sauceObject, _id : req.params.id })
                            .then(() => res.status(200).json({ message : "Sauce modifiée" }))
                            .catch(error => res.status(400).json({ error }))
                    }
                    else {
                        res.status(400).json({ error : "Erreur dans l'entrée des données, veuillez rentrer des informations pertinantes" })
                    }
                }
                else {
                    res.status(404).json({ message : "Vous ne pouvez pas modifier une Sauce qui ne vous appartient pas"})
                }
            })
            .catch(error => res.status(500).json({ error }))
    }
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
                sauce.save()
                    .then(() => res.status(201).json({ message : "Like/Dislike mis à jour" }))
                    .catch(error => res.status(400).json({ error }))
            })
        .catch(error => res.status(500).json({ error }));  
};