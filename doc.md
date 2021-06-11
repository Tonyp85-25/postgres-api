

un client de connexion ne peut éxécuter qu'une seule requête à la fois. C'est pour cela qu'on va utiliser un pool qui maintient plusieurs clients  réutilisables


Le pattern repository consiste à créer un objet repository et lui créer plusieurs méthodes comme find, findById qui renvoient des donées exploitables par l'application.


> Attention aux problèmes de casses liées aux conventions SQL d'utiliser la snake_case tandis qu'on utilise camelCase en JS. POur éviter les problèmes, on va parser les résultats et réecrire le nom des champs litigieux en camelCase pour éviter tout problème en JS

> Les tests parallèles peuvent être sources de problèmes car les résultats sont faussés par la simultanéité des opérations

ON va donc utiliser un schéma par fichier de test pour éviter ce problème.

> Un schéma est comme un dossier dans une BDD, celui par défaut s'appelle 'public'. Chaque schéma peut avoir sa propre copie d'une table.

On créé un schéma de cette manière:

```sql
    CREATE SCHEMA test;

    -- on créé une table dans celui-ci
    CREATE TABLE test.users(

    )
```

Lorsque l'on fait une requête, un search_path est suivi implicitement, lorquel on souhaite obtenir sa valeur avec ``SHOW search_path``, on obtient le résultat suivant :

``search_path="$user",public`` $user fait référence à l'utilisateur courant, public au schéma par défaut

> par défaut POSTGRESQL se connecte au schéma portant le nom de l'utilisateur, sinon à public

On peut modifier le search_path en faisant

```sql
    SET search_path TO test,public;
```

Cela dit, on préférera utiliser en conditions réelles la stratégie suivante:

    - Pour chaque fichier de test, on se connectera normalement
    - on va générer une chaîne de caractères aléatoire
    - on va créer un nouvel utilisateur dans notre BDD avec cette chaîne
    - on va créer un nouveau schéma avec ce nom
    - on va indiquer à notre fichier de test de se connecter à la DB avec ce nom
