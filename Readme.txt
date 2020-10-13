********************* DOCUMENTATION API *********************

////// Création d'un utilisateur //////

=> Pour créer un utilisateur, il faudra utiliser la route api/auth/signup en utilisant la méthode POST
=> Le corps de la requête doit contenir un "email" dont celui-ci doit être valide et unique, et "password" qui doit contenir au minimum une majuscule, un chiffre et un caractère spécial
=> Un message "Utilisateur créé" confirme la création de de l'utilisateur dans la BDD

------ Messages d'erreurs ------

=> "Email incorrect !" : Utiliser un format d'email correct
=> "Veuillez réessayer avec une autre adresse" : Utiliser une adresse qui n'a pas déjà été utilisée
=> "Veuillez entrer un mot de passe contenant au moins 6 caractères dont 1 majuscule, 1 minuscule, 1 chiffre et 1 des caractères spéciaux !" : Respecter le modèle password demandé

--------------------------------

////// Connexion d'un utilisateur //////

=> Pour se connecter, il faut utiliser la route api/auth/login en utilisant la méthode POST
=> Le corps de la requête doit contenir un "email" enregistré précédemment et un "password" valide
=> Une réponse retourne un "userId" et un "token" de connexion

------ Messages d'erreurs ------

=> "Email ou mot de passe incorrect" : Vérifier que l'email utilisé existe bien ou que le password est correct
=> "Nombre de tentative de connexion atteinte, veuillez réessayer dans ** minutes" : Il faudra ettendre le temps indiquer avant de pouvoir tester de nouveau le jeu email/password

--------------------------------

////// Affichage de toutes les sauces //////

=> Pour afficher l'ensemble des sauces, il faut utiliser la route api/sauces en utilisant la méthode GET

------ Messages d'erreurs ------

=> "Connexion non authorisée" : Pour obtenir l'affichage, il faudra s'être connecté avec un identifiant valide

--------------------------------

////// Affichage d'une sauce //////

=> Pour afficher une sauce, il faut utiliser la route api/sauces/_id en utilisant la méthode GET

------ Messages d'erreurs ------

=> "Connexion non authorisée" : Pour obtenir l'affichage, il faudra s'être connecté avec un identifiant valide
=> "Erreur ID dans l'URL : _id" : Une erreur sur l'ID de la sauce à afficher

--------------------------------

////// Création d'une sauce //////

=> Pour créer une sauce, il faut utiliser la route api/sauces en utilisant la méthode POST
=> Le corps de la requête doit contenir les champs "image" (nécessite un fichier image PNG, JPG ou JPEG), "name", "manufacturer", "description", "mainPepper", "heat", "userId" (tous les champs doivent contenir des informations pertinantes)
=> Un message "Sauce enregistrée" confirme la création de de la sauce dans la BDD

------ Messages d'erreurs ------

=> "Connexion non authorisée" : Pour créer une sauce, il faudra s'être connecté avec un identifiant valide
=> "Erreur dans l'entrée des données, veuillez rentrer des informations pertinantes" : Rentrer des informations perntinantes sans commencer par des caractères spéciaux ou des espaces

--------------------------------

////// Modification d'une sauce //////

=> Pour modifier une sauce, il faut utiliser la route api/sauces/_id en utilisant la méthode PUT
=> Le corps de la requête doit contenir soit juste une "image" (nécessite un fichier image PNG, JPG ou JPEG) avec les champs "name", "manufacturer", "description", "mainPepper", "heat", "userId" (tous les champs doivent contenir des informations pertinantes), ou sans "image"
=> un message "Sauce modifiée" confirme la modification de de la sauce dans la BDD

------ Messages d'erreurs ------

=> "Connexion non authorisée" : Pour créer une sauce, il faudra s'être connecté avec un identifiant valide
=> "Erreur dans l'entrée des données, veuillez rentrer des informations pertinantes" : Rentrer des informations perntinantes sans commencer par des caractères spéciaux ou des espaces

--------------------------------

////// Suppression d'une sauce //////

=> Pour supprimer une sauce, il faut utiliser la route api/sauces/_id en utilisant la méthode DELETE
=> un message "Sauce supprimée" confirme la suppression de de la sauce dans la BDD

------ Messages d'erreurs ------

=> "Connexion non authorisée" : Pour créer une sauce, il faudra s'être connecté avec un identifiant valide
=> "Vous ne pouvez pas supprimer cette sauce" : Il faut que se soit le même userId qui a créé la sauce pour supprimer celle-ci

--------------------------------

////// Ajout d'un Like //////

=> Pour ajouter un like sur une sauce, il faut utiliser la route api/sauces/_id/like en utilisant la méthode POST
=> Le corps de la requête doit contenir les champs "userId" et "like" dont le nombre correspond à 1
=> Un message "Like/Dislike mis à jour" confirme l'ajout du Like sur la sauce et enregistre le "userId"

------ Messages d'erreurs ------

=> "Connexion non authorisée" : Pour créer une sauce, il faudra s'être connecté avec un identifiant valide
=> "Le corps de la requête n'est pas conforme" : Le "like" ou le "userId" n'est pas correct
=> "Impossible d'ajouter plusieurs Like" : Il n'est pas possible de Like la sauce plusieurs fois avec le même "userId"

--------------------------------

////// Ajout d'un Dislike //////

=> Pour ajouter un dislike sur une sauce, il faut utiliser la route api/sauces/_id/like en utilisant la méthode POST
=> Le corps de la requête doit contenir les champs "userId" et "like" dont le nombre correspond à -1
=> Un message "Like/Dislike mis à jour" confirme l'ajout du Like sur la sauce et enregistre le "userId"

------ Messages d'erreurs ------

=> "Connexion non authorisée" : Pour créer une sauce, il faudra s'être connecté avec un identifiant valide
=> "Le corps de la requête n'est pas conforme" : Le "like" ou le "userId" n'est pas correct
=> "Impossible d'ajouter plusieurs Like" : Il n'est pas possible de Dislike la sauce plusieurs fois avec le même "userId"

--------------------------------

////// Retirer un Like/Dislike //////

=> Pour retirer un like ou dislike sur une sauce, il faut utiliser la route api/sauces/_id/like en utilisant la méthode POST
=> Le corps de la requête doit contenir les champs "userId" et "like" dont le nombre correspond à 0
=> Un message "Like/Dislike mis à jour" confirme le retrait du Like/Dislike sur la sauce et retire le "userId"

------ Messages d'erreurs ------

=> "Connexion non authorisée" : Pour créer une sauce, il faudra s'être connecté avec un identifiant valide
=> "Le corps de la requête n'est pas conforme" : Le "like" ou le "userId" n'est pas correct

--------------------------------