

un client de connexion ne peut éxécuter qu'une seule requête à la fois. C'est pour cela qu'on va utiliser un pool qui maintient plusieurs clients  réutilisables


Le pattern repository consiste à créer un objet repository et lui créer plusieurs méthodes comme find, findById qui renvoient des donées exploitables par l'application.


> Attention aux problèmes de casses liées aux conventions SQL d'utiliser la snake_case tandis qu'on utilise camelCase en JS. POur éviter les problèmes, on va parser les résultats et récrrire le nom des champs litigieux en camelCase pour éviter tout problème en JS