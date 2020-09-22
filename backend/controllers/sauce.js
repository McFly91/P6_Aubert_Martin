const Sauce = require("../models/sauce");

const fs = require("fs");

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    sauceObject.dislikes = 0;
    sauceObject.likes = 0;

    const sauce = new Sauce ({
        ...sauceObject,
        imageUrl : `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message : "Sauce enregistrée" }))
        .catch(() => res.status(400).json({ error : "Erreur dans l'enregistrement, sauce non enregistrée" }))
};

exports.modifySauce = (req, res, next) => {
    console.log(res.locals.userId);
    if (req.file && req.body.sauce === undefined) {
        const filename = req.file.filename;
        fs.unlink(`images/${filename}`, () => {
            res.status(400).json({ error : "Erreur dans la requête" })
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
            if (res.locals.userId === sauce.userId) {

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
                res.status(404).json({ message : "Vous ne pouvez pas modifier une Sauce qui ne vous appartient pas"})
            }
        })
        .catch(error => res.status(500).json({ error }))
    }
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id : req.params.id })
    .then(sauce => {
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
                
                console.log(sauce, sauce.likes);
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