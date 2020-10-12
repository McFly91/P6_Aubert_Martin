********************* DOCUMENTATION API *********************

////// Création d'un utilisateur //////

=> Pour créer un utilisateur, il faudra utiliser la route api/auth/signup
=> Le corps de la requête doit contenir un "email" dont celui-ci doit être valide et unique, et "password" qui doit contenir au minimum une majuscule, un chiffre et un caractère spécial
=> Un message "Utilisateur créé" confirme la création de de l'utilisateur dans la BDD

------ Messages d'erreurs ------

=> "Email incorrect !" : Utiliser un format d'email correct
=> "Veuillez réessayer avec une autre adresse" : Utiliser une adresse qui n'a pas déjà été utilisée
=> "Veuillez entrer un mot de passe contenant au moins 6 caractères dont 1 majuscule, 1 minuscule, 1 chiffre et 1 des caractères spéciaux !" : Respecter le modèle password demandé


////// Connexion d'un utilisateur //////

=> Pour se connecter, il faut utiliser la route api/auth/login
=> Le corps de la requête doit contenir un "email" enregistré précédemment et un "password" valide
=> Une réponse retourne un "userId" et un "token" de connexion

------ Messages d'erreurs ------

=> "Email ou mot de passe incorrect" : Vérifier que l'email utilisé existe bien ou que le password est correct


////// Affichage de toutes les sauces //////

=> 



////// Création d'une sauce //////



////// Modification d'une sauce //////



////// Suppression d'une sauce //////



////// Ajout d'un Like //////



////// Ajout d'un Dislike //////



////// Retirer un Like/Dislike //////
